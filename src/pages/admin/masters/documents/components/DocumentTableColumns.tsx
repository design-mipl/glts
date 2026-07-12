import { Eye, PencilLine, Power, PowerOff, Trash2 } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { DocumentMaster } from '@/shared/types/documentMaster'
import { richTextToPlainText } from '@/shared/utils/richTextUtils'
import {
  documentStatusColor,
  documentStatusLabel,
} from '../config/documentStatusConfig'
import { formatDocumentDate } from '../utils/documentListingUtils'

interface ColumnHandlers {
  onOpenDetail: (row: DocumentMaster) => void
  onOpenEdit: (row: DocumentMaster) => void
  onToggleStatus: (row: DocumentMaster) => void
  onDelete: (row: DocumentMaster) => void
}

export function buildDocumentColumns({
  onOpenDetail,
  onOpenEdit,
  onToggleStatus,
  onDelete,
}: ColumnHandlers): Column<DocumentMaster>[] {
  return [
    {
      key: 'documentType',
      label: 'Document Type',
      widthSize: adminListingColumnWidthSize('service'),
      sortable: true,
      filterable: false,
      searchable: true,
      hideable: false,
    },
    {
      key: 'description',
      label: 'Description',
      widthSize: adminListingColumnWidthSize('description'),
      sortable: false,
      filterable: false,
      searchable: true,
      render: (_, row) => {
        const plainDescription = richTextToPlainText(row.description)
        return (
          <span
            style={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 320,
            }}
            title={plainDescription}
          >
            {plainDescription || '--'}
          </span>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
      filterable: true,
      render: (_, row) => (
        <Badge
          label={documentStatusLabel[row.status]}
          color={documentStatusColor[row.status]}
          size="sm"
        />
      ),
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      filterable: false,
      render: (_, row) => formatDocumentDate(row.createdAt),
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
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
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
