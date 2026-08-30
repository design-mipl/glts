import { useMemo, type ComponentType } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Briefcase,
  Building2,
  Check,
  Globe2,
  GraduationCap,
  Heart,
  Plane,
  Ship,
  Users,
  type LucideProps,
} from 'lucide-react'
import { getCountryMasterById, getVisaOfferings } from '@/shared/services/countryMasterService'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  eyebrowSx,
  getSelectableSx,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import { StepShell } from '../StepShell'

interface VisaStepProps {
  countryId: string
  visaOfferingId: string
  onSelect: (offeringId: string) => void
  onBack: () => void
  onContinue: () => void
}

/**
 * Icons differentiate by *shape only* — every badge shares one neutral treatment.
 * Per-type pastel backgrounds are a flagged "AI-generated SaaS" tell and are not used here.
 */
function resolveVisaIcon(offering: {
  purposeId?: string
  purposeLabel?: string
  visaTypeLabel?: string
}): ComponentType<LucideProps> {
  const haystack = [offering.purposeId, offering.purposeLabel, offering.visaTypeLabel]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (haystack.includes('business') || haystack.includes('meeting') || haystack.includes('corporate')) {
    return Briefcase
  }
  if (haystack.includes('student') || haystack.includes('study') || haystack.includes('education')) {
    return GraduationCap
  }
  if (haystack.includes('family') || haystack.includes('visit') || haystack.includes('spouse')) {
    return Heart
  }
  if (haystack.includes('crew') || haystack.includes('marine') || haystack.includes('ship')) {
    return Ship
  }
  if (haystack.includes('group') || haystack.includes('tour')) {
    return Users
  }
  if (haystack.includes('transit')) {
    return Globe2
  }
  if (haystack.includes('work') || haystack.includes('employ')) {
    return Building2
  }
  return Plane
}

export function VisaStep({ countryId, visaOfferingId, onSelect, onBack, onContinue }: VisaStepProps) {
  const offerings = useMemo(() => getVisaOfferings(countryId, true, 'retail'), [countryId])
  const countryName = useMemo(() => getCountryMasterById(countryId)?.name, [countryId])

  return (
    <StepShell
      title="What are you travelling for?"
      helperText="This determines which documents your application will need."
      onBack={onBack}
      backLabel="Back"
      onContinue={onContinue}
      continueDisabled={!visaOfferingId}
    >
      {offerings.length === 0 ? (
        <Typography sx={{ fontFamily: applyFont.body, fontSize: 14, color: applyFlow.inkMuted, mb: 2 }}>
          No visa types are configured for {countryName ?? 'this destination'} yet. Choose another
          destination, or contact GLTS support.
        </Typography>
      ) : null}

      <Stack
        role="radiogroup"
        aria-label="Visa type"
        spacing={1.5}
        sx={{ width: '100%', maxWidth: 620 }}
      >
        {offerings.map((opt, index) => {
          const selected = visaOfferingId === opt.id
          const Icon = resolveVisaIcon(opt)

          return (
            <Box
              key={opt.id}
              component="button"
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(opt.id)}
              sx={{
                ...getSelectableSx(selected),
                appearance: 'none',
                font: 'inherit',
                textAlign: 'left',
                width: '100%',
                pl: 3.5,
                pr: 3.5,
                py: 2.75,
                // Short stagger on first paint so the list assembles rather than snapping in.
                animation: `visaRowIn 300ms ${applyMotion.easeOut} both`,
                animationDelay: `${Math.min(index * 45, 220)}ms`,
                '@keyframes visaRowIn': {
                  from: { opacity: 0, transform: 'translateY(6px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Box
                  aria-hidden
                  sx={{
                    flex: '0 0 auto',
                    width: 34,
                    height: 34,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: applyRadius.chip,
                    // One neutral treatment for every type — shape carries the meaning.
                    backgroundColor: selected ? 'transparent' : applyFlow.canvas,
                    border: `1px solid ${selected ? applyFlow.accentBorder : applyFlow.hairline}`,
                    color: selected ? applyFlow.accentInk : applyFlow.inkMuted,
                    transition: `color 160ms ${applyMotion.easeOut}, border-color 160ms ${applyMotion.easeOut}`,
                  }}
                >
                  <Icon size={18} strokeWidth={1.9} />
                </Box>

                <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: applyFont.body,
                      fontSize: 15,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: applyFlow.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {opt.visaTypeLabel}
                  </Typography>
                  {opt.entryType ? (
                    <Typography sx={{ ...eyebrowSx, mt: 0.8, letterSpacing: '0.1em' }}>
                      {opt.entryType}
                    </Typography>
                  ) : null}
                </Box>

                {/* Processing time as a right-aligned mono readout — a manifest column, not a chip. */}
                {opt.processingTimeline ? (
                  <Typography
                    sx={{
                      ...tabularNums,
                      flex: '0 0 auto',
                      display: { xs: 'none', sm: 'block' },
                      fontFamily: applyFont.mono,
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: applyFlow.inkMuted,
                      textAlign: 'right',
                      pl: 2,
                    }}
                  >
                    {opt.processingTimeline}
                  </Typography>
                ) : null}

                <Box
                  aria-hidden
                  sx={{
                    flex: '0 0 auto',
                    width: 18,
                    height: 18,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    border: `1.5px solid ${selected ? applyFlow.accent : applyFlow.hairlineStrong}`,
                    backgroundColor: selected ? applyFlow.accent : 'transparent',
                    color: applyFlow.onAccent,
                    transition: `border-color 160ms ${applyMotion.easeOut}, background-color 160ms ${applyMotion.easeOut}`,
                  }}
                >
                  <Check
                    size={11}
                    strokeWidth={3.5}
                    style={{
                      opacity: selected ? 1 : 0,
                      transform: selected ? 'scale(1)' : 'scale(0.7)',
                      transition: `opacity 160ms ${applyMotion.easeOut}, transform 160ms ${applyMotion.easeOut}`,
                    }}
                  />
                </Box>
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </StepShell>
  )
}
