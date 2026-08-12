import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import {
  Briefcase,
  ClipboardList,
  LayoutDashboard,
  MapPinned,
  Wallet,
} from 'lucide-react'
import {
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
  'qa-claims': <ClipboardList size={18} />,
  'qa-funds': <Wallet size={18} />,
  'qa-allocation': <Wallet size={18} />,
  'qa-expenses': <ClipboardList size={18} />,
  'qa-apps': <LayoutDashboard size={18} />,
}

/** Overview — desk queue, alerts, claim status, and recent activity. */
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
          title="Operations Desk queue"
          subtitle="Pending · moved next day · docs submitted"
          rows={data.todaysJobs.slice(0, 6)}
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
      <Grid size={{ xs: 12, md: 5 }}>
        <NotificationPanel
          title="Field alerts"
          items={data.notifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <ExpenseSummary
          title="Claim sheets"
          subtitle="Finance review status"
          data={data.expenseSummary}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
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
