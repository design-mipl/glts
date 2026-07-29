import { ExecutiveGrid, HeroMetric } from '../dashboard-ui-kit'
import type { DashboardKpiItem } from '../types'
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

  const displayItems: DashboardKpiItem[] =
    loading && items.length === 0
      ? Array.from({ length: columns }, (_, i) => ({
          id: `kpi-skeleton-${i}`,
          label: '—',
          value: '—',
        }))
      : items

  return (
    <ExecutiveGrid
      columns={columns === 6 ? 6 : columns === 3 ? 3 : columns === 2 ? 2 : 4}
      spacing={1}
    >
      {displayItems.map((item) => (
        <HeroMetric
          key={item.id}
          label={item.label}
          value={item.value}
          delta={item.delta}
          deltaLabel={item.deltaLabel}
          icon={item.icon}
          loading={loading}
          animate
        />
      ))}
    </ExecutiveGrid>
  )
}
