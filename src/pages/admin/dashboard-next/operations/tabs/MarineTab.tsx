import type { Column } from '@/design-system/UIComponents'
import { Grid } from '@mui/material'
import {
  DashboardTable,
  MarineTimeline,
  StatusBadge,
  DASHBOARD_SPACING,
} from '../../shared'
import type { OperationsDashboardTabProps, OperationsMarinePriorityRow } from '../types'

/** Dedicated Marine priority tab — hidden by page when empty (Original parity). */
export function MarineTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: OperationsDashboardTabProps) {
  const columns: Column<OperationsMarinePriorityRow>[] = [
    { key: 'vesselName', label: 'Vessel', widthSize: 'md', sortable: false },
    { key: 'crewName', label: 'Crew', widthSize: 'lg', sortable: false },
    { key: 'joiningPort', label: 'Joining port', widthSize: 'md', sortable: false },
    { key: 'joiningDate', label: 'Joining date', widthSize: 'md', sortable: false },
    { key: 'daysRemaining', label: 'Days left', widthSize: 'sm', sortable: false },
    { key: 'visaStatus', label: 'Visa status', widthSize: 'md', sortable: false },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.priority} status={row.priority} />,
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Marine priority cases"
          subtitle="Crew joining windows that need urgent attention"
          columns={columns}
          data={data.marinePriorityCases}
          rowKey="id"
          loading={loading}
          pageSize={8}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
          actionLabel="Open marine apps"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MarineTimeline
          title="Marine timeline"
          rows={data.myMarineTimeline}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
        />
      </Grid>
    </Grid>
  )
}
