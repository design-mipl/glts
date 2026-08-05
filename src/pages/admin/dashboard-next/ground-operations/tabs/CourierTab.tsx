import { Grid } from '@mui/material'
import { CourierTracking, DASHBOARD_SPACING, InTransitCourierListing } from '../../shared'
import type { LogisticsInTransitRow } from '../../shared/utils/mapLogisticsInTransitRows'
import type { GroundOperationsDashboardTabProps, GroundPassportMovementRow } from '../types'

function toInTransitRow(row: GroundPassportMovementRow): LogisticsInTransitRow {
  return {
    id: row.id,
    applicationNumber: row.applicationNumber,
    applicant: row.applicant,
    currentLocation: row.currentLocation,
    courier: row.courier,
    trackingNumber: row.trackingNumber,
    trackingUrl: row.trackingUrl,
    deliveryMethod: row.deliveryMethod ?? '—',
    eta: row.eta,
    status: row.status,
    assignedTeam: row.currentLocation,
    assignedExecutive: '—',
  }
}

export function CourierTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenPassport,
}: GroundOperationsDashboardTabProps) {
  const inTransitRows = data.passportRows.filter((row) => /in\s*transit/i.test(row.status))
  const tableRows = (inTransitRows.length > 0 ? inTransitRows : data.passportRows).map(
    toInTransitRow,
  )

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 5 }}>
        <CourierTracking
          title="Featured consignment"
          subtitle="From Tracking & Logistics — in transit"
          data={data.courierTracking}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <InTransitCourierListing
          title="IN TRANSIT"
          description="Courier name · AWB · tracking link — updated at dispatch on Tracking & Logistics"
          rows={tableRows}
          loading={loading}
          includeMethod
          onOpen={(row) => onOpenPassport?.(row.id)}
          onViewAll={() => onNavigate('/admin/ground-operations/logistics')}
          viewAllLabel="Open logistics"
        />
      </Grid>
    </Grid>
  )
}
