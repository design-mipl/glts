import { Box, Stack, Typography } from '@mui/material'
import { ProgressBar, ProgressRing } from '@/design-system/UIComponents'
import type { DashboardProgressItem } from '../types'
import { DASHBOARD_SPACING } from '../constants'
import { isDashboardPermissionGranted } from '../utils/permission'

export interface ProgressSummaryProps {
  items: DashboardProgressItem[]
  variant?: 'bar' | 'ring'
  loading?: boolean
  permission?: boolean
}

export function ProgressSummary({
  items,
  variant = 'bar',
  loading = false,
  permission,
}: ProgressSummaryProps) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  if (variant === 'ring') {
    return (
      <Stack
        direction="row"
        spacing={DASHBOARD_SPACING.card}
        useFlexGap
        flexWrap="wrap"
        sx={{ mb: DASHBOARD_SPACING.section }}
      >
        {items.map((item) => (
          <Box key={item.id} sx={{ textAlign: 'center' }}>
            <ProgressRing
              value={loading ? 0 : item.value}
              showValue
              label={item.label}
              size={96}
            />
            {item.helperText ? (
              <Typography variant="caption" color="text.secondary">
                {item.helperText}
              </Typography>
            ) : null}
          </Box>
        ))}
      </Stack>
    )
  }

  return (
    <Stack spacing={DASHBOARD_SPACING.dense} sx={{ mb: DASHBOARD_SPACING.section }}>
      {items.map((item) => (
        <Box key={item.id}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="body2" color="text.primary" fontWeight={600}>
              {item.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {loading ? '—' : `${Math.round(item.value)}%`}
            </Typography>
          </Stack>
          <ProgressBar value={loading ? 0 : item.value} />
          {item.helperText ? (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {item.helperText}
            </Typography>
          ) : null}
        </Box>
      ))}
    </Stack>
  )
}
