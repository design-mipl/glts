import { Grid } from '@mui/material'
import {
  DASHBOARD_SPACING,
  DocumentMovement,
  NotificationPanel,
  RecentActivity,
  RouteTimeline,
} from '../../shared'
import type { GroundOperationsDashboardTabProps } from '../types'

export function ActivityTab({
  data,
  loading,
  onRetry,
}: GroundOperationsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 7 }}>
        <RecentActivity
          title="Field activity"
          subtitle="Assignments · courier · passport · expenses · settlements"
          items={data.activityFeed}
          loading={loading}
          onRetry={onRetry}
          maxItems={8}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <NotificationPanel
          title="Operational notices"
          items={data.activityNotifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RouteTimeline
          title="Day route"
          events={data.activityRoute}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <DocumentMovement
          title="Document events"
          subtitle="Pickup · VFS · embassy · courier"
          points={data.activityDocuments}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
    </Grid>
  )
}
