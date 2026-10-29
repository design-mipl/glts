import { useState } from 'react'
import { Box, Button, Stack, Typography, keyframes } from '@mui/material'
import { ArrowLeft, Check, X } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getAccentButtonSx,
  getQuietButtonSx,
  getSelectableSx,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import { FieldLabel, applyControlSx } from '@/pages/website/theme/applyFormControls'
import { displayNameUpper } from '../config/travelProfileQuestions'
import type { RetailTravellerSponsor } from '../types'

/**
 * Panel swap. A CSS animation rather than an `AnimatePresence mode="wait"` exit/enter pair:
 * that pattern only mounts the incoming panel once the outgoing one finishes animating, so
 * anything that stalls the animation frame loop — a backgrounded tab, a busy main thread —
 * leaves the dialog showing a panel the header has already moved past. Content should never
 * be gated on an animation completing. This also runs off the main thread.
 */
const panelIn = keyframes`
  from { opacity: 0; transform: translateX(14px); }
  to { opacity: 1; transform: translateX(0); }
`

const panelFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const RELATIONSHIP_OPTIONS = [
  { id: 'parent', label: 'Parent' },
  { id: 'spouse', label: 'Spouse / Partner' },
  { id: 'sibling', label: 'Sibling' },
  { id: 'relative', label: 'Other relative' },
  { id: 'employer', label: 'Employer' },
  { id: 'friend', label: 'Friend' },
  { id: 'other', label: 'Other' },
] as const

interface SponsorProfileBuilderProps {
  /** Draft name from the someone-else row (may be edited further in-modal). */
  initialName: string
  initialRelationship?: string
  travellerName: string
  onClose: () => void
  onComplete: (sponsor: Extract<RetailTravellerSponsor, { mode: 'someone_else' }>) => void
}

/**
 * Build sponsor profile.
 *
 * This dialog was the one place the retail flow fell back to the default application
 * theme: it rendered design-system `Button`s and pulled colours from
 * `usePublicBrandColors()`, so the moment sponsor details were confirmed the accent, the
 * buttons and the text fields all switched to the admin/portal palette. The fix is
 * structural rather than per-element — the dialog now composes the same
 * `applyFlowTheme` / `applyFormControls` primitives as every other retail step, and
 * imports nothing from the shared brand palette. `Modal` is kept purely as unstyled
 * overlay chrome (backdrop + focus trap), which is what `TravelProfileBuilder` already does.
 *
 * Scope also narrowed per the client: no phone, no email, and no bank details here.
 * Sponsor documents are collected with everyone else's on the Documents step.
 */
