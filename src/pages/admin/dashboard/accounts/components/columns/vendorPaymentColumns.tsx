import { Badge, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { VendorPaymentRow } from '../../data/accountsDashboardMock'
import { paymentStatusColor } from '../../utils/applyAccountsDashboardFilters'

export function buildVendorPaymentColumns(): Column<VendorPaymentRow>[] {
  return [
    { key: 'vendor', label: 'Vendor', widthSize: adminListingColumnWidthSize('company') },
    { key: 'service', label: 'Service', widthSize: adminListingColumnWidthSize('service') },
    { key: 'amount', label: 'Amount', widthSize: adminListingColumnWidthSize('code') },
    { key: 'dueDate', label: 'Due Date', widthSize: adminListingColumnWidthSize('date') },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => (
        <Badge label={row.paymentStatus} color={paymentStatusColor(row.paymentStatus)} size="sm" />
      ),
    },
  ]
}
