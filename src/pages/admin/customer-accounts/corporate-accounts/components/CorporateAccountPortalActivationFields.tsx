import { useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { Trash2 } from 'lucide-react'
import { Badge, Button, FormField, IconButton, Select } from '@/design-system/UIComponents'
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
  primaryContactUserId?: string
  secondaryContactUserId?: string
  showContactRoles?: boolean
  onTeamChange: (teamId: string) => void
  onUserIdsChange: (userIds: string[]) => void
  onSetPrimaryContact?: (userId: string) => void
  onSetSecondaryContact?: (userId: string) => void
  onClearSecondaryContact?: () => void
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
  primaryContactUserId = '',
  secondaryContactUserId = '',
  showContactRoles = false,
  onTeamChange,
  onUserIdsChange,
  onSetPrimaryContact,
  onSetSecondaryContact,
  onClearSecondaryContact,
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
        direction="row"
        spacing={1.5}
        alignItems="flex-end"
        useFlexGap
        sx={{ width: '100%', minWidth: 0, flexWrap: { xs: 'wrap', md: 'nowrap' } }}
      >
        <FormField
          label="Team"
          required
          sx={{
            width: { xs: '100%', md: 200 },
            minWidth: 0,
            flex: { md: '0 0 200px' },
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
        <FormField
          label={userLabel}
          required
          sx={{ flex: 1, minWidth: { xs: '100%', md: 180 }, width: { xs: '100%', md: 'auto' } }}
        >
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
            width: { xs: '100%', md: 'auto' },
            minWidth: { md: 128 },
            flexShrink: 0,
            alignSelf: { xs: 'stretch', md: 'flex-end' },
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
        {showContactRoles ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Mark one user as primary contact (required) and optionally one as secondary.
          </Typography>
        ) : null}
        {selectedUsers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {emptyListMessage}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {selectedUsers.map((user) => {
              const isPrimary = primaryContactUserId === user.id
              const isSecondary = secondaryContactUserId === user.id
              return (
                <Stack
                  key={user.id}
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  spacing={1}
                  sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, px: 1.25, py: 0.9 }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                        {user.label}
                      </Typography>
                      {isPrimary ? <Badge label="Primary" color="info" size="sm" /> : null}
                      {isSecondary ? <Badge label="Secondary" color="neutral" size="sm" /> : null}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Team: {user.teamName}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                    {showContactRoles ? (
                      <>
                        <Button
                          label={isPrimary ? 'Primary' : 'Set primary'}
                          size="sm"
                          variant={isPrimary ? 'soft' : 'neutral'}
                          disabled={isPrimary}
                          onClick={() => onSetPrimaryContact?.(user.id)}
                        />
                        {isSecondary ? (
                          <Button
                            label="Clear secondary"
                            size="sm"
                            variant="neutral"
                            onClick={() => onClearSecondaryContact?.()}
                          />
                        ) : (
                          <Button
                            label="Set secondary"
                            size="sm"
                            variant="neutral"
                            disabled={isPrimary}
                            onClick={() => onSetSecondaryContact?.(user.id)}
                          />
                        )}
                      </>
                    ) : null}
                    <IconButton
                      icon={<Trash2 size={14} />}
                      size="sm"
                      color="error"
                      variant="soft"
                      tooltip={`Remove ${userLabel.toLowerCase()}`}
                      onClick={() => handleRemoveUser(user.id)}
                    />
                  </Stack>
                </Stack>
              )
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  )
}

function pruneContactRoles(
  data: CorporateAccountFormData,
  teamLeaderUserIds: string[],
  assignedUserIds: string[],
): Pick<CorporateAccountFormData, 'primaryContactUserId' | 'secondaryContactUserId'> {
  const eligible = new Set([...teamLeaderUserIds, ...assignedUserIds])
  const primary =
    data.primaryContactUserId && eligible.has(data.primaryContactUserId)
      ? data.primaryContactUserId
      : ''
  const secondary =
    data.secondaryContactUserId &&
    eligible.has(data.secondaryContactUserId) &&
    data.secondaryContactUserId !== primary
      ? data.secondaryContactUserId
      : ''
  return { primaryContactUserId: primary, secondaryContactUserId: secondary }
}

export function CorporateAccountPortalActivationFields({
  data,
  onChange,
}: CorporateAccountPortalActivationFieldsProps) {
  const setPrimary = (userId: string) => {
    onChange({
      ...data,
      primaryContactUserId: userId,
      secondaryContactUserId:
        data.secondaryContactUserId === userId ? '' : data.secondaryContactUserId,
    })
  }

  const setSecondary = (userId: string) => {
    if (userId === data.primaryContactUserId) return
    onChange({ ...data, secondaryContactUserId: userId })
  }

  const clearSecondary = () => {
    onChange({ ...data, secondaryContactUserId: '' })
  }

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
        primaryContactUserId={data.primaryContactUserId}
        secondaryContactUserId={data.secondaryContactUserId}
        showContactRoles
        onTeamChange={(teamLeaderTeamId) => onChange({ ...data, teamLeaderTeamId })}
        onUserIdsChange={(teamLeaderUserIds) =>
          onChange({
            ...data,
            teamLeaderUserIds,
            ...pruneContactRoles(data, teamLeaderUserIds, data.assignedUserIds),
          })
        }
        onSetPrimaryContact={setPrimary}
        onSetSecondaryContact={setSecondary}
        onClearSecondaryContact={clearSecondary}
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
        primaryContactUserId={data.primaryContactUserId}
        secondaryContactUserId={data.secondaryContactUserId}
        showContactRoles
        onTeamChange={(assignedTeamId) => onChange({ ...data, assignedTeamId })}
        onUserIdsChange={(assignedUserIds) =>
          onChange({
            ...data,
            assignedUserIds,
            ...pruneContactRoles(data, data.teamLeaderUserIds, assignedUserIds),
          })
        }
        onSetPrimaryContact={setPrimary}
        onSetSecondaryContact={setSecondary}
        onClearSecondaryContact={clearSecondary}
      />
    </Stack>
  )
}
