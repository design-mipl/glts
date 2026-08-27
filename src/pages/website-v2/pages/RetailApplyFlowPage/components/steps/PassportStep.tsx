import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Check, Upload } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { StepShell } from '../StepShell'
import { PhotoCaptureFlow } from '../capture/PhotoCaptureFlow'
import { PassportCaptureFlow } from '../capture/PassportCaptureFlow'
import { displayNameUpper, initialsFromName } from '../../config/travelProfileQuestions'
import type { RetailApplicantParty, RetailCapturedImage } from '../../types'

const AVATAR_TONES = ['#D4A0A0', '#0D9488', '#B45309', '#4F46E5', '#0891B2'] as const

interface PassportStepProps {
  countryName?: string
  applicants: RetailApplicantParty[]
  onUpdateApplicant: (id: string, patch: Partial<RetailApplicantParty>) => void
  onBack: () => void
  onContinue: () => void
}

type ActiveCapture =
  | { kind: 'photo'; applicantId: string }
  | { kind: 'passport'; applicantId: string }

function cardTitle(applicant: RetailApplicantParty, index: number): string {
  const name = applicant.details.fullName.trim()
  if (name) return displayNameUpper(name)
  return index === 0 ? 'TRAVELLER 1' : displayNameUpper(applicant.label)
}

function cardInitials(applicant: RetailApplicantParty, index: number): string {
  const name = applicant.details.fullName.trim()
  if (name) return initialsFromName(name)
  return index === 0 ? 'T1' : `T${index + 1}`
}

function docsUploadedCount(applicant: RetailApplicantParty): { done: number; total: number } {
  const total = 2
  let done = 0
  if (applicant.photo) done += 1
  if (applicant.passport) done += 1
  return { done, total }
}

function applicantReady(applicant: RetailApplicantParty): boolean {
  return Boolean(
    applicant.photo &&
      applicant.passport &&
      applicant.passportBack &&
      applicant.details.email.trim() &&
      applicant.details.phone.trim(),
  )
}

function DocActionButton({
  label,
  uploaded,
  onClick,
}: {
  label: string
  uploaded: boolean
  onClick: () => void
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        appearance: 'none',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 1.25,
        minHeight: 40,
        py: 1.25,
        px: 1.5,
        borderRadius: BORDER_RADIUS.xl,
        border: uploaded
          ? '1px solid rgba(115, 192, 100, 0.35)'
          : `1px solid ${colors.border}`,
        bgcolor: uploaded ? 'rgba(115, 192, 100, 0.06)' : colors.surfaceAlt,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: 700,
        color: colors.navy,
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        '&:hover': {
          borderColor: uploaded ? 'rgba(115, 192, 100, 0.55)' : colors.greenBright,
          bgcolor: uploaded ? 'rgba(115, 192, 100, 0.1)' : colors.surfaceAlt,
        },
      }}
    >
      {uploaded ? (
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            bgcolor: colors.greenBright,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Check size={12} strokeWidth={3} />
        </Box>
      ) : (
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: BORDER_RADIUS.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor: 'rgba(115, 192, 100, 0.14)',
            color: colors.greenBright,
          }}
        >
          <Upload size={14} strokeWidth={2.25} />
        </Box>
      )}
      {label}
    </Box>
  )
}

/** Essential documents — multi-traveller Photo + Passport cards with capture overlays. */
export function PassportStep({
  countryName,
  applicants,
  onUpdateApplicant,
  onBack,
  onContinue,
}: PassportStepProps) {
  const colors = usePublicBrandColors()
  const [active, setActive] = useState<ActiveCapture | null>(null)
  const allReady = applicants.every(applicantReady)
  const activeApplicant = active
    ? applicants.find((applicant) => applicant.id === active.applicantId)
    : undefined

  return (
    <>
      <StepShell
        title="The Essential Travelers details"
        helperText={
          countryName
            ? `These are as per the official ${countryName} embassy requirements for visa processing.`
            : 'These are as per the official embassy requirements for visa processing.'
        }
        onBack={onBack}
        backLabel="Back"
        onContinue={onContinue}
        continueLabel="Continue"
        continueDisabled={!allReady}
        contentMaxWidth={980}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: applicants.length === 1 ? 'minmax(0, 210px)' : 'repeat(2, minmax(0, 210px))',
              md:
                applicants.length === 1
                  ? 'minmax(0, 210px)'
                  : applicants.length === 2
                    ? 'repeat(2, minmax(0, 210px))'
                    : 'repeat(3, minmax(0, 210px))',
            },
            gap: 2,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {applicants.map((applicant, index) => {
            const { done, total } = docsUploadedCount(applicant)
            const tone = AVATAR_TONES[index % AVATAR_TONES.length]
            return (
              <Box
                key={applicant.id}
                sx={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: 4,
                  bgcolor: colors.white,
                  p: 1.75,
                  maxWidth: 210,
                  width: '100%',
                  mx: 'auto',
                  minHeight: 210,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: tone,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {cardInitials(applicant, index)}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: colors.navy,
                        letterSpacing: '0.04em',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cardTitle(applicant, index)}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.25 }}>
                      {done}/{total} docs uploaded
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={1.25} sx={{ mt: 'auto', pt: 1.25 }}>
                  <DocActionButton
                    label="Photo"
                    uploaded={Boolean(applicant.photo)}
                    onClick={() => setActive({ kind: 'photo', applicantId: applicant.id })}
                  />
                  <DocActionButton
                    label="Passport"
                    uploaded={Boolean(applicant.passport)}
                    onClick={() => setActive({ kind: 'passport', applicantId: applicant.id })}
                  />
                </Stack>
              </Box>
            )
          })}
        </Box>
      </StepShell>

      {active?.kind === 'photo' && activeApplicant ? (
        <PhotoCaptureFlow
          applicantName={activeApplicant.details.fullName.trim() || activeApplicant.label}
          initialImage={activeApplicant.photo}
          onClose={() => setActive(null)}
          onConfirm={(image: RetailCapturedImage) => {
            onUpdateApplicant(active.applicantId, { photo: image })
            setActive(null)
          }}
        />
      ) : null}

      {active?.kind === 'passport' && activeApplicant ? (
        <PassportCaptureFlow
          applicantName={activeApplicant.details.fullName.trim() || activeApplicant.label}
          initialPassport={activeApplicant.passport}
          initialPassportBack={activeApplicant.passportBack}
          initialFields={activeApplicant.passportFields}
          initialDetails={activeApplicant.details}
          onClose={() => setActive(null)}
          onConfirm={(result) => {
            onUpdateApplicant(active.applicantId, {
              passport: result.passport,
              passportBack: result.passportBack,
              passportFields: result.passportFields,
              details: {
                ...activeApplicant.details,
                ...result.details,
              },
            })
            setActive(null)
          }}
        />
      ) : null}
    </>
  )
}
