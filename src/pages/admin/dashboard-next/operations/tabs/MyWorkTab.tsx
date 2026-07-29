import type { ReactNode } from 'react'
import type { Column } from '@/design-system/UIComponents'
import { Button, useToast } from '@/design-system/UIComponents'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  Anchor,
  ClipboardList,
  FileText,
  MapPinned,
  MessageSquare,
  Ship,
} from 'lucide-react'
import {
  DashboardTable,
  MarineTimeline,
  PassportJourney,
  PendingVerification,
  RecentActivity,
  StatusBadge,
  DASHBOARD_SPACING,
} from '../../shared'
import { ExecutiveCard } from '../../shared/dashboard-ui-kit'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import type {
  OperationsApplicationRow,
  OperationsAwaitingDocumentRow,
  OperationsCorrectionRow,
  OperationsDashboardTabProps,
} from '../types'

export const OPS_ACTION_ICONS: Record<string, ReactNode> = {
  'qa-my-apps': <FileText size={18} />,
  'qa-verification': <ClipboardList size={18} />,
  'qa-appointments': <MapPinned size={18} />,
  'qa-marine': <Ship size={18} />,
  'qa-passport': <Anchor size={18} />,
  'qa-followups': <MessageSquare size={18} />,
}

/** My Work story — applications, tasks, corrections, awaiting docs + personal widgets. */
export function MyWorkTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onVerificationOpen,
  onViewVerificationQueue,
  onOpenApplication,
}: OperationsDashboardTabProps) {
  const drilldown = useDrilldownOptional()
  const { showToast } = useToast()
  const theme = useTheme()

  const appColumns: Column<OperationsApplicationRow>[] = [
    { key: 'glNumber', label: 'GL Number', widthSize: 'md', sortable: false },
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
    { key: 'company', label: 'Company', widthSize: 'md', sortable: false },
    { key: 'country', label: 'Country', widthSize: 'md', sortable: false },
    { key: 'currentStage', label: 'Stage', widthSize: 'md', sortable: false },
    { key: 'nextActionRequired', label: 'Next action', widthSize: 'lg', sortable: false },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.priority} status={row.priority} />,
    },
    { key: 'slaTimer', label: 'SLA', widthSize: 'sm', sortable: false },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <Button
          label="Open"
          variant="text"
          size="sm"
          onClick={() => {
            if (onOpenApplication) onOpenApplication(row.applicationHref)
            else onNavigate(row.applicationHref)
          }}
        />
      ),
    },
  ]

  const correctionColumns: Column<OperationsCorrectionRow>[] = [
    { key: 'applicationId', label: 'Application', widthSize: 'md', sortable: false },
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
    { key: 'raisedBy', label: 'Raised by', widthSize: 'md', sortable: false },
    { key: 'reason', label: 'Reason', widthSize: 'lg', sortable: false },
    { key: 'waitingSince', label: 'Waiting', widthSize: 'sm', sortable: false },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <Button
          label="View"
          variant="text"
          size="sm"
          onClick={() =>
            showToast({
              title: 'Correction opened',
              description: `Reviewing ${row.applicationId}.`,
              variant: 'info',
            })
          }
        />
      ),
    },
  ]

  const awaitingColumns: Column<OperationsAwaitingDocumentRow>[] = [
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
    { key: 'outstandingDocuments', label: 'Outstanding docs', widthSize: 'lg', sortable: false },
    { key: 'lastReminderSent', label: 'Last reminder', widthSize: 'md', sortable: false },
    { key: 'daysWaiting', label: 'Days waiting', widthSize: 'sm', sortable: false },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <Button
          label="Send Reminder"
          variant="text"
          size="sm"
          onClick={() =>
            showToast({
              title: 'Reminder sent',
              description: `Document reminder sent to ${row.applicant}.`,
              variant: 'success',
            })
          }
        />
      ),
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="My applications"
          subtitle="Cases assigned to you — open to continue work"
          columns={appColumns}
          data={data.myApplications}
          rowKey="id"
          loading={loading}
          pageSize={6}
          onRowClick={(row) => {
            if (onOpenApplication) onOpenApplication(row.applicationHref)
            else onNavigate(row.applicationHref)
          }}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
          actionLabel="View all"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ExecutiveCard title="Today's tasks" subtitle="Auto-generated operational tasks" density="comfortable">
          <Stack spacing={1}>
            {data.todayTasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tasks scheduled for today.
              </Typography>
            ) : (
              data.todayTasks.map((task) => (
                <Box
                  key={task.id}
                  sx={{
                    p: 1.25,
                    borderRadius: '10px',
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {task.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Due {task.dueTime} · {task.taskCount} items
                      </Typography>
                    </Box>
                    <StatusBadge label={task.priority} status={task.priority} />
                  </Stack>
                </Box>
              ))
            )}
          </Stack>
        </ExecutiveCard>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <DashboardTable
          title="Correction requests"
          subtitle="Applications requiring corrections"
          columns={correctionColumns}
          data={data.correctionRequests}
          rowKey="id"
          loading={loading}
          pageSize={5}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Awaiting client documents"
          subtitle="Send reminders for outstanding paperwork"
          columns={awaitingColumns}
          data={data.awaitingDocuments}
          rowKey="id"
          loading={loading}
          pageSize={5}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <PendingVerification
          title="My pending verification"
          subtitle="Waiting on you"
          rows={data.myPendingVerification}
          loading={loading}
          onRetry={onRetry}
          onViewAll={onViewVerificationQueue}
          onAction={(row) => onVerificationOpen?.(row.id)}
          onRowClick={(row) => {
            drilldown?.openDrilldown({
              id: `ops-my-verification-${row.id}`,
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
      <Grid size={{ xs: 12, lg: 6 }}>
        <PassportJourney
          title="My passport follow-ups"
          stages={data.myPassportJourney.stages}
          journeyStatus={data.myPassportJourney.journeyStatus}
          eta={data.myPassportJourney.eta}
          trackingNumber={data.myPassportJourney.trackingNumber}
          courier={data.myPassportJourney.courier}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MarineTimeline
          title="My marine timeline"
          rows={data.myMarineTimeline}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RecentActivity
          title="My recent activity"
          items={data.myRecentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
    </Grid>
  )
}
