import {
  ExecutiveGrid,
  FinancialMetric,
  ProgressMetric,
} from '../../dashboard-ui-kit'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'

export interface CollectionSummaryData {
  outstanding: string | number
  collected: string | number
  overdue: string | number
  collectionRate: number
}

export interface CollectionSummaryProps {
  title?: string
  subtitle?: string
  data: CollectionSummaryData
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function CollectionSummary({
  title = 'Collection summary',
  subtitle = 'Outstanding vs collected',
  data,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: CollectionSummaryProps) {
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
      skeletonHeightSpacing={16}
    >
      <ExecutiveGrid columns={3}>
        <FinancialMetric label="Outstanding" value={data.outstanding} />
        <FinancialMetric label="Collected" value={data.collected} tone="positive" />
        <FinancialMetric label="Overdue" value={data.overdue} tone="warning" />
      </ExecutiveGrid>
      <ProgressMetric
        label="Collection rate"
        value={data.collectionRate}
        helperText={`${Math.round(data.collectionRate)}% of billed amount collected`}
      />
    </BusinessWidgetFrame>
  )
}
