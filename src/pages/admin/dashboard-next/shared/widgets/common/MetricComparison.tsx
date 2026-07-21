import { MetricCard } from '@/design-system/UIComponents'
import { BusinessWidgetFrame } from './BusinessWidgetFrame'

export interface MetricComparisonItem {
  label: string
  value: string | number
  delta?: number
}

export interface MetricComparisonProps {
  title?: string
  subtitle?: string
  metrics: MetricComparisonItem[]
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

/** Side-by-side metric comparison using DS MetricCard. */
export function MetricComparison({
  title = 'Comparison',
  subtitle,
  metrics,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: MetricComparisonProps) {
  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? metrics.length === 0}
      permission={permission}
      onRetry={onRetry}
      skeletonHeightSpacing={14}
    >
      <MetricCard title={title} subtitle={subtitle} metrics={metrics} />
    </BusinessWidgetFrame>
  )
}
