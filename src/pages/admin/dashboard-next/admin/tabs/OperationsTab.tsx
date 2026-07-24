import { Grid } from '@mui/material'
import {
  MarineTimeline,
  OperationsHealth,
  PassportJourney,
  TeamCapacity,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AdminDashboardTabProps } from '../types'

/** Operations story — health, capacity, marine & passport (funnel lives in executive row). */
export function OperationsTab({
  data,
  loading,
  onRetry,
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
      <Grid size={{ xs: 12 }}>
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
