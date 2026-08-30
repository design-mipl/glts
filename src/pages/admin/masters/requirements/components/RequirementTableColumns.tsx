import { Typography } from '@mui/material'
import { PencilLine, Power, PowerOff, Trash2 } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { RequirementMaster } from '@/shared/types/requirementMaster'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface ColumnHandlers {
  onOpenEdit: (row: RequirementMaster) => void
  onToggleStatus: (row: RequirementMaster) => void
  onDelete: (row: RequirementMaster) => void
}

export function buildRequirementColumns({
  onOpenEdit,
  onToggleStatus,
  onDelete,
}: ColumnHandlers): Column<RequirementMaster>[] {
  return [
    {
      key: 'name',
      label: 'Name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      filterable: false,
      searchable: true,
      hideable: false,
    },
    {
      key: 'questions',
      label: 'Questions',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      filterable: false,
      render: (_, row) => (
        <Typography variant="body2" sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
          {row.questions.length}
        </Typography>
      ),
    },
    {
      key: 'documents',
      label: 'Documents',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      filterable: false,
      render: (_, row) => (
        <Typography variant="body2" sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
          {row.documents.length}
        </Typography>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
      filterable: true,
      render: (_, row) => (
        <Badge label={masterStatusLabel[row.status]} color={masterStatusColor[row.status]} size="sm" />
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      filterable: false,
      render: (_, row) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {formatMasterDate(row.updatedAt)}
        </Typography>
      ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      render: (_, row) => {
        const isActive = row.status === 'active'
        const actions: RowAction[] = [
          { label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
          {
            label: isActive ? 'Deactivate' : 'Activate',
            icon: isActive ? <PowerOff size={14} /> : <Power size={14} />,
            onClick: () => onToggleStatus(row),
          },
          {
            label: 'Delete',
            icon: <Trash2 size={14} />,
            onClick: () => onDelete(row),
            variant: 'destructive',
          },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
