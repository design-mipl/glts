import { Typography } from '@mui/material'
import { Eye, PencilLine } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { WorkflowMaster } from '@/shared/types/workflowMaster'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface ColumnHandlers {
  onOpenView: (row: WorkflowMaster) => void
  onOpenEdit: (row: WorkflowMaster) => void
}

export function buildWorkflowColumns({
  onOpenView,
  onOpenEdit,
}: ColumnHandlers): Column<WorkflowMaster>[] {
  return [
    {
      key: 'name',
      label: 'Workflow Name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      filterable: false,
      searchable: true,
    },
    {
      key: 'description',
      label: 'Description',
      widthSize: adminListingColumnWidthSize('description'),
      sortable: false,
      filterable: false,
      searchable: true,
      render: (_, row) => (
        <Typography
          variant="body2"
          sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={row.description}
        >
          {row.description || '—'}
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
        <Badge
          label={masterStatusLabel[row.status]}
          color={masterStatusColor[row.status]}
          size="sm"
        />
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
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenView(row) },
          { label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
