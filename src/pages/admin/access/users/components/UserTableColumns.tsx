import { Box, Typography } from '@mui/material'
import { Eye, KeyRound, PencilLine, Power, PowerOff, Shield } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { masterStatusColor, masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { teamService } from '@/shared/services/teamService'
import type { AdminPortalUser } from '@/shared/types/adminPortalUser'
import { formatUserTime } from '../utils/userListingUtils'

interface ColumnHandlers {
  onOpenDetail: (row: AdminPortalUser) => void
  onOpenEdit: (row: AdminPortalUser) => void
  onConfigurePermissions: (row: AdminPortalUser) => void
  onToggleStatus: (row: AdminPortalUser) => void
  onResetPassword: (row: AdminPortalUser) => void
}

function DateTimeCell({ iso }: { iso: string }) {
  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {formatMasterDate(iso)}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
        {formatUserTime(iso)}
      </Typography>
    </Box>
  )
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

export function buildUserColumns({
  onOpenDetail,
  onOpenEdit,
  onConfigurePermissions,
  onToggleStatus,
  onResetPassword,
}: ColumnHandlers): Column<AdminPortalUser>[] {
  return [
    {
      key: 'fullName',
      label: 'User Name',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      searchable: true,
    },
    {
      key: 'email',
      label: 'Email',
      widthSize: 'md',
      sortable: false,
      filterable: true,
    },
    {
      key: 'phone',
      label: 'Phone Number',
      widthSize: 'md',
      sortable: false,
      filterable: false,
    },
    {
      key: 'team',
      label: 'Team',
      widthSize: 'md',
      sortable: false,
      filterable: true,
      render: (_, row) => teamService.getById(row.teamId)?.name ?? '—',
    },
    {
      key: 'designation',
      label: 'Designation',
      widthSize: 'md',
      sortable: false,
      filterable: true,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
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
      key: 'lastLogin',
      label: 'Last Login',
      widthSize: 'md',
      sortable: true,
      filterable: false,
      render: (_, row) =>
        row.lastLoginAt ? <DateTimeCell iso={row.lastLoginAt} /> : (
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            —
          </Typography>
        ),
    },
    {
      key: 'createdAudit',
      label: 'Created By',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By',
      widthSize: 'md',
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
      render: (_, row) => {
        const isActive = row.status === 'active'
        const actions: RowAction[] = [
          { label: 'View User', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
          { label: 'Edit User', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
          {
            label: 'Configure Permissions',
            icon: <Shield size={14} />,
            onClick: () => onConfigurePermissions(row),
          },
          {
            label: isActive ? 'Deactivate' : 'Activate',
            icon: isActive ? <PowerOff size={14} /> : <Power size={14} />,
            onClick: () => onToggleStatus(row),
          },
          {
            label: 'Reset Password',
            icon: <KeyRound size={14} />,
            onClick: () => onResetPassword(row),
          },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
