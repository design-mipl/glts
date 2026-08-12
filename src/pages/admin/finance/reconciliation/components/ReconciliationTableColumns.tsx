import { Typography } from '@mui/material'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { ReconciliationItem, ReconciliationTab } from '@/shared/types/reconciliation'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import { getExpensePaymentModeLabel } from '@/pages/admin/finance/expenses/config/expenseDetailFormConfig'
import { getReconciliationStatusLabel } from '../config/reconciliationListingConfig'
import { formatReconciliationMoney } from '../utils/reconciliationListingUtils'

export interface ReconciliationColumnHandlers {
  onOpen: (row: ReconciliationItem) => void
}

function moneyRender(value: number) {
  return (
    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
      {formatReconciliationMoney(value)}
    </Typography>
  )
}

function statusRender(row: ReconciliationItem) {
  return (
    <Badge
      label={getReconciliationStatusLabel(row.status)}
      color={row.status === 'submitted' ? 'success' : 'warning'}
      size="sm"
    />
  )
}

function actionsColumn(onOpen: (row: ReconciliationItem) => void): Column<ReconciliationItem> {
  return {
    key: 'actions',
    label: '',
    widthSize: adminListingColumnWidthSize('actions'),
    sortable: false,
    filterable: false,
    searchable: false,
    hideable: false,
    render: (_: unknown, row) => (
      <RowActions
        row={row}
        actions={[
          {
            label: row.status === 'submitted' ? 'View' : 'Reconcile',
            onClick: () => onOpen(row),
          },
        ]}
      />
    ),
  }
}

function routeLabel(row: ReconciliationItem): string {
  if (!row.locationFrom && !row.locationTo) return '—'
  return `${row.locationFrom || '—'} → ${row.locationTo || '—'}`
}

function settlementRefColumn(): Column<ReconciliationItem> {
  return {
    key: 'referenceNumber',
    label: 'Book entry number',
    widthSize: adminListingColumnWidthSize('code'),
    sortable: true,
    searchable: true,
    render: (value: string) => value || '—',
  }
}

function userColumn(): Column<ReconciliationItem> {
  return {
    key: 'reconciledBy',
    label: 'User',
    widthSize: adminListingColumnWidthSize('name'),
    sortable: true,
    searchable: true,
    render: (_: unknown, row) => row.reconciledBy || row.acPersonName || '—',
  }
}

function trailingMetaColumns(
  onOpen: (row: ReconciliationItem) => void,
): Column<ReconciliationItem>[] {
  return [
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: true,
      render: (_, row) => statusRender(row),
    },
    settlementRefColumn(),
    userColumn(),
    actionsColumn(onOpen),
  ]
}

