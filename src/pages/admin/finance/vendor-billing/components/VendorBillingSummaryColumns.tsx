import { Eye } from 'lucide-react'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { VendorBillingSummaryRow } from '@/shared/types/vendorBilling'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { vendorStatusColor, vendorStatusLabel } from '@/pages/admin/vendor-management/vendors/config/vendorStatusConfig'

interface Handlers {
  onOpenDetail: (row: VendorBillingSummaryRow) => void
}

function formatDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

export function buildVendorBillingSummaryColumns({ onOpenDetail }: Handlers): Column<VendorBillingSummaryRow>[] {
  return [
    {
      key: 'vendorName',
      label: 'Vendor Name',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
      searchable: true,
      hideable: false,
    },
    {
      key: 'awaitingInvoiceCount',
      label: 'Awaiting Invoice',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      align: 'right',
      render: (_, row) => row.awaitingInvoiceCount,
    },
    {
      key: 'billsCount',
      label: 'Open Bills',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      align: 'right',
    },
    {
      key: 'outstandingAmount',
      label: 'Outstanding Amount',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_, row) => formatInr(row.outstandingAmount),
    },
    {
      key: 'lastInvoiceDate',
      label: 'Last Invoice Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatDate(row.lastInvoiceDate),
    },
    {
      key: 'lastPaymentDate',
      label: 'Last Payment Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatDate(row.lastPaymentDate),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => (
        <Badge label={vendorStatusLabel[row.status]} color={vendorStatusColor[row.status]} size="sm" />
      ),
    },
    {
      key: 'actions',
      label: '',
      width: 56,
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      render: (_, row) => (
        <RowActions
          row={row}
          actions={[
            {
              label: 'Open vendor billing',
              icon: <Eye size={14} />,
              onClick: () => onOpenDetail(row),
            },
          ]}
        />
      ),
    },
  ]
}
