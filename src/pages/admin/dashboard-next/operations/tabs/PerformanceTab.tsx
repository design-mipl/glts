import { Grid } from '@mui/material'
import {
  DashboardSection,
  MetricComparison,
  ProcessingTrend,
  ProgressSummary,
  TeamCapacity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { OperationsDashboardTabProps } from '../types'

export function PerformanceTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: OperationsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <ProcessingTrend
          title="My weekly throughput"
          subtitle="Applications processed vs completed"
          points={data.processingTrend}
          secondaryLabel="Completed"
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MetricComparison
          title="Personal productivity"
          subtitle="Completed · cycle time · corrections · SLA"
          metrics={data.metricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DashboardSection title="My SLA" subtitle="Daily and weekly compliance">
          <ProgressSummary items={data.personalSla} loading={loading} />
        </DashboardSection>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TeamCapacity
          title="Capacity context"
          subtitle="My load vs pod"
          rows={data.teamCapacity}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/access/teams')}
        />
      </Grid>
    </Grid>
  )
}
