import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Check, Upload } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { FileUploadModal } from '@/pages/website-v2/components/fileUploadModal/FileUploadModal'
import { retailProfileCardGradient } from '@/pages/website-v2/theme/retailFlowTokens'
import { StepShell } from '../StepShell'
import { PhotoCaptureFlow } from '../capture/PhotoCaptureFlow'
import { PassportCaptureFlow } from '../capture/PassportCaptureFlow'
import { displayNameUpper, initialsFromName } from '../../config/travelProfileQuestions'
import {
  TRAVELLER_BANK_STATEMENT_DOC_ID,
  type RetailApplicantParty,
  type RetailCapturedImage,
} from '../../types'
import { checklistUploadKey } from './ChecklistStep'

const AVATAR_TONES = ['#D4A0A0', '#0D9488', '#B45309', '#4F46E5', '#0891B2'] as const

interface PassportStepProps {
  countryName?: string
  applicants: RetailApplicantParty[]
  uploads?: Record<string, RetailCapturedImage>
  onUpdateApplicant: (id: string, patch: Partial<RetailApplicantParty>) => void
  onUploadBankStatement?: (applicantId: string, image: RetailCapturedImage) => void
  onBack: () => void
  onContinue: () => void
}

type ActiveCapture =
  | { kind: 'photo'; applicantId: string }
  | { kind: 'passport'; applicantId: string }
  | { kind: 'bank'; applicantId: string }

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

function hasBankStatement(
  applicant: RetailApplicantParty,
  uploads: Record<string, RetailCapturedImage>,
): boolean {
  return Boolean(uploads[checklistUploadKey(applicant.id, TRAVELLER_BANK_STATEMENT_DOC_ID)])
}

function docsUploadedCount(
  applicant: RetailApplicantParty,
  uploads: Record<string, RetailCapturedImage>,
): { done: number; total: number } {
  const total = 3
  let done = 0
  if (applicant.photo) done += 1
  if (applicant.passport) done += 1
  if (hasBankStatement(applicant, uploads)) done += 1
  return { done, total }
}

function applicantReady(
  applicant: RetailApplicantParty,
  uploads: Record<string, RetailCapturedImage>,
): boolean {
  return Boolean(
    applicant.photo &&
      applicant.passport &&
      applicant.passportBack &&
      applicant.details.email.trim() &&
      applicant.details.phone.trim() &&
      hasBankStatement(applicant, uploads),
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
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        minHeight: 56,
        py: 0.85,
        px: 0.5,
        borderRadius: BORDER_RADIUS.lg,
        border: uploaded
          ? '1px solid rgba(115, 192, 100, 0.35)'
          : `1px solid ${colors.border}`,
        bgcolor: uploaded ? 'rgba(115, 192, 100, 0.06)' : colors.surfaceAlt,
        cursor: 'pointer',
        fontFamily: 'inherit',
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
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: colors.greenBright,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Check size={11} strokeWidth={3} />
        </Box>
      ) : (
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: BORDER_RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor: 'rgba(115, 192, 100, 0.14)',
            color: colors.greenBright,
          }}
        >
          <Upload size={12} strokeWidth={2.25} />
        </Box>
      )}
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          color: colors.navy,
          lineHeight: 1.15,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

/** Essential documents — multi-traveller Photo + Passport + Bank cards with capture overlays. */
export function PassportStep({
  countryName,
  applicants,
  uploads = {},
  onUpdateApplicant,
  onUploadBankStatement,
  onBack,
  onContinue,
}: PassportStepProps) {
  const colors = usePublicBrandColors()
  const [active, setActive] = useState<ActiveCapture | null>(null)
  const allReady = applicants.every((applicant) => applicantReady(applicant, uploads))
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
              sm: applicants.length === 1 ? 'minmax(0, 240px)' : 'repeat(2, minmax(0, 240px))',
              md:
                applicants.length === 1
                  ? 'minmax(0, 240px)'
                  : applicants.length === 2
                    ? 'repeat(2, minmax(0, 240px))'
                    : 'repeat(3, minmax(0, 240px))',
            },
            gap: 2,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {applicants.map((applicant, index) => {
            const { done, total } = docsUploadedCount(applicant, uploads)
            const tone = AVATAR_TONES[index % AVATAR_TONES.length]
            const bankDone = hasBankStatement(applicant, uploads)
            return (
              <Box
                key={applicant.id}
                sx={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: 4,
                  bgcolor: colors.white,
                  backgroundImage: retailProfileCardGradient,
                  p: 1.75,
                  maxWidth: 240,
                  width: '100%',
                  mx: 'auto',
                  minHeight: 210,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack alignItems="center" spacing={0.75} sx={{ mb: 1.25, width: '100%' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: tone,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {cardInitials(applicant, index)}
                  </Box>
                  <Box sx={{ minWidth: 0, width: '100%', textAlign: 'center' }}>
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

                <Stack direction="row" spacing={0.75} sx={{ mt: 'auto', pt: 1.25 }}>
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
                  <DocActionButton
                    label="Bank"
                    uploaded={bankDone}
                    onClick={() => setActive({ kind: 'bank', applicantId: applicant.id })}
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

      {active?.kind === 'bank' && activeApplicant ? (
        <FileUploadModal
          open
          onClose={() => setActive(null)}
          documentName="Bank statement"
          description="Last 3 months preferred. Must show the traveller's name and account details."
          onUpload={(files) => {
            const file = files[0]
            if (!file || !onUploadBankStatement) return
            const reader = new FileReader()
            reader.onload = () => {
              onUploadBankStatement(active.applicantId, {
                dataUrl: String(reader.result ?? ''),
                capturedAt: new Date().toISOString(),
              })
              setActive(null)
            }
            reader.readAsDataURL(file)
          }}
        />
      ) : null}
    </>
  )
}
