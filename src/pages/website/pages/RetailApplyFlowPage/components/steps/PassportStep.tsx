import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Check, FolderOpen, Upload } from 'lucide-react'
import { StepShell } from '../StepShell'
import { applyFlow, applyFont, applyMotion, applyRadius } from '@/pages/website/theme/applyFlowTheme'
import { SectionHeading } from '@/pages/website/theme/applyFormControls'
import { PhotoCaptureFlow } from '../capture/PhotoCaptureFlow'
import { PassportCaptureFlow } from '../capture/PassportCaptureFlow'
import { displayNameUpper, initialsFromName } from '../../config/travelProfileQuestions'
import { type RetailApplicantParty, type RetailCapturedImage } from '../../types'
import { getStoredDocumentByType } from '@/shared/services/storedDocumentsService'


function StoredPassportReuseBanner({
  applicants,
  onApply,
}: {
  applicants: RetailApplicantParty[]
  onApply: (applicantId: string, image: RetailCapturedImage) => void
}) {
  const stored = getStoredDocumentByType('passport')
  if (!stored) return null

  const target = applicants.find(a => !a.passport) ?? applicants[0]
  if (!target || target.passport) return null

  return (
    <Box
      sx={{
        mb: 2.5,
        p: 2,
        borderRadius: applyRadius.chip,
        border: `1px solid ${applyFlow.accentBorder}`,
        bgcolor: applyFlow.surface,
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 1.5,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <FolderOpen size={18} color={applyFlow.accent} style={{ flexShrink: 0, marginTop: 2 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: applyFlow.ink }}>
          Use stored passport
        </Typography>
        <Typography sx={{ fontSize: 12, color: applyFlow.inkMuted, mt: 0.25 }}>
          {stored.fileName} from your account — apply to {target.details.fullName.trim() || target.label}.
        </Typography>
      </Box>
      <Box
        component="button"
        type="button"
        onClick={() =>
          onApply(target.id, {
            dataUrl: stored.fileUrl || `stored://${stored.id}`,
            capturedAt: new Date().toISOString(),
          })
        }
        sx={{
          appearance: 'none',
          border: `1px solid ${applyFlow.accent}`,
          bgcolor: applyFlow.accent,
          color: '#fff',
          borderRadius: applyRadius.chip,
          px: 2,
          py: 1,
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        Apply stored passport
      </Box>
    </Box>
  )
}

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

/**
 * This step captures identity only — photo and passport.
 *
 * Financial evidence used to be a third card here, but it is not an identity capture and
 * the client does not want a bank statement collected at this point. Any funds document a
 * given visa actually requires now comes from the requirement pack and is uploaded on the
 * Documents step with everything else, rather than being hardcoded into this screen.
 */
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
  onUpdateApplicant,
  onBack,
  onContinue,
}: PassportStepProps) {
  const [active, setActive] = useState<ActiveCapture | null>(null)
  const allReady = applicants.every(applicantReady)
  const activeApplicant = active
    ? applicants.find((applicant) => applicant.id === active.applicantId)
    : undefined

  return (
    <>
      <StepShell
        title="Passport and photo"
        helperText={
          countryName
            ? `Every traveller needs both of these before ${countryName} will accept the application. Supporting documents come next.`
            : 'Every traveller needs both of these before the embassy will accept the application. Supporting documents come next.'
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
            {`Documents — ${applicants.filter(applicantReady).length} of ${applicants.length} travellers complete`}
          </SectionHeading>

          <StoredPassportReuseBanner
            applicants={applicants}
            onApply={(applicantId, image) =>
              onUpdateApplicant(applicantId, {
                passport: image,
                passportBack: image,
              })
            }
          />

          {applicants.map((applicant, index) => {
            const { done, total } = docsUploadedCount(applicant)
            const ready = applicantReady(applicant)

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
