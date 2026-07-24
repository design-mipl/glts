import { KPIGrid } from '../KPIGrid'
import { BusinessWidgetFrame } from './BusinessWidgetFrame'
import type { DashboardKpiItem } from '../../types'

export interface QuickStatsProps {
  title?: string
  subtitle?: string
  items: DashboardKpiItem[]
  columns?: 2 | 3 | 4 | 6
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

/** Compact KPI strip — wraps KPIGrid / StatCard. */
export function QuickStats({
  title,
  subtitle,
  items,
  columns = 4,
  loading = false,
  error,
  empty,
  permission,
  onRetry,
}: QuickStatsProps) {
  return (
    <BusinessWidgetFrame
      title={title}
      subtitle={subtitle}
      loading={false}
      error={error}
      empty={!loading && (empty ?? items.length === 0)}
      permission={permission}
      onRetry={onRetry}
      card={Boolean(title)}
      skeletonHeightSpacing={12}
    >
      <KPIGrid items={items} columns={columns} loading={loading} />
    </BusinessWidgetFrame>
  )
}
