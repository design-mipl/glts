import { Grid } from '@mui/material'
import {
  BranchPerformance,
  BusinessSegmentBreakdown,
  CountryDistribution,
  ProcessingTrend,
  RevenueSnapshot,
  RiskOverview,
  SLAOverview,
  VisaDistribution,
  DASHBOARD_SPACING,
} from '../../shared'
import type { SuperAdminDashboardTabProps } from '../types'

export function AnalyticsTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: SuperAdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <RevenueSnapshot
          title="Revenue trend"
          data={data.revenueSnapshot}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BranchPerformance
          title="Branch comparison"
          branches={data.branchPerformance}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CountryDistribution
          title="Country performance"
          slices={data.countryDistribution}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <VisaDistribution
          title="Visa mix"
          slices={data.visaDistribution}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <BusinessSegmentBreakdown
          title="Segment growth mix"
          slices={data.businessSegments}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProcessingTrend
          title="Processing trend"
          points={data.processingTrend}
          secondaryLabel="Completed"
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RiskOverview
          title="Risk indicators"
          alerts={data.riskAlerts}
          loading={loading}
          onRetry={onRetry}
          onShowMore={() => onNavigate('/admin/dashboard-next')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SLAOverview
          title="SLA trend"
          items={data.slaOverview}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
    </Grid>
  )
}
