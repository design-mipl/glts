import { Box, Typography } from '@mui/material'
import { PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { TdsSection } from '@/shared/types/taxMaster'
import { getTdsApplicableOnLabel } from '@/shared/services/taxMasterService'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface ColumnHandlers {
  onOpenEdit: (row: TdsSection) => void
  onToggleStatus: (row: TdsSection) => void
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

export function buildTdsSectionColumns({
  onOpenEdit,
  onToggleStatus,
}: ColumnHandlers): Column<TdsSection>[] {
  return [
    { key: 'sectionCode', label: 'TDS Section', minWidth: 120, searchable: true },
    {
      key: 'ratePercent',
      label: 'TDS %',
      width: 90,
      render: (_, row) => `${row.ratePercent}%`,
    },
    {
      key: 'applicableOn',
      label: 'Applicable On',
      minWidth: 140,
      render: (_, row) => getTdsApplicableOnLabel(row.applicableOn),
    },
    {
      key: 'thresholdLimit',
      label: 'Threshold Limit',
      width: 120,
      render: (_, row) =>
        row.thresholdLimit != null ? row.thresholdLimit.toLocaleString() : '—',
    },
    {
      key: 'status',
      label: 'Status',
      width: 100,
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
      width: 150,
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By / Date',
      width: 150,
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
      width: 60,
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
