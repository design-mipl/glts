import { Badge, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { TopRevenueRow } from '../../data/accountsDashboardMock'

export function buildTopRevenueColumns(): Column<TopRevenueRow>[] {
  return [
    { key: 'rank', label: '#', widthSize: adminListingColumnWidthSize('count'), hideable: false },
    { key: 'name', label: 'Name', widthSize: adminListingColumnWidthSize('company') },
    { key: 'revenue', label: 'Revenue', widthSize: adminListingColumnWidthSize('code') },
    {
      key: 'sharePercent',
      label: 'Share',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => <Badge label={`${row.sharePercent}%`} color="info" size="sm" />,
    },
  ]
}
