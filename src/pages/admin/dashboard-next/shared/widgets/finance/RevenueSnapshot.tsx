import {
  ExecutiveGrid,
  FinancialMetric,
  HeroMetric,
  TrendMetric,
} from '../../dashboard-ui-kit'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'

export interface RevenueSnapshotData {
  todayRevenue: string | number
  monthlyRevenue: string | number
  growthPercent: number
  trend: number[]
}

export interface RevenueSnapshotProps {
  title?: string
  subtitle?: string
  data: RevenueSnapshotData
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function RevenueSnapshot({
  title = 'Revenue snapshot',
  subtitle = 'Today vs month-to-date',
  data,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: RevenueSnapshotProps) {
  return (
    <BusinessWidgetFrame
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      empty={empty}
      permission={permission}
      onRetry={onRetry}
      card={false}
      skeletonHeightSpacing={14}
    >
      <ExecutiveGrid columns={3}>
        <HeroMetric label="Today's revenue" value={data.todayRevenue} animate />
        <FinancialMetric
          label="Monthly revenue"
          value={data.monthlyRevenue}
          delta={data.growthPercent}
          deltaLabel="growth"
        />
        <TrendMetric
          label="Trend"
          value={`${data.growthPercent > 0 ? '+' : ''}${data.growthPercent.toFixed(1)}%`}
          delta={data.growthPercent}
        />
      </ExecutiveGrid>
    </BusinessWidgetFrame>
  )
}
