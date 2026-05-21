import { Card, Typography, Button, Divider, Stack } from '@mui/material'
import type { Country } from '../../../../../shared/types/visa'
import {
  publicColors,
  publicLayout,
  publicShadows,
  publicFonts,
  publicTypography,
  primaryButtonSx,
} from '../../../../../shared/theme/publicBrand'

interface PricingCardProps {
  country: Country
}

export function PricingCard({ country }: PricingCardProps) {
  return (
    <Card
      sx={{
        p: 4,
        border: `2px solid ${publicColors.greenBright}`,
        borderRadius: publicLayout.cardRadius,
        boxShadow: publicShadows.float,
        bgcolor: '#fff',
      }}
    >
      <Typography
        sx={{
          color: publicColors.textMuted,
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
          color: publicColors.navy,
          my: 1,
        }}
      >
        ₹{country.price.toLocaleString('en-IN')}
      </Typography>
      <Typography sx={{ color: publicColors.textSecondary, fontSize: '15px', mb: 3 }}>
        per applicant · all-inclusive
      </Typography>

      <Divider sx={{ mb: 3, borderColor: publicColors.border }} />

      <Stack spacing={1.5} sx={{ mb: 4 }}>
        {[
          `Processing: ${country.processingTime}`,
          `Approval rate: ${country.rating}%`,
          'Document review included',
          'Status tracking included',
        ].map(item => (
          <Typography key={item} sx={{ color: publicColors.text, fontSize: '15px', fontWeight: 500 }}>
            ✓ {item}
          </Typography>
        ))}
      </Stack>

      <Button fullWidth variant="contained" size="large" sx={{ ...primaryButtonSx, py: 1.75 }}>
        Start Application
      </Button>

      <Typography
        sx={{
          color: publicColors.textMuted,
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
