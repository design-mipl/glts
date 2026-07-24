import { Grid } from '@mui/material'
import {
  BranchPerformance,
  BusinessSegmentBreakdown,
  CountryDistribution,
  ProcessingTrend,
  QuickStats,
  RevenueSnapshot,
  RiskOverview,
  SLAOverview,
  TeamCapacity,
  VisaDistribution,
  DASHBOARD_SPACING,
} from '../../shared'
import {
  ComparisonLayout,
  ExecutiveGrid,
  ProgressMetric,
  RankingList,
} from '../../shared/dashboard-ui-kit'
import type { SuperAdminDashboardTabProps, SuperAdminRankItem } from '../types'

function toRankingItems(items: SuperAdminRankItem[]) {
  return items.map((item, index) => ({
    id: item.id,
    primary: item.primary,
    secondary: item.secondary,
    rank: index + 1,
    value: item.value,
    progress: item.progress,
  }))
}

/** Analytics — cross-cutting performance, SLA, and people signals. */
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
          secondaryLabel="Completed"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <RiskOverview
          alerts={data.riskAlerts}
          loading={loading}
          onRetry={onRetry}
          onShowMore={() => onNavigate('/admin/application-management/marine')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SLAOverview items={data.slaOverview} loading={loading} onRetry={onRetry} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <QuickStats
          title="Commercial snapshot (placeholder)"
          columns={4}
          loading={loading}
          items={[
            {
              id: 'pipe',
              label: 'Pipeline value',
              value: data.salesPlaceholder.pipelineValue,
            },
            {
              id: 'win',
              label: 'Win rate',
              value: data.salesPlaceholder.winRate,
            },
            {
              id: 'deal',
              label: 'Average deal',
              value: data.salesPlaceholder.avgDeal,
            },
            {
              id: 'conv',
              label: 'Proposal conversion',
              value: data.salesPlaceholder.conversion,
            },
          ]}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
          {data.staffProductivity.map((item) => (
            <ProgressMetric
              key={item.id}
              label={item.label}
              value={item.value}
              helperText={item.helperText}
              loading={loading}
            />
          ))}
        </ExecutiveGrid>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ComparisonLayout
          left={
            <RankingList
              title="Department leaderboard"
              items={toRankingItems(data.staffLeaderboard)}
              loading={loading}
            />
          }
          right={
            <TeamCapacity
              title="Queue vs capacity"
              rows={data.teamCapacity}
              loading={loading}
              onRetry={onRetry}
              onViewAll={() => onNavigate('/admin/access/teams')}
            />
          }
        />
      </Grid>
    </Grid>
  )
}
