import { Box, Stack, Typography } from '@mui/material'
import { Pencil, Power, PowerOff, Shield } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import { masterStatusColor, masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { teamService } from '@/shared/services/teamService'
import type { AdminPortalUser } from '@/shared/types/adminPortalUser'

interface UserDetailSummaryProps {
  user: AdminPortalUser
  onEdit: () => void
  onConfigurePermissions: () => void
  onToggleStatus: () => void
}

export function UserDetailSummary({
  user,
  onEdit,
  onConfigurePermissions,
  onToggleStatus,
}: UserDetailSummaryProps) {
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
                {user.email} · {teamName} · {user.designation}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Button
                label="Configure permissions"
                variant="outlined"
                color="secondary"
                startIcon={<Shield size={14} />}
                onClick={onConfigurePermissions}
              />
              <Button
                label="Edit user"
                variant="outlined"
                color="secondary"
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
            {user.isSuperAdmin ? <Badge label="Super Admin" color="info" /> : null}
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
