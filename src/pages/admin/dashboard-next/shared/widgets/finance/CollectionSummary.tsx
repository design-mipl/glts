import { Grid } from '@mui/material'
import { StatCard } from '@/design-system/UIComponents'
import { ProgressSummary } from '../ProgressSummary'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import { DASHBOARD_SPACING } from '../../constants'

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
      skeletonHeightSpacing={16}
    >
      <Grid container spacing={DASHBOARD_SPACING.field} sx={{ mb: DASHBOARD_SPACING.dense }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Outstanding" value={data.outstanding} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Collected" value={data.collected} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Overdue" value={data.overdue} />
        </Grid>
      </Grid>
      <ProgressSummary
        items={[
          {
            id: 'collection-rate',
            label: 'Collection rate',
            value: data.collectionRate,
            helperText: `${Math.round(data.collectionRate)}% of billed amount collected`,
          },
        ]}
      />
    </BusinessWidgetFrame>
  )
}
