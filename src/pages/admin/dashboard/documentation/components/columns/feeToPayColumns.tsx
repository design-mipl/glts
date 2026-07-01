import type { Column } from '@/design-system/UIComponents'
import { Badge } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { FeeToPayRow } from '../../data/documentationDashboardMock'

export function buildFeeToPayColumns(): Column<FeeToPayRow>[] {
  return [
    { key: 'applicant', label: 'Applicant', widthSize: adminListingColumnWidthSize('name'), hideable: false },
    { key: 'country', label: 'Country', widthSize: adminListingColumnWidthSize('country') },
    { key: 'embassyVfs', label: 'Embassy / VFS', widthSize: adminListingColumnWidthSize('jurisdiction') },
    { key: 'feeAmount', label: 'Fee Amount', widthSize: adminListingColumnWidthSize('count'), align: 'right' },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => (
        <Badge
          label={row.paymentStatus}
          color={row.paymentStatus === 'Pending' ? 'warning' : 'success'}
          size="sm"
        />
      ),
    },
    { key: 'dueTime', label: 'Due Time', widthSize: adminListingColumnWidthSize('sla') },
  ]
}
