import type { Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { DocumentationActivityRow } from '../../data/documentationDashboardMock'

export function buildDocumentationActivityColumns(): Column<DocumentationActivityRow>[] {
  return [
    { key: 'timestamp', label: 'Timestamp', widthSize: adminListingColumnWidthSize('date'), hideable: false },
    { key: 'action', label: 'Action', widthSize: adminListingColumnWidthSize('status') },
    { key: 'application', label: 'Application', widthSize: adminListingColumnWidthSize('code') },
    { key: 'result', label: 'Result', widthSize: adminListingColumnWidthSize('description') },
  ]
}
