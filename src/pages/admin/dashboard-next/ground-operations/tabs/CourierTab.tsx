import type { Column } from '@/design-system/UIComponents'
import { Button } from '@/design-system/UIComponents'
import { Grid } from '@mui/material'
import {
  CourierTracking,
  DashboardTable,
  DASHBOARD_SPACING,
  StatusBadge,
} from '../../shared'
import type {
  GroundOperationsDashboardTabProps,
  GroundPassportMovementRow,
} from '../types'

export function CourierTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenPassport,
}: GroundOperationsDashboardTabProps) {
  const columns: Column<GroundPassportMovementRow>[] = [
    { key: 'applicationNumber', label: 'Application Number', widthSize: 'md', sortable: false },
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
    { key: 'currentLocation', label: 'Current Location', widthSize: 'md', sortable: false },
    { key: 'courier', label: 'Courier', widthSize: 'md', sortable: false },
    { key: 'trackingNumber', label: 'Tracking Number', widthSize: 'md', sortable: false },
    { key: 'eta', label: 'ETA', widthSize: 'md', sortable: false },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <Button label="Open" variant="text" size="sm" onClick={() => onOpenPassport?.(row.id)} />
      ),
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 5 }}>
        <CourierTracking data={data.courierTracking} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <DashboardTable
          title="Courier & passport movement"
          subtitle="In transit · awaiting collection · delivered"
          columns={columns}
          data={data.passportRows}
          rowKey="id"
          loading={loading}
          pageSize={8}
          onRowClick={(row) => onOpenPassport?.(row.id)}
          onViewAll={() => onNavigate('/admin/ground-operations/logistics')}
          actionLabel="Open logistics"
        />
      </Grid>
    </Grid>
  )
}
