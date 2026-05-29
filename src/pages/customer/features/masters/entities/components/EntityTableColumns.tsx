import { Eye, PencilLine, Power, PowerOff, Trash2 } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { RowActions } from '@/design-system/UIComponents'
import type { EntityMaster } from '@/shared/types/entityMaster'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { entityStatusLabel, entityStatusTone } from '../config/entityStatusConfig'
import { formatEntityDate } from '../utils/entityListingUtils'

interface ColumnHandlers {
  onOpenDetail: (row: EntityMaster) => void
  onOpenEdit: (row: EntityMaster) => void
  onToggleStatus: (row: EntityMaster) => void
  onDelete: (row: EntityMaster) => void
}

export function buildEntityColumns({
  onOpenDetail,
  onOpenEdit,
  onToggleStatus,
  onDelete,
}: ColumnHandlers): Column<EntityMaster>[] {
  return [
    {
      key: 'entityName',
      label: 'Entity name',
      sortable: true,
      searchable: true,
      hideable: false,
      minWidth: 180,
    },
    {
      key: 'contactPerson',
      label: 'Contact person',
      sortable: true,
      searchable: true,
      minWidth: 160,
      render: (_, row) => row.contactPersonName,
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      searchable: true,
      minWidth: 200,
      render: (_, row) => [row.location, row.city].filter(Boolean).join(', ') || '--',
    },
    {
      key: 'country',
      label: 'Country',
      sortable: true,
      filterable: true,
      minWidth: 120,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      minWidth: 100,
      render: (_, row) => (
        <CustomerStatusChip label={entityStatusLabel[row.status]} tone={entityStatusTone[row.status]} />
      ),
    },
    {
      key: 'lastUpdated',
      label: 'Last updated',
      sortable: true,
      minWidth: 120,
      render: (_, row) => formatEntityDate(row.updatedAt),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      width: 56,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_, row) => {
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={16} />, onClick: () => onOpenDetail(row) },
          { label: 'Edit', icon: <PencilLine size={16} />, onClick: () => onOpenEdit(row) },
          {
            label: row.status === 'active' ? 'Inactivate' : 'Activate',
            icon: row.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />,
            onClick: () => onToggleStatus(row),
          },
          { label: 'Delete / archive', icon: <Trash2 size={16} />, onClick: () => onDelete(row), variant: 'destructive' },
        ]
        return <RowActions actions={actions} row={row} />
      },
    },
  ]
}