export function SponsorProfileBuilder({
  initialName,
  initialRelationship = '',
  travellerName,
  onClose,
  onComplete,
}: SponsorProfileBuilderProps) {
  const [step, setStep] = useState<'relationship' | 'confirm'>('relationship')
  const [name, setName] = useState(initialName.trim())
  const [relationship, setRelationship] = useState(initialRelationship)

  const displayName = name.trim() || 'Sponsor'
  const nameUpper = displayNameUpper(displayName)
  const travellerFirst = travellerName.split(/\s+/)[0] || travellerName || 'traveller'

  function selectRelationship(label: string) {
    setRelationship(label)
    // Brief hold so the selection registers visually before the panel changes.
    window.setTimeout(() => setStep('confirm'), 160)
  }

  function handleFinish() {
    const trimmedName = name.trim()
    if (!trimmedName || !relationship) return
    onComplete({
      mode: 'someone_else',
      name: trimmedName,
      relationship,
      profileComplete: true,
    })
  }

  const iconBtnSx = {
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    appearance: 'none',
    border: `1px solid ${applyFlow.hairline}`,
    background: 'none',
    borderRadius: applyRadius.control,
    color: applyFlow.inkMuted,
    cursor: 'pointer',
    flex: '0 0 auto',
    transition: `color 150ms ${applyMotion.easeOut}, border-color 150ms ${applyMotion.easeOut}`,
    '@media (pointer: coarse)': { width: 44, height: 44 },
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover': { color: applyFlow.ink, borderColor: applyFlow.hairlineStrong },
    },
    '&:focus-visible': {
      outline: 'none',
      borderColor: applyFlow.accent,
      boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
    },
  } as const

  const stepIndex = step === 'relationship' ? 0 : 1

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      hideCloseButton
      sx={{
        width: { xs: '100%', sm: 460 },
        height: { xs: '100%', sm: 'auto' },
        maxHeight: { xs: '100%', sm: 'min(560px, 88vh)' },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: applyFlow.surface,
          px: { xs: 4, sm: 5 },
          py: { xs: 4, sm: 4.5 },
        },
      }}
    >
      <Box sx={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" spacing={2.5} sx={{ flexShrink: 0, mb: 3.5 }}>
          {step === 'confirm' ? (
            <Box
              component="button"
              type="button"
              aria-label="Back to relationship"
              onClick={() => setStep('relationship')}
              sx={iconBtnSx}
            >
              <ArrowLeft size={15} />
            </Box>
          ) : null}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                ...tabularNums,
                fontFamily: applyFont.mono,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: applyFlow.inkFaint,
              }}
            >
              Sponsor · {String(stepIndex + 1).padStart(2, '0')} / 02
            </Typography>
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontSize: 13,
                fontWeight: 600,
                color: applyFlow.ink,
                mt: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Funding {displayNameUpper(travellerName || 'traveller')}
            </Typography>
          </Box>

          <Box component="button" type="button" aria-label="Close" onClick={onClose} sx={iconBtnSx}>
            <X size={15} />
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, mb: 4 }} aria-hidden>
          {[0, 1].map((i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: '2px',
                borderRadius: '1px',
                backgroundColor: i <= stepIndex ? applyFlow.accent : applyFlow.accentTrack,
                transition: `background-color 220ms ${applyMotion.easeOut}`,
              }}
            />
          ))}
        </Box>

        <Box
          key={step}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            animation: `${panelIn} 200ms ${applyMotion.easeOut} both`,
            '@media (prefers-reduced-motion: reduce)': {
              animation: `${panelFadeIn} 150ms linear both`,
            },
          }}
        >
            {step === 'relationship' ? (
              <>
                <Box sx={{ flexShrink: 0, mb: 3 }}>
                  <Typography
                    sx={{
                      fontFamily: applyFont.display,
                      fontSize: 19,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      color: applyFlow.ink,
                    }}
                  >
                    How is {nameUpper} related to {travellerFirst}?
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: applyFont.body,
                      fontSize: 13,
                      color: applyFlow.inkMuted,
                      mt: 1.25,
                      lineHeight: 1.45,
                    }}
                  >
                    Relationship is what consulates use to assess financial support.
                  </Typography>
                </Box>

                <Stack
                  spacing={1}
                  role="radiogroup"
                  aria-label="Relationship to traveller"
                  sx={{
                    width: '100%',
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    pr: 1,
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${applyFlow.hairlineStrong} transparent`,
                  }}
                >
                  {RELATIONSHIP_OPTIONS.map((option) => {
                    const selected = relationship === option.label
                    return (
                      <Box
                        key={option.id}
                        component="button"
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => selectRelationship(option.label)}
                        sx={{
                          ...getSelectableSx(selected),
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2.5,
                          minHeight: 44,
                          pl: 3.5,
                          pr: 3,
                          py: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            flex: 1,
                            fontFamily: applyFont.body,
                            fontSize: 14,
                            fontWeight: selected ? 600 : 400,
                            color: applyFlow.ink,
                            lineHeight: 1.35,
                            textAlign: 'left',
                          }}
                        >
                          {option.label}
                        </Typography>
                        {selected ? (
                          <Check
                            size={14}
                            strokeWidth={3}
                            style={{ color: applyFlow.accentInk, flex: '0 0 auto' }}
                          />
                        ) : null}
                      </Box>
                    )
                  })}
                </Stack>
              </>
            ) : (
              <>
                <Box sx={{ flexShrink: 0, mb: 3 }}>
                  <Typography
                    sx={{
                      fontFamily: applyFont.display,
                      fontSize: 19,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      color: applyFlow.ink,
                    }}
                  >
                    Confirm sponsor details
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: applyFont.body,
                      fontSize: 13,
                      color: applyFlow.inkMuted,
                      mt: 1.25,
                      lineHeight: 1.45,
                    }}
                  >
                    Any documents this sponsor needs are collected with everyone else&apos;s on the
                    Documents step.
                  </Typography>
                </Box>

                <Stack spacing={3.5} sx={{ width: '100%', flex: 1, minHeight: 0 }}>
                  <Box>
                    <FieldLabel htmlFor="sponsor-modal-name" required>
                      Sponsor&apos;s full name
                    </FieldLabel>
                    <Box
                      component="input"
                      id="sponsor-modal-name"
                      value={name}
                      placeholder="As printed on their documents"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setName(event.target.value)
                      }
                      sx={applyControlSx}
                    />
                  </Box>

                  <Box
                    sx={{
                      pl: 4,
                      borderLeft: `2px solid ${applyFlow.accent}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: applyFont.mono,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: applyFlow.inkMuted,
                        mb: 1,
                      }}
                    >
                      Relationship
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: applyFont.body,
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: applyFlow.ink,
                      }}
                    >
                      {relationship || '—'}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Button
                      variant="contained"
                      disableElevation
                      fullWidth
                      disabled={!name.trim() || !relationship}
                      onClick={handleFinish}
                      sx={{ ...getAccentButtonSx(), minHeight: 44 }}
                    >
                      Save sponsor
                    </Button>
                    <Button
                      variant="text"
                      fullWidth
                      onClick={() => setStep('relationship')}
                      sx={{ ...getQuietButtonSx(), minHeight: 44, mt: 2 }}
                    >
                      Back
                    </Button>
                  </Box>
                </Stack>
              </>
            )}
        </Box>
      </Box>
    </Modal>
  )
}
