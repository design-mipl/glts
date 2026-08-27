import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FileText, Star } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { FileUploadModal } from '@/pages/website-v2/components/fileUploadModal/FileUploadModal'
import { getElevatedCardSx, retailFlowColors } from '@/pages/website-v2/theme/retailFlowTokens'
import { displayNameUpper, initialsFromName } from '../../config/travelProfileQuestions'
import {
  SPONSOR_BANK_STATEMENT_DOC_ID,
  type RetailApplicantParty,
  type RetailCapturedImage,
} from '../../types'
import { checklistUploadKey } from './ChecklistStep'
import { sponsorGold } from '../SponsorProfileBuilder'
import { StepShell } from '../StepShell'

interface SponsorDocsStepProps {
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onUpload: (applicantId: string, image: RetailCapturedImage) => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

const AVATAR_FALLBACK = '#8B6914'

/** B10 beat 2 — Sponsor summary card + bank statement upload (sponsored travellers only). */
export function SponsorDocsStep({
  applicants,
  uploads,
  onUpload,
  onBack,
  onContinue,
  previewOnly = false,
}: SponsorDocsStepProps) {
  const colors = usePublicBrandColors()
  const sponsored = useMemo(
    () =>
      applicants.filter(
        (a) => a.sponsor?.mode === 'someone_else' && a.sponsor.profileComplete,
      ),
    [applicants],
  )

  const [activeId, setActiveId] = useState(sponsored[0]?.id ?? '')
  const [uploadOpen, setUploadOpen] = useState(false)

  useEffect(() => {
    if (!sponsored.some((a) => a.id === activeId) && sponsored[0]) {
      setActiveId(sponsored[0].id)
    }
  }, [sponsored, activeId])

  const active = sponsored.find((a) => a.id === activeId) ?? sponsored[0]
  const sponsor = active?.sponsor?.mode === 'someone_else' ? active.sponsor : undefined
  const bankKey = active ? checklistUploadKey(active.id, SPONSOR_BANK_STATEMENT_DOC_ID) : ''
  const bankUpload = bankKey ? uploads[bankKey] : undefined

  const allComplete =
    sponsored.length > 0 &&
    sponsored.every((a) => Boolean(uploads[checklistUploadKey(a.id, SPONSOR_BANK_STATEMENT_DOC_ID)]))

  const travellerName = active?.details.fullName.trim() || active?.label || 'traveller'

  const body = (
    <Stack spacing={2.5} sx={{ width: '100%', textAlign: 'left' }}>
      {sponsored.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: colors.textMuted, textAlign: 'center', py: 4 }}>
          No sponsored travellers on this application.
        </Typography>
      ) : (
        <>
          {sponsored.length > 1 ? (
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
              {sponsored.map((applicant) => {
                const isActive = applicant.id === active?.id
                const label = applicant.details.fullName.trim() || applicant.label
                const done = Boolean(
                  uploads[checklistUploadKey(applicant.id, SPONSOR_BANK_STATEMENT_DOC_ID)],
                )
                return (
                  <Box
                    key={applicant.id}
                    component="button"
                    type="button"
                    onClick={() => setActiveId(applicant.id)}
                    sx={{
                      appearance: 'none',
                      font: 'inherit',
                      cursor: 'pointer',
                      flexShrink: 0,
                      px: 1.5,
                      py: 1,
                      borderRadius: BORDER_RADIUS.lg,
                      border: `1.5px solid ${isActive ? sponsorGold.border : colors.border}`,
                      bgcolor: isActive ? sponsorGold.soft : colors.white,
                      textAlign: 'left',
                      minWidth: 120,
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.navy }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: done ? sponsorGold.main : colors.textMuted }}>
                      {done ? 'Uploaded' : 'Needs statement'}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          ) : null}

          {sponsor ? (
            <Box
              sx={{
                borderRadius: BORDER_RADIUS.xl,
                border: `1.5px solid ${sponsorGold.border}`,
                background: 'linear-gradient(180deg, #FFFBF0 0%, #FFFFFF 70%)',
                p: 2.5,
                maxWidth: 440,
                mx: 'auto',
                width: '100%',
              }}
            >
              <Stack alignItems="center" spacing={0.75} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: AVATAR_FALLBACK,
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: `1.5px dashed ${sponsorGold.border}`,
                    outlineOffset: 5,
                  }}
                >
                  {initialsFromName(sponsor.name).slice(0, 1)}
                </Box>
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: colors.navy }}>
                  {displayNameUpper(sponsor.name)}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.45,
                    color: sponsorGold.main,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}
                >
                  <Star size={11} fill={sponsorGold.main} />
                  SPONSOR
                </Box>
                <Typography sx={{ fontSize: 12.5, color: colors.textMuted, textAlign: 'center' }}>
                  {sponsor.relationship} · funding {travellerName}&apos;s trip
                </Typography>
              </Stack>

              <Box
                sx={{
                  ...getElevatedCardSx(colors.border),
                  borderRadius: BORDER_RADIUS.lg,
                  bgcolor: colors.white,
                  p: 2,
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy, mb: 0.35 }}>
                  Sponsor bank statement
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: colors.textMuted, mb: 1.5, lineHeight: 1.4 }}>
                  Upload a recent statement in {sponsor.name}&apos;s name (JPEG, PNG, or PDF).
                </Typography>

                {bankUpload ? (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.25}
                    sx={{
                      p: 1.5,
                      borderRadius: BORDER_RADIUS.md,
                      bgcolor: retailFlowColors.greenMuted,
                      border: `1px solid ${retailFlowColors.greenBorderSoft}`,
                    }}
                  >
                    <FileText size={18} color={retailFlowColors.green} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>
                        Statement uploaded
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: colors.textMuted }}>
                        {new Date(bankUpload.capturedAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Button label="Replace" variant="ghost" size="sm" onClick={() => setUploadOpen(true)} />
                  </Stack>
                ) : (
                  <Button
                    label="Upload bank statement"
                    variant="soft"
                    color="primary"
                    fullWidth
                    onClick={() => setUploadOpen(true)}
                  />
                )}
              </Box>
            </Box>
          ) : null}
        </>
      )}

      <FileUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        documentName="Sponsor bank statement"
        description="Last 3 months preferred. Must show the sponsor's name and account details."
        onUpload={(files) => {
          const file = files[0]
          if (!file || !active) return
          const reader = new FileReader()
          reader.onload = () => {
            onUpload(active.id, {
              dataUrl: String(reader.result ?? ''),
              capturedAt: new Date().toISOString(),
            })
            setUploadOpen(false)
          }
          reader.readAsDataURL(file)
        }}
      />
    </Stack>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="Sponsor documents"
      helperText="Upload financial proof for each sponsor. Marked clearly so reviewers know it’s not the traveller’s statement."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!allComplete}
      contentMaxWidth={560}
    >
      {body}
    </StepShell>
  )
}
