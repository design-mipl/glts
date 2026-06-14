import type { Column } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
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
    {
      key: 'invoiceId',
      label: 'Invoice ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
    },
    {
      key: 'invoiceType',
      label: 'Invoice Type',
      widthSize: adminListingColumnWidthSize('service'),
      filterable: true,
      render: (_, row) => (
        <Badge label={invoiceTypeLabel[row.invoiceType]} color={invoiceTypeColor[row.invoiceType]} size="sm" />
      ),
    },
    {
      key: 'companyName',
      label: 'Company Name',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'billingEntity',
      label: 'Billing Entity',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'vessel',
      label: 'Vessel',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'gltsReference',
      label: 'GLTS Reference',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      render: (_, row) => row.gltsReferences.join(', ') || '—',
    },
    {
      key: 'batchId',
      label: 'Batch ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      render: (_, row) => row.batchIds.join(', ') || '—',
    },
    {
      key: 'totalApplications',
      label: 'Total Applications',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      align: 'right',
      render: (_, row) => String(getInvoiceApplicationCount(row)),
    },
    {
      key: 'invoiceAmount',
      label: 'Invoice Amount',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_, row) => formatInr(row.totals.finalAmount),
    },
    {
      key: 'advanceAdjusted',
      label: 'Advance Adjusted',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_, row) => formatInr(row.totals.advanceAdjusted),
    },
    {
      key: 'balancePayable',
      label: 'Balance Payable',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_, row) => formatInr(row.totals.balancePayable),
    },
    {
      key: 'invoiceStatus',
      label: 'Invoice Status',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
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
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => (
        <Badge
          label={paymentStatusLabel[row.paymentStatus]}
          color={paymentStatusBadgeColor(row.paymentStatus)}
          size="sm"
        />
      ),
    },
    {
      key: 'invoiceDate',
      label: 'Invoice Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
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
      render: (_, row) => <RowActions row={row} actions={buildInvoiceRowActions(row, handlers)} />,
    },
  ]
}
