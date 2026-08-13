import { Grid } from '@mui/material'
import { DASHBOARD_SPACING } from '../../../shared'
import { SuperAdminSection } from '../SuperAdminChrome'
import { AnalyticsMetricKpiRow } from './AnalyticsMetricKpiRow'
import {
  AnalyticsLineTrendPanel,
  AnalyticsStackedTrendPanel,
} from './AnalyticsTrendPanels'
import type {
  AnalyticsOperationalEfficiency,
  AnalyticsPeriodMonths,
} from '../../types/analyticsTypes'

export interface OperationalEfficiencySectionProps {
  data: AnalyticsOperationalEfficiency
  periodMonths: AnalyticsPeriodMonths
  loading?: boolean
}

export function OperationalEfficiencySection({
  data,
  periodMonths,
  loading,
}: OperationalEfficiencySectionProps) {
  return (
    <SuperAdminSection
      title="Operational efficiency"
      description="Processing quality trends — approval rates, rejection causes, and rework by business segment"
    >
      <AnalyticsMetricKpiRow items={data.headlines} loading={loading} />

      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsLineTrendPanel
            chart={data.approvalRateTrend}
            periodMonths={periodMonths}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsStackedTrendPanel
            chart={data.rejectionRootCause}
            periodMonths={periodMonths}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsLineTrendPanel
            chart={data.reworkBySegmentTrend}
            periodMonths={periodMonths}
            loading={loading}
          />
        </Grid>
      </Grid>
    </SuperAdminSection>
  )
}
