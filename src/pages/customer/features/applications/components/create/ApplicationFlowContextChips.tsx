import { Chip, Stack } from '@mui/material'
import { usePublicBrandColors, type PublicBrandColors } from '@/shared/theme/publicBrand'

type FlowContextChipTone = 'country' | 'visa' | 'purpose'

function getFlowContextChipStyles(colors: PublicBrandColors): Record<
  FlowContextChipTone,
  { bg: string; text: string; border: string }
> {
  return {
    country: {
      bg: 'rgba(59, 130, 246, 0.12)',
      text: '#2563EB',
      border: 'rgba(59, 130, 246, 0.24)',
    },
    visa: {
      bg: colors.greenMuted,
      text: colors.greenDark,
      border: 'rgba(115, 192, 100, 0.24)',
    },
    purpose: {
      bg: 'rgba(245, 158, 11, 0.14)',
      text: '#B45309',
      border: 'rgba(245, 158, 11, 0.26)',
    },
  }
}

const flowContextChipSx = {
  height: 22,
  fontSize: 11,
  fontWeight: 700,
  borderRadius: '999px',
} as const

export interface ApplicationFlowContextChipsProps {
  countryFlag?: string
  countryName?: string
  visaTypeLabel?: string
  purposeLabel?: string
  showCountry?: boolean
  showVisa?: boolean
  showPurpose?: boolean
}

export function ApplicationFlowContextChips({
  countryFlag,
  countryName,
  visaTypeLabel,
  purposeLabel,
  showCountry = true,
  showVisa = true,
  showPurpose = true,
}: ApplicationFlowContextChipsProps) {
  const colors = usePublicBrandColors()
  const toneStyles = getFlowContextChipStyles(colors)

  const chips: { key: string; label: string; tone: FlowContextChipTone }[] = []

  if (showCountry && countryName) {
    chips.push({
      key: 'country',
      label: `${countryFlag ?? ''} ${countryName}`.trim(),
      tone: 'country',
    })
  }
  if (showVisa && visaTypeLabel) {
    chips.push({ key: 'visa', label: visaTypeLabel, tone: 'visa' })
  }
  if (showPurpose && purposeLabel) {
    chips.push({ key: 'purpose', label: purposeLabel, tone: 'purpose' })
  }

  if (chips.length === 0) return null

  return (
    <Stack direction="row" flexWrap="wrap" gap={0.75} alignItems="center">
      {chips.map(chip => {
        const style = toneStyles[chip.tone]
        return (
          <Chip
            key={chip.key}
            label={chip.label}
            size="small"
            sx={{
              ...flowContextChipSx,
              bgcolor: style.bg,
              color: style.text,
              border: `1px solid ${style.border}`,
            }}
          />
        )
      })}
    </Stack>
  )
}
