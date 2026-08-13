import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../../shared'
import { SuperAdminSection } from '../SuperAdminChrome'
import { AnalyticsMetricKpiRow } from './AnalyticsMetricKpiRow'
import {
  AnalyticsLineTrendPanel,
  AnalyticsStackedTrendPanel,
} from './AnalyticsTrendPanels'
import type { AnalyticsPeriodMonths, AnalyticsRevenueQuality } from '../../types/analyticsTypes'

export interface RevenueQualitySectionProps {
  data: AnalyticsRevenueQuality
  periodMonths: AnalyticsPeriodMonths
  loading?: boolean
}

export function RevenueQualitySection({
  data,
  periodMonths,
  loading,
}: RevenueQualitySectionProps) {
  return (
    <SuperAdminSection
      title="Revenue quality"
      description="Where net revenue comes from and how concentrated or recurring it is over time"
    >
      <AnalyticsMetricKpiRow items={data.headlines} loading={loading} />

      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsLineTrendPanel
            chart={data.concentrationTrend}
            periodMonths={periodMonths}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsLineTrendPanel
            chart={data.revenueByCountryTrend}
            periodMonths={periodMonths}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsStackedTrendPanel
            chart={data.recurringVsTransactional}
            periodMonths={periodMonths}
            loading={loading}
          />
        </Grid>
      </Grid>
    </SuperAdminSection>
  )
}
