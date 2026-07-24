import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import {
  Briefcase,
  CreditCard,
  Landmark,
  LayoutDashboard,
  MapPinned,
  Wallet,
} from 'lucide-react'
import {
  AppointmentSchedule,
  ExpenseSummary,
  NotificationPanel,
  RecentActivity,
  TodaysJobs,
  DASHBOARD_SPACING,
} from '../../shared'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import type { GroundOperationsDashboardTabProps } from '../types'

export const GROUND_ACTION_ICONS: Record<string, ReactNode> = {
  'qa-desk': <Briefcase size={18} />,
  'qa-logistics': <MapPinned size={18} />,
  'qa-funds': <Wallet size={18} />,
  'qa-allocation': <Landmark size={18} />,
  'qa-expenses': <CreditCard size={18} />,
  'qa-apps': <LayoutDashboard size={18} />,
}

/** Overview story — executive row (alerts · route · actions) plus field pulse. */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenJob,
}: GroundOperationsDashboardTabProps) {
  const drilldown = useDrilldownOptional()

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 7 }}>
        <TodaysJobs
          rows={data.todaysJobs.slice(0, 5)}
          loading={loading}
          onRetry={onRetry}
          onRowClick={(row) => {
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
      <Grid size={{ xs: 12, md: 5 }}>
        <NotificationPanel
          title="Field alerts"
          items={data.notifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <AppointmentSchedule
          rows={data.appointmentSchedule.slice(0, 5)}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/ground-operations/case-handling')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <ExpenseSummary data={data.expenseSummary} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RecentActivity
          items={data.recentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
    </Grid>
  )
}
