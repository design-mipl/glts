import { useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { Trash2 } from 'lucide-react'
import { Button, FormField, IconButton, Select } from '@/design-system/UIComponents'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'

interface CorporateAccountPortalActivationFieldsProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
}

interface TeamMemberAssignmentFieldsProps {
  sectionTitle: string
  teamId: string
  userIds: string[]
  userLabel: string
  teamPlaceholder: string
  userPlaceholderTeamSelected: string
  userPlaceholderNoTeam: string
  addButtonLabel: string
  listTitle: string
  emptyListMessage: string
  onTeamChange: (teamId: string) => void
  onUserIdsChange: (userIds: string[]) => void
}

function TeamMemberAssignmentFields({
  sectionTitle,
  teamId,
  userIds,
  userLabel,
  teamPlaceholder,
  userPlaceholderTeamSelected,
  userPlaceholderNoTeam,
  addButtonLabel,
  listTitle,
  emptyListMessage,
  onTeamChange,
  onUserIdsChange,
}: TeamMemberAssignmentFieldsProps) {
  const [pendingUserId, setPendingUserId] = useState('')

  const teamOptions = [
    { value: '', label: 'Select team…' },
    ...teamService.listActiveOptions().map((opt) => ({ value: String(opt.value), label: opt.label })),
  ]

  const teamUsers = teamId
    ? adminPortalUserService.listByTeamId(teamId).filter((user) => user.status === 'active')
    : []

  const userOptions = [
    { value: '', label: `Select ${userLabel.toLowerCase()}…` },
    ...teamUsers
      .filter((user) => !userIds.includes(user.id))
      .map((user) => ({
        value: user.id,
        label: `${user.fullName} (${user.email})`,
      })),
  ]

  const selectedUsers = userIds.map((id) => {
    const user = teamUsers.find((member) => member.id === id) ?? adminPortalUserService.getById(id)
    return {
      id,
      label: user ? `${user.fullName} (${user.email})` : id,
      teamName: user ? teamService.getById(user.teamId)?.name ?? '—' : '—',
    }
  })

  const handleTeamChange = (nextTeamId: string | number) => {
    onTeamChange(String(nextTeamId))
    setPendingUserId('')
  }

  const handleAddUser = () => {
    if (!teamId || !pendingUserId) return
    onUserIdsChange(Array.from(new Set([...userIds, pendingUserId])))
    setPendingUserId('')
  }

  const handleRemoveUser = (userId: string) => {
    onUserIdsChange(userIds.filter((id) => id !== userId))
  }

  return (
    <Stack spacing={1.5} sx={{ width: '100%', minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {sectionTitle}
      </Typography>
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
            value={teamId}
            onChange={handleTeamChange}
            options={teamOptions}
            placeholder={teamPlaceholder}
            fullWidth
          />
        </FormField>
        <FormField label={userLabel} required sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Select
            value={pendingUserId}
            onChange={(value) => setPendingUserId(String(value))}
            options={userOptions}
            placeholder={teamId ? userPlaceholderTeamSelected : userPlaceholderNoTeam}
            fullWidth
            disabled={!teamId}
          />
        </FormField>
        <Button
          label={addButtonLabel}
          onClick={handleAddUser}
          disabled={!teamId || !pendingUserId}
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
          {listTitle}
        </Typography>
        {selectedUsers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {emptyListMessage}
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
                  tooltip={`Remove ${userLabel.toLowerCase()}`}
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

export function CorporateAccountPortalActivationFields({ data, onChange }: CorporateAccountPortalActivationFieldsProps) {
  return (
    <Stack spacing={3} sx={{ width: '100%', minWidth: 0 }}>
      <TeamMemberAssignmentFields
        sectionTitle="Team leader"
        teamId={data.teamLeaderTeamId}
        userIds={data.teamLeaderUserIds}
        userLabel="Team leader"
        teamPlaceholder="Select team"
        userPlaceholderTeamSelected="Select team leader from the selected team"
        userPlaceholderNoTeam="Select a team first"
        addButtonLabel="Add team leader"
        listTitle="Added team leaders"
        emptyListMessage="No team leaders added yet."
        onTeamChange={(teamLeaderTeamId) => onChange({ ...data, teamLeaderTeamId })}
        onUserIdsChange={(teamLeaderUserIds) => onChange({ ...data, teamLeaderUserIds })}
      />
      <Divider />
      <TeamMemberAssignmentFields
        sectionTitle="Team"
        teamId={data.assignedTeamId}
        userIds={data.assignedUserIds}
        userLabel="User"
        teamPlaceholder="Select team"
        userPlaceholderTeamSelected="Select user from the selected team"
        userPlaceholderNoTeam="Select a team first"
        addButtonLabel="Add user"
        listTitle="Added users"
        emptyListMessage="No users added yet."
        onTeamChange={(assignedTeamId) => onChange({ ...data, assignedTeamId })}
        onUserIdsChange={(assignedUserIds) => onChange({ ...data, assignedUserIds })}
      />
    </Stack>
  )
}
