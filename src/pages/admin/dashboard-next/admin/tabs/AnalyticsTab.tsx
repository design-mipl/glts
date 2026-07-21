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
import type { AdminDashboardTabProps } from '../types'

export function AnalyticsTab({ data, loading, onRetry, onNavigate }: AdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <RevenueSnapshot data={data.revenueSnapshot} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BranchPerformance
          branches={data.branchPerformance}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CountryDistribution
          slices={data.countryDistribution}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <VisaDistribution
          slices={data.visaDistribution}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <BusinessSegmentBreakdown
          slices={data.businessSegments}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProcessingTrend
          points={data.processingTrend}
          loading={loading}
          onRetry={onRetry}
          secondaryLabel="Completions"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RiskOverview
          alerts={data.riskAlerts}
          loading={loading}
          onRetry={onRetry}
          onShowMore={() => onNavigate('/admin/application-management/retail')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SLAOverview items={data.slaOverview} loading={loading} onRetry={onRetry} />
      </Grid>
    </Grid>
  )
}
