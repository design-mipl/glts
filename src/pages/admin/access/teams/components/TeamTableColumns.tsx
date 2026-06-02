import { Box, Typography } from '@mui/material'
import { Eye, PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { masterStatusColor, masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { teamService } from '@/shared/services/teamService'
import type { TeamMaster } from '@/shared/types/teamMaster'

interface ColumnHandlers {
  onOpenDetail: (row: TeamMaster) => void
  onOpenEdit: (row: TeamMaster) => void
  onToggleStatus: (row: TeamMaster) => void
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

export function buildTeamColumns({
  onOpenDetail,
  onOpenEdit,
  onToggleStatus,
}: ColumnHandlers): Column<TeamMaster>[] {
  return [
    {
      key: 'name',
      label: 'Team Name',
      minWidth: 160,
      sortable: true,
      filterable: true,
      searchable: true,
    },
    {
      key: 'description',
      label: 'Description',
      minWidth: 220,
      sortable: false,
      filterable: false,
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
      key: 'totalUsers',
      label: 'Total Users',
      width: 110,
      sortable: true,
      filterable: false,
      render: (_, row) => teamService.countUsers(row.id),
    },
    {
      key: 'status',
      label: 'Status',
      width: 100,
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
      key: 'createdAudit',
      label: 'Created By',
      width: 150,
      sortable: true,
      filterable: true,
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By',
      width: 150,
      sortable: true,
      filterable: true,
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
          { label: 'View Detail', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
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
