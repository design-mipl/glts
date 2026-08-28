import { useState } from 'react'
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, HandCoins, Star, X } from 'lucide-react'
import { Modal, Button } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowEaseOut } from '@/pages/website-v2/theme/retailFlowTokens'
import { displayNameUpper, initialsFromName } from '../config/travelProfileQuestions'
import type { RetailTravellerSponsor } from '../types'

/** Gold sponsor accent — distinct from traveller profile violet. */
const SPONSOR_GOLD = '#C4A035'
const SPONSOR_GOLD_SOFT = 'rgba(196, 160, 53, 0.12)'
const SPONSOR_GOLD_BORDER = 'rgba(196, 160, 53, 0.55)'
const AVATAR_ROSE = '#D4A0A0'

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
  /** Draft name from the someone-else card (may be edited further in-modal). */
  initialName: string
  initialRelationship?: string
  initialContact?: string
  travellerName: string
  onClose: () => void
  onComplete: (sponsor: Extract<RetailTravellerSponsor, { mode: 'someone_else' }>) => void
}

/**
 * Build sponsor profile — same modal chrome as TravelProfileBuilder,
 * questions tailored to B10 someone-else (relationship + contact).
 */
export function SponsorProfileBuilder({
  initialName,
  initialRelationship = '',
  initialContact = '',
  travellerName,
  onClose,
  onComplete,
}: SponsorProfileBuilderProps) {
  const colors = usePublicBrandColors()
  const [step, setStep] = useState<'relationship' | 'contact'>('relationship')
  const [name, setName] = useState(initialName.trim())
  const [relationship, setRelationship] = useState(initialRelationship)
  const [contact, setContact] = useState(initialContact)

  const displayName = name.trim() || 'Sponsor'
  const nameUpper = displayNameUpper(displayName)
  const travellerFirst = travellerName.split(/\s+/)[0] || travellerName || 'traveller'

  function selectRelationship(label: string) {
    setRelationship(label)
    window.setTimeout(() => setStep('contact'), 160)
  }

  function handleFinish() {
    const trimmedName = name.trim()
    const trimmedContact = contact.trim()
    if (!trimmedName || !relationship || trimmedContact.length < 3) return
    onComplete({
      mode: 'someone_else',
      name: trimmedName,
      relationship,
      contact: trimmedContact,
      profileComplete: true,
    })
  }

  const contactReady = name.trim().length > 0 && contact.trim().length >= 3

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      hideCloseButton
      sx={{
        width: { sm: 400 },
        height: { xs: '100%', sm: 400 },
        minHeight: { sm: 400 },
        maxHeight: { sm: 400 },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          px: { xs: 2, sm: 2.25 },
          py: { xs: 1.5, sm: 1.75 },
        },
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1, flexShrink: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: 1, pr: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: AVATAR_ROSE,
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {initialsFromName(displayName).slice(0, 1)}
            </Box>
            <Typography sx={{ fontSize: 13, color: colors.textMuted, minWidth: 0 }}>
              Sponsor for{' '}
              <Box component="span" sx={{ fontWeight: 700, color: colors.navy }}>
                {displayNameUpper(travellerName || 'traveller')}
              </Box>
            </Typography>
          </Stack>

          <IconButton
            aria-label="Close"
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: 'rgba(15, 169, 104, 0.12)',
              color: colors.navy,
              flexShrink: 0,
              '&:hover': { bgcolor: 'rgba(15, 169, 104, 0.2)' },
            }}
          >
            <X size={16} />
          </IconButton>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1, flexShrink: 0 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              bgcolor: SPONSOR_GOLD_SOFT,
              color: SPONSOR_GOLD,
            }}
          >
            <HandCoins size={14} strokeWidth={2} />
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: SPONSOR_GOLD }}>
              Build sponsor profile
            </Typography>
          </Box>
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
          >
            {step === 'relationship' ? (
              <>
                <Box sx={{ textAlign: 'center', mt: { xs: 1, sm: 1.5 }, mb: 1.5, px: 1, flexShrink: 0 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: 17, sm: 18 },
                      fontWeight: 700,
                      color: colors.navy,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    How is {nameUpper} related to {travellerFirst}?
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                    Relationship helps consulates assess financial support
                  </Typography>
                </Box>

                <Stack
                  spacing={0.75}
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    mx: 'auto',
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    pr: 0.5,
                    pb: 0.5,
                  }}
                >
                  {RELATIONSHIP_OPTIONS.map((option) => {
                    const selected = relationship === option.label
                    return (
                      <Box
                        key={option.id}
                        component="button"
                        type="button"
                        onClick={() => selectRelationship(option.label)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          width: '100%',
                          minHeight: 36,
                          textAlign: 'left',
                          border: `1.5px solid ${selected ? SPONSOR_GOLD_BORDER : colors.border}`,
                          bgcolor: selected ? SPONSOR_GOLD_SOFT : colors.white,
                          borderRadius: BORDER_RADIUS.md,
                          px: 1.25,
                          py: 0.5,
                          cursor: 'pointer',
                          transition: `border-color 150ms ${retailFlowEaseOut}, background-color 150ms ${retailFlowEaseOut}`,
                          font: 'inherit',
                          color: 'inherit',
                          '&:hover': {
                            borderColor: selected ? SPONSOR_GOLD_BORDER : 'rgba(15, 23, 42, 0.22)',
                          },
                        }}
                      >
                        <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 500, color: colors.navy }}>
                          {option.label}
                        </Typography>
                        {selected ? (
                          <Box sx={{ color: SPONSOR_GOLD, display: 'flex' }}>
                            <Check size={14} strokeWidth={2.5} />
                          </Box>
                        ) : null}
                      </Box>
                    )
                  })}
                </Stack>
              </>
            ) : (
              <>
                <Box sx={{ textAlign: 'center', mt: { xs: 1, sm: 1.5 }, mb: 2, px: 1, flexShrink: 0 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: 17, sm: 18 },
                      fontWeight: 700,
                      color: colors.navy,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    Confirm sponsor details
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                    We’ll ask for their bank statement on the next step
                  </Typography>
                </Box>

                <Stack spacing={1.75} sx={{ width: '100%', maxWidth: 400, mx: 'auto', flex: 1 }}>
                  <TextField
                    label="Sponsor's name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: BORDER_RADIUS.md, fontSize: 13 },
                    }}
                  />
                  <TextField
                    label="Phone or email"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    fullWidth
                    size="small"
                    placeholder="Contact for verification"
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: BORDER_RADIUS.md, fontSize: 13 },
                    }}
                  />
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      alignSelf: 'center',
                      color: SPONSOR_GOLD,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                    }}
                  >
                    <Star size={11} fill={SPONSOR_GOLD} />
                    SPONSOR · {relationship || '—'}
                  </Box>
                  <Box sx={{ mt: 'auto', pt: 1 }}>
                    <Button
                      label="Save sponsor profile"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!contactReady}
                      onClick={handleFinish}
                    />
                    <Button
                      label="Back"
                      variant="text"
                      fullWidth
                      onClick={() => setStep('relationship')}
                      sx={{ mt: 0.75 }}
                    />
                  </Box>
                </Stack>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Modal>
  )
}

export const sponsorGold = {
  main: SPONSOR_GOLD,
  soft: SPONSOR_GOLD_SOFT,
  border: SPONSOR_GOLD_BORDER,
} as const
