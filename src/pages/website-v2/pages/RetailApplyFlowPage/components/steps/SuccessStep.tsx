import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { CheckCircle2 } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'

interface SuccessStepProps {
  journey: RetailJourney
  listingHref: string
}

export function SuccessStep({ journey, listingHref }: SuccessStepProps) {
  const colors = usePublicBrandColors()
  const reference = useMemo(() => `GLTS-${journey.country.code}-${Math.floor(100000 + Math.random() * 900000)}`, [journey.country.code])

  return (
    <Box
      sx={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: BORDER_RADIUS.lg,
        p: { xs: 3, md: 5 },
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: colors.greenMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2.5,
        }}
      >
        <CheckCircle2 size={30} color={colors.greenDark} />
      </Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 700, color: colors.text, mb: 1 }}>
        Application submitted
      </Typography>
      <Typography sx={{ fontSize: '14px', color: colors.textSecondary, maxWidth: 420, mx: 'auto', mb: 1.5 }}>
        Your {journey.visaType.name} application for {journey.country.name} is in progress. We'll email you updates.
      </Typography>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: colors.navy, letterSpacing: '0.02em', mb: 3 }}>
        Reference: {reference}
      </Typography>
      <Box
        component="a"
        href={listingHref}
        sx={{ ...getPrimaryButtonSx(colors), display: 'inline-flex', alignItems: 'center', px: 3, py: 1.2, textDecoration: 'none' }}
      >
        Explore more destinations
      </Box>
    </Box>
  )
}
