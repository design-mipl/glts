import { Card, Typography, Button, Divider, Stack } from '@mui/material'
import type { Country } from '@/shared/types/visa'
import {
  publicLayout,
  publicShadows,
  publicFonts,
  publicTypography,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
} from '@/shared/theme/publicBrand'

interface PricingCardProps {
  country: Country
}

export function PricingCard({ country }: PricingCardProps) {
  const colors = usePublicBrandColors()
  return (
    <Card
      sx={{
        p: 4,
        border: `2px solid ${colors.greenBright}`,
        borderRadius: publicLayout.cardRadius,
        boxShadow: publicShadows.float,
        bgcolor: '#fff',
      }}
    >
      <Typography
        sx={{
          color: colors.textMuted,
          textTransform: 'uppercase',
          fontWeight: 700,
          fontSize: publicTypography.caption,
          letterSpacing: '0.5px',
        }}
      >
        Visa fee
      </Typography>
      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontWeight: 800,
          fontSize: { xs: '36px', md: '42px' },
          color: colors.navy,
          my: 1,
        }}
      >
        ₹{country.price.toLocaleString('en-IN')}
      </Typography>
      <Typography sx={{ color: colors.textSecondary, fontSize: '15px', mb: 3 }}>
        per applicant · all-inclusive
      </Typography>

      <Divider sx={{ mb: 3, borderColor: colors.border }} />

      <Stack spacing={1.5} sx={{ mb: 4 }}>
        {[
          `Processing: ${country.processingTime}`,
          `Approval rate: ${country.rating}%`,
          'Document review included',
          'Status tracking included',
        ].map(item => (
          <Typography key={item} sx={{ color: colors.text, fontSize: '15px', fontWeight: 500 }}>
            ✓ {item}
          </Typography>
        ))}
      </Stack>

      <Button
        fullWidth
        variant="contained"
        size="large"
        href={`/apply/new?country=${country.id}`}
        sx={{ ...getMarketingPrimaryButtonSx(colors), py: 1.5, fontSize: '15px' }}
      >
        {country.fastMinutes ? `Get visa in ${country.fastMinutes} min` : 'Get started'}
      </Button>

      <Typography
        sx={{
          color: colors.textMuted,
          display: 'block',
          textAlign: 'center',
          mt: 2,
          fontSize: publicTypography.caption,
        }}
      >
        No payment until approval
      </Typography>
    </Card>
  )
}
