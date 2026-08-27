import { useMemo, type ComponentType } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import {
  Briefcase,
  Building2,
  Globe2,
  GraduationCap,
  Heart,
  Plane,
  Ship,
  Users,
  type LucideProps,
} from 'lucide-react'
import { getCountryMasterById, getVisaOfferings } from '@/shared/services/countryMasterService'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { getElevatedCardSx } from '@/pages/website-v2/theme/retailFlowTokens'
import { StepShell } from '../StepShell'

interface VisaStepProps {
  countryId: string
  visaOfferingId: string
  onSelect: (offeringId: string) => void
  onBack: () => void
  onContinue: () => void
}

const ICON_TONES = [
  { bg: 'rgba(225, 29, 72, 0.12)', fg: '#BE123C' },
  { bg: 'rgba(13, 148, 136, 0.12)', fg: '#0F766E' },
  { bg: 'rgba(180, 83, 9, 0.12)', fg: '#B45309' },
  { bg: 'rgba(79, 70, 229, 0.12)', fg: '#4338CA' },
  { bg: 'rgba(8, 145, 178, 0.12)', fg: '#0E7490' },
  { bg: 'rgba(147, 51, 234, 0.12)', fg: '#7E22CE' },
] as const

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
  const colors = usePublicBrandColors()
  const offerings = useMemo(() => getVisaOfferings(countryId, true, 'retail'), [countryId])
  const countryName = useMemo(() => getCountryMasterById(countryId)?.name, [countryId])

  return (
    <StepShell
      title="What are you travelling for?"
      helperText="We'll use this to prepare your visa requirements."
      onBack={onBack}
      backLabel="Cancel"
      onContinue={onContinue}
      continueDisabled={!visaOfferingId}
    >
      {offerings.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: colors.textMuted, mb: 2 }}>
          No visa types are configured for {countryName ?? 'this destination'} yet. Choose another
          destination or contact GLTS support.
        </Typography>
      ) : null}

      <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 560, mx: 'auto' }}>
        {offerings.map((opt, index) => {
          const selected = visaOfferingId === opt.id
          const Icon = resolveVisaIcon(opt)
          const tone = ICON_TONES[index % ICON_TONES.length]
          return (
            <Grid size={{ xs: 12, sm: 6 }} key={opt.id} sx={{ maxWidth: { sm: 260 } }}>
              <Box
                onClick={() => onSelect(opt.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelect(opt.id)
                  }
                }}
                aria-pressed={selected}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  height: '100%',
                  maxWidth: 260,
                  mx: 'auto',
                  ...getElevatedCardSx(selected ? 'rgba(115, 192, 100, 0.55)' : 'rgba(15, 23, 42, 0.08)'),
                  bgcolor: colors.white,
                  borderRadius: BORDER_RADIUS.xl,
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                  '&:hover': {
                    borderColor: 'rgba(115, 192, 100, 0.55)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    mx: 'auto',
                    mb: 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: tone.bg,
                    color: tone.fg,
                  }}
                >
                  <Icon size={20} strokeWidth={2.25} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: 15, color: colors.navy }}>
                  {opt.visaTypeLabel}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 12,
                    color: colors.textMuted,
                    lineHeight: 1.45,
                  }}
                >
                  {[opt.entryType, opt.processingTimeline].filter(Boolean).join(' · ')}
                </Typography>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </StepShell>
  )
}