export function buildReconciliationColumns(
  tab: ReconciliationTab,
  handlers: ReconciliationColumnHandlers,
): Column<ReconciliationItem>[] {
  const { onOpen } = handlers

  if (tab === 'approved_claim_sheet') {
    return [
      {
        key: 'claimNumber',
        label: 'Claim no',
        widthSize: adminListingColumnWidthSize('code'),
        sortable: true,
        searchable: true,
        hideable: false,
        render: (value: string) => (
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, fontFamily: 'monospace' }}>
            {value}
          </Typography>
        ),
      },
      {
        key: 'refNo',
        label: 'GLTS No',
        widthSize: adminListingColumnWidthSize('code'),
        sortable: true,
        searchable: true,
      },
      { key: 'passengerName', label: 'Passenger', widthSize: adminListingColumnWidthSize('name'), sortable: true, searchable: true },
      { key: 'client', label: 'Client', widthSize: adminListingColumnWidthSize('company'), sortable: true, searchable: true },
      { key: 'visaCountry', label: 'Visa country', widthSize: adminListingColumnWidthSize('country'), sortable: true },
      { key: 'claimTeam', label: 'Team', widthSize: adminListingColumnWidthSize('name'), sortable: true },
      {
        key: 'claimReviewedAt',
        label: 'Reviewed',
        widthSize: adminListingColumnWidthSize('date'),
        sortable: true,
        render: (_, row) => formatDisplayDate(row.claimReviewedAt),
      },
      {
        key: 'total',
        label: 'Case total',
        widthSize: 'md',
        sortable: true,
        align: 'right',
        render: (_, row) => moneyRender(row.total),
      },
      {
        key: 'claimGrandTotal',
        label: 'Claim total',
        widthSize: 'md',
        sortable: true,
        align: 'right',
        render: (_, row) => moneyRender(row.claimGrandTotal),
      },
      ...trailingMetaColumns(onOpen),
    ]
  }

  if (tab === 'insurance') {
    return [
      {
        key: 'refNo',
        label: 'RefNo',
        widthSize: adminListingColumnWidthSize('code'),
        sortable: true,
        searchable: true,
        hideable: false,
        render: (value: string) => (
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, fontFamily: 'monospace' }}>
            {value}
          </Typography>
        ),
      },
      {
        key: 'gltsCreationDate',
        label: 'GLTS creation date',
        widthSize: adminListingColumnWidthSize('date'),
        sortable: true,
        render: (_, row) => formatDisplayDate(row.gltsCreationDate),
      },
      { key: 'passengerName', label: 'PassengerName', widthSize: adminListingColumnWidthSize('name'), sortable: true, searchable: true },
      { key: 'client', label: 'Client', widthSize: adminListingColumnWidthSize('company'), sortable: true, searchable: true },
      { key: 'bookedBy', label: 'BookedBy', widthSize: adminListingColumnWidthSize('name'), sortable: true },
      { key: 'consultant', label: 'Consultant', widthSize: adminListingColumnWidthSize('name'), sortable: true },
      { key: 'visaCountry', label: 'VisaCountry', widthSize: adminListingColumnWidthSize('country'), sortable: true },
      { key: 'vendor', label: 'Vendor', widthSize: adminListingColumnWidthSize('company'), sortable: true },
      {
        key: 'bookingDate',
        label: 'Insurance booking date',
        widthSize: adminListingColumnWidthSize('date'),
        sortable: true,
        render: (_, row) => formatDisplayDate(row.bookingDate),
      },
      { key: 'policyNumber', label: 'Policy number', widthSize: adminListingColumnWidthSize('code'), sortable: true, searchable: true },
      { key: 'vendorInvoiceNumber', label: 'Vendor Invoice number', widthSize: adminListingColumnWidthSize('code'), sortable: true },
      { key: 'cost', label: 'Cost', widthSize: 'md', sortable: true, align: 'right', render: (_, row) => moneyRender(row.cost) },
      { key: 'markup', label: 'Markup', widthSize: 'md', sortable: true, align: 'right', render: (_, row) => moneyRender(row.markup) },
      { key: 'total', label: 'Total', widthSize: 'md', sortable: true, align: 'right', render: (_, row) => moneyRender(row.total) },
      ...trailingMetaColumns(onOpen),
    ]
  }

  if (tab === 'ticket') {
    return [
      {
        key: 'refNo',
        label: 'RefNo',
        widthSize: adminListingColumnWidthSize('code'),
        sortable: true,
        searchable: true,
        hideable: false,
        render: (value: string) => (
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, fontFamily: 'monospace' }}>
            {value}
          </Typography>
        ),
      },
      {
        key: 'gltsCreationDate',
        label: 'GLTS Creation date',
        widthSize: adminListingColumnWidthSize('date'),
        sortable: true,
        render: (_, row) => formatDisplayDate(row.gltsCreationDate),
      },
      { key: 'passengerName', label: 'PassengerName', widthSize: adminListingColumnWidthSize('name'), sortable: true, searchable: true },
      { key: 'client', label: 'Client', widthSize: adminListingColumnWidthSize('company'), sortable: true, searchable: true },
      { key: 'bookedBy', label: 'Booker', widthSize: adminListingColumnWidthSize('name'), sortable: true },
      { key: 'consultant', label: 'Consultant', widthSize: adminListingColumnWidthSize('name'), sortable: true },
      { key: 'visaCountry', label: 'VisaCountry', widthSize: adminListingColumnWidthSize('country'), sortable: true },
      { key: 'vendor', label: 'Vendor', widthSize: adminListingColumnWidthSize('company'), sortable: true },
      {
        key: 'bookingDate',
        label: 'Ticket Booking date',
        widthSize: adminListingColumnWidthSize('date'),
        sortable: true,
        render: (_, row) => formatDisplayDate(row.bookingDate),
      },
      { key: 'cost', label: 'Cost', widthSize: 'md', sortable: true, align: 'right', render: (_, row) => moneyRender(row.cost) },
      { key: 'markup', label: 'Markup', widthSize: 'md', sortable: true, align: 'right', render: (_, row) => moneyRender(row.markup) },
      { key: 'total', label: 'Total', widthSize: 'md', sortable: true, align: 'right', render: (_, row) => moneyRender(row.total) },
      {
        key: 'locationFrom',
        label: 'Locations of Ticket bookings',
        widthSize: adminListingColumnWidthSize('applicationSummary'),
        sortable: false,
        render: (_, row) => (
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {routeLabel(row)}
          </Typography>
        ),
      },
      ...trailingMetaColumns(onOpen),
    ]
  }

  if (tab === 'courier') {
    return [
      {
        key: 'refNo',
        label: 'RefNo',
        widthSize: adminListingColumnWidthSize('code'),
        sortable: true,
        searchable: true,
        hideable: false,
        render: (value: string) => (
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, fontFamily: 'monospace' }}>
            {value}
          </Typography>
        ),
      },
      {
        key: 'gltsCreationDate',
        label: 'GLTS Creation date',
        widthSize: adminListingColumnWidthSize('date'),
        sortable: true,
        render: (_, row) => formatDisplayDate(row.gltsCreationDate),
      },
      { key: 'passengerName', label: 'PassengerName', widthSize: adminListingColumnWidthSize('name'), sortable: true, searchable: true },
      { key: 'client', label: 'Client', widthSize: adminListingColumnWidthSize('company'), sortable: true, searchable: true },
      { key: 'bookedBy', label: 'Booker', widthSize: adminListingColumnWidthSize('name'), sortable: true },
      { key: 'consultant', label: 'Consultant', widthSize: adminListingColumnWidthSize('name'), sortable: true },
      { key: 'visaCountry', label: 'VisaCountry', widthSize: adminListingColumnWidthSize('country'), sortable: true },
      { key: 'vendor', label: 'Vendor', widthSize: adminListingColumnWidthSize('company'), sortable: true },
      {
        key: 'bookingDate',
        label: 'Courier booking date',
        widthSize: adminListingColumnWidthSize('date'),
        sortable: true,
        render: (_, row) => formatDisplayDate(row.bookingDate),
      },
      { key: 'trackingNumber', label: 'Tracking no (AWB)', widthSize: adminListingColumnWidthSize('code'), sortable: true, searchable: true },
      { key: 'courierBookedBy', label: 'Courier Booked by GLTS staff', widthSize: adminListingColumnWidthSize('name'), sortable: true },
      { key: 'cost', label: 'Cost', widthSize: 'md', sortable: true, align: 'right', render: (_, row) => moneyRender(row.cost) },
      { key: 'markup', label: 'Markup', widthSize: 'md', sortable: true, align: 'right', render: (_, row) => moneyRender(row.markup) },
      { key: 'total', label: 'Total', widthSize: 'md', sortable: true, align: 'right', render: (_, row) => moneyRender(row.total) },
      {
        key: 'locationFrom',
        label: 'Locations of Courier',
        widthSize: adminListingColumnWidthSize('applicationSummary'),
        sortable: false,
        render: (_, row) => (
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {routeLabel(row)}
          </Typography>
        ),
      },
      ...trailingMetaColumns(onOpen),
    ]
  }

  // mode_of_payment
  return [
    {
      key: 'refNo',
      label: 'GLTS No',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
      render: (value: string) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, fontFamily: 'monospace' }}>
          {value}
        </Typography>
      ),
    },
    { key: 'passengerName', label: 'Passenger Name', widthSize: adminListingColumnWidthSize('name'), sortable: true, searchable: true },
    { key: 'visaCountry', label: 'Country', widthSize: adminListingColumnWidthSize('country'), sortable: true },
    { key: 'chargesName', label: 'Charges Name', widthSize: adminListingColumnWidthSize('applicationSummary'), sortable: true, searchable: true },
    { key: 'vendor', label: 'Vendor Name', widthSize: adminListingColumnWidthSize('company'), sortable: true },
    {
      key: 'paymentDate',
      label: 'Payment Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatDisplayDate(row.paymentDate),
    },
    {
      key: 'paymentMode',
      label: 'Mode of payment',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: true,
      filterable: true,
      render: (_, row) => getExpensePaymentModeLabel(row.paymentMode),
    },
    { key: 'cardUsed', label: 'Card Used', widthSize: adminListingColumnWidthSize('code'), sortable: true, render: (value: string) => value || '—' },
    {
      key: 'amountInr',
      label: 'Amount in INR',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_, row) => moneyRender(row.amountInr),
    },
    {
      key: 'foreignCurrencyAmount',
      label: 'Foreign Currency Amount',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_, row) =>
        row.foreignCurrencyAmount > 0 ? (
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {row.foreignCurrencyAmount.toFixed(2)}
          </Typography>
        ) : (
          '—'
        ),
    },
    { key: 'staffName', label: 'Staff Name who made the payments', widthSize: adminListingColumnWidthSize('name'), sortable: true },
    ...trailingMetaColumns(onOpen),
  ]
}

export function mapReconciliationRowsToGridItems(rows: ReconciliationItem[]) {
  return rows.map(row => ({
    id: row.id,
    title: row.passengerName || row.claimNumber || row.refNo,
    subtitle: row.client || row.chargesName,
    meta: row.refNo,
    status: getReconciliationStatusLabel(row.status),
    statusColor: (row.status === 'submitted' ? 'success' : 'warning') as 'success' | 'warning',
  }))
}
