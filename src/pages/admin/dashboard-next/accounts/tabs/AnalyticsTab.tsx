import { Grid } from '@mui/material'
import {
  BranchPerformance,
  BusinessSegmentBreakdown,
  CountryDistribution,
  MetricComparison,
  ProcessingTrend,
  RevenueSnapshot,
  RiskOverview,
  SLAOverview,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AccountsDashboardTabProps } from '../types'

export function AnalyticsTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: AccountsDashboardTabProps) {
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
          title="Branch revenue"
          subtitle="MTD revenue by branch (₹L)"
          branches={data.branchPerformance}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CountryDistribution
          title="Country revenue mix"
          slices={data.countryDistribution}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BusinessSegmentBreakdown
          title="Business segment revenue"
          slices={data.businessSegments}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <ProcessingTrend
          title="Collections trend"
          subtitle="Billed vs recovered (₹L)"
          points={data.processingTrend}
          secondaryLabel="Collected"
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <MetricComparison
          title="Recovery metrics"
          metrics={data.metricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RiskOverview
          title="Financial risk"
          alerts={data.riskAlerts}
          loading={loading}
          onRetry={onRetry}
          onShowMore={() => onNavigate('/admin/finance/invoices')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SLAOverview
          title="Finance SLA"
          items={data.slaOverview}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
    </Grid>
  )
}
