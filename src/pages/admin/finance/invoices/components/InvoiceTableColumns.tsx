import type { Column } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { formatInr, getInvoiceApplicationCount } from '@/shared/utils/invoiceCalculations'
import {
  invoiceStatusBadgeColor,
  invoiceStatusLabel,
  invoiceTypeColor,
  invoiceTypeLabel,
  paymentStatusBadgeColor,
  paymentStatusLabel,
} from '../config/invoiceStatusConfig'
import { buildInvoiceRowActions, type InvoiceRowActionHandlers } from '../utils/invoiceRowActions'

export function buildInvoiceColumns(handlers: InvoiceRowActionHandlers): Column<Invoice>[] {
  return [
    { key: 'invoiceId', label: 'Invoice ID', sortable: true, searchable: true, hideable: false, minWidth: 130 },
    {
      key: 'invoiceType',
      label: 'Invoice Type',
      filterable: true,
      minWidth: 160,
      render: (_, row) => (
        <Badge label={invoiceTypeLabel[row.invoiceType]} color={invoiceTypeColor[row.invoiceType]} size="sm" />
      ),
    },
    { key: 'companyName', label: 'Company Name', sortable: true, searchable: true, minWidth: 180 },
    { key: 'billingEntity', label: 'Billing Entity', sortable: true, searchable: true, minWidth: 180 },
    { key: 'vessel', label: 'Vessel', sortable: true, searchable: true, minWidth: 140 },
    {
      key: 'gltsReference',
      label: 'GLTS Reference',
      sortable: true,
      searchable: true,
      minWidth: 150,
      render: (_, row) => row.gltsReferences.join(', ') || '—',
    },
    {
      key: 'batchId',
      label: 'Batch ID',
      sortable: true,
      searchable: true,
      minWidth: 140,
      render: (_, row) => row.batchIds.join(', ') || '—',
    },
    {
      key: 'totalApplications',
      label: 'Total Applications',
      sortable: true,
      align: 'right',
      width: 120,
      render: (_, row) => String(getInvoiceApplicationCount(row)),
    },
    {
      key: 'invoiceAmount',
      label: 'Invoice Amount',
      sortable: true,
      align: 'right',
      minWidth: 120,
      render: (_, row) => formatInr(row.totals.finalAmount),
    },
    {
      key: 'advanceAdjusted',
      label: 'Advance Adjusted',
      sortable: true,
      align: 'right',
      minWidth: 120,
      render: (_, row) => formatInr(row.totals.advanceAdjusted),
    },
    {
      key: 'balancePayable',
      label: 'Balance Payable',
      sortable: true,
      align: 'right',
      minWidth: 120,
      render: (_, row) => formatInr(row.totals.balancePayable),
    },
    {
      key: 'invoiceStatus',
      label: 'Invoice Status',
      filterable: true,
      minWidth: 130,
      render: (_, row) => (
        <Badge
          label={invoiceStatusLabel[row.invoiceStatus]}
          color={invoiceStatusBadgeColor(row.invoiceStatus)}
          size="sm"
        />
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      filterable: true,
      minWidth: 120,
      render: (_, row) => (
        <Badge
          label={paymentStatusLabel[row.paymentStatus]}
          color={paymentStatusBadgeColor(row.paymentStatus)}
          size="sm"
        />
      ),
    },
    { key: 'invoiceDate', label: 'Invoice Date', sortable: true, minWidth: 110 },
    { key: 'dueDate', label: 'Due Date', sortable: true, minWidth: 110 },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      sortable: true,
      minWidth: 110,
      render: (_, row) => new Date(row.lastUpdated).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => <RowActions row={row} actions={buildInvoiceRowActions(row, handlers)} />,
    },
  ]
}
