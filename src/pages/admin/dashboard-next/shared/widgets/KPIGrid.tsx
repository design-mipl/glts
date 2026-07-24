import { Grid } from '@mui/material'
import { StatCard } from '@/design-system/UIComponents'
import type { DashboardKpiItem } from '../types'
import { DASHBOARD_SPACING } from '../constants'
import { isDashboardPermissionGranted } from '../utils/permission'

export interface KPIGridProps {
  items: DashboardKpiItem[]
  loading?: boolean
  permission?: boolean
  /** Columns at lg breakpoint (default 4). Use 6 for executive strips. */
  columns?: 2 | 3 | 4 | 6
}

export function KPIGrid({
  items,
  loading = false,
  permission,
  columns = 4,
}: KPIGridProps) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  const lgSpan = 12 / columns
  const mdSpan = columns >= 6 ? 4 : columns >= 4 ? 6 : 6
  const displayItems: DashboardKpiItem[] =
    loading && items.length === 0
      ? Array.from({ length: columns }, (_, i) => ({
          id: `kpi-skeleton-${i}`,
          label: '—',
          value: '—',
        }))
      : items

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      {displayItems.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, md: mdSpan, lg: lgSpan }}>
          <StatCard
            label={item.label}
            value={item.value}
            delta={item.delta}
            deltaLabel={item.deltaLabel}
            icon={item.icon}
            sparklineData={item.sparklineData}
            loading={loading}
            sx={{ height: '100%' }}
          />
        </Grid>
      ))}
    </Grid>
  )
}
