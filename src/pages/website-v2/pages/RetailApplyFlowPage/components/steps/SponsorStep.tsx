import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Check, Plus, User, UserRound } from 'lucide-react'
import { Button, IconButton } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowEaseOut, retailProfileCardGradient } from '@/pages/website-v2/theme/retailFlowTokens'
import { displayNameUpper, initialsFromName } from '../../config/travelProfileQuestions'
import type { RetailApplicantParty, RetailTravellerSponsor } from '../../types'
import { SponsorProfileBuilder } from '../SponsorProfileBuilder'
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

/** Match TravellerProfileCard avatar tone from Travel profile. */
const SPONSOR_AVATAR_TONE = '#D4A0A0'

/** Same visual language as TravellerProfileCard — sponsor name + build / complete states. */
function SponsorProfileCard({
  name,
  relationship,
  contact,
  profileComplete,
  onNameChange,
  onBuild,
  onEdit,
}: {
  name: string
  relationship?: string
  contact?: string
  profileComplete?: boolean
  onNameChange: (value: string) => void
  onBuild: () => void
  onEdit: () => void
}) {
  const colors = usePublicBrandColors()
  const trimmed = name.trim()
  const nameUpper = trimmed ? displayNameUpper(trimmed) : ''
  const tags = [relationship, contact].filter((value): value is string => Boolean(value?.trim()))
  const complete = Boolean(profileComplete && trimmed && tags.length > 0)

  if (complete) {
    return (
      <Box
        sx={{
          border: `1px solid ${colors.border}`,
          borderRadius: 4,
          bgcolor: colors.white,
          backgroundImage: retailProfileCardGradient,
          p: 1.75,
          maxWidth: 210,
          width: '100%',
          mx: 'auto',
          alignSelf: 'center',
          minHeight: 210,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: SPONSOR_AVATAR_TONE,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initialsFromName(trimmed)}
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 13,
              color: colors.navy,
              letterSpacing: '0.04em',
              lineHeight: 1.3,
            }}
          >
            {nameUpper}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: 0.5,
            pt: 1,
          }}
        >
          {tags.map((tag) => (
            <Box
              key={tag}
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 0.9,
                py: 0.55,
                borderRadius: 999,
                bgcolor: colors.greenMuted,
                border: `1px solid ${colors.border}`,
                fontSize: 11,
                fontWeight: 600,
                color: colors.navy,
                lineHeight: 1.2,
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 'auto', pt: 1.25 }}>
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              bgcolor: '#0FA968',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Sponsor profile complete"
          >
            <Check size={14} strokeWidth={2.75} />
          </Box>
          <Button label="Edit" variant="outlined" color="secondary" size="sm" onClick={onEdit} />
        </Stack>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        bgcolor: colors.white,
        backgroundImage: retailProfileCardGradient,
        p: 2,
        maxWidth: 210,
        width: '100%',
        mx: 'auto',
        alignSelf: 'center',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 210,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: SPONSOR_AVATAR_TONE,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 700,
          mt: 0.25,
          mb: 0.75,
        }}
      >
        {trimmed ? initialsFromName(trimmed) : <UserRound size={20} strokeWidth={1.75} />}
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 13,
          color: trimmed ? colors.navy : colors.textMuted,
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}
      >
        {nameUpper || 'ADD NAME'}
      </Typography>

      <Box
        component="form"
        sx={{ width: '100%', mt: 'auto', pt: 1.5 }}
        onSubmit={(event) => {
          event.preventDefault()
          if (trimmed) onBuild()
        }}
      >
        <Box
          sx={{
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            px: 1.5,
            pt: 1,
            pb: 1.1,
            bgcolor: colors.white,
            textAlign: 'left',
          }}
        >
          <Typography
            component="label"
            htmlFor="sponsor-name-input"
            sx={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: colors.textMuted,
              mb: 0.35,
            }}
          >
            Name
          </Typography>
          <Box
            component="input"
            id="sponsor-name-input"
            value={name}
            placeholder="Sponsor name"
            onChange={(event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value)}
            sx={{
              width: '100%',
              border: 'none',
              outline: 'none',
              bgcolor: 'transparent',
              font: 'inherit',
              fontSize: 15,
              fontWeight: 700,
              color: colors.navy,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              p: 0,
              '&::placeholder': {
                color: colors.textMuted,
                fontWeight: 500,
                letterSpacing: 0,
                textTransform: 'none',
              },
            }}
          />
        </Box>
        <Button
          type="submit"
          label="Build profile"
          variant="soft"
          color="primary"
          fullWidth
          sx={{ mt: 1.5 }}
          disabled={!trimmed}
        />
      </Box>
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

  useEffect(() => {
    if (sponsor?.mode === 'someone_else') {
      setDraftName(sponsor.name)
    } else {
      setDraftName('')
    }
  }, [active?.id, sponsor])

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
                      border: `1.5px solid ${isActive ? colors.green : colors.border}`,
                      bgcolor: isActive ? colors.greenMuted : colors.white,
                      textAlign: 'left',
                      minWidth: 120,
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.navy }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: done ? colors.greenDark : colors.textMuted }}>
                      {done ? 'Done' : 'Needs answer'}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          ) : null}

          <Stack spacing={1.5} sx={{ maxWidth: 520, mx: 'auto', width: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ width: '100%' }}>
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
                  gap: 1,
                  flex: 1,
                  minWidth: 0,
                  px: 1.25,
                  py: 1.25,
                  borderRadius: 999,
                  border: `1.5px solid ${
                    sponsor?.mode === 'individual' ? colors.green : colors.border
                  }`,
                  bgcolor: colors.white,
                  textAlign: 'left',
                  transition: `border-color 150ms ${retailFlowEaseOut}`,
                  '&:hover': { borderColor: colors.green },
                }}
              >
                <IconButton
                  icon={<User size={14} strokeWidth={1.75} />}
                  variant="soft"
                  color="success"
                  size="sm"
                  sx={{ pointerEvents: 'none', flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: colors.navy,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Self-paying
                </Typography>
                <RadioDot selected={sponsor?.mode === 'individual'} />
              </Box>

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
                  gap: 1,
                  flex: 1,
                  minWidth: 0,
                  px: 1.25,
                  py: 1.25,
                  borderRadius: 999,
                  border: `1.5px solid ${
                    sponsor?.mode === 'someone_else' ? colors.green : colors.border
                  }`,
                  bgcolor: colors.white,
                  textAlign: 'left',
                  transition: `border-color 150ms ${retailFlowEaseOut}`,
                  '&:hover': { borderColor: colors.green },
                }}
              >
                <IconButton
                  icon={<Plus size={14} strokeWidth={1.75} />}
                  variant="soft"
                  color="success"
                  size="sm"
                  sx={{ pointerEvents: 'none', flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: colors.navy,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Someone else
                </Typography>
                <RadioDot selected={sponsor?.mode === 'someone_else'} />
              </Box>
            </Stack>

            {sponsor?.mode === 'someone_else' ? (
              <SponsorProfileCard
                name={draftName || sponsor.name}
                relationship={sponsor.relationship}
                contact={sponsor.contact}
                profileComplete={sponsor.profileComplete}
                onNameChange={(value) => {
                  setDraftName(value)
                  onUpdateSponsor(active!.id, {
                    mode: 'someone_else',
                    name: value,
                    relationship: sponsor.relationship,
                    contact: sponsor.contact,
                    profileComplete: false,
                  })
                }}
                onBuild={() => {
                  const nextName = (draftName || sponsor.name).trim()
                  onUpdateSponsor(active!.id, {
                    mode: 'someone_else',
                    name: nextName,
                    relationship: sponsor.relationship,
                    contact: sponsor.contact,
                    profileComplete: false,
                  })
                  setBuilderOpen(true)
                }}
                onEdit={() => {
                  setDraftName(sponsor.name)
                  setBuilderOpen(true)
                }}
              />
            ) : null}
          </Stack>
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
