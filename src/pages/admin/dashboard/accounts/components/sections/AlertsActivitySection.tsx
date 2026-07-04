import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { DashboardSectionTable } from '@/pages/admin/operations/dashboard/components/DashboardSectionTable'
import { FinancialAlertsPanel } from '../FinancialAlertsPanel'
import { buildAccountsActivityColumns } from '../columns/accountsActivityColumns'
import type { AccountsActivityRow, FinancialAlert } from '../../data/accountsDashboardMock'

export interface AlertsActivitySectionProps {
  financialAlerts: FinancialAlert[]
  accountsActivity: AccountsActivityRow[]
  getActivityCellValue: (row: AccountsActivityRow, key: string) => string
  loading?: boolean
}

export function AlertsActivitySection({
  financialAlerts,
  accountsActivity,
  getActivityCellValue,
  loading = false,
}: AlertsActivitySectionProps) {
  const activityColumns = useMemo(() => buildAccountsActivityColumns(), [])

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <FinancialAlertsPanel alerts={financialAlerts} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="Today's financial activity"
          subtitle="Read-only audit trail of accounts actions"
          columns={activityColumns}
          data={accountsActivity}
          rowKey="id"
          getCellValue={getActivityCellValue}
          loading={loading}
          pageSize={8}
          emptyTitle="No activity yet"
          emptyDescription="Your financial actions today will appear here."
        />
      </Grid>
    </Grid>
  )
}
