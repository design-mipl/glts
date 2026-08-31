import { useMemo, useState, type ChangeEvent } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getAccentButtonSx,
  getQuietButtonSx,
} from '@/pages/website/theme/applyFlowTheme'
import { SectionHeading, StatusPill } from '@/pages/website/theme/applyFormControls'
import { initialsFromName } from '../../config/travelProfileQuestions'
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
  // Name + relationship only — phone/email and bank details are no longer collected here.
  return Boolean(sponsor.profileComplete && sponsor.name.trim() && sponsor.relationship)
}

/**
 * Two-option segmented control. Replaces two pill-shaped (999px) buttons — a fully rounded
 * control reads as a tag, not a choice, and the brief rules out pill-shaped UI.
 */
function PayerToggle({
  value,
  onChange,
  idPrefix,
}: {
  value: 'individual' | 'someone_else' | undefined
  onChange: (mode: 'individual' | 'someone_else') => void
  idPrefix: string
}) {
  const options = [
    { id: 'individual' as const, label: 'Self-funded' },
    { id: 'someone_else' as const, label: 'Someone else' },
  ]

  return (
    <Box
      role="radiogroup"
      aria-label="Who is paying"
      sx={{
        display: 'inline-flex',
        p: '2px',
        borderRadius: applyRadius.control,
        border: `1px solid ${applyFlow.hairline}`,
        backgroundColor: applyFlow.canvas,
      }}
    >
      {options.map((opt) => {
        const selected = value === opt.id
        return (
          <Box
            key={opt.id}
            component="button"
            type="button"
            role="radio"
            id={`${idPrefix}-${opt.id}`}
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            sx={{
              appearance: 'none',
              border: 'none',
              cursor: 'pointer',
              minHeight: 38,
              '@media (pointer: coarse)': { minHeight: 44 },
              px: 3.5,
              borderRadius: '7px',
              fontFamily: applyFont.body,
              fontSize: 13,
              fontWeight: selected ? 600 : 500,
              color: selected ? applyFlow.onAccent : applyFlow.inkMuted,
              backgroundColor: selected ? applyFlow.accent : 'transparent',
              whiteSpace: 'nowrap',
              transition: `background-color 180ms ${applyMotion.easeOut}, color 180ms ${applyMotion.easeOut}`,
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': { color: selected ? applyFlow.onAccent : applyFlow.ink },
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: `0 0 0 2px ${applyFlow.accent}`,
              },
            }}
          >
            {opt.label}
          </Box>
        )
      })}
    </Box>
  )
}

