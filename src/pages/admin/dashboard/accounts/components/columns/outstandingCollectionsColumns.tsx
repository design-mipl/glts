import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { OutstandingCollectionRow } from '../../data/accountsDashboardMock'
import { collectionStatusColor } from '../../utils/applyAccountsDashboardFilters'

export interface OutstandingCollectionsColumnHandlers {
  onFollowUp: (row: OutstandingCollectionRow) => void
  onUpdateStatus: (row: OutstandingCollectionRow) => void
}

export function buildOutstandingCollectionsColumns({
  onFollowUp,
  onUpdateStatus,
}: OutstandingCollectionsColumnHandlers): Column<OutstandingCollectionRow>[] {
  return [
    { key: 'company', label: 'Company', widthSize: adminListingColumnWidthSize('company') },
    { key: 'invoice', label: 'Invoice', widthSize: adminListingColumnWidthSize('code') },
    { key: 'outstandingAmount', label: 'Outstanding Amount', widthSize: adminListingColumnWidthSize('code') },
    { key: 'followUpDate', label: 'Follow-up Date', widthSize: adminListingColumnWidthSize('date') },
    {
      key: 'collectionStatus',
      label: 'Collection Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => (
        <Badge label={row.collectionStatus} color={collectionStatusColor(row.collectionStatus)} size="sm" />
      ),
    },
    { key: 'assignedExecutive', label: 'Assigned Executive', widthSize: adminListingColumnWidthSize('assignee') },
    {
      key: 'actions',
      label: '',
      hideable: false,
      align: 'center',
      width: 56,
      render: (_, row) => (
        <RowActions
          row={row}
          actions={[
            { label: 'Record follow-up', onClick: () => onFollowUp(row) },
            { label: 'Update collection status', onClick: () => onUpdateStatus(row) },
          ]}
        />
      ),
    },
  ]
}
