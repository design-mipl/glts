import { ExecutiveGrid, HeroMetric } from '../dashboard-ui-kit'
import type { DashboardKpiItem } from '../types'
import { isDashboardPermissionGranted } from '../utils/permission'
import { kpiColumns, type KpiColumnCount } from '../utils/kpiColumns'

export interface KPIGridProps {
  items: DashboardKpiItem[]
  loading?: boolean
  permission?: boolean
  /** Columns at lg breakpoint. Defaults to matching item count (max 6). */
  columns?: KpiColumnCount
}

export function KPIGrid({
  items,
  loading = false,
  permission,
  columns,
}: KPIGridProps) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  const resolvedColumns = columns ?? kpiColumns(items.length)

  const displayItems: DashboardKpiItem[] =
    loading && items.length === 0
      ? Array.from({ length: resolvedColumns }, (_, i) => ({
          id: `kpi-skeleton-${i}`,
          label: '—',
          value: '—',
        }))
      : items

  return (
    <ExecutiveGrid columns={resolvedColumns} spacing={1}>
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
