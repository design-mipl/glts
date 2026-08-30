import { useMemo, useRef, useState } from 'react'
import { Box, Typography, keyframes } from '@mui/material'
import { Camera, FileText, IdCard, IndianRupee, UserRound } from 'lucide-react'
import {
  getStaggerDelayMs,
  retailFlowEaseOut,
} from '@/pages/website/theme/retailFlowTokens'
import { WhyWeAskSheet } from '@/pages/website/components/WhyWeAskSheet'
import { resolveDocumentWhyContent, type DocumentWhyContent } from '@/pages/website/config/documentWhyContent'
import { DocumentChecklistRow } from '@/pages/website/components/documentChecklist/DocumentChecklistRow'
import {
  BulkUploadDropzone,
  type BulkUploadDropzoneHandle,
} from '@/pages/website/components/bulkUpload/BulkUploadDropzone'
import { initialsFromName, profileAnswerTags } from '../../config/travelProfileQuestions'
import { StepShell } from '../StepShell'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getSelectableSx,
} from '@/pages/website/theme/applyFlowTheme'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'
import type { RetailApplicantParty, RetailCapturedImage } from '../../types'

type DocCategory = 'personal' | 'financial' | 'other'

/** ~2 minutes of upload/review time estimated per remaining mandatory doc. */

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

/** Passport + photo are captured earlier — always show them under Personal as completed when present. */
const ESSENTIAL_PERSONAL_DOCS: RetailChecklistDocument[] = [
  {
    documentId: 'photo',
    name: 'Photograph',
    description: 'Recent passport-size photo on a white background.',
    mandatory: true,
    originalDocument: false,
  },
  {
    documentId: 'passport',
    name: 'Passport',
    description: 'Bio page — clear and fully visible.',
    mandatory: true,
    originalDocument: true,
  },
]

