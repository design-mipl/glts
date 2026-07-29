import type { Column } from '@/design-system/UIComponents'
import { Button } from '@/design-system/UIComponents'
import { Grid } from '@mui/material'
import {
  DashboardTable,
  DASHBOARD_SPACING,
  SettlementStatus,
  StatusBadge,
} from '../../shared'
import type { GroundFundCaseRow, GroundOperationsDashboardTabProps } from '../types'

export function SettlementsTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenFundCase,
}: GroundOperationsDashboardTabProps) {
  const columns: Column<GroundFundCaseRow>[] = [
    { key: 'caseRef', label: 'Case', widthSize: 'md', sortable: false },
    { key: 'allocatedAmount', label: 'Allocated Amount', widthSize: 'md', sortable: false },
    { key: 'expensesIncurred', label: 'Expenses Incurred', widthSize: 'md', sortable: false },
    { key: 'availableBalance', label: 'Available Balance', widthSize: 'md', sortable: false },
    { key: 'settlementAmount', label: 'Settlement Amount', widthSize: 'md', sortable: false },
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
        <Button label="Open" variant="text" size="sm" onClick={() => onOpenFundCase?.(row.id)} />
      ),
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 5 }}>
        <SettlementStatus
          rows={data.settlementRows}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/ground-operations/funds')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <DashboardTable
          title="Fund cases"
          subtitle="Allocation · spend · settlement"
          columns={columns}
          data={data.fundCaseRows}
          rowKey="id"
          loading={loading}
          pageSize={8}
          onRowClick={(row) => onOpenFundCase?.(row.id)}
          onViewAll={() => onNavigate('/admin/ground-operations/funds')}
          actionLabel="Open funds"
        />
      </Grid>
    </Grid>
  )
}
