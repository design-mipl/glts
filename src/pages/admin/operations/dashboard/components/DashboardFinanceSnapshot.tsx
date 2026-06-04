import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import {
  Badge,
  BaseCard,
  DataTable,
} from '@/design-system/UIComponents'
import type { Column, TableState } from '@/design-system/UIComponents'
import { INITIAL_TABLE_STATE } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import type { FinanceKpi, RecentInvoiceRow } from '../data/operationsDashboardMock'

function invoiceStatusColor(status: RecentInvoiceRow['status']): 'success' | 'warning' | 'error' {
  if (status === 'paid') return 'success'
  if (status === 'pending') return 'warning'
  return 'error'
}

function invoiceStatusLabel(status: RecentInvoiceRow['status']): string {
  if (status === 'paid') return 'Paid'
  if (status === 'pending') return 'Pending'
  return 'Overdue'
}

const INVOICE_TABLE_STATE: TableState = {
  ...INITIAL_TABLE_STATE,
  pageSize: 5,
}

const INVOICE_COLUMNS: Column<RecentInvoiceRow>[] = [
  { key: 'invoiceNumber', label: 'Invoice #', minWidth: 120, hideable: false },
  { key: 'customer', label: 'Customer', minWidth: 160 },
  { key: 'amount', label: 'Amount', minWidth: 100, align: 'right' },
  {
    key: 'status',
    label: 'Status',
    minWidth: 90,
    render: (_, row) => (
      <Badge label={invoiceStatusLabel(row.status)} color={invoiceStatusColor(row.status)} size="sm" />
    ),
  },
  { key: 'dueDate', label: 'Due date', minWidth: 100 },
]

export interface DashboardFinanceSnapshotProps {
  kpis: FinanceKpi[]
  invoices: RecentInvoiceRow[]
}

export function DashboardFinanceSnapshot({ kpis, invoices }: DashboardFinanceSnapshotProps) {
  const [state, setState] = useState<TableState>(INVOICE_TABLE_STATE)
  const columns = useMemo(() => INVOICE_COLUMNS, [])

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        {kpis.map((kpi) => (
          <Grid key={kpi.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <BaseCard hoverable sx={{ height: '100%' }}>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
                >
                  {kpi.label}
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                  {kpi.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                  {kpi.subtitle}
                </Typography>
              </Box>
            </BaseCard>
          </Grid>
        ))}
      </Grid>

      <BaseCard sx={{ overflow: 'hidden' }}>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Recent invoices
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Latest billing activity across channels
          </Typography>
        </Box>
        <DataTable
          columns={columns}
          data={invoices}
          rowKey="id"
          state={state}
          onStateChange={setState}
          embedded
          hideToolbar
          hidePagination
          stickyHeader
          enableColumnSort={false}
          showColumnSearch={false}
        />
      </BaseCard>
    </Stack>
  )
}