function withEssentialPersonalDocs(documents: RetailChecklistDocument[]): RetailChecklistDocument[] {
  const hasPhoto = documents.some((doc) => isIdentityCaptureDoc(doc.documentId) === 'photo')
  const hasPassport = documents.some((doc) => isIdentityCaptureDoc(doc.documentId) === 'passport')
  const missing = ESSENTIAL_PERSONAL_DOCS.filter((doc) => {
    if (doc.documentId === 'photo') return !hasPhoto
    if (doc.documentId === 'passport') return !hasPassport
    return false
  })
  if (missing.length === 0) return documents
  return [...missing, ...documents]
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
  onBulkFilesSelected,
}: {
  documents: RetailChecklistDocument[]
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onUpload: (documentId: string, image: RetailCapturedImage, applicantId: string) => void
  estimatedApproval?: string
  onBulkFilesSelected?: (applicantId: string, files: File[]) => void
}) {
  const namedApplicants = applicants.filter((a) => a.details.fullName.trim())
  const list = namedApplicants.length > 0 ? namedApplicants : applicants
  const [activeApplicantId, setActiveApplicantId] = useState(list[0]?.id ?? '')
  const [whyContent, setWhyContent] = useState<DocumentWhyContent | null>(null)
  /** Per-document verification state, keyed by `applicantId__documentId`. */
  const [docStatus, setDocStatus] = useState<Record<string, 'verifying' | 'error'>>({})
  const dropzoneRef = useRef<BulkUploadDropzoneHandle | null>(null)

  const activeApplicant = list.find((a) => a.id === activeApplicantId) ?? list[0]

  const checklistDocuments = useMemo(() => withEssentialPersonalDocs(documents), [documents])

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
    for (const doc of checklistDocuments) {
      map[categorizeDocument(doc)].push(doc)
    }
    return order
      .map((category) => ({ category, docs: map[category] }))
      .filter((group) => group.docs.length > 0)
  }, [checklistDocuments])

  const activeProgress = useMemo(() => {
    if (!activeApplicant) return { done: 0, total: 0, remaining: 0, percent: 0, complete: false }
    return travellerProgress(activeApplicant, checklistDocuments, uploads)
  }, [activeApplicant, checklistDocuments, uploads])

  /**
   * Read a file, then clear the row's verifying state. The row shows `checking` while the
   * read is in flight and `error` if it fails, so a bad file is fixed in place instead of
   * silently doing nothing — which is what the old version did on a FileReader failure.
   */
  function handleFile(documentId: string, file: File, applicantId: string) {
    const key = checklistUploadKey(applicantId, documentId)
    setDocStatus((prev) => ({ ...prev, [key]: 'verifying' }))

    const reader = new FileReader()
    reader.onload = () => {
      onUpload(
        documentId,
        { dataUrl: reader.result as string, capturedAt: new Date().toISOString() },
        applicantId,
      )
      setDocStatus((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
    reader.onerror = () => {
      setDocStatus((prev) => ({ ...prev, [key]: 'error' }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        {/* Traveller strip — profile details stay visible while you work per person. */}
        {list.length > 1 ? (
          <Box
            role="tablist"
            aria-label="Traveller"
            sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 3, scrollbarWidth: 'none' }}
          >
            {list.map((applicant, index) => {
              const active = applicant.id === activeApplicant?.id
              const name = applicant.details.fullName.trim() || applicant.label
              const tags = profileAnswerTags(applicant.profileAnswers)
              const marital = tags.find((t) => ['Single', 'Married', 'Divorced', 'Widowed'].includes(t))
              const profession = tags.find(
                (t) => !['Single', 'Married', 'Divorced', 'Widowed', 'Yes', 'No'].includes(t),
              )
              const tagLine = [index > 0 ? 'Co-traveller' : null, marital, profession]
                .filter(Boolean)
                .join(' · ')
              const p = travellerProgress(applicant, checklistDocuments, uploads)

              return (
                <Box
                  key={applicant.id}
                  component="button"
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveApplicantId(applicant.id)}
                  sx={{
                    ...getSelectableSx(active),
                    flex: '0 0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    minHeight: 44,
                    pl: 3,
                    pr: 3.5,
                    py: 2,
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 30,
                      height: 30,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: applyRadius.chip,
                      backgroundColor: applyFlow.canvas,
                      border: `1px solid ${p.complete ? applyFlow.successBorder : applyFlow.hairline}`,
                      fontFamily: applyFont.mono,
                      fontSize: 11,
                      fontWeight: 700,
                      color: applyFlow.inkMuted,
                      flex: '0 0 auto',
                    }}
                  >
                    {initialsFromName(name)}
                  </Box>
                  <Box sx={{ minWidth: 0, textAlign: 'left' }}>
                    <Typography
                      sx={{
                        fontFamily: applyFont.body,
                        fontSize: 13,
                        fontWeight: 600,
                        color: applyFlow.ink,
                        lineHeight: 1.25,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: applyFont.mono,
                        fontSize: 10,
                        color: p.complete ? applyFlow.success : applyFlow.inkMuted,
                        mt: 0.4,
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {p.done}/{p.total}{tagLine ? `  ·  ${tagLine}` : ''}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        ) : null}

        {/* Two columns: the list you work through on the left, the tools that act on
            all of it on the right. The right rail sticks so the dropzone and the
            readiness figure stay reachable while the list scrolls. */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'flex-start',
            gap: { xs: 4, md: 6 },
          }}
        >
          <Box sx={{ flex: '1 1 auto', minWidth: 0, width: '100%', order: { xs: 2, md: 1 } }}>
        {/* Documents, grouped. Category label is an inline mono rule, not a 120px gutter. */}
        {activeApplicant
          ? grouped.map(({ category, docs }, groupIndex) => (
              <Box
                key={category}
                sx={{
                  mt: groupIndex === 0 ? 3 : 4,
                  animation: `${fadeUp} 0.3s ${retailFlowEaseOut} both`,
                  animationDelay: `${getStaggerDelayMs(groupIndex)}ms`,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: applyFont.mono,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: applyFlow.inkFaint,
                    mb: 1,
                  }}
                >
                  {CATEGORY_META[category].label}
                </Typography>
                {docs.map((doc) => {
                  const key = checklistUploadKey(activeApplicant.id, doc.documentId)
                  return (
                    <DocumentChecklistRow
                      key={doc.documentId}
                      icon={docIcon(doc)}
                      name={doc.name}
                      completed={isDocComplete(doc, activeApplicant, uploads)}
                      optional={!doc.mandatory}
                      status={docStatus[key]}
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
                  )
                })}
              </Box>
            ))
          : null}
          </Box>

          <Box
            sx={{
              flex: { xs: '1 1 auto', md: '0 0 296px' },
              width: { xs: '100%', md: 296 },
              minWidth: 0,
              order: { xs: 1, md: 2 },
              position: { xs: 'static', md: 'sticky' },
              top: 0,
            }}
          >
        <BulkUploadDropzone
          openFilePickerRef={dropzoneRef}
          title="Drop the whole set at once"
          onFilesSelected={handleBulkFiles}
        />

        {/* Readiness — mono figure over a hairline bar. */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            mt: 4,
            pb: 3,
            borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
          }}
        >
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: applyFlow.inkMuted,
              flex: '0 0 auto',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {activeProgress.done} / {activeProgress.total} ready
          </Typography>
          <Box
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={activeProgress.percent}
            aria-label="Document readiness"
            sx={{
              flex: '1 1 auto',
              height: '2px',
              borderRadius: '1px',
              backgroundColor: applyFlow.accentTrack,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${activeProgress.percent}%`,
                backgroundColor: activeProgress.complete ? applyFlow.success : applyFlow.accent,
                transition: `width 300ms ${applyMotion.easeInOut}, background-color 300ms linear`,
              }}
            />
          </Box>
          {estimatedApproval ? (
            <Typography
              sx={{
                fontFamily: applyFont.mono,
                fontSize: 10.5,
                color: applyFlow.inkMuted,
                flex: '0 0 auto',
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              APPROVAL {estimatedApproval}
            </Typography>
          ) : null}
        </Box>

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
  previewOnly = false,
  onBulkFilesSelected,
}: ChecklistStepProps) {
  const namedApplicants = applicants.filter((a) => a.details.fullName.trim())
  const list = namedApplicants.length > 0 ? namedApplicants : applicants
  const checklistDocuments = useMemo(() => withEssentialPersonalDocs(documents), [documents])

  const mandatoryComplete =
    list.length > 0 &&
    list.every((applicant) =>
      checklistDocuments.filter((doc) => doc.mandatory).every((doc) => isDocComplete(doc, applicant, uploads)),
    )

  const card = (
    <ChecklistCard
      documents={checklistDocuments}
      applicants={applicants}
      uploads={uploads}
      onUpload={onUpload}
      estimatedApproval={estimatedApproval}
      onBulkFilesSelected={onBulkFilesSelected}
    />
  )

  if (previewOnly) return card

  return (
    <StepShell
      title="Add your documents"
      mobileTitle="Add your documents"
      helperText="Drop the whole set in one go and we'll sort them, or add them one at a time. You can finish this any time in the next 5 days — we start drafting your forms as soon as you check out."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!mandatoryComplete || list.length === 0}
      continueLabel="Continue"
      contentMaxWidth={820}
    >
      {card}
    </StepShell>
  )
}
