import { Box, Card, Typography, Button, Divider, Stack, Chip } from '@mui/material'
import { Info } from 'lucide-react'
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
  selectedVisaCategoryLabel: string
  applyHref: string
}

export function PricingCard({ country, selectedVisaCategoryLabel, applyHref }: PricingCardProps) {
  const colors = usePublicBrandColors()
  const indicativeTotal = `Starting from ₹${country.price.toLocaleString('en-IN')}`
  const feeRows = [
    { label: 'Embassy Fee', value: 'Confirmed after visa type selection' },
    { label: 'GreenLight Fee', value: 'Confirmed after visa type selection' },
    { label: 'Total', value: indicativeTotal, highlight: true },
  ]

  return (
    <Card
      sx={{
        p: 4,
        border: `1px solid ${colors.greenBright}`,
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
        Fee estimate
      </Typography>

      <Chip
        label={selectedVisaCategoryLabel}
        size="small"
        sx={{
          mt: 1.25,
          fontWeight: 800,
          bgcolor: colors.greenMuted,
          color: colors.greenDark,
          border: `1px solid rgba(115, 192, 100, 0.28)`,
        }}
      />

      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontWeight: 800,
          fontSize: { xs: '28px', md: '32px' },
          color: colors.navy,
          mt: 2,
          mb: 1,
        }}
      >
        {indicativeTotal}
      </Typography>
      <Typography sx={{ color: colors.textSecondary, fontSize: '14px', mb: 3, lineHeight: 1.55 }}>
        Indicative total for {country.name}. Final embassy and GreenLight fee split is confirmed
        before submission.
      </Typography>

      <Divider sx={{ mb: 3, borderColor: colors.border }} />

      <Stack spacing={1.75} sx={{ mb: 4 }}>
        {feeRows.map(row => (
          <Box
            key={row.label}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              alignItems: 'flex-start',
            }}
          >
            <Typography sx={{ color: colors.textSecondary, fontSize: '14px', fontWeight: 600 }}>
              {row.label}
            </Typography>
            <Typography
              sx={{
                color: row.highlight ? colors.navy : colors.text,
                fontSize: row.highlight ? '15px' : '13px',
                fontWeight: row.highlight ? 800 : 600,
                textAlign: 'right',
                maxWidth: 170,
                lineHeight: 1.45,
              }}
            >
              {row.value}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Stack spacing={1.25} sx={{ mb: 4 }}>
        {[`Processing Time: ${country.processingTime}`, 'Document review included', 'Status tracking included'].map(item => (
          <Typography key={item} sx={{ color: colors.text, fontSize: '14px', fontWeight: 500 }}>
            {item}
          </Typography>
        ))}
      </Stack>

      <Button
        fullWidth
        variant="contained"
        size="large"
        href={applyHref}
        sx={{ ...getMarketingPrimaryButtonSx(colors), py: 1.5, fontSize: '15px' }}
      >
        Start Application
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mt: 2 }}>
        <Info size={14} color={colors.textMuted} style={{ marginTop: 2, flexShrink: 0 }} />
        <Typography sx={{ color: colors.textMuted, fontSize: publicTypography.caption, lineHeight: 1.45 }}>
          Final pricing depends on destination rules, selected visa category and applicant profile.
        </Typography>
      </Box>
    </Card>
  )
}