/** B10 beat 1 — Who's paying, per traveller. */
export function SponsorStep({
  applicants,
  onUpdateSponsor,
  onGoToTravelProfile,
  onBack,
  onContinue,
  previewOnly = false,
}: SponsorStepProps) {
  const named = useMemo(
    () => applicants.filter((a) => a.details.fullName.trim() || a.label),
    [applicants],
  )
  // Which traveller's sponsor builder is open. Every traveller is visible at once, so
  // this replaces the old "active tab" state — nobody is hidden behind a tab any more.
  const [builderForId, setBuilderForId] = useState<string | null>(null)

  const allComplete = named.length > 0 && named.every((a) => sponsorSelectionComplete(a.sponsor))
  const doneCount = named.filter((a) => sponsorSelectionComplete(a.sponsor)).length
  const builderApplicant = builderForId ? named.find((a) => a.id === builderForId) : undefined
  const builderSponsor =
    builderApplicant?.sponsor?.mode === 'someone_else' ? builderApplicant.sponsor : undefined

  function setMode(applicant: RetailApplicantParty, mode: 'individual' | 'someone_else') {
    if (mode === 'individual') {
      onUpdateSponsor(applicant.id, { mode: 'individual' })
      if (builderForId === applicant.id) setBuilderForId(null)
      return
    }
    const existing = applicant.sponsor?.mode === 'someone_else' ? applicant.sponsor : undefined
    onUpdateSponsor(applicant.id, {
      mode: 'someone_else',
      name: existing?.name ?? '',
      relationship: existing?.relationship ?? '',
      profileComplete: existing?.profileComplete,
    })
  }

  const body =
    named.length === 0 ? (
      <Stack spacing={3} alignItems="flex-start" sx={{ py: 6 }}>
        <Typography
          sx={{ fontFamily: applyFont.body, fontSize: 13.5, color: applyFlow.inkMuted }}
        >
          No travellers yet. Add them on the travel profile step, then come back.
        </Typography>
        <Button
          variant="text"
          onClick={onGoToTravelProfile}
          sx={{ ...getQuietButtonSx(), px: 4, minHeight: 44 }}
        >
          Go to travel profile
        </Button>
      </Stack>
    ) : (
      <Box sx={{ width: '100%' }}>
        <SectionHeading>{`Funding — ${doneCount} of ${named.length} answered`}</SectionHeading>

        {named.map((applicant, index) => {
          const sponsor = applicant.sponsor
          const isSponsored = sponsor?.mode === 'someone_else'
          const complete = sponsorSelectionComplete(sponsor)
          const label = applicant.details.fullName.trim() || applicant.label

          return (
            <Box
              key={applicant.id}
              sx={{
                py: 3.25,
                borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
                '&:first-of-type': { borderTop: `1px solid ${applyFlow.hairlineSoft}` },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: { xs: 2.5, md: 3.5 },
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
                      border: `1px solid ${complete ? applyFlow.successBorder : applyFlow.hairline}`,
                      fontFamily: applyFont.mono,
                      fontSize: 13,
                      fontWeight: 700,
                      color: applyFlow.inkMuted,
                      flex: '0 0 auto',
                    }}
                  >
                    {initialsFromName(label) || '—'}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: applyFont.body,
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: applyFlow.ink,
                      lineHeight: 1.3,
                      width: { xs: 'auto', md: 150 },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </Typography>
                </Stack>

                <Box sx={{ flex: '1 1 auto' }}>
                  <PayerToggle
                    value={sponsor?.mode}
                    idPrefix={`payer-${applicant.id}`}
                    onChange={(mode) => setMode(applicant, mode)}
                  />
                </Box>

                {complete ? <StatusPill tone="done">Done</StatusPill> : null}
              </Box>

              {/* Sponsor detail, inline under the traveller it belongs to. */}
              {isSponsored ? (
                <Box
                  sx={{
                    mt: 3,
                    ml: { xs: 0, md: '84px' },
                    pl: 4,
                    borderLeft: `2px solid ${
                      sponsor?.profileComplete ? applyFlow.successBorder : applyFlow.accent
                    }`,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                    <Typography
                      component="label"
                      htmlFor={`sponsor-name-${applicant.id}`}
                      sx={{
                        display: 'block',
                        fontFamily: applyFont.mono,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: applyFlow.inkFaint,
                        mb: 1,
                      }}
                    >
                      Sponsor
                    </Typography>
                    <Box
                      component="input"
                      id={`sponsor-name-${applicant.id}`}
                      value={sponsor?.name ?? ''}
                      placeholder="Sponsor's full name"
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        onUpdateSponsor(applicant.id, {
                          mode: 'someone_else',
                          name: event.target.value,
                          relationship: sponsor?.relationship ?? '',
                          profileComplete: false,
                        })
                      }
                      sx={{
                        width: '100%',
                        border: 'none',
                        borderBottom: '1px solid transparent',
                        outline: 'none',
                        background: 'transparent',
                        p: 0,
                        pb: 1,
                        fontFamily: applyFont.body,
                        fontSize: 15,
                        fontWeight: 600,
                        color: applyFlow.ink,
                        transition: `border-color 150ms ${applyMotion.easeOut}`,
                        '&::placeholder': { color: applyFlow.inkFaint, fontWeight: 400 },
                        '&:hover': { borderBottomColor: applyFlow.hairline },
                        '&:focus': { borderBottomColor: applyFlow.accent },
                      }}
                    />
                    {sponsor?.relationship ? (
                      <Typography
                        sx={{
                          fontFamily: applyFont.mono,
                          fontSize: 11,
                          color: applyFlow.inkMuted,
                          mt: 1,
                        }}
                      >
                        {sponsor.relationship}
                      </Typography>
                    ) : null}
                  </Box>

                  <Button
                    variant={sponsor?.profileComplete ? 'text' : 'contained'}
                    disableElevation
                    disabled={!sponsor?.name.trim()}
                    onClick={() => setBuilderForId(applicant.id)}
                    sx={
                      sponsor?.profileComplete
                        ? { ...getQuietButtonSx(), px: 3.5, minHeight: 44, flex: '0 0 auto' }
                        : { ...getAccentButtonSx(), px: 4, minHeight: 44, flex: '0 0 auto' }
                    }
                  >
                    {sponsor?.profileComplete ? 'Edit details' : 'Add details'}
                  </Button>
                </Box>
              ) : null}
            </Box>
          )
        })}
      </Box>
    )

  const overlay =
    builderApplicant && builderSponsor ? (
      <SponsorProfileBuilder
        initialName={builderSponsor.name}
        initialRelationship={builderSponsor.relationship}
        travellerName={builderApplicant.details.fullName.trim() || builderApplicant.label}
        onClose={() => setBuilderForId(null)}
        onComplete={(next) => {
          onUpdateSponsor(builderApplicant.id, next)
          setBuilderForId(null)
        }}
      />
    ) : null

  if (previewOnly) {
    return (
      <>
        {body}
        {overlay}
      </>
    )
  }

  return (
    <>
      <StepShell
        title="Who is paying for this trip?"
        helperText="Self-funded travellers move straight on. For a sponsored traveller we just need who the sponsor is and how they're related — their documents are collected with everyone else's."
        onBack={onBack}
        onContinue={onContinue}
        continueDisabled={!allComplete}
        contentMaxWidth={860}
      >
        {body}
      </StepShell>
      {overlay}
    </>
  )
}
