import { useMemo, useRef, useState } from 'react'
import { Box, Stack, Typography, keyframes } from '@mui/material'
import { Camera, FileText, IdCard, IndianRupee, UserRound } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  getElevatedCardSx,
  getStaggerDelayMs,
  retailFlowEaseOut,
  retailFlowLayout,
} from '@/pages/website-v2/theme/retailFlowTokens'
import { WhyWeAskSheet } from '@/pages/website-v2/components/WhyWeAskSheet'
import { resolveDocumentWhyContent, type DocumentWhyContent } from '@/pages/website-v2/config/documentWhyContent'
import { DocumentChecklistRow } from '@/pages/website-v2/components/documentChecklist/DocumentChecklistRow'
import {
  BulkUploadDropzone,
  type BulkUploadDropzoneHandle,
} from '@/pages/website-v2/components/bulkUpload/BulkUploadDropzone'
import { LiveStatusPanel } from '@/pages/website-v2/components/liveStatusPanel/LiveStatusPanel'
import { displayNameUpper, initialsFromName, profileAnswerTags } from '../../config/travelProfileQuestions'
import { StepShell } from '../StepShell'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'
import type { RetailApplicantParty, RetailCapturedImage } from '../../types'

type DocCategory = 'personal' | 'financial' | 'other'

/** ~2 minutes of upload/review time estimated per remaining mandatory doc. */
const MINUTES_PER_REMAINING_DOC = 2

interface ChecklistStepProps {
  documents: RetailChecklistDocument[]
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onUpload: (documentId: string, image: RetailCapturedImage, applicantId: string) => void
  onBack: () => void
  onContinue: () => void
  /** Estimated approval date/time shown in the side LiveStatusPanel. */
  estimatedApproval?: string
  /** Trip context line under the estimate, e.g. "India → Schengen · Tourist visa". */
  tripContext?: string
  /** When true, render only the checklist body (no StepShell) — isolated preview. */
  previewOnly?: boolean
  onBulkFilesSelected?: (applicantId: string, files: File[]) => void
}

export function checklistUploadKey(applicantId: string, documentId: string) {
  return `${applicantId}__${documentId}`
}

function categorizeDocument(doc: RetailChecklistDocument): DocCategory {
  const hay = `${doc.documentId} ${doc.name}`.toLowerCase()
  if (/bank|statement|itr|salary|financial|funds|balance|income/.test(hay)) return 'financial'
  if (/photo|passport|aadhaar|aadhar|pan|identity|birth|national|id.?card/.test(hay)) return 'personal'
  return 'other'
}

function isIdentityCaptureDoc(documentId: string): 'photo' | 'passport' | null {
  const id = documentId.toLowerCase()
  if (id === 'photo' || id === 'photograph') return 'photo'
  if (id.includes('photo') && !id.includes('passport')) return 'photo'
  if (id === 'passport') return 'passport'
  if (id.includes('passport') && !/old|stamp|back|front|all|pages/.test(id)) return 'passport'
  return null
}

function docIcon(doc: RetailChecklistDocument) {
  const hay = `${doc.documentId} ${doc.name}`.toLowerCase()
  if (/photo|photograph/.test(hay)) return Camera
  if (/passport/.test(hay)) return FileText
  if (/aadhaar|aadhar|pan|id/.test(hay)) return IdCard
  if (/bank|statement|financial|salary|itr/.test(hay)) return IndianRupee
  return FileText
}

function isDocComplete(
  doc: RetailChecklistDocument,
  applicant: RetailApplicantParty,
  uploads: Record<string, RetailCapturedImage>,
): boolean {
  const identity = isIdentityCaptureDoc(doc.documentId)
  if (identity === 'photo' && applicant.photo) return true
  if (identity === 'passport' && applicant.passport) return true
  return Boolean(
    uploads[checklistUploadKey(applicant.id, doc.documentId)] || uploads[doc.documentId],
  )
}

const CATEGORY_META: Record<DocCategory, { label: string; icon: typeof UserRound }> = {
  personal: { label: 'Personal', icon: UserRound },
  financial: { label: 'Financial', icon: IndianRupee },
  other: { label: 'Other', icon: FileText },
}

