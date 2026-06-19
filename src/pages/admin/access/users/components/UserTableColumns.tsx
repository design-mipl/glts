import { Box, Typography } from '@mui/material'
import { Eye, KeyRound, PencilLine, Power, PowerOff, Shield } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { masterStatusColor, masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { teamService } from '@/shared/services/teamService'
import type { AdminPortalUser } from '@/shared/types/adminPortalUser'
import { formatUserDateTime } from '../utils/userListingUtils'

interface ColumnHandlers {
  onOpenDetail: (row: AdminPortalUser) => void
  onOpenEdit: (row: AdminPortalUser) => void
  onConfigurePermissions: (row: AdminPortalUser) => void
  onToggleStatus: (row: AdminPortalUser) => void
  onResetPassword: (row: AdminPortalUser) => void
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
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      filterable: true,
      searchable: true,
    },
    {
      key: 'email',
      label: 'Email',
      widthSize: adminListingColumnWidthSize('email'),
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
      widthSize: adminListingColumnWidthSize('assignee'),
      sortable: false,
      filterable: true,
      render: (_, row) => teamService.getById(row.teamId)?.name ?? '—',
    },
    {
      key: 'designation',
      label: 'Designation',
      widthSize: adminListingColumnWidthSize('service'),
      sortable: false,
      filterable: true,
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
      key: 'lastLogin',
      label: 'Last Login',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      filterable: false,
      render: (_, row) => (
        <Typography variant="body2" sx={{ fontSize: 13 }}>
          {row.lastLoginAt ? formatUserDateTime(row.lastLoginAt) : '—'}
        </Typography>
      ),
    },
    {
      key: 'createdAudit',
      label: 'Created By',
      widthSize: adminListingColumnWidthSize('audit'),
      sortable: true,
      filterable: true,
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By',
      widthSize: adminListingColumnWidthSize('audit'),
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
