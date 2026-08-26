import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Check, Plus, Trash2, Upload } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { Button, IconButton } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { StepShell } from '../StepShell'
import { PhotoCaptureFlow } from '../capture/PhotoCaptureFlow'
import { PassportCaptureFlow } from '../capture/PassportCaptureFlow'
import type { RetailApplicantParty, RetailCapturedImage } from '../../types'

const AVATAR_TONES = ['#E11D48', '#0D9488', '#B45309', '#4F46E5', '#0891B2'] as const

interface PassportStepProps {
  countryName?: string
  applicants: RetailApplicantParty[]
  onUpdateApplicant: (id: string, patch: Partial<RetailApplicantParty>) => void
  onAddTraveller: () => void
  onRemoveTraveller: (id: string) => void
  onBack: () => void
  onContinue: () => void
}

type ActiveCapture =
  | { kind: 'photo'; applicantId: string }
  | { kind: 'passport'; applicantId: string }

function initialsFor(applicant: RetailApplicantParty, index: number): string {
  const name = applicant.details.fullName.trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }
  return index === 0 ? 'T1' : `T${index + 1}`
}

function displayName(applicant: RetailApplicantParty, index: number): string {
  const name = applicant.details.fullName.trim()
  if (name) return name
  return index === 0 ? 'Traveller 1' : applicant.label
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
  onAddTraveller,
  onRemoveTraveller,
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
        footerEndAction={
          <Button
            label="Add travelers"
            variant="soft"
            color="primary"
            startIcon={<Plus size={16} />}
            onClick={onAddTraveller}
          />
        }
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: applicants.length === 1 ? 'minmax(0, 220px)' : 'repeat(2, minmax(0, 220px))',
              md:
                applicants.length === 1
                  ? 'minmax(0, 220px)'
                  : applicants.length === 2
                    ? 'repeat(2, minmax(0, 220px))'
                    : 'repeat(3, minmax(0, 220px))',
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
                  borderRadius: BORDER_RADIUS.xl,
                  bgcolor: colors.white,
                  p: 2,
                  maxWidth: 220,
                  width: '100%',
                  mx: 'auto',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
                  position: 'relative',
                }}
              >
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: BORDER_RADIUS.xl,
                        bgcolor: tone,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {initialsFor(applicant, index)}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: 16,
                          color: colors.navy,
                          lineHeight: 1.35,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {displayName(applicant, index)}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.25 }}>
                        {done}/{total} docs uploaded
                      </Typography>
                    </Box>
                  </Stack>
                  {index > 0 ? (
                    <IconButton
                      size="sm"
                      variant="soft"
                      color="error"
                      tooltip={`Remove ${displayName(applicant, index)}`}
                      icon={<Trash2 size={14} />}
                      onClick={() => onRemoveTraveller(applicant.id)}
                    />
                  ) : (
                    <Box sx={{ width: 34 }} />
                  )}
                </Stack>

                <Stack spacing={1.25} sx={{ mt: 5.5 }}>
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
