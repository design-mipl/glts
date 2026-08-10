import { Stack } from '@mui/material'
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
import { getInvoiceOpenItemFlags } from '../utils/invoiceDetailSideTabs'
import {
  getListingCreditNoteNumber,
  getListingInvoiceNumber,
} from '../utils/invoiceListingUtils'
import { buildInvoiceRowActions, type InvoiceRowActionHandlers } from '../utils/invoiceRowActions'
import { formatDisplayDate, formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'

export function buildInvoiceColumns(handlers: InvoiceRowActionHandlers): Column<Invoice>[] {
  return [
    {
      key: 'invoiceId',
      label: 'Invoice ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
      render: (_, row) => getListingInvoiceNumber(row),
    },
    {
      key: 'creditNoteNumber',
      label: 'Credit Note Number',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      render: (_, row) => getListingCreditNoteNumber(row),
    },
    {
      key: 'invoiceType',
      label: 'Invoice Type',
      widthSize: adminListingColumnWidthSize('name'),
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
      key: 'openItems',
      label: 'Unbilled / Refund',
      widthSize: adminListingColumnWidthSize('name'),
      filterable: true,
      render: (_, row) => {
        const flags = getInvoiceOpenItemFlags(row)
        if (!flags.hasUnbilledExpenses && !flags.hasPendingRefunds) return '—'
        return (
          <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {flags.hasUnbilledExpenses ? (
              <Badge label="Unbilled expenses" color="warning" size="sm" />
            ) : null}
            {flags.hasPendingRefunds ? <Badge label="Refund" color="error" size="sm" /> : null}
          </Stack>
        )
      },
    },
    {
      key: 'gstFiled',
      label: 'GST',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) =>
        row.invoiceType === 'credit_note' || row.invoiceStatus === 'draft' ? (
          '—'
        ) : (
          <Badge
            label={row.gstFiledAt ? `Filed ${row.gstFiledAt}` : 'Not filed'}
            color={row.gstFiledAt ? 'success' : 'neutral'}
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
      render: (_, row) => formatDisplayDate(row.invoiceDate),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatDisplayDate(row.dueDate),
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatDisplayDateTime(row.lastUpdated),
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