function travellerProgress(
  applicant: RetailApplicantParty,
  documents: RetailChecklistDocument[],
  uploads: Record<string, RetailCapturedImage>,
) {
  const mandatory = documents.filter((d) => d.mandatory)
  const total = mandatory.length
  const done = mandatory.filter((d) => isDocComplete(d, applicant, uploads)).length
  const percent = total === 0 ? 100 : Math.round((done / total) * 100)
  return {
    done,
    total,
    remaining: Math.max(0, total - done),
    percent,
    complete: total > 0 && done === total,
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

/** Two-column checklist body — flex 65/35 (not CSS Grid). */
export function ChecklistCard({
  documents,
  applicants,
  uploads,
  onUpload,
  estimatedApproval = 'Aug 29',
  tripContext = 'India → Schengen · Tourist visa',
  onBulkFilesSelected,
}: {
  documents: RetailChecklistDocument[]
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onUpload: (documentId: string, image: RetailCapturedImage, applicantId: string) => void
  estimatedApproval?: string
  tripContext?: string
  onBulkFilesSelected?: (applicantId: string, files: File[]) => void
}) {
  const colors = usePublicBrandColors()
  const namedApplicants = applicants.filter((a) => a.details.fullName.trim())
  const list = namedApplicants.length > 0 ? namedApplicants : applicants
  const [activeApplicantId, setActiveApplicantId] = useState(list[0]?.id ?? '')
  const [whyContent, setWhyContent] = useState<DocumentWhyContent | null>(null)
  const dropzoneRef = useRef<BulkUploadDropzoneHandle | null>(null)

  const activeApplicant = list.find((a) => a.id === activeApplicantId) ?? list[0]

  async function runBulkPipeline(applicantId: string, files: File[]) {
    if (!files.length) return
    await sleep(400)

    const first = files[0]
    if (first && !first.name.toLowerCase().endsWith('.zip')) {
      handleFile('passport', first, applicantId)
    } else if (first) {
      onUpload(
        'passport',
        { dataUrl: `bulk://${encodeURIComponent(first.name)}`, capturedAt: new Date().toISOString() },
        applicantId,
      )
    }

    onBulkFilesSelected?.(applicantId, files)
  }

  function handleBulkFiles(files: File[]) {
    const targetId = activeApplicant?.id
    if (!targetId) return
    void runBulkPipeline(targetId, files)
  }

  const grouped = useMemo(() => {
    const order: DocCategory[] = ['personal', 'financial', 'other']
    const map: Record<DocCategory, RetailChecklistDocument[]> = {
      personal: [],
      financial: [],
      other: [],
    }
    for (const doc of documents) {
      map[categorizeDocument(doc)].push(doc)
    }
    return order
      .map((category) => ({ category, docs: map[category] }))
      .filter((group) => group.docs.length > 0)
  }, [documents])

  const activeProgress = useMemo(() => {
    if (!activeApplicant) return { done: 0, total: 0, remaining: 0, percent: 0, complete: false }
    return travellerProgress(activeApplicant, documents, uploads)
  }, [activeApplicant, documents, uploads])

  function handleFile(documentId: string, file: File, applicantId: string) {
    const reader = new FileReader()
    reader.onload = () =>
      onUpload(documentId, { dataUrl: reader.result as string, capturedAt: new Date().toISOString() }, applicantId)
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Box
        data-testid="checklist-two-col"
        sx={{
          width: '100%',
          ...getElevatedCardSx(colors.border),
          borderRadius: retailFlowLayout.cardRadius,
          bgcolor: colors.white,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Full-width header — spans both columns */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.25, pb: 1.75, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: colors.navy, mb: 0.5 }}>
            Here&apos;s what you will upload after checkout
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.textMuted,
            }}
          >
            Guided by experts — backed by approval data
          </Typography>
        </Box>

        {/* Full-width passenger tabs */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            px: { xs: 2, sm: 3 },
            pt: 1.5,
            pb: 2.5,
            overflowX: 'auto',
          }}
        >
          {list.map((applicant, index) => {
            const active = applicant.id === activeApplicant?.id
            const name = applicant.details.fullName.trim() || applicant.label
            const profileTags = profileAnswerTags(applicant.profileAnswers)
            // Prefer marital + profession style line from Build profile (e.g. "Single · Salaried Employee").
            const marital = profileTags.find((t) =>
              ['Single', 'Married', 'Divorced', 'Widowed'].includes(t),
            )
            const profession = profileTags.find(
              (t) => !['Single', 'Married', 'Divorced', 'Widowed', 'Yes', 'No'].includes(t),
            )
            const tagLine = [index > 0 ? 'Co-traveler' : null, marital, profession]
              .filter(Boolean)
              .join(' · ')

            return (
              <Box
                key={applicant.id}
                component="button"
                type="button"
                onClick={() => setActiveApplicantId(applicant.id)}
                sx={{
                  appearance: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  flex: '0 0 auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  textAlign: 'left',
                  px: 2.25,
                  py: 1.5,
                  borderRadius: '10px',
                  bgcolor: active ? colors.navy : colors.surfaceAlt,
                  color: active ? '#fff' : colors.navy,
                  transition: `background-color 150ms ${retailFlowEaseOut}, color 150ms ${retailFlowEaseOut}, transform 160ms ${retailFlowEaseOut}`,
                  '&:active': { transform: 'scale(0.97)' },
                  font: 'inherit',
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: active ? 'rgba(255,255,255,0.18)' : colors.border,
                    color: active ? '#fff' : colors.textSecondary,
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {initialsFromName(name)}
                </Box>
                <Box sx={{ minWidth: 0, pr: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'inherit',
                      lineHeight: 1.2,
                    }}
                  >
                    {displayNameUpper(name)}
                  </Typography>
                  {tagLine ? (
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: active ? 'rgba(255,255,255,0.72)' : colors.textMuted,
                        mt: 0.15,
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tagLine}
                    </Typography>
                  ) : null}
                </Box>
              </Box>
            )
          })}
        </Box>

        {/* Body row: left list (~65%) + right sidebar (~35%) — flex only */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch',
            gap: { xs: 2, md: 2.5 },
            borderTop: `1px solid ${colors.border}`,
            px: { xs: 2, sm: 2.5 },
            py: { xs: 2, md: 2.5 },
            bgcolor: colors.white,
          }}
        >
          {/* Left — category-grouped DocumentChecklistRow list */}
          <Box
            sx={{
              flex: { xs: '1 1 auto', md: '1 1 65%' },
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              ...getElevatedCardSx(colors.border),
              borderRadius: retailFlowLayout.cardRadius,
              bgcolor: colors.white,
              overflow: 'hidden',
            }}
          >
            <Stack spacing={0} sx={{ flex: 1 }}>
              {activeApplicant
                ? grouped.map(({ category, docs }, groupIndex) => {
                    const meta = CATEGORY_META[category]
                    const CatIcon = meta.icon
                    return (
                      <Box
                        key={category}
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          borderBottom: `1px solid ${colors.border}`,
                          '&:last-of-type': { borderBottom: 'none' },
                          animation: `${fadeUp} 0.32s ${retailFlowEaseOut} both`,
                          animationDelay: `${getStaggerDelayMs(groupIndex)}ms`,
                        }}
                      >
                        <Box
                          sx={{
                            flex: { sm: '0 0 120px' },
                            px: 2,
                            pt: { xs: 1.75, sm: 2.25 },
                            pb: { xs: 0.5, sm: 2 },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.75,
                              px: 1.25,
                              py: 0.65,
                              borderRadius: 999,
                              bgcolor: colors.surfaceAlt,
                              color: colors.textSecondary,
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                            }}
                          >
                            <CatIcon size={13} />
                            {meta.label}
                          </Box>
                        </Box>

                        <Stack spacing={0} sx={{ flex: 1, minWidth: 0, px: { xs: 1, sm: 1.25 }, py: 1 }}>
                          {docs.map((doc) => (
                            <DocumentChecklistRow
                              key={doc.documentId}
                              icon={docIcon(doc)}
                              name={doc.name}
                              completed={isDocComplete(doc, activeApplicant, uploads)}
                              optional={!doc.mandatory}
                              onInfoClick={() =>
                                setWhyContent(
                                  resolveDocumentWhyContent({
                                    documentId: doc.documentId,
                                    name: doc.name,
                                    description: doc.description,
                                  }),
                                )
                              }
                              onFileSelect={(file) => handleFile(doc.documentId, file, activeApplicant.id)}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )
                  })
                : null}
            </Stack>
          </Box>

          {/* Right — bulk upload for active traveller + LiveStatusPanel readiness */}
          <Box
            sx={{
              flex: { xs: '1 1 auto', md: '0 0 35%' },
              maxWidth: { md: '35%' },
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <BulkUploadDropzone
              openFilePickerRef={dropzoneRef}
              title="Upload folder or ZIP"
              onFilesSelected={handleBulkFiles}
            />

            <LiveStatusPanel
              headline={{
                eyebrow: 'Estimated approval',
                value: estimatedApproval,
                caption: tripContext,
              }}
              readiness={{
                percent: activeProgress.percent,
                minutesLeft: activeProgress.remaining * MINUTES_PER_REMAINING_DOC,
              }}
            />
          </Box>
        </Box>
      </Box>

      <WhyWeAskSheet open={Boolean(whyContent)} content={whyContent} onClose={() => setWhyContent(null)} />
    </>
  )
}

export function ChecklistStep({
  documents,
  applicants,
  uploads,
  onUpload,
  onBack,
  onContinue,
  estimatedApproval,
  tripContext,
  previewOnly = false,
  onBulkFilesSelected,
}: ChecklistStepProps) {
  const namedApplicants = applicants.filter((a) => a.details.fullName.trim())
  const list = namedApplicants.length > 0 ? namedApplicants : applicants

  const mandatoryComplete =
    list.length > 0 &&
    list.every((applicant) =>
      documents.filter((doc) => doc.mandatory).every((doc) => isDocComplete(doc, applicant, uploads)),
    )

  const card = (
    <ChecklistCard
      documents={documents}
      applicants={applicants}
      uploads={uploads}
      onUpload={onUpload}
      estimatedApproval={estimatedApproval}
      tripContext={tripContext}
      onBulkFilesSelected={onBulkFilesSelected}
    />
  )

  if (previewOnly) return card

  return (
    <StepShell
      title="We work in parallel. You don't wait, your visa doesn't wait."
      mobileTitle="We work in parallel. You don't wait."
      helperText="The moment you checkout, we start drafting required forms and your slot is confirmed. Upload the documents any time in the next 5 days."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!mandatoryComplete || list.length === 0}
      continueLabel="Continue"
      contentMaxWidth={1100}
    >
      {card}
    </StepShell>
  )
}
