import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Check, Upload } from 'lucide-react'
import { FileUploadModal } from '@/pages/website/components/fileUploadModal/FileUploadModal'
import { StepShell } from '../StepShell'
import { applyFlow, applyFont, applyMotion, applyRadius } from '@/pages/website/theme/applyFlowTheme'
import { SectionHeading } from '@/pages/website/theme/applyFormControls'
import { PhotoCaptureFlow } from '../capture/PhotoCaptureFlow'
import { PassportCaptureFlow } from '../capture/PassportCaptureFlow'
import { displayNameUpper, initialsFromName } from '../../config/travelProfileQuestions'
import {
  TRAVELLER_BANK_STATEMENT_DOC_ID,
  type RetailApplicantParty,
  type RetailCapturedImage,
} from '../../types'
import { checklistUploadKey } from './ChecklistStep'


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
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight: 44,
        py: 1.5,
        px: 2.5,
        borderRadius: applyRadius.chip,
        border: `1px solid ${uploaded ? applyFlow.successBorder : applyFlow.hairline}`,
        backgroundColor: uploaded ? applyFlow.successSoft : applyFlow.surface,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: `border-color 150ms ${applyMotion.easeOut}, background-color 150ms ${applyMotion.easeOut}, transform ${applyMotion.pressMs}ms ${applyMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': { borderColor: uploaded ? applyFlow.successBorder : applyFlow.accentBorder },
        },
        '&:active': { transform: 'scale(0.97)' },
        '&:focus-visible': {
          outline: 'none',
          borderColor: applyFlow.accent,
          boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
        },
      }}
    >
      {uploaded ? (
        <Check size={12} strokeWidth={3.5} style={{ color: applyFlow.success, flexShrink: 0 }} />
      ) : (
        <Upload size={12} strokeWidth={2.1} style={{ color: applyFlow.inkFaint, flexShrink: 0 }} />
      )}
      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: uploaded ? applyFlow.success : applyFlow.inkMuted,
          lineHeight: 1.15,
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
  const [active, setActive] = useState<ActiveCapture | null>(null)
  const allReady = applicants.every((applicant) => applicantReady(applicant, uploads))
  const activeApplicant = active
    ? applicants.find((applicant) => applicant.id === active.applicantId)
    : undefined

  return (
    <>
      <StepShell
        title="Passport, photo and funds"
        helperText={
          countryName
            ? `Every traveller needs these three before ${countryName} will accept the application.`
            : 'Every traveller needs these three before the embassy will accept the application.'
        }
        onBack={onBack}
        backLabel="Back"
        onContinue={onContinue}
        continueLabel="Continue"
        continueDisabled={!allReady}
        contentMaxWidth={980}
      >
        <Box sx={{ width: '100%' }}>
          <SectionHeading>
            {`Documents — ${applicants.filter((a) => applicantReady(a, uploads)).length} of ${applicants.length} travellers complete`}
          </SectionHeading>

          {applicants.map((applicant, index) => {
            const { done, total } = docsUploadedCount(applicant, uploads)
            const bankDone = hasBankStatement(applicant, uploads)
            const ready = applicantReady(applicant, uploads)

            return (
              <Box
                key={applicant.id}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'stretch', md: 'center' },
                  gap: { xs: 2.5, md: 3.5 },
                  py: 3.25,
                  borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
                  '&:first-of-type': { borderTop: `1px solid ${applyFlow.hairlineSoft}` },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={3} sx={{ flex: '0 0 auto', minWidth: 0 }}>
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
                      border: `1px solid ${ready ? applyFlow.successBorder : applyFlow.hairline}`,
                      fontFamily: applyFont.mono,
                      fontSize: 13,
                      fontWeight: 700,
                      color: applyFlow.inkMuted,
                      flex: '0 0 auto',
                    }}
                  >
                    {cardInitials(applicant, index)}
                  </Box>
                  <Box sx={{ minWidth: 0, width: { xs: 'auto', md: 150 } }}>
                    <Typography
                      sx={{
                        fontFamily: applyFont.body,
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: applyFlow.ink,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cardTitle(applicant, index)}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: applyFont.mono,
                        fontSize: 10.5,
                        color: ready ? applyFlow.success : applyFlow.inkMuted,
                        mt: 0.75,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {done} / {total} uploaded
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ flex: '1 1 auto', minWidth: 0 }}>
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
