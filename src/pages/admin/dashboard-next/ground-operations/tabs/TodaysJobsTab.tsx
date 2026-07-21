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
  CourierTracking,
  DASHBOARD_SPACING,
  NotificationPanel,
  QuickActions,
  QuickStats,
  RecentActivity,
  RouteTimeline,
  TodaysJobs,
} from '../../shared'
import type { GroundOperationsDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-desk': <Briefcase size={18} />,
  'qa-logistics': <MapPinned size={18} />,
  'qa-funds': <Wallet size={18} />,
  'qa-allocation': <Landmark size={18} />,
  'qa-expenses': <CreditCard size={18} />,
  'qa-apps': <LayoutDashboard size={18} />,
}

export function TodaysJobsTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenJob,
}: GroundOperationsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <QuickStats
          title="Today's field snapshot"
          items={data.quickStats}
          loading={loading}
          onRetry={onRetry}
          columns={4}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <NotificationPanel
          title="Field alerts"
          items={data.notifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={4}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <TodaysJobs
          rows={data.todaysJobs}
          loading={loading}
          onRetry={onRetry}
          onRowClick={(row) => onOpenJob?.(row.id)}
          onViewAll={() => onNavigate('/admin/ground-operations/case-handling')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <RouteTimeline events={data.routeTimeline} loading={loading} onRetry={onRetry} />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <AppointmentSchedule
          rows={data.appointmentSchedule}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/ground-operations/case-handling')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <CourierTracking data={data.courierTracking} loading={loading} onRetry={onRetry} />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions.map((action) => ({
            id: action.id,
            title: action.title,
            description: action.description,
            badge: action.badge,
            icon: ACTION_ICONS[action.id],
            onClick: () => onNavigate(action.href),
          }))}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
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
