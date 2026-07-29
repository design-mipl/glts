import { Grid } from '@mui/material'
import {
  DocumentMovement,
  PassportJourney,
  RouteTimeline,
  DASHBOARD_SPACING,
} from '../../shared'
import type { GroundOperationsDashboardTabProps } from '../types'

/** Routes story — field routing and passport logistics. */
export function RoutesTab({
  data,
  loading,
  onRetry,
}: GroundOperationsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <RouteTimeline events={data.routeTimeline} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
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
      <Grid size={{ xs: 12, md: 6 }}>
        <DocumentMovement
          points={data.documentMovement}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
    </Grid>
  )
}
