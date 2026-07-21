import { Grid } from '@mui/material'
import {
  ApplicationPipeline,
  MarineTimeline,
  OperationsHealth,
  PassportJourney,
  PendingVerification,
  RecentActivity,
  TeamCapacity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AdminDashboardTabProps } from '../types'

export function OperationsTab({
  data,
  loading,
  onRetry,
  onPipelineStageClick,
  onVerificationOpen,
  onViewVerificationQueue,
  onNavigate,
}: AdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <OperationsHealth
          metrics={data.operationsHealth}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TeamCapacity
          rows={data.teamCapacity}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/access/teams')}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ApplicationPipeline
          stages={data.pipelineStages}
          loading={loading}
          onRetry={onRetry}
          onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <MarineTimeline
          rows={data.marineTimeline}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <PassportJourney
          stages={data.passportJourney.stages}
          journeyStatus={data.passportJourney.journeyStatus}
          eta={data.passportJourney.eta}
          trackingNumber={data.passportJourney.trackingNumber}
          courier={data.passportJourney.courier}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <PendingVerification
          rows={data.pendingVerification}
          loading={loading}
          onRetry={onRetry}
          onViewAll={onViewVerificationQueue}
          onAction={(row) => onVerificationOpen?.(row.id)}
          onRowClick={(row) => onVerificationOpen?.(row.id)}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <RecentActivity
          items={data.recentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
    </Grid>
  )
}
