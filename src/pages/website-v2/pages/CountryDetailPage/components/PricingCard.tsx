import { Box, Card, Typography, Button, Divider, Stack, Chip } from '@mui/material'
import type { Country } from '@/shared/types/visa'
import {
  publicFonts,
  publicTypography,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
} from '@/shared/theme/publicBrand'
import { LiveStatusPanel } from '../../../components/liveStatusPanel/LiveStatusPanel'
import {
  getElevatedStatusCardSx,
  statusVisualRadius,
} from '../../../theme/statusVisualTokens'

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

  const approvalLikelihood =
    typeof country.rating === 'number' && country.rating > 0 ? `${country.rating}%` : null

  return (
    <Stack spacing={2}>
      <LiveStatusPanel
        headline={{
          eyebrow: 'Avg processing',
          value: country.processingTime || 'TBD',
          caption: `${country.name} · ${selectedVisaCategoryLabel}`,
        }}
        bullets={[
          ...(approvalLikelihood
            ? [`Approval likelihood ${approvalLikelihood} for typical profiles`]
            : []),
          'Document review included',
          'Live status tracking after you apply',
        ]}
      />

      <Card
        sx={{
          p: { xs: 3, md: 3.5 },
          borderRadius: statusVisualRadius.hero,
          bgcolor: colors.white,
          ...getElevatedStatusCardSx('rgba(15, 23, 42, 0.06)'),
        }}
      >
        <Typography
          sx={{
            color: colors.textMuted,
            textTransform: 'uppercase',
            fontWeight: 700,
            fontSize: publicTypography.caption,
            letterSpacing: '0.5px',
            fontFamily: publicFonts.body,
          }}
        >
          Fee estimate
        </Typography>

        <Chip
          label={selectedVisaCategoryLabel}
          size="small"
          sx={{
            mt: 1.25,
            fontWeight: 700,
            bgcolor: colors.greenMuted,
            color: colors.greenDark,
            border: `1px solid rgba(115, 192, 100, 0.28)`,
          }}
        />

        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontWeight: 800,
            fontSize: { xs: '24px', md: '28px' },
            color: colors.navy,
            mt: 2,
            mb: 1,
            letterSpacing: '-0.01em',
          }}
        >
          {indicativeTotal}
        </Typography>
        <Typography
          sx={{
            color: colors.textSecondary,
            fontSize: '14px',
            mb: 3,
            lineHeight: 1.55,
            fontFamily: publicFonts.body,
          }}
        >
          Indicative total for {country.name}. Final embassy and GreenLight fee split is confirmed
          before submission.
        </Typography>

        <Divider sx={{ mb: 3, borderColor: colors.border }} />

        <Stack spacing={1.75} sx={{ mb: 3.5 }}>
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

        <Button
          fullWidth
          variant="contained"
          size="large"
          href={applyHref}
          sx={{ ...getMarketingPrimaryButtonSx(colors), py: 1.5, fontSize: '15px' }}
        >
          Start Application
        </Button>

        <Typography
          sx={{
            color: colors.textMuted,
            fontSize: publicTypography.caption,
            lineHeight: 1.45,
            mt: 2,
          }}
        >
          Final pricing depends on destination rules, selected visa category and applicant profile.
        </Typography>
      </Card>
    </Stack>
  )
}
