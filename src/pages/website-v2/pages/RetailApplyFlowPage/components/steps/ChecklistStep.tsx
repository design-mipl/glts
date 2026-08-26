import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Camera, FileText, IdCard, IndianRupee, UserRound } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowLayout } from '@/pages/website-v2/theme/retailFlowTokens'
import { WhyWeAskSheet } from '@/pages/website-v2/components/WhyWeAskSheet'
import { resolveDocumentWhyContent, type DocumentWhyContent } from '@/pages/website-v2/config/documentWhyContent'
import { DocumentChecklistRow } from '@/pages/website-v2/components/documentChecklist/DocumentChecklistRow'
import {
  displayNameUpper,
  initialsFromName,
  profileAnswerTags,
} from '../../config/travelProfileQuestions'
import { StepShell } from '../StepShell'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'
import type { RetailApplicantParty, RetailCapturedImage } from '../../types'

type DocCategory = 'personal' | 'financial' | 'other'

const AVATAR_TONES = ['#0FA968', '#5B8DEF', '#D4A0A0', '#B45309', '#4F46E5'] as const

interface ChecklistStepProps {
  documents: RetailChecklistDocument[]
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onUpload: (documentId: string, image: RetailCapturedImage, applicantId: string) => void
  onBack: () => void
  onContinue: () => void
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

export function ChecklistStep({
  documents,
  applicants,
  uploads,
  onUpload,
  onBack,
  onContinue,
}: ChecklistStepProps) {
  const colors = usePublicBrandColors()
  const namedApplicants = applicants.filter((a) => a.details.fullName.trim())
  const list = namedApplicants.length > 0 ? namedApplicants : applicants
  const [activeApplicantId, setActiveApplicantId] = useState(list[0]?.id ?? '')
  const [whyContent, setWhyContent] = useState<DocumentWhyContent | null>(null)

  const activeApplicant = list.find((a) => a.id === activeApplicantId) ?? list[0]

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

  const mandatoryComplete =
    list.length > 0 &&
    list.every((applicant) =>
      documents.filter((doc) => doc.mandatory).every((doc) => isDocComplete(doc, applicant, uploads)),
    )

  function handleFile(documentId: string, file: File, applicantId: string) {
    const reader = new FileReader()
    reader.onload = () =>
      onUpload(documentId, { dataUrl: reader.result as string, capturedAt: new Date().toISOString() }, applicantId)
    reader.readAsDataURL(file)
  }

  return (
    <>
      <StepShell
        title="We work in parallel. You don't wait, your visa doesn't wait."
        mobileTitle="We work in parallel. You don't wait."
        helperText="The moment you checkout, we start drafting required forms and your slot is confirmed. Upload the documents any time in the next 5 days."
        onBack={onBack}
        onContinue={onContinue}
        continueDisabled={!mandatoryComplete || !activeApplicant}
        continueLabel="Continue"
        contentMaxWidth={920}
      >
        <Box
          sx={{
            width: '100%',
            textAlign: 'left',
            border: `1px solid ${colors.border}`,
            borderRadius: retailFlowLayout.cardRadius,
            bgcolor: colors.white,
            boxShadow: '0 8px 28px rgba(15, 23, 42, 0.06)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: colors.navy, mb: 0.75 }}>
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

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              px: { xs: 2, sm: 3 },
              pb: 2,
              overflowX: 'auto',
            }}
          >
            {list.map((applicant, index) => {
              const active = applicant.id === activeApplicant?.id
              const name = applicant.details.fullName.trim() || applicant.label
              const tags = profileAnswerTags(applicant.profileAnswers)
              const tagLine = [index > 0 ? 'Co-traveler' : null, ...tags.slice(0, 2)]
                .filter(Boolean)
                .join(' · ')
              const tone = AVATAR_TONES[index % AVATAR_TONES.length]

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
                    flex: '1 1 180px',
                    minWidth: 180,
                    maxWidth: 280,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    textAlign: 'left',
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 999,
                    bgcolor: active ? colors.navy : colors.surfaceAlt,
                    color: active ? '#fff' : colors.navy,
                    transition: 'background-color 0.15s ease',
                    font: 'inherit',
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: tone,
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {initialsFromName(name)}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        color: 'inherit',
                        lineHeight: 1.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayNameUpper(name)}
                    </Typography>
                    {tagLine ? (
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: active ? 'rgba(255,255,255,0.72)' : colors.textMuted,
                          mt: 0.25,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
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

          <Stack spacing={0} sx={{ borderTop: `1px solid ${colors.border}` }}>
            {activeApplicant
              ? grouped.map(({ category, docs }) => {
                  const meta = CATEGORY_META[category]
                  const CatIcon = meta.icon
                  return (
                    <Box
                      key={category}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '132px 1fr' },
                        borderBottom: `1px solid ${colors.border}`,
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Box sx={{ px: 2, pt: { xs: 1.75, sm: 2.25 }, pb: { xs: 0.5, sm: 2 } }}>
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

                      <Stack spacing={0} sx={{ px: { xs: 1, sm: 1.25 }, py: 1 }}>
                        {docs.map((doc) => (
                          <DocumentChecklistRow
                            key={doc.documentId}
                            icon={docIcon(doc)}
                            name={doc.name}
                            description={doc.description}
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
      </StepShell>

      <WhyWeAskSheet open={Boolean(whyContent)} content={whyContent} onClose={() => setWhyContent(null)} />
    </>
  )
}
