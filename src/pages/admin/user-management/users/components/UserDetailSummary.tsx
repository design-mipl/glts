import { Box, Stack, Typography } from '@mui/material'
import { Pencil, Power, PowerOff } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import { masterStatusColor, masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { departmentService } from '@/shared/services/departmentService'
import { teamService } from '@/shared/services/teamService'
import {
  ADMIN_PORTAL_USER_TYPE_LABEL,
  type AdminPortalUser,
} from '@/shared/types/adminPortalUser'

interface UserDetailSummaryProps {
  user: AdminPortalUser
  onEdit: () => void
  onToggleStatus: () => void
}

export function UserDetailSummary({
  user,
  onEdit,
  onToggleStatus,
}: UserDetailSummaryProps) {
  const departmentName = departmentService.getById(user.departmentId)?.name ?? '—'
  const teamName = teamService.getById(user.teamId)?.name ?? '—'
  const isActive = user.status === 'active'

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ADMIN_PORTAL_USER_TYPE_LABEL[user.userType]} · {user.email || '—'} ·{' '}
                {departmentName} · {teamName} · {user.designation}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Button
                label="Edit user"
                variant="neutral"
                startIcon={<Pencil size={14} />}
                onClick={onEdit}
              />
              <Button
                label={isActive ? 'Deactivate' : 'Activate'}
                variant="outlined"
                color={isActive ? 'error' : 'primary'}
                startIcon={isActive ? <PowerOff size={14} /> : <Power size={14} />}
                onClick={onToggleStatus}
              />
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.75} flexWrap="wrap">
            <Badge
              label={masterStatusLabel[user.status]}
              color={masterStatusColor[user.status]}
            />
            {user.isSuperAdmin || user.userType === 'super_admin' ? (
              <Badge label="Super Admin" color="info" />
            ) : null}
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
