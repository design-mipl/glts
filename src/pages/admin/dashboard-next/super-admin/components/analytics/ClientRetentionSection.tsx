import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../../shared'
import { SuperAdminRankChart, SuperAdminSection } from '../SuperAdminChrome'
import { AnalyticsMetricKpiRow } from './AnalyticsMetricKpiRow'
import { AnalyticsLineTrendPanel } from './AnalyticsTrendPanels'
import type { AnalyticsClientRetention, AnalyticsPeriodMonths } from '../../types/analyticsTypes'

export interface ClientRetentionSectionProps {
  data: AnalyticsClientRetention
  periodMonths: AnalyticsPeriodMonths
  loading?: boolean
}

export function ClientRetentionSection({
  data,
  periodMonths,
  loading,
}: ClientRetentionSectionProps) {
  return (
    <SuperAdminSection
      title="Client lifetime & retention"
      description="Whether existing accounts are expanding, stable, or leaving — by business segment"
    >
      <AnalyticsMetricKpiRow items={data.headlines} loading={loading} />

      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsLineTrendPanel
            chart={data.nrrTrend}
            periodMonths={periodMonths}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsLineTrendPanel
            chart={data.churnBySegmentTrend}
            periodMonths={periodMonths}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <SuperAdminRankChart
            title="Estimated wallet share — top accounts"
            items={data.walletShareAccounts}
            loading={loading}
            valueLabel="Wallet share"
            initialTopN="5"
          />
        </Grid>
      </Grid>
    </SuperAdminSection>
  )
}
