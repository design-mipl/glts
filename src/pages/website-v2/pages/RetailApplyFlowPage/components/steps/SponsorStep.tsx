import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, TextField, Typography } from '@mui/material'
import { Plus, Star, User } from 'lucide-react'
import { Button, IconButton } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowEaseOut } from '@/pages/website-v2/theme/retailFlowTokens'
import { displayNameUpper, initialsFromName } from '../../config/travelProfileQuestions'
import type { RetailApplicantParty, RetailTravellerSponsor } from '../../types'
import { SponsorProfileBuilder, sponsorGold } from '../SponsorProfileBuilder'
import { StepShell } from '../StepShell'

interface SponsorStepProps {
  applicants: RetailApplicantParty[]
  onUpdateSponsor: (applicantId: string, sponsor: RetailTravellerSponsor) => void
  onGoToTravelProfile: () => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

function sponsorSelectionComplete(sponsor: RetailTravellerSponsor | undefined): boolean {
  if (!sponsor) return false
  if (sponsor.mode === 'individual') return true
  return Boolean(sponsor.profileComplete && sponsor.name.trim() && sponsor.relationship && sponsor.contact.trim())
}

function RadioDot({ selected }: { selected: boolean }) {
  const colors = usePublicBrandColors()
  return (
    <Box
      aria-hidden
      sx={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: `2px solid ${selected ? colors.navy : 'rgba(15, 23, 42, 0.25)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {selected ? (
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.navy }} />
      ) : null}
    </Box>
  )
}

/** B10 beat 1 — Who's paying: Individual vs Someone else + build sponsor profile. */
export function SponsorStep({
  applicants,
  onUpdateSponsor,
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
  const [builderOpen, setBuilderOpen] = useState(false)
  const [draftName, setDraftName] = useState('')

  useEffect(() => {
    if (!named.some((a) => a.id === activeId) && named[0]) {
      setActiveId(named[0].id)
    }
  }, [named, activeId])

  const active = named.find((a) => a.id === activeId) ?? named[0]
  const sponsor = active?.sponsor
  const travellerName = active?.details.fullName.trim() || active?.label || 'this traveller'
  const travellerFirst = travellerName.split(/\s+/)[0] || travellerName

  const allComplete = named.length > 0 && named.every((a) => sponsorSelectionComplete(a.sponsor))

  function setMode(mode: 'individual' | 'someone_else') {
    if (!active) return
    if (mode === 'individual') {
      onUpdateSponsor(active.id, { mode: 'individual' })
      setBuilderOpen(false)
      return
    }
    const existing = sponsor?.mode === 'someone_else' ? sponsor : undefined
    onUpdateSponsor(active.id, {
      mode: 'someone_else',
      name: existing?.name ?? '',
      relationship: existing?.relationship ?? '',
      contact: existing?.contact ?? '',
      profileComplete: existing?.profileComplete,
    })
    setDraftName(existing?.name ?? '')
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
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
              {named.map((applicant) => {
                const isActive = applicant.id === active?.id
                const label = applicant.details.fullName.trim() || applicant.label
                const done = sponsorSelectionComplete(applicant.sponsor)
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
                      {done ? 'Done' : 'Needs answer'}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          ) : null}

          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: colors.navy, mb: 0.5 }}>
              Who&apos;s paying for {travellerFirst}&apos;s trip?
            </Typography>
            <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 2, lineHeight: 1.45 }}>
              Pick self-funded or add a sponsor. Bank statements come on the next step when needed.
            </Typography>

            <Stack spacing={1.25} sx={{ maxWidth: 520 }}>
              <Box
                role="button"
                tabIndex={0}
                onClick={() => setMode('individual')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setMode('individual')
                  }
                }}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  width: '100%',
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 999,
                  border: `1.5px solid ${
                    sponsor?.mode === 'individual' ? sponsorGold.border : colors.border
                  }`,
                  bgcolor: colors.white,
                  textAlign: 'left',
                  transition: `border-color 150ms ${retailFlowEaseOut}`,
                  '&:hover': { borderColor: sponsorGold.border },
                }}
              >
                <IconButton
                  icon={<User size={14} strokeWidth={1.75} />}
                  variant="soft"
                  color="success"
                  size="sm"
                  sx={{ pointerEvents: 'none', flexShrink: 0 }}
                />
                <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 700, color: colors.navy }}>
                  Self-paying
                </Typography>
                <RadioDot selected={sponsor?.mode === 'individual'} />
              </Box>

              {sponsor?.mode === 'someone_else' ? (
                <Box
                  sx={{
                    borderRadius: BORDER_RADIUS.xl,
                    border: `1.5px solid ${sponsorGold.border}`,
                    background: 'linear-gradient(180deg, #FFFBF0 0%, #FFFFFF 72%)',
                    p: 2,
                    position: 'relative',
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 14, right: 14 }}>
                    <RadioDot selected />
                  </Box>

                  <Stack alignItems="center" spacing={0.75} sx={{ mb: 2, pt: 0.5 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: AVATAR_FALLBACK,
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        outline: `1.5px dashed ${sponsorGold.border}`,
                        outlineOffset: 4,
                      }}
                    >
                      {initialsFromName(draftName || sponsor.name || 'S').slice(0, 1)}
                    </Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 800, color: colors.navy }}>
                      {displayNameUpper(draftName || sponsor.name || 'Sponsor')}
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.4,
                        color: sponsorGold.main,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                      }}
                    >
                      <Star size={11} fill={sponsorGold.main} />
                      SPONSOR
                    </Box>
                  </Stack>

                  <TextField
                    label="Sponsor's Name"
                    value={draftName || sponsor.name}
                    onChange={(event) => {
                      const value = event.target.value
                      setDraftName(value)
                      onUpdateSponsor(active!.id, {
                        mode: 'someone_else',
                        name: value,
                        relationship: sponsor.relationship,
                        contact: sponsor.contact,
                        profileComplete: false,
                      })
                    }}
                    fullWidth
                    size="small"
                    sx={{
                      mb: 1.5,
                      '& .MuiOutlinedInput-root': { borderRadius: BORDER_RADIUS.md, fontSize: 13 },
                    }}
                  />

                  {sponsor.profileComplete ? (
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: 12.5, color: colors.textMuted, textAlign: 'center' }}>
                        {sponsor.relationship} · {sponsor.contact}
                      </Typography>
                      <Button
                        label="Edit sponsor profile"
                        variant="soft"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          setDraftName(sponsor.name)
                          setBuilderOpen(true)
                        }}
                      />
                    </Stack>
                  ) : (
                    <Button
                      label="Build profile"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!(draftName || sponsor.name).trim()}
                      onClick={() => {
                        const name = (draftName || sponsor.name).trim()
                        onUpdateSponsor(active!.id, {
                          mode: 'someone_else',
                          name,
                          relationship: sponsor.relationship,
                          contact: sponsor.contact,
                          profileComplete: false,
                        })
                        setBuilderOpen(true)
                      }}
                    />
                  )}
                </Box>
              ) : (
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={() => setMode('someone_else')}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setMode('someone_else')
                    }
                  }}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    width: '100%',
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 999,
                    border: `1.5px solid ${colors.border}`,
                    bgcolor: colors.white,
                    textAlign: 'left',
                    transition: `border-color 150ms ${retailFlowEaseOut}`,
                    '&:hover': { borderColor: sponsorGold.border },
                  }}
                >
                  <IconButton
                    icon={<Plus size={14} strokeWidth={1.75} />}
                    variant="soft"
                    color="success"
                    size="sm"
                    sx={{ pointerEvents: 'none', flexShrink: 0 }}
                  />
                  <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 700, color: colors.navy }}>
                    Someone else
                  </Typography>
                  <RadioDot selected={false} />
                </Box>
              )}
            </Stack>
          </Box>
        </>
      )}

      {builderOpen && active && sponsor?.mode === 'someone_else' ? (
        <SponsorProfileBuilder
          initialName={draftName || sponsor.name}
          initialRelationship={sponsor.relationship}
          initialContact={sponsor.contact}
          travellerName={travellerName}
          onClose={() => setBuilderOpen(false)}
          onComplete={(next) => {
            onUpdateSponsor(active.id, next)
            setDraftName(next.name)
            setBuilderOpen(false)
          }}
        />
      ) : null}
    </Stack>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="Who's paying for this trip?"
      helperText="Self-funded travellers continue immediately. Sponsored trips need a short sponsor profile first."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!allComplete}
      contentMaxWidth={560}
    >
      {body}
    </StepShell>
  )
}

const AVATAR_FALLBACK = '#8B6914'
