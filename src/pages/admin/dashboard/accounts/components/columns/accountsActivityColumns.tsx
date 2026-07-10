import { type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { AccountsActivityRow } from '../../data/accountsDashboardMock'

export function buildAccountsActivityColumns(): Column<AccountsActivityRow>[] {
  return [
    { key: 'timestamp', label: 'Timestamp', widthSize: adminListingColumnWidthSize('audit') },
    { key: 'user', label: 'User', widthSize: adminListingColumnWidthSize('assignee') },
    { key: 'action', label: 'Action', widthSize: adminListingColumnWidthSize('description') },
    { key: 'reference', label: 'Reference', widthSize: adminListingColumnWidthSize('code') },
  ]
}
