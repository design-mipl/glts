import { Box, Typography } from '@mui/material'
import { PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { GstRate } from '@/shared/types/taxMaster'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface ColumnHandlers {
  onOpenEdit: (row: GstRate) => void
  onToggleStatus: (row: GstRate) => void
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

export function buildGstRateColumns({
  onOpenEdit,
  onToggleStatus,
}: ColumnHandlers): Column<GstRate>[] {
  return [
    {
      key: 'slabName',
      label: 'Slab Name',
      widthSize: adminListingColumnWidthSize('name'),
      searchable: true,
    },
    {
      key: 'ratePercent',
      label: 'Rate %',
      widthSize: adminListingColumnWidthSize('count'),
      render: (_, row) => `${row.ratePercent}%`,
    },
    {
      key: 'description',
      label: 'Description',
      widthSize: adminListingColumnWidthSize('description'),
      render: (_, row) => (
        <span
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 280,
          }}
          title={row.description}
        >
          {row.description || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      render: (_, row) => (
        <Badge
          label={masterStatusLabel[row.status]}
          color={masterStatusColor[row.status]}
          size="sm"
        />
      ),
    },
    {
      key: 'createdAudit',
      label: 'Created By / Date',
      widthSize: adminListingColumnWidthSize('audit'),
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By / Date',
      widthSize: adminListingColumnWidthSize('audit'),
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
        const isActive = row.status === 'active'
        const actions: RowAction[] = [
          { label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
          {
            label: isActive ? 'Deactivate' : 'Activate',
            icon: isActive ? <PowerOff size={14} /> : <Power size={14} />,
            onClick: () => onToggleStatus(row),
          },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
