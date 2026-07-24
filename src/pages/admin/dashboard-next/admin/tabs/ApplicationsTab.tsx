import { Grid } from '@mui/material'
import {
  ApplicationPipeline,
  PendingVerification,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import type { AdminDashboardTabProps } from '../types'

/** Applications story — intake, verification, and pipeline detail. */
export function ApplicationsTab({
  data,
  loading,
  onRetry,
  onPipelineStageClick,
  onVerificationOpen,
  onViewVerificationQueue,
}: AdminDashboardTabProps) {
  const drilldown = useDrilldownOptional()

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <ApplicationPipeline
          title="Application funnel detail"
          subtitle="Drill into a stage for queue context"
          stages={data.pipelineStages}
          loading={loading}
          onRetry={onRetry}
          onStageClick={(stageId) => {
            drilldown?.openDrilldown({
              id: `admin-pipeline-${stageId}`,
              title: `Pipeline · ${stageId}`,
              subtitle: 'Application stage drilldown',
              entityType: 'application',
              entityId: stageId,
              meta: { stageId },
            })
            onPipelineStageClick?.(stageId)
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <PendingVerification
          rows={data.pendingVerification}
          loading={loading}
          onRetry={onRetry}
          onViewAll={onViewVerificationQueue}
          onAction={(row) => onVerificationOpen?.(row.id)}
          onRowClick={(row) => {
            drilldown?.openDrilldown({
              id: `admin-verification-${row.id}`,
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
        <RecentActivity
          title="Application activity"
          items={data.recentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
    </Grid>
  )
}
