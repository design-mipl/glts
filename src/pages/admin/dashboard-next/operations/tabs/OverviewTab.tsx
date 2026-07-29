import { Grid, Stack, Typography } from '@mui/material'
import {
  MetricComparison,
  NotificationPanel,
  PendingVerification,
  ProgressSummary,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import type { OperationsDashboardTabProps } from '../types'

/** Overview story — executive row (alerts · queue · actions) plus attention widgets. */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onVerificationOpen,
  onViewVerificationQueue,
}: OperationsDashboardTabProps) {
  const drilldown = useDrilldownOptional()

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={700}>
            Personal SLA
          </Typography>
          <ProgressSummary items={data.personalSla} loading={loading} />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MetricComparison
          title="My throughput"
          metrics={data.metricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <PendingVerification
          title="Needs attention"
          subtitle="Verification waiting on you"
          rows={data.myPendingVerification}
          loading={loading}
          onRetry={onRetry}
          onViewAll={onViewVerificationQueue}
          onAction={(row) => onVerificationOpen?.(row.id)}
          onRowClick={(row) => {
            drilldown?.openDrilldown({
              id: `ops-verification-${row.id}`,
              title: row.glNumber,
              subtitle: row.applicant,
              entityType: 'case',
              entityId: row.id,
              meta: {
                company: row.company,
                priority: row.priority,
                waitingTime: row.waitingTime,
              },
            })
            onVerificationOpen?.(row.id)
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <NotificationPanel
          title="Desk alerts"
          items={data.notifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RecentActivity
          items={data.myRecentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
    </Grid>
  )
}
