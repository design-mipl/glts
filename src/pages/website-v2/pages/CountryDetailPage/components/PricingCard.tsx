import { useState } from 'react'
import {
  Box,
  Card,
  Typography,
  Button,
  Divider,
  Stack,
  Select,
  MenuItem,
  IconButton,
  type SelectChangeEvent,
} from '@mui/material'
import { Landmark, Clock, Minus, Plus } from 'lucide-react'
import type { Country } from '@/shared/types/visa'
import {
  publicFonts,
  publicTypography,
  usePublicBrandColors,
} from '@/shared/theme/publicBrand'
import { LiveStatusPanel } from '../../../components/liveStatusPanel/LiveStatusPanel'
import { applyFlow, getAccentButtonSx } from '../../../theme/applyFlowTheme'
import {
  getElevatedStatusCardSx,
  statusVisualRadius,
} from '../../../theme/statusVisualTokens'

interface VisaCategoryOption {
  value: string
  label: string
}

interface PricingCardProps {
  country: Country
  visaCategoryOptions: readonly VisaCategoryOption[]
  selectedVisaCategory: string
  onVisaCategoryChange: (value: string) => void
  applyHref: string
}

const MAX_TRAVELLERS = 9

export function PricingCard({
  country,
  visaCategoryOptions,
  selectedVisaCategory,
  onVisaCategoryChange,
  applyHref,
}: PricingCardProps) {
  const colors = usePublicBrandColors()
  const [travellerCount, setTravellerCount] = useState(1)

  const selectedLabel =
    visaCategoryOptions.find(option => option.value === selectedVisaCategory)?.label ??
    visaCategoryOptions[0]?.label ??
    'Tourist Visa'

  const unitPrice = country.price
  const totalPrice = unitPrice * travellerCount
  const totalPriceLabel = `₹${totalPrice.toLocaleString('en-IN')}`

  // Indicative split pending a per-visa-type fee breakdown from the backend — embassy/government
  // fees make up the bulk of most visa costs, with GreenLight's facilitation fee as the remainder.
  // Split on the unit price first so the two line items always sum exactly to the total.
  const embassyFeeUnit = Math.round(unitPrice * 0.8)
  const serviceFeeUnit = unitPrice - embassyFeeUnit
  const embassyFeeLabel = `₹${(embassyFeeUnit * travellerCount).toLocaleString('en-IN')}`
  const serviceFeeLabel = `₹${(serviceFeeUnit * travellerCount).toLocaleString('en-IN')}`

  const travellerAwareHref = `${applyHref}${applyHref.includes('?') ? '&' : '?'}travellers=${travellerCount}`

  const approvalLikelihood =
    typeof country.rating === 'number' && country.rating > 0 ? `${country.rating}%` : null

  const selectFieldSx = {
    height: 40,
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 600,
    color: colors.navy,
    bgcolor: colors.white,
    '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: applyFlow.accent },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: applyFlow.accent, borderWidth: 1.5 },
    '& .MuiSelect-select': { display: 'flex', alignItems: 'center', py: 0 },
  }

  return (
    <Stack spacing={2}>
      <LiveStatusPanel
        headline={{
          eyebrow: 'Avg processing',
          value: country.processingTime || 'TBD',
          caption: `${country.name} · ${selectedLabel}`,
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
            mb: 2,
          }}
        >
          Fee estimate
        </Typography>

        {/* Visa type */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: publicFonts.mono,
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.textMuted,
              mb: 0.75,
            }}
          >
            Visa type
          </Typography>
          <Select
            fullWidth
            value={selectedVisaCategory}
            onChange={(event: SelectChangeEvent) => onVisaCategoryChange(event.target.value)}
            sx={selectFieldSx}
          >
            {visaCategoryOptions.map(option => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: '13px' }}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Travellers */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: publicFonts.mono,
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.textMuted,
                mb: 0.5,
              }}
            >
              Travellers
            </Typography>
            <Typography sx={{ fontSize: '13px', color: colors.textSecondary }}>
              {travellerCount} {travellerCount === 1 ? 'applicant' : 'applicants'}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              px: 0.5,
              height: 40,
            }}
          >
            <IconButton
              size="small"
              disabled={travellerCount <= 1}
              onClick={() => setTravellerCount(count => Math.max(1, count - 1))}
              sx={{ color: colors.navy }}
              aria-label="Remove traveller"
            >
              <Minus size={15} />
            </IconButton>
            <Typography
              sx={{
                fontFamily: publicFonts.mono,
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 700,
                fontSize: '15px',
                color: colors.navy,
                minWidth: 18,
                textAlign: 'center',
              }}
            >
              {travellerCount}
            </Typography>
            <IconButton
              size="small"
              disabled={travellerCount >= MAX_TRAVELLERS}
              onClick={() => setTravellerCount(count => Math.min(MAX_TRAVELLERS, count + 1))}
              sx={{ color: colors.navy }}
              aria-label="Add traveller"
            >
              <Plus size={15} />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5, borderColor: colors.border }} />

        {/* Total */}
        <Typography
          sx={{
            fontFamily: publicFonts.mono,
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 800,
            fontSize: { xs: '26px', md: '30px' },
            color: colors.navy,
            mb: 0.5,
            letterSpacing: '-0.01em',
          }}
        >
          {totalPriceLabel}
        </Typography>
        <Typography
          sx={{
            color: colors.textSecondary,
            fontSize: '13px',
            mb: 3,
            lineHeight: 1.5,
            fontFamily: publicFonts.body,
          }}
        >
          Indicative total for {travellerCount} {travellerCount === 1 ? 'applicant' : 'applicants'} ·{' '}
          {country.name}. Final embassy and GreenLight fee split is confirmed before submission.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          size="large"
          href={travellerAwareHref}
          sx={{ ...getAccentButtonSx(), py: 1.5, fontSize: '15px', mb: 3 }}
        >
          Start Application
        </Button>

        <Stack spacing={1.75}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <Landmark size={16} color={colors.textMuted} style={{ marginTop: 2, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.navy, fontSize: '13px', fontWeight: 600 }}>
                Embassy &amp; government fee
              </Typography>
              <Typography sx={{ color: colors.textMuted, fontSize: '12px' }}>Paid with application</Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: publicFonts.mono,
                fontVariantNumeric: 'tabular-nums',
                color: colors.navy,
                fontSize: '13px',
                fontWeight: 700,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {embassyFeeLabel}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <Clock size={16} color={colors.textMuted} style={{ marginTop: 2, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ color: colors.navy, fontSize: '13px', fontWeight: 600 }}>
                GreenLight service fee
              </Typography>
              <Typography sx={{ color: colors.textMuted, fontSize: '12px' }}>Included in total</Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: publicFonts.mono,
                fontVariantNumeric: 'tabular-nums',
                color: colors.navy,
                fontSize: '13px',
                fontWeight: 700,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {serviceFeeLabel}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: colors.border }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: colors.navy, fontSize: '14px', fontWeight: 800 }}>
              Total amount
            </Typography>
            <Typography
              sx={{
                fontFamily: publicFonts.mono,
                fontVariantNumeric: 'tabular-nums',
                color: colors.navy,
                fontSize: '15px',
                fontWeight: 800,
              }}
            >
              {totalPriceLabel}
            </Typography>
          </Box>
        </Stack>

        <Typography
          sx={{
            color: colors.textMuted,
            fontSize: publicTypography.caption,
            lineHeight: 1.45,
            mt: 2.5,
          }}
        >
          Final pricing depends on destination rules, selected visa category and applicant profile.
        </Typography>
      </Card>
    </Stack>
  )
}
