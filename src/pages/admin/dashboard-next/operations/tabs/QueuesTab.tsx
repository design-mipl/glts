import type { Column } from '@/design-system/UIComponents'
import { Button, useToast } from '@/design-system/UIComponents'
import { Grid, Stack } from '@mui/material'
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
import type {
  OperationsAppointmentSubmissionRow,
  OperationsDashboardTabProps,
  OperationsQueueRow,
  OperationsReviewQcRow,
} from '../types'

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
  const { showToast } = useToast()

  const qcColumns: Column<OperationsReviewQcRow>[] = [
    { key: 'applicationId', label: 'Application', widthSize: 'md', sortable: false },
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
    { key: 'country', label: 'Country', widthSize: 'md', sortable: false },
    { key: 'submittedBy', label: 'Submitted by', widthSize: 'md', sortable: false },
    { key: 'currentStage', label: 'Stage', widthSize: 'md', sortable: false },
    { key: 'slaTimer', label: 'SLA', widthSize: 'sm', sortable: false },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <Stack direction="row" spacing={0.5}>
          <Button
            label="Approve"
            variant="text"
            size="sm"
            onClick={() =>
              showToast({
                title: 'QC approved',
                description: `${row.applicationId} approved.`,
                variant: 'success',
              })
            }
          />
          <Button
            label="Raise Correction"
            variant="text"
            size="sm"
            onClick={() =>
              showToast({
                title: 'Correction raised',
                description: `Correction raised for ${row.applicationId}.`,
                variant: 'info',
              })
            }
          />
        </Stack>
      ),
    },
  ]

  const appointmentColumns: Column<OperationsAppointmentSubmissionRow>[] = [
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
    { key: 'appointmentDate', label: 'Appointment', widthSize: 'lg', sortable: false },
    { key: 'country', label: 'Country', widthSize: 'md', sortable: false },
    { key: 'vfsLocation', label: 'VFS / VAC', widthSize: 'md', sortable: false },
    {
      key: 'submissionStatus',
      label: 'Status',
      widthSize: 'md',
      sortable: false,
      render: (_value, row) => (
        <StatusBadge label={row.submissionStatus} status={row.submissionStatus} />
      ),
    },
  ]

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

      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Pending my review / QC"
          subtitle="Approve or raise corrections"
          columns={qcColumns}
          data={data.reviewQcQueue}
          rowKey="id"
          loading={loading}
          pageSize={6}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Appointment & submission queue"
          subtitle="VAC slots and embassy submission readiness"
          columns={appointmentColumns}
          data={data.appointmentSubmissionQueue}
          rowKey="id"
          loading={loading}
          pageSize={6}
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
