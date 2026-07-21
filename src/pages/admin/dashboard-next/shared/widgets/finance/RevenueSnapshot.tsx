import { Grid } from '@mui/material'
import { StatCard } from '@/design-system/UIComponents'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import { DASHBOARD_SPACING } from '../../constants'

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
      skeletonHeightSpacing={14}
    >
      <Grid container spacing={DASHBOARD_SPACING.field}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Today's revenue" value={data.todayRevenue} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Monthly revenue"
            value={data.monthlyRevenue}
            delta={data.growthPercent}
            deltaLabel="growth"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Trend"
            value={`${data.growthPercent > 0 ? '+' : ''}${data.growthPercent.toFixed(1)}%`}
            sparklineData={data.trend}
          />
        </Grid>
      </Grid>
    </BusinessWidgetFrame>
  )
}
