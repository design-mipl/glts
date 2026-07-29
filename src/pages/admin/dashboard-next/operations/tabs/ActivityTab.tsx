import { Grid } from '@mui/material'
import {
  DocumentMovement,
  NotificationPanel,
  PassportJourney,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { OperationsDashboardTabProps } from '../types'

export function ActivityTab({ data, loading, onRetry }: OperationsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 7 }}>
        <RecentActivity
          title="Operational history"
          subtitle="Assignments · submissions · courier updates"
          items={data.activityFeed}
          loading={loading}
          onRetry={onRetry}
          maxItems={8}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <NotificationPanel
          title="Activity notices"
          items={data.activityNotifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <PassportJourney
          title="Passport movement"
          stages={data.activityPassportJourney.stages}
          journeyStatus={data.activityPassportJourney.journeyStatus}
          eta={data.activityPassportJourney.eta}
          trackingNumber={data.activityPassportJourney.trackingNumber}
          courier={data.activityPassportJourney.courier}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <DocumentMovement
          title="Document movement"
          subtitle="Inbound vs outbound this week"
          points={data.documentMovement}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
    </Grid>
  )
}
