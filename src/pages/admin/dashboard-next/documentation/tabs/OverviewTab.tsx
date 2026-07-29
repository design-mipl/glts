import { Grid, Stack, Typography } from '@mui/material'
import {
  AlertCenter,
  MetricComparison,
  ProgressSummary,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { DocumentationDashboardTabProps } from '../types'

/** Overview — performance metrics, recent activity, alerts summary. */
export function OverviewTab({ data, loading, onRetry }: DocumentationDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            Documentation SLA
          </Typography>
          <ProgressSummary items={data.personalSla} loading={loading} />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MetricComparison
          title="My performance today"
          metrics={data.metricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <AlertCenter
          title="Critical alerts summary"
          alerts={data.criticalAlerts}
          loading={loading}
          maxItems={5}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <RecentActivity
          title="Recent activity"
          items={data.recentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
    </Grid>
  )
}
