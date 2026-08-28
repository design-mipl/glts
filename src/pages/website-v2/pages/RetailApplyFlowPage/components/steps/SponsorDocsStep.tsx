import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { applyFlow, applyFont, applyRadius } from '@/pages/website-v2/theme/applyFlowTheme'
import { SectionHeading } from '@/pages/website-v2/theme/applyFormControls'
import { initialsFromName } from '../../config/travelProfileQuestions'
import {
  SPONSOR_BANK_STATEMENT_DOC_ID,
  type RetailApplicantParty,
  type RetailCapturedImage,
} from '../../types'
import { checklistUploadKey } from './ChecklistStep'
import { UploadTile } from '../UploadTile'
import { StepShell } from '../StepShell'

interface SponsorDocsStepProps {
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onUpload: (applicantId: string, image: RetailCapturedImage) => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

/**
 * B10 beat 2 — bank statement per sponsor.
 *
 * Every sponsored traveller is listed at once. The previous version put one sponsor at a
 * time behind a tab strip inside a gold gradient card with a dashed 64px avatar and a
 * star badge; with two sponsors you could not see that the second was still missing.
 * Same manifest shape as the traveller and funding steps, so the whole flow reads as one
 * document.
 */
export function SponsorDocsStep({
  applicants,
  uploads,
  onUpload,
  onBack,
  onContinue,
  previewOnly = false,
}: SponsorDocsStepProps) {
  const sponsored = useMemo(
    () => applicants.filter((a) => a.sponsor?.mode === 'someone_else' && a.sponsor.profileComplete),
    [applicants],
  )

  const allComplete =
    sponsored.length > 0 &&
    sponsored.every((a) => Boolean(uploads[checklistUploadKey(a.id, SPONSOR_BANK_STATEMENT_DOC_ID)]))

  const doneCount = sponsored.filter((a) =>
    Boolean(uploads[checklistUploadKey(a.id, SPONSOR_BANK_STATEMENT_DOC_ID)]),
  ).length

  function handleFile(applicantId: string, file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      onUpload(applicantId, {
        dataUrl: String(reader.result ?? ''),
        capturedAt: new Date().toISOString(),
      })
    }
    reader.readAsDataURL(file)
  }

  const body =
    sponsored.length === 0 ? (
      <Typography
        sx={{ fontFamily: applyFont.body, fontSize: 13.5, color: applyFlow.inkMuted, py: 6 }}
      >
        No sponsored travellers — nothing to upload here.
      </Typography>
    ) : (
      <Box sx={{ width: '100%' }}>
        <SectionHeading>{`Sponsor statements — ${doneCount} of ${sponsored.length} uploaded`}</SectionHeading>

        {sponsored.map((applicant, index) => {
          const sponsor = applicant.sponsor?.mode === 'someone_else' ? applicant.sponsor : undefined
          if (!sponsor) return null
          const key = checklistUploadKey(applicant.id, SPONSOR_BANK_STATEMENT_DOC_ID)
          const upload = uploads[key]
          const travellerName = applicant.details.fullName.trim() || applicant.label

          return (
            <Box
              key={applicant.id}
              sx={{
                py: 3.25,
                borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
                '&:first-of-type': { borderTop: `1px solid ${applyFlow.hairlineSoft}` },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: applyFont.mono,
                    fontSize: 11,
                    fontWeight: 600,
                    color: applyFlow.inkFaint,
                    width: 18,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Box
                  aria-hidden
                  sx={{
                    width: 38,
                    height: 38,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: applyRadius.chip,
                    backgroundColor: applyFlow.canvas,
                    border: `1px solid ${upload ? applyFlow.successBorder : applyFlow.hairline}`,
                    fontFamily: applyFont.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    color: applyFlow.inkMuted,
                    flex: '0 0 auto',
                  }}
                >
                  {initialsFromName(sponsor.name) || '—'}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: applyFont.body,
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: applyFlow.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {sponsor.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: applyFont.mono,
                      fontSize: 10.5,
                      color: applyFlow.inkMuted,
                      mt: 0.75,
                    }}
                  >
                    {[sponsor.relationship, `funding ${travellerName}`].filter(Boolean).join('  ·  ')}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ pl: { xs: 0, sm: '84px' } }}>
                <UploadTile
                  label="Bank statement"
                  hint="Last 3 months, showing the sponsor's name — PDF, JPG or PNG"
                  value={upload?.dataUrl}
                  capturedAt={upload?.capturedAt}
                  required
                  onFile={(file) => handleFile(applicant.id, file)}
                />
              </Box>
            </Box>
          )
        })}
      </Box>
    )

  if (previewOnly) return body

  return (
    <StepShell
      title="Sponsor bank statements"
      helperText="Each sponsor needs to show they can fund the trip. The statement must be in the sponsor's name, not the traveller's."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!allComplete}
      contentMaxWidth={780}
    >
      {body}
    </StepShell>
  )
}
