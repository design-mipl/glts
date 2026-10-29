import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Camera, FileText, IdCard, IndianRupee, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DocumentChecklistRow } from '@/pages/website/components/documentChecklist/DocumentChecklistRow'
import { WhyWeAskSheet } from '@/pages/website/components/WhyWeAskSheet'
import {
  resolveDocumentWhyContent,
  type DocumentWhyContent,
} from '@/pages/website/config/documentWhyContent'
import type { RetailChecklistDocument } from '@/shared/services/retailJourneyResolver'
import { isRetailChecklistDocumentComplete } from '@/shared/utils/retailDocumentFlowUtils'
import { initialsFromName } from '../../config/travelProfileQuestions'
import { StepShell } from '../StepShell'
import { applyFlow, applyFont, applyRadius, tabularNums } from '@/pages/website/theme/applyFlowTheme'
import { SectionHeading } from '@/pages/website/theme/applyFormControls'
import type { RetailApplicantParty, RetailCapturedImage } from '../../types'

interface OriginalDocumentsStepProps {
  documents: RetailChecklistDocument[]
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onBack: () => void
  onContinue: () => void
  /** Preview-only: skip StepShell chrome. */
  previewOnly?: boolean
}

function docIcon(doc: RetailChecklistDocument): LucideIcon {
  const hay = `${doc.documentId} ${doc.name}`.toLowerCase()
  if (/photo|photograph/.test(hay)) return Camera
  if (/passport/.test(hay)) return FileText
  if (/aadhaar|aadhar|pan|id/.test(hay)) return IdCard
  if (/bank|statement|financial|salary|itr/.test(hay)) return IndianRupee
  return FileText
}

export function OriginalDocumentsStep({
  documents,
  applicants,
  uploads,
  onBack,
  onContinue,
  previewOnly = false,
}: OriginalDocumentsStepProps) {
  const [whyContent, setWhyContent] = useState<DocumentWhyContent | null>(null)
  const originals = documents.filter((doc) => doc.originalDocument)

  const namedApplicants = useMemo(
    () => applicants.filter((applicant) => applicant.details.fullName.trim()),
    [applicants],
  )
  const list = namedApplicants.length > 0 ? namedApplicants : applicants

  const rows = useMemo(
    () =>
      list.flatMap((applicant, index) =>
        originals.map((doc) => ({
          key: `${applicant.id}__${doc.documentId}`,
          applicant,
          doc,
          role: index === 0 ? 'Traveller 01 · you' : `Traveller ${String(index + 1).padStart(2, '0')}`,
          uploaded: isRetailChecklistDocumentComplete(doc, applicant, uploads),
        })),
      ),
    [list, originals, uploads],
  )

  const body = (
    <>
      <Box sx={{ width: '100%' }}>
        <SectionHeading>{`Originals required — ${originals.length} document type${originals.length === 1 ? '' : 's'}`}</SectionHeading>
        {rows.length === 0 ? (
          <Typography
            sx={{ fontFamily: applyFont.body, fontSize: 13.5, color: applyFlow.inkMuted, py: 4 }}
          >
            No physical originals are required for this visa.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {list.map((applicant, index) => {
              const applicantRows = rows.filter((row) => row.applicant.id === applicant.id)
              if (applicantRows.length === 0) return null
              const name = applicant.details.fullName.trim() || applicant.label
              const role =
                index === 0 ? 'Traveller 01 · you' : `Traveller ${String(index + 1).padStart(2, '0')}`

              return (
                <Box
                  key={applicant.id}
                  sx={{
                    borderRadius: applyRadius.control,
                    border: `1px solid ${applyFlow.hairline}`,
                    backgroundColor: applyFlow.surface,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 3,
                      py: 2,
                      borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
                      backgroundColor: applyFlow.canvas,
                    }}
                  >
                    <Box
                      aria-hidden
                      sx={{
                        width: 26,
                        height: 26,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: applyRadius.chip,
                        border: `1px solid ${applyFlow.hairline}`,
                        fontFamily: applyFont.mono,
                        fontSize: 11,
                        fontWeight: 700,
                        color: applyFlow.inkMuted,
                      }}
                    >
                      {initialsFromName(name) || <UserRound size={14} strokeWidth={1.9} />}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: applyFont.body,
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: applyFlow.ink,
                        }}
                      >
                        {name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: applyFont.mono,
                          fontSize: 10.5,
                          color: applyFlow.inkMuted,
                          mt: 0.5,
                        }}
                      >
                        {role}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        ...tabularNums,
                        ml: 'auto',
                        fontFamily: applyFont.mono,
                        fontSize: 11,
                        fontWeight: 600,
                        color: applicantRows.every((row) => row.uploaded)
                          ? applyFlow.success
                          : applyFlow.inkMuted,
                      }}
                    >
                      {applicantRows.filter((row) => row.uploaded).length}/{applicantRows.length}
                    </Typography>
                  </Box>

                  {applicantRows.map((row) => (
                    <DocumentChecklistRow
                      key={row.key}
                      icon={docIcon(row.doc)}
                      name={row.doc.name}
                      dense
                      completed={row.uploaded}
                      description={
                        row.uploaded
                          ? 'Digital copy already on file — the embassy still needs the physical original.'
                          : 'We will collect the physical original in the next step.'
                      }
                      statusTag={
                        row.uploaded
                          ? undefined
                          : { label: 'Original required', tone: 'original' }
                      }
                      onInfoClick={() =>
                        setWhyContent(
                          resolveDocumentWhyContent({
                            documentId: row.doc.documentId,
                            name: row.doc.name,
                            description: row.doc.description,
                          }),
                        )
                      }
                    />
                  ))}
                </Box>
              )
            })}
          </Stack>
        )}
      </Box>

      <WhyWeAskSheet open={Boolean(whyContent)} content={whyContent} onClose={() => setWhyContent(null)} />
    </>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="We also need these as originals"
      helperText="The embassy requires original copies of the following — we'll arrange collection next."
      onBack={onBack}
      onContinue={onContinue}
      contentMaxWidth={640}
    >
      {body}
    </StepShell>
  )
}
