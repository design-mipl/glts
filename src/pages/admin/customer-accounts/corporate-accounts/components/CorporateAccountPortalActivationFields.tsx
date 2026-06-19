import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Trash2 } from 'lucide-react'
import { Button, FormField, IconButton, Select } from '@/design-system/UIComponents'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'

interface CorporateAccountPortalActivationFieldsProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
}

export function CorporateAccountPortalActivationFields({ data, onChange }: CorporateAccountPortalActivationFieldsProps) {
  const [pendingUserId, setPendingUserId] = useState<string>('')

  const teamOptions = [
    { value: '', label: 'Select team…' },
    ...teamService.listActiveOptions().map((opt) => ({ value: String(opt.value), label: opt.label })),
  ]

  const teamUsers = data.assignedTeamId
    ? adminPortalUserService.listByTeamId(data.assignedTeamId).filter((user) => user.status === 'active')
    : []

  const userOptions = [
    { value: '', label: 'Select user…' },
    ...teamUsers.map((user) => ({
    value: user.id,
    label: `${user.fullName} (${user.email})`,
    })),
  ]
  const selectedUsers = data.assignedUserIds.map((id) => {
    const user = teamUsers.find((member) => member.id === id) ?? adminPortalUserService.getById(id)
    return {
      id,
      label: user ? `${user.fullName} (${user.email})` : id,
      teamName: user ? teamService.getById(user.teamId)?.name ?? '—' : '—',
    }
  })

  const handleTeamChange = (teamId: string | number) => {
    const nextTeamId = String(teamId)
    onChange({
      ...data,
      assignedTeamId: nextTeamId,
    })
    setPendingUserId('')
  }

  const handleAddUser = () => {
    if (!data.assignedTeamId || !pendingUserId) return
    const nextAssigned = Array.from(new Set([...data.assignedUserIds, pendingUserId]))
    onChange({ ...data, assignedUserIds: nextAssigned })
    setPendingUserId('')
  }

  const handleRemoveUser = (userId: string) => {
    onChange({
      ...data,
      assignedUserIds: data.assignedUserIds.filter((id) => id !== userId),
    })
  }

  return (
    <Stack spacing={2} sx={{ width: '100%', minWidth: 0 }}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', lg: 'flex-end' }}
        useFlexGap
        sx={{ width: '100%', minWidth: 0 }}
      >
        <FormField
          label="Team"
          required
          sx={{
            width: { xs: '100%', lg: 240 },
            minWidth: 0,
            flex: { lg: '0 0 240px' },
          }}
        >
          <Select
            value={data.assignedTeamId}
            onChange={handleTeamChange}
            options={teamOptions}
            placeholder="Select team from User Management"
            fullWidth
          />
        </FormField>
        <FormField label="User" required sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Select
            value={pendingUserId}
            onChange={(value) => setPendingUserId(String(value))}
            options={userOptions}
            placeholder={data.assignedTeamId ? 'Select user from the selected team' : 'Select a team first'}
            fullWidth
            disabled={!data.assignedTeamId}
          />
        </FormField>
        <Button
          label="Add user"
          onClick={handleAddUser}
          disabled={!data.assignedTeamId || !pendingUserId}
          sx={{
            width: { xs: '100%', lg: 'auto' },
            minWidth: { lg: 110 },
            flexShrink: 0,
          }}
        />
      </Stack>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          px: 1.5,
          py: 1.25,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.75 }}>
          Added users
        </Typography>
        {selectedUsers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No users added yet.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {selectedUsers.map((user) => (
              <Stack
                key={user.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, px: 1.25, py: 0.9 }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                    {user.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Team: {user.teamName}
                  </Typography>
                </Box>
                <IconButton
                  icon={<Trash2 size={14} />}
                  size="sm"
                  color="error"
                  variant="soft"
                  tooltip="Remove user"
                  onClick={() => handleRemoveUser(user.id)}
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  )
}
