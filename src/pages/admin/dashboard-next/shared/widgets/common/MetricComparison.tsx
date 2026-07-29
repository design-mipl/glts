import {
  ComparisonMetric,
  ExecutiveGrid,
} from '../../dashboard-ui-kit'
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

/** Side-by-side metric comparison via Dashboard UI Kit. */
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
      title={title}
      subtitle={subtitle}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? metrics.length === 0}
      permission={permission}
      onRetry={onRetry}
      skeletonHeightSpacing={14}
    >
      <ExecutiveGrid columns={metrics.length >= 3 ? 3 : 2}>
        {metrics.map((metric) => (
          <ComparisonMetric
            key={metric.label}
            label={metric.label}
            value={metric.value}
            delta={metric.delta}
          />
        ))}
      </ExecutiveGrid>
    </BusinessWidgetFrame>
  )
}
