import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Plus, Star } from 'lucide-react'
import { Button, Input } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowColors } from '@/pages/website-v2/theme/retailFlowTokens'
import {
  displayNameUpper,
  initialsFromName,
} from '../../config/travelProfileQuestions'
import type { RetailApplicantParty, RetailSponsorSelection } from '../../types'
import { StepShell } from '../StepShell'

const AVATAR_TONES = ['#D4A0A0', '#0D9488', '#B45309', '#4F46E5', '#0891B2'] as const

interface SponsorStepProps {
  applicants: RetailApplicantParty[]
  sponsor?: RetailSponsorSelection
  onChange: (sponsor: RetailSponsorSelection) => void
  onGoToTravelProfile: () => void
  onBack: () => void
  onContinue: () => void
}

function canContinue(sponsor?: RetailSponsorSelection): boolean {
  if (!sponsor) return false
  if (sponsor.mode === 'someone_else') return sponsor.name.trim().length > 0
  if (sponsor.mode === 'traveller') return Boolean(sponsor.applicantId)
  return true
}

function RadioDot({ selected }: { selected: boolean }) {
  const colors = usePublicBrandColors()
  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: `2px solid ${selected ? retailFlowColors.green : colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        bgcolor: colors.white,
      }}
    >
      {selected ? (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: retailFlowColors.green,
          }}
        />
      ) : null}
    </Box>
  )
}

function SponsorOptionCard({
  selected,
  onSelect,
  children,
}: {
  selected: boolean
  onSelect: () => void
  children: ReactNode
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
        textAlign: 'left',
        border: `1.5px solid ${selected ? retailFlowColors.optionBorderSelected : colors.border}`,
        bgcolor: selected ? retailFlowColors.optionBgSelected : colors.white,
        borderRadius: 999,
        px: 1.75,
        py: 1.35,
        cursor: 'pointer',
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        font: 'inherit',
        color: 'inherit',
        boxShadow: selected ? 'none' : '0 1px 2px rgba(15, 23, 42, 0.04)',
        '&:hover': {
          borderColor: selected ? retailFlowColors.optionBorderSelected : retailFlowColors.greenBorderSoft,
        },
      }}
    >
      {children}
      <Box sx={{ ml: 'auto' }}>
        <RadioDot selected={selected} />
      </Box>
    </Box>
  )
}

/** Choose who sponsors the trip — after travel profiles. */
export function SponsorStep({
  applicants,
  sponsor,
  onChange,
  onGoToTravelProfile,
  onBack,
  onContinue,
}: SponsorStepProps) {
  const colors = usePublicBrandColors()
  const namedApplicants = applicants.filter((applicant) => applicant.details.fullName.trim())

  const externalName = sponsor?.mode === 'someone_else' ? sponsor.name : ''

  return (
    <StepShell
      title="Let us know who's sponsoring this trip"
        helperText="A sponsor is someone who will fund the majority of this trip. Their financials are key to approval. Travelers can only be added in Travel profile."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!canContinue(sponsor)}
      contentMaxWidth={820}
    >
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2.5, md: 0 },
          textAlign: 'left',
          alignItems: 'start',
        }}
      >
        <Box
          sx={{
            pr: { md: 3 },
            borderRight: { md: `1px dashed ${colors.border}` },
            minWidth: 0,
          }}
        >
          <Stack spacing={1.25}>
            {namedApplicants.length === 0 ? (
              <Stack spacing={1.5} alignItems="center" sx={{ py: 2 }}>
                <Typography sx={{ fontSize: 13, color: colors.textMuted, textAlign: 'center' }}>
                  No travelers yet. Add them in Travel profile, then return here to choose a sponsor.
                </Typography>
                <Button
                  label="Go to Travel profile"
                  variant="soft"
                  color="primary"
                  onClick={onGoToTravelProfile}
                />
              </Stack>
            ) : (
              namedApplicants.map((applicant, index) => {
                const name = applicant.details.fullName.trim()
                const selected =
                  sponsor?.mode === 'traveller' && sponsor.applicantId === applicant.id
                const tone = AVATAR_TONES[index % AVATAR_TONES.length]

                return (
                  <SponsorOptionCard
                    key={applicant.id}
                    selected={selected}
                    onSelect={() => onChange({ mode: 'traveller', applicantId: applicant.id })}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
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
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: colors.navy,
                          letterSpacing: '0.04em',
                          lineHeight: 1.3,
                        }}
                      >
                        {displayNameUpper(name)}
                      </Typography>
                      {selected ? (
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.35 }}>
                          <Star size={11} fill={retailFlowColors.green} color={retailFlowColors.green} />
                          <Typography
                            sx={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              letterSpacing: '0.06em',
                              color: retailFlowColors.green,
                              textTransform: 'uppercase',
                            }}
                          >
                            Sponsor
                          </Typography>
                        </Stack>
                      ) : null}
                    </Box>
                  </SponsorOptionCard>
                )
              })
            )}
          </Stack>
        </Box>

        <Box sx={{ pl: { md: 3 }, minWidth: 0 }}>
          <Stack spacing={1.25}>
            <SponsorOptionCard
              selected={sponsor?.mode === 'self_paying'}
              onSelect={() => onChange({ mode: 'self_paying' })}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: retailFlowColors.greenMuted,
                  color: retailFlowColors.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: `1px dashed ${retailFlowColors.greenBorderSoft}`,
                }}
              >
                <Star size={18} fill={retailFlowColors.green} />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.navy }}>
                Everyone&apos;s self-paying
              </Typography>
            </SponsorOptionCard>

            <SponsorOptionCard
              selected={sponsor?.mode === 'someone_else'}
              onSelect={() =>
                onChange({
                  mode: 'someone_else',
                  name: sponsor?.mode === 'someone_else' ? sponsor.name : '',
                })
              }
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: colors.white,
                  color: colors.navy,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: `1.5px dashed ${colors.border}`,
                }}
              >
                <Plus size={18} strokeWidth={2} />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.navy }}>
                Someone else
              </Typography>
            </SponsorOptionCard>

            {sponsor?.mode === 'someone_else' ? (
              <Box sx={{ pt: 0.5 }}>
                <Input
                  label="Sponsor name"
                  placeholder="External sponsor full name"
                  fullWidth
                  value={externalName}
                  onChange={(value) => onChange({ mode: 'someone_else', name: value })}
                  helperText="This adds an external sponsor only — not a traveler on the trip."
                  autoFocus
                />
              </Box>
            ) : null}
          </Stack>
        </Box>
      </Box>
    </StepShell>
  )
}
