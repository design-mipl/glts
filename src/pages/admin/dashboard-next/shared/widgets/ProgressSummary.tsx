import { Stack } from '@mui/material'
import { ProgressRing } from '@/design-system/UIComponents'
import { ExecutiveGrid, ProgressMetric, UI_KIT_SPACING } from '../dashboard-ui-kit'
import type { DashboardProgressItem } from '../types'
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
      <ExecutiveGrid columns={items.length >= 4 ? 4 : items.length === 3 ? 3 : 2}>
        {items.map((item) => (
          <Stack key={item.id} alignItems="center" spacing={UI_KIT_SPACING.dense}>
            <ProgressRing
              value={loading ? 0 : item.value}
              showValue
              label={item.label}
              size={96}
            />
          </Stack>
        ))}
      </ExecutiveGrid>
    )
  }

  return (
    <Stack spacing={UI_KIT_SPACING.field}>
      {items.map((item) => (
        <ProgressMetric
          key={item.id}
          label={item.label}
          value={loading ? 0 : item.value}
          helperText={item.helperText}
          loading={loading}
        />
      ))}
    </Stack>
  )
}
