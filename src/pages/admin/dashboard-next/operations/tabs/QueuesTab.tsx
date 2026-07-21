import type { Column } from '@/design-system/UIComponents'
import { Grid } from '@mui/material'
import {
  ApplicationPipeline,
  DashboardTable,
  MarineTimeline,
  PassportJourney,
  PendingVerification,
  RecentActivity,
  StatusBadge,
  DASHBOARD_SPACING,
} from '../../shared'
import type { OperationsDashboardTabProps, OperationsQueueRow } from '../types'

const queueColumns: Column<OperationsQueueRow>[] = [
  { key: 'glNumber', label: 'GL Number', widthSize: 'md', sortable: false },
  { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
  { key: 'queueLabel', label: 'Queue', widthSize: 'lg', sortable: false },
  {
    key: 'priority',
    label: 'Priority',
    widthSize: 'sm',
    sortable: false,
    render: (_value, row) => <StatusBadge label={row.priority} status={row.priority} />,
  },
  { key: 'waitingTime', label: 'Waiting', widthSize: 'md', sortable: false },
  {
    key: 'status',
    label: 'Status',
    widthSize: 'sm',
    sortable: false,
    render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
  },
]

export function QueuesTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onPipelineStageClick,
  onVerificationOpen,
  onViewVerificationQueue,
  onQueueRowClick,
}: OperationsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Action queues"
          subtitle="Pending QC · Corrections · Appointments · Submission · Blocked"
          columns={queueColumns}
          data={data.queueItems}
          rowKey="id"
          loading={loading}
          onRowClick={(row) => onQueueRowClick?.(row.id)}
          onViewAll={onViewVerificationQueue}
          actionLabel="Open queues"
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <PendingVerification
          title="Verification waiting"
          rows={data.queuePendingVerification}
          loading={loading}
          onRetry={onRetry}
          onViewAll={onViewVerificationQueue}
          onAction={(row) => onVerificationOpen?.(row.id)}
          onRowClick={(row) => onVerificationOpen?.(row.id)}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <ApplicationPipeline
          title="Queue pipeline"
          stages={data.queuePipelineStages}
          loading={loading}
          onRetry={onRetry}
          onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <PassportJourney
          stages={data.queuePassportJourney.stages}
          journeyStatus={data.queuePassportJourney.journeyStatus}
          eta={data.queuePassportJourney.eta}
          trackingNumber={data.queuePassportJourney.trackingNumber}
          courier={data.queuePassportJourney.courier}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <MarineTimeline
          title="Marine queue"
          rows={data.queueMarineTimeline}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <RecentActivity
          title="Queue activity"
          items={data.queueRecentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
    </Grid>
  )
}
