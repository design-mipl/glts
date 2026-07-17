import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { DashboardSectionTable } from '@/pages/admin/dashboard/components'
import { OperationsCriticalAlertsPanel } from '../OperationsCriticalAlertsPanel'
import { buildMyActivityColumns } from '../columns/myActivityColumns'
import type { MyActivityRow, OperationsCriticalAlert } from '../../data/operationsConsultantDashboardMock'

export interface CriticalAlertsActivitySectionProps {
  criticalAlerts: OperationsCriticalAlert[]
  myActivity: MyActivityRow[]
  getMyActivityCellValue: (row: MyActivityRow, key: string) => string
  loading?: boolean
}

export function CriticalAlertsActivitySection({
  criticalAlerts,
  myActivity,
  getMyActivityCellValue,
  loading = false,
}: CriticalAlertsActivitySectionProps) {
  const activityColumns = useMemo(() => buildMyActivityColumns(), [])

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <OperationsCriticalAlertsPanel alerts={criticalAlerts} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="My activity today"
          subtitle="Read-only audit trail of your actions today"
          columns={activityColumns}
          data={myActivity}
          rowKey="id"
          getCellValue={getMyActivityCellValue}
          loading={loading}
          pageSize={8}
          emptyTitle="No activity yet"
          emptyDescription="Your actions today will appear here."
        />
      </Grid>
    </Grid>
  )
}
