import type { Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { MyActivityRow } from '../../data/operationsConsultantDashboardMock'

export function buildMyActivityColumns(): Column<MyActivityRow>[] {
  return [
    { key: 'timestamp', label: 'Timestamp', widthSize: adminListingColumnWidthSize('date'), hideable: false },
    { key: 'action', label: 'Action', widthSize: adminListingColumnWidthSize('status') },
    { key: 'application', label: 'Application', widthSize: adminListingColumnWidthSize('code') },
    { key: 'result', label: 'Result', widthSize: adminListingColumnWidthSize('description') },
  ]
}
