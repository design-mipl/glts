import { BarChart } from '@/design-system/UIComponents'
import { AnalyticsChart } from '../../dashboard-ui-kit'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import {
  AGEING_BUCKET_LABELS,
  type AgeingBucketId,
} from '../../config/ageingBuckets'
import { DASHBOARD_CHART_HEIGHT_SPACING } from '../../constants'

export interface AgeingBucketValue {
  id: AgeingBucketId
  amount: number
  count?: number
}

export interface AgeingAnalysisProps {
  title?: string
  subtitle?: string
  buckets: AgeingBucketValue[]
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function AgeingAnalysis({
  title = 'Ageing analysis',
  subtitle = 'Outstanding by age bucket',
  buckets,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: AgeingAnalysisProps) {
  const chartHeight = DASHBOARD_CHART_HEIGHT_SPACING * 8
  const chartData = buckets.map((bucket) => ({
    bucket: AGEING_BUCKET_LABELS[bucket.id],
    amount: bucket.amount,
    count: bucket.count ?? 0,
  }))

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? buckets.length === 0}
      permission={permission}
      onRetry={onRetry}
    >
      <AnalyticsChart title={title} subtitle={subtitle} minHeight={chartHeight}>
        <BarChart
          data={chartData}
          xKey="bucket"
          bars={[{ key: 'amount', label: 'Amount' }]}
          height={chartHeight}
          showLegend={false}
        />
      </AnalyticsChart>
    </BusinessWidgetFrame>
  )
}
