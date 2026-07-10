import { Badge, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { InvoicePostingRow } from '../../data/accountsDashboardMock'

export function buildInvoicePostingColumns(): Column<InvoicePostingRow>[] {
  return [
    { key: 'invoiceNo', label: 'Invoice No.', widthSize: adminListingColumnWidthSize('code') },
    { key: 'company', label: 'Company', widthSize: adminListingColumnWidthSize('company') },
    { key: 'billingType', label: 'Billing Type', widthSize: adminListingColumnWidthSize('service') },
    { key: 'invoiceAmount', label: 'Invoice Amount', widthSize: adminListingColumnWidthSize('code') },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => {
        const lower = row.status.toLowerCase()
        const color =
          lower.includes('ready') ? 'success' : lower.includes('pending') ? 'warning' : 'info'
        return <Badge label={row.status} color={color} size="sm" />
      },
    },
  ]
}
