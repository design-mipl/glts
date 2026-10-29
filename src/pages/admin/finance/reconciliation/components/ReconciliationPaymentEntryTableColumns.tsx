import { Typography } from '@mui/material'
import { Eye } from 'lucide-react'
import { Badge, RowActions, type Column, type RowAction } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { ReconciliationPaymentEntryRow } from '@/shared/types/reconciliation'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  getReconciliationPaymentModeLabel,
  getReconciliationStatusBadgeColor,
  getReconciliationStatusLabel,
} from '../config/reconciliationListingConfig'

export type ReconciliationPaymentEntryAction = 'view' | 'reconcile'

export interface ReconciliationPaymentEntryTableColumnsParams {
  onAction: (action: ReconciliationPaymentEntryAction, row: ReconciliationPaymentEntryRow) => void
}

function moneyRender(value: number) {
  return (
    <Typography variant="body2" sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
      {formatInr(value)}
    </Typography>
  )
}

export function buildReconciliationPaymentEntryTableColumns(
  params: ReconciliationPaymentEntryTableColumnsParams,
): Column<ReconciliationPaymentEntryRow>[] {
  return [
    {
      key: 'refNo',
      label: 'GLTS reference',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
      render: (_value, row) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, fontFamily: 'monospace' }} noWrap>
          {row.refNo}
        </Typography>
      ),
    },
    {
      key: 'passengerName',
      label: 'Passenger name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'client',
      label: 'Client',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'visaCountry',
      label: 'Country',
      widthSize: adminListingColumnWidthSize('country'),
      sortable: true,
    },
    {
      key: 'servicesSummary',
      label: 'Services',
      widthSize: adminListingColumnWidthSize('applicationSummary'),
      sortable: true,
      searchable: true,
      render: (_value, row) => (
        <Typography variant="body2" noWrap sx={{ fontSize: 13 }} title={row.servicesSummary}>
          {row.servicesSummary}
        </Typography>
      ),
    },
    {
      key: 'serviceCount',
      label: 'Count',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      render: (_value, row) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {row.serviceCount}
        </Typography>
      ),
    },
    {
      key: 'paymentDate',
      label: 'Payment date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_value, row) => formatDisplayDate(row.paymentDate),
    },
    {
      key: 'paymentMode',
      label: 'Mode of payment',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: true,
      filterable: true,
      render: (_value, row) => getReconciliationPaymentModeLabel(row.paymentMode),
    },
    {
      key: 'amountInr',
      label: 'Amount in INR',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_value, row) => moneyRender(row.amountInr),
    },
    {
      key: 'staffName',
      label: 'Staff name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'reconciliationStatus',
      label: 'Reconciliation',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: true,
      render: (_value, row) => (
        <Badge
          label={getReconciliationStatusLabel(row.status)}
          color={getReconciliationStatusBadgeColor(row.status)}
          size="sm"
        />
      ),
    },
    {
      key: 'reconciledBy',
      label: 'User',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      searchable: true,
      render: (_value, row) => row.reconciledBy || '—',
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => {
        const actions: RowAction[] = [
          {
            label: row.status === 'pending' ? 'Reconcile' : 'View',
            icon: row.status === 'pending' ? undefined : <Eye size={16} />,
            onClick: () =>
              params.onAction(row.status === 'pending' ? 'reconcile' : 'view', row),
          },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
