import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FileText, User, Users } from 'lucide-react'
import { Button, FormField, Input } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { FileUploadModal } from '@/pages/website-v2/components/fileUploadModal/FileUploadModal'
import { getElevatedCardSx, retailFlowColors } from '@/pages/website-v2/theme/retailFlowTokens'
import { initialsFromName } from '../../config/travelProfileQuestions'
import {
  SPONSOR_BANK_STATEMENT_DOC_ID,
  type RetailApplicantParty,
  type RetailCapturedImage,
  type RetailTravellerSponsor,
} from '../../types'
import { checklistUploadKey } from './ChecklistStep'
import { StepShell } from '../StepShell'

interface SponsorStepProps {
  applicants: RetailApplicantParty[]
  uploads: Record<string, RetailCapturedImage>
  onUpdateSponsor: (applicantId: string, sponsor: RetailTravellerSponsor) => void
  onUpload: (applicantId: string, image: RetailCapturedImage) => void
  onGoToTravelProfile: () => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

function travellerSponsorComplete(
  sponsor: RetailTravellerSponsor | undefined,
  hasBankStatement: boolean,
): boolean {
  if (!sponsor) return false
  if (sponsor.mode === 'individual') return true
  return (
    sponsor.name.trim().length > 0 &&
    sponsor.relationship.trim().length > 0 &&
    sponsor.contact.trim().length > 0 &&
    hasBankStatement
  )
}

function ModeCard({
  selected,
  onSelect,
  icon,
  label,
  description,
}: {
  selected: boolean
  onSelect: () => void
  icon: ReactNode
  label: string
  description: string
}) {
  const colors = usePublicBrandColors()
  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      sx={{
        appearance: 'none',
        font: 'inherit',
        textAlign: 'left',
        cursor: 'pointer',
        flex: 1,
        minWidth: 0,
        p: 2,
        borderRadius: BORDER_RADIUS.lg,
        bgcolor: selected ? retailFlowColors.optionBgSelected : colors.white,
        border: `1.5px solid ${selected ? retailFlowColors.optionBorderSelected : colors.border}`,
        ...(!selected ? getElevatedCardSx(colors.border) : { boxShadow: 'none' }),
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        '&:hover': {
          borderColor: selected ? retailFlowColors.optionBorderSelected : retailFlowColors.greenBorderSoft,
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor: selected ? retailFlowColors.greenMuted : colors.surfaceAlt,
            color: selected ? retailFlowColors.green : colors.navy,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>{label}</Typography>
          <Typography sx={{ fontSize: 12.5, color: colors.textMuted, mt: 0.35, lineHeight: 1.4 }}>
            {description}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

/** B10 — Who's paying, per traveller (Individual vs Someone else + sponsor bank statement). */
export function SponsorStep({
  applicants,
  uploads,
  onUpdateSponsor,
  onUpload,
  onGoToTravelProfile,
  onBack,
  onContinue,
  previewOnly = false,
}: SponsorStepProps) {
  const colors = usePublicBrandColors()
  const named = useMemo(
    () => applicants.filter((a) => a.details.fullName.trim() || a.label),
    [applicants],
  )
  const initialId =
    named.find((a) => a.sponsor?.mode === 'someone_else')?.id ?? named[0]?.id ?? ''
  const [activeId, setActiveId] = useState(initialId)
  const [uploadOpen, setUploadOpen] = useState(false)

  useEffect(() => {
    if (!named.some((a) => a.id === activeId) && named[0]) {
      setActiveId(named[0].id)
    }
  }, [named, activeId])

  const active = named.find((a) => a.id === activeId) ?? named[0]
  const sponsor = active?.sponsor
  const bankKey = active
    ? checklistUploadKey(active.id, SPONSOR_BANK_STATEMENT_DOC_ID)
    : ''
  const bankUpload = bankKey ? uploads[bankKey] : undefined

  const allComplete =
    named.length > 0 &&
    named.every((a) =>
      travellerSponsorComplete(
        a.sponsor,
        Boolean(uploads[checklistUploadKey(a.id, SPONSOR_BANK_STATEMENT_DOC_ID)]),
      ),
    )

  const name = active?.details.fullName.trim() || active?.label || 'this traveller'

  function setMode(mode: 'individual' | 'someone_else') {
    if (!active) return
    if (mode === 'individual') {
      onUpdateSponsor(active.id, { mode: 'individual' })
      return
    }
    onUpdateSponsor(active.id, {
      mode: 'someone_else',
      name: sponsor?.mode === 'someone_else' ? sponsor.name : '',
      relationship: sponsor?.mode === 'someone_else' ? sponsor.relationship : '',
      contact: sponsor?.mode === 'someone_else' ? sponsor.contact : '',
    })
  }

  function patchSomeoneElse(patch: Partial<Extract<RetailTravellerSponsor, { mode: 'someone_else' }>>) {
    if (!active || sponsor?.mode !== 'someone_else') return
    onUpdateSponsor(active.id, { ...sponsor, ...patch })
  }

  const body = (
    <Stack spacing={2.5} sx={{ width: '100%', textAlign: 'left' }}>
      {named.length === 0 ? (
        <Stack spacing={1.5} alignItems="center" sx={{ py: 3 }}>
          <Typography sx={{ fontSize: 13, color: colors.textMuted, textAlign: 'center' }}>
            No travelers yet. Add them in Travel profile, then return here.
          </Typography>
          <Button label="Go to Travel profile" variant="soft" color="primary" onClick={onGoToTravelProfile} />
        </Stack>
      ) : (
        <>
          {named.length > 1 ? (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                pb: 0.5,
              }}
            >
              {named.map((applicant) => {
                const isActive = applicant.id === active?.id
                const label = applicant.details.fullName.trim() || applicant.label
                const done = travellerSponsorComplete(
                  applicant.sponsor,
                  Boolean(uploads[checklistUploadKey(applicant.id, SPONSOR_BANK_STATEMENT_DOC_ID)]),
                )
                return (
                  <Box
                    key={applicant.id}
                    component="button"
                    type="button"
                    onClick={() => setActiveId(applicant.id)}
                    sx={{
                      appearance: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      flex: '0 0 auto',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.25,
                      textAlign: 'left',
                      px: 2,
                      py: 1.25,
                      borderRadius: '10px',
                      bgcolor: isActive ? colors.navy : colors.surfaceAlt,
                      color: isActive ? '#fff' : colors.navy,
                      font: 'inherit',
                      transition: 'background-color 0.15s ease, color 0.15s ease',
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: isActive ? 'rgba(255,255,255,0.18)' : colors.border,
                        color: isActive ? '#fff' : colors.textSecondary,
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {initialsFromName(label)}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          opacity: 0.75,
                          mt: 0.15,
                        }}
                      >
                        {done ? 'Done' : 'Needs answer'}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          ) : null}

          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: colors.navy, mb: 0.5 }}>
              Who&apos;s paying for {name}&apos;s trip?
            </Typography>
            <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 2, lineHeight: 1.45 }}>
              A sponsor funds the majority of this trip. Their financials matter for approval.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <ModeCard
                selected={sponsor?.mode === 'individual'}
                onSelect={() => setMode('individual')}
                icon={<User size={18} strokeWidth={2.2} />}
                label="Individual"
                description="Self-funded — this traveller pays for their own trip."
              />
              <ModeCard
                selected={sponsor?.mode === 'someone_else'}
                onSelect={() => setMode('someone_else')}
                icon={<Users size={18} strokeWidth={2.2} />}
                label="Someone else"
                description="A parent, relative, employer, or host is covering costs."
              />
            </Stack>
          </Box>

          {sponsor?.mode === 'someone_else' ? (
            <Stack spacing={2}>
              <Box
                sx={{
                  ...getElevatedCardSx(colors.border),
                  borderRadius: BORDER_RADIUS.lg,
                  bgcolor: colors.white,
                  p: 2,
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy, mb: 1.5 }}>
                  Sponsor details
                </Typography>
                <Stack spacing={1.75}>
                  <FormField label="Sponsor name" required>
                    <Input
                      fullWidth
                      value={sponsor.name}
                      onChange={(v) => patchSomeoneElse({ name: v })}
                      placeholder="Full name"
                    />
                  </FormField>
                  <FormField label="Relationship to traveller" required>
                    <Input
                      fullWidth
                      value={sponsor.relationship}
                      onChange={(v) => patchSomeoneElse({ relationship: v })}
                      placeholder="e.g. Parent, Spouse, Employer"
                    />
                  </FormField>
                  <FormField label="Contact" required>
                    <Input
                      fullWidth
                      value={sponsor.contact}
                      onChange={(v) => patchSomeoneElse({ contact: v })}
                      placeholder="Phone or email"
                    />
                  </FormField>
                </Stack>
              </Box>

              <Box
                sx={{
                  ...getElevatedCardSx(colors.border),
                  borderRadius: BORDER_RADIUS.lg,
                  bgcolor: colors.white,
                  p: 2,
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy, mb: 0.5 }}>
                  Sponsor bank statement
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: colors.textMuted, mb: 1.5, lineHeight: 1.4 }}>
                  Upload a recent statement in the sponsor&apos;s name (JPEG, PNG, or PDF).
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
                    onClick={() => setUploadOpen(true)}
                  />
                )}
              </Box>
            </Stack>
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
      title="Who's paying for this trip?"
      helperText="Answer for each traveller. Self-funded travellers skip sponsor paperwork."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!allComplete}
      contentMaxWidth={720}
    >
      {body}
    </StepShell>
  )
}
