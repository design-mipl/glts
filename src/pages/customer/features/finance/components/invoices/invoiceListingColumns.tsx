import { Typography } from '@mui/material'
import { Download, Eye } from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'
import { RowActions, type Column } from '@/design-system/UIComponents'
import type { Toast } from '@/design-system/UIComponents'
import type { InvoiceListingRow } from '../../types/customerFinance.types'
import { FinanceStatusBadges } from '../shared/FinanceStatusBadges'
import { FinanceAmountCell } from '../shared/FinanceAmountCell'
import { getCustomerInvoiceTypeLabel } from '../../utils/customerInvoiceTypeLabels'

type ToastFn = (toast: Omit<Toast, 'id'>) => void

export interface InvoiceListingColumnsParams {
  base: string
  navigate: NavigateFunction
  showToast: ToastFn
}

export function buildInvoiceListingColumns({
  base,
  navigate,
  showToast,
}: InvoiceListingColumnsParams): Column<InvoiceListingRow>[] {
  return [
    {
      key: 'invoiceNumber',
      label: 'Invoice Number',
      sortable: true,
      width: 150,
      render: (_: unknown, row: InvoiceListingRow) => (
        <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ fontSize: 13 }}>
          {row.invoice.invoiceId}
        </Typography>
      ),
    },
    {
      key: 'invoiceType',
      label: 'Invoice Type',
      sortable: true,
      width: 200,
      render: (_: unknown, row: InvoiceListingRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {getCustomerInvoiceTypeLabel(row.invoice)}
        </Typography>
      ),
    },
    {
      key: 'bookers',
      label: 'Booker(s)',
      sortable: true,
      width: 140,
      render: (_: unknown, row: InvoiceListingRow) => (
        <Typography variant="body2" sx={{ fontSize: 13 }} noWrap>
          {row.bookers.join(', ') || '—'}
        </Typography>
      ),
    },
    {
      key: 'passengerCrewCount',
      label: 'Pax / Crew',
      sortable: true,
      width: 90,
    },
    { key: 'invoiceDate', label: 'Invoice Date', sortable: true, width: 110 },
    { key: 'dueDate', label: 'Due Date', sortable: true, width: 110 },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      sortable: true,
      width: 120,
      render: (_: unknown, row: InvoiceListingRow) => (
        <FinanceAmountCell amount={row.invoice.totals.finalAmount} />
      ),
    },
    {
      key: 'paidAmount',
      label: 'Paid Amount',
      sortable: true,
      width: 120,
      render: (_: unknown, row: InvoiceListingRow) => <FinanceAmountCell amount={row.paidAmount} />,
    },
    {
      key: 'outstandingAmount',
      label: 'Outstanding',
      sortable: true,
      width: 120,
      render: (_: unknown, row: InvoiceListingRow) => (
        <FinanceAmountCell
          amount={row.outstandingAmount}
          fontWeight={600}
          color={row.outstandingAmount > 0 ? 'error.main' : undefined}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: 180,
      render: (_: unknown, row: InvoiceListingRow) => <FinanceStatusBadges invoice={row.invoice} />,
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      width: 56,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_: unknown, row: InvoiceListingRow) => (
        <RowActions
          row={row}
          actions={[
            {
              label: 'View invoice',
              icon: <Eye size={16} />,
              onClick: () => navigate(`${base}/finance/invoices/${row.invoice.id}`),
            },
            {
              label: 'Download PDF',
              icon: <Download size={16} />,
              onClick: () =>
                showToast({
                  title: 'Download started',
                  description: `${row.invoice.invoiceId}.pdf`,
                  variant: 'success',
                }),
            },
          ]}
        />
      ),
    },
  ]
}
