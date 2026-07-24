import { Grid } from '@mui/material'
import { ExpenseSummary, DASHBOARD_SPACING } from '../../shared'
import type { GroundOperationsDashboardTabProps } from '../types'

export function ExpensesTab({ data, loading, onRetry }: GroundOperationsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <ExpenseSummary data={data.expenseSummary} loading={loading} onRetry={onRetry} />
      </Grid>
    </Grid>
  )
}
