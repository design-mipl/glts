import { Box, Typography } from '@mui/material'
import { PencilLine, Trash2 } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { CardMaster } from '@/shared/types/cardMaster'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface ColumnHandlers {
  onOpenEdit: (row: CardMaster) => void
  onDelete: (row: CardMaster) => void
}

function AuditCell({ name, date }: { name: string; date: string }) {
  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {name}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
        {formatMasterDate(date)}
      </Typography>
    </Box>
  )
}

export function buildCardMasterColumns({
  onOpenEdit,
  onDelete,
}: ColumnHandlers): Column<CardMaster>[] {
  return [
    {
      key: 'cardName',
      label: 'Card Name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      filterable: false,
      searchable: true,
    },
    {
      key: 'createdAudit',
      label: 'Created By / Date',
      widthSize: adminListingColumnWidthSize('audit'),
      sortable: true,
      filterable: false,
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By / Date',
      widthSize: adminListingColumnWidthSize('audit'),
      sortable: true,
      filterable: false,
      render: (_, row) => <AuditCell name={row.updatedBy} date={row.updatedAt} />,
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
          { label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
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
