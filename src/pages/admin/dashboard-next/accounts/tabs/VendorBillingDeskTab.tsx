import { useMemo } from 'react'
import { Stack } from '@mui/material'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { AccountsWorkListing } from '../components/AccountsWorkListing'
import type { AccountsDashboardTabProps, AccountsVendorBillingRow } from '../types'

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('active')) return 'success'
  if (s.includes('hold') || s.includes('inactive')) return 'warning'
  return 'neutral'
}

function getCellValue(row: AccountsVendorBillingRow, key: string): string {
  const value = row[key as keyof AccountsVendorBillingRow]
  return value == null ? '' : String(value)
}

/** Vendor billing desk — awaiting invoice, open bills, outstanding payables. */
export function VendorBillingDeskTab({
  data,
  loading,
  onNavigate,
}: AccountsDashboardTabProps) {
  const columns: Column<AccountsVendorBillingRow>[] = useMemo(
    () => [
      {
        key: 'vendorName',
        label: 'Vendor Name',
        widthSize: 'lg',
        sortable: true,
        filterable: true,
        searchable: true,
      },
      {
        key: 'awaitingInvoiceCount',
        label: 'Awaiting Invoice',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
      },
      {
        key: 'openBills',
        label: 'Open Bills',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
      },
      {
        key: 'outstandingAmount',
        label: 'Outstanding Amount',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'lastInvoiceDate',
        label: 'Last Invoice Date',
        widthSize: 'md',
        sortable: true,
        filterable: true,
      },
      {
        key: 'status',
        label: 'Status',
        widthSize: 'sm',
        sortable: true,
        filterable: true,
        render: (_value, row) => <Badge label={row.status} color={statusColor(row.status)} />,
      },
      {
        key: 'actions',
        label: '',
        hideable: false,
        sortable: false,
        filterable: false,
        searchable: false,
        width: 56,
        render: (_value, row) => (
          <RowActions
            actions={[
              {
                label: 'Open vendor billing',
                onClick: () => onNavigate(`/admin/finance/vendor-billing/${row.vendorId}`),
              },
              {
                label: 'Create / view bills',
                onClick: () =>
                  onNavigate(`/admin/finance/vendor-billing/${row.vendorId}?tab=awaiting-invoice`),
              },
              {
                label: 'Record payment',
                onClick: () =>
                  onNavigate(`/admin/finance/vendor-billing/${row.vendorId}?tab=payments`),
              },
            ]}
          />
        ),
      },
    ],
    [onNavigate],
  )

  return (
    <Stack spacing={1.5}>
      <AccountsWorkListing
        title="Vendor billing queue"
        description="Awaiting invoice · open bills · outstanding payables"
        rows={data.vendorBillingRows}
        columns={columns}
        getCellValue={getCellValue}
        loading={loading}
        onOpen={(row) => onNavigate(`/admin/finance/vendor-billing/${row.vendorId}`)}
        onViewAll={() => onNavigate('/admin/finance/vendor-billing')}
        viewAllLabel="Open vendor billing"
        searchPlaceholder="Search vendor, bill, status…"
        exportFileName="vendor-billing-queue"
        emptyTitle="No vendor billing rows"
        emptyDescription="Vendor charges awaiting invoice and open bills will appear here."
      />
    </Stack>
  )
}
