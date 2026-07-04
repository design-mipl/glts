import type { Column } from '@/design-system/UIComponents'
import { Badge } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { PassportTransitRow } from '../../data/operationsDashboardMock'

export function buildPassportTransitColumns(): Column<PassportTransitRow>[] {
  return [
    {
      key: 'applicant',
      label: 'Applicant',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: false,
      hideable: false,
    },
    {
      key: 'courier',
      label: 'Courier',
      widthSize: adminListingColumnWidthSize('assignee'),
      sortable: false,
    },
    {
      key: 'awbNumber',
      label: 'AWB Number',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: false,
    },
    {
      key: 'destination',
      label: 'Destination',
      widthSize: adminListingColumnWidthSize('jurisdiction'),
      sortable: false,
    },
    {
      key: 'eta',
      label: 'ETA',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: false,
    },
    {
      key: 'trackingStatus',
      label: 'Tracking Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
      render: (_, row) => <Badge label={row.trackingStatus} color="info" size="sm" />,
    },
  ]
}
