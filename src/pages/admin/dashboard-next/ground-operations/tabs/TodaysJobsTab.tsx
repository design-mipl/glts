import { Grid } from '@mui/material'
import {
  AppointmentSchedule,
  TodaysJobs,
  DASHBOARD_SPACING,
} from '../../shared'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import type { GroundOperationsDashboardTabProps } from '../types'

/** Operations Desk tab — pending / moved / docs-submitted cases. */
export function TodaysJobsTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenJob,
}: GroundOperationsDashboardTabProps) {
  const drilldown = useDrilldownOptional()

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <TodaysJobs
          title="Operations Desk cases"
          subtitle="Open cases needing ground execution"
          rows={data.todaysJobs}
          loading={loading}
          onRetry={onRetry}
          onRowClick={row => {
            drilldown?.openDrilldown({
              id: `ground-job-${row.id}`,
              title: row.jobRef,
              subtitle: `${row.type} · ${row.location}`,
              entityType: 'case',
              entityId: row.id,
              meta: {
                status: row.status,
                assignee: row.assignee,
                scheduledAt: row.scheduledAt,
              },
            })
            onOpenJob?.(row.id)
          }}
          onViewAll={() => onNavigate('/admin/ground-operations/case-handling')}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AppointmentSchedule
          title="Scheduled operational dates"
          subtitle="Pending and moved-to-next-day cases by operational date"
          rows={data.appointmentSchedule}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/ground-operations/case-handling')}
        />
      </Grid>
    </Grid>
  )
}
