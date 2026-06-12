import { Box, Stack, Typography } from '@mui/material'
import { BORDER_RADIUS } from '@/design-system/tokens'
import {
  CustomerStatusChip,
  type CustomerTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type {
  TravelDateFeasibilityResult,
  TravelDateFeasibilityStatus,
} from '@/shared/utils/travelDateFeasibility'

interface TravelDateFeasibilityCardProps {
  result: TravelDateFeasibilityResult
}

function statusTone(status: TravelDateFeasibilityStatus): CustomerTone {
  if (status === 'green') return 'success'
  if (status === 'amber') return 'warning'
  if (status === 'red') return 'critical'
  return 'neutral'
}

export function TravelDateFeasibilityCard({ result }: TravelDateFeasibilityCardProps) {
  const colors = usePublicBrandColors()

  if (result.status === 'unknown' || !result.headline || !result.summaryLine) {
    return null
  }

  const tone = statusTone(result.status)
  const tonePalette: Record<CustomerTone, { bg: string; border: string; text: string }> = {
    success: { bg: colors.greenMuted, border: 'rgba(115, 192, 100, 0.24)', text: colors.greenDark },
    warning: { bg: 'rgba(245, 158, 11, 0.14)', border: 'rgba(245, 158, 11, 0.26)', text: '#B45309' },
    critical: { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.24)', text: '#DC2626' },
    info: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.24)', text: '#2563EB' },
    neutral: { bg: colors.surfaceAlt, border: colors.border, text: colors.textSecondary },
  }
  const toneStyles = tonePalette[tone]

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: BORDER_RADIUS.lg,
        border: `1px solid ${toneStyles.border}`,
        bgcolor: toneStyles.bg,
      }}
    >
      <Stack spacing={0.25}>
        <CustomerStatusChip label={result.headline} tone={tone} size="sm" />
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.navy, lineHeight: 1.45 }}>
          {result.summaryLine}
        </Typography>
      </Stack>
    </Box>
  )
}
