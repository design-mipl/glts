import {
  ExecutiveGrid,
  HeroMetric,
  InsightStack,
} from '../../dashboard-ui-kit'
import { BusinessWidgetFrame } from './BusinessWidgetFrame'
import type { DashboardKpiItem } from '../../types'
import { kpiColumns, type KpiColumnCount } from '../../utils/kpiColumns'

export interface QuickStatsProps {
  title?: string
  subtitle?: string
  items: DashboardKpiItem[]
  columns?: KpiColumnCount
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

/** Compact KPI strip — Dashboard UI Kit dense metric strip. */
export function QuickStats({
  title,
  subtitle,
  items,
  columns,
  loading = false,
  error,
  empty,
  permission,
  onRetry,
}: QuickStatsProps) {
  const resolvedColumns = columns ?? kpiColumns(items.length)

  const displayItems: DashboardKpiItem[] =
    loading && items.length === 0
      ? Array.from({ length: resolvedColumns }, (_, i) => ({
          id: `kpi-skeleton-${i}`,
          label: '—',
          value: '—' as string | number,
        }))
      : items

  return (
    <BusinessWidgetFrame
      title={title}
      subtitle={subtitle}
      loading={false}
      error={error}
      empty={!loading && (empty ?? items.length === 0)}
      permission={permission}
      onRetry={onRetry}
      card={false}
      skeletonHeightSpacing={8}
    >
      <InsightStack>
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
      </InsightStack>
    </BusinessWidgetFrame>
  )
}
