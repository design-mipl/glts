import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '@/pages/admin/operations/dashboard/components/DashboardSectionTable'
import { buildInvoicePostingColumns } from '../columns/invoicePostingColumns'
import { buildReconciliationColumns } from '../columns/reconciliationColumns'
import { buildVendorPaymentColumns } from '../columns/vendorPaymentColumns'
import type {
  InvoicePostingRow,
  ReconciliationRow,
  VendorPaymentRow,
} from '../../data/accountsDashboardMock'

export interface DailyFinancialOperationsSectionProps {
  invoicePostingQueue: InvoicePostingRow[]
  vendorPayments: VendorPaymentRow[]
  reconciliationQueue: ReconciliationRow[]
  getInvoicePostingCellValue: (row: InvoicePostingRow, key: string) => string
  getVendorPaymentCellValue: (row: VendorPaymentRow, key: string) => string
  getReconciliationCellValue: (row: ReconciliationRow, key: string) => string
  loading?: boolean
}

export function DailyFinancialOperationsSection({
  invoicePostingQueue,
  vendorPayments,
  reconciliationQueue,
  getInvoicePostingCellValue,
  getVendorPaymentCellValue,
  getReconciliationCellValue,
  loading = false,
}: DailyFinancialOperationsSectionProps) {
  const { showToast } = useToast()

  const invoiceColumns = useMemo(() => buildInvoicePostingColumns(), [])
  const vendorColumns = useMemo(() => buildVendorPaymentColumns(), [])
  const reconciliationColumns = useMemo(
    () =>
      buildReconciliationColumns({
        onResolve: (row) =>
          showToast({
            title: 'Reconciliation opened',
            description: `Reviewing ${row.referenceNo}.`,
            variant: 'info',
          }),
      }),
    [showToast],
  )

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardSectionTable
          title="Invoice posting queue"
          subtitle="Invoices awaiting posting"
          columns={invoiceColumns}
          data={invoicePostingQueue}
          rowKey="id"
          getCellValue={getInvoicePostingCellValue}
          loading={loading}
          pageSize={5}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardSectionTable
          title="Vendor payments"
          subtitle="Payments due and scheduled"
          columns={vendorColumns}
          data={vendorPayments}
          rowKey="id"
          getCellValue={getVendorPaymentCellValue}
          loading={loading}
          pageSize={5}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <DashboardSectionTable
          title="Reconciliation queue"
          subtitle="Payment and invoice matching"
          columns={reconciliationColumns}
          data={reconciliationQueue}
          rowKey="id"
          getCellValue={getReconciliationCellValue}
          loading={loading}
          pageSize={5}
        />
      </Grid>
    </Grid>
  )
}
