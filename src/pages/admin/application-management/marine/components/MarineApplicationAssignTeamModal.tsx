import { useEffect, useMemo, useState } from 'react'
import { Stack } from '@mui/material'
import { Button, FormField, Modal, Select } from '@/design-system/UIComponents'
import { isBulkRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { resolveApplicationCompanyName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'

interface MarineApplicationAssignTeamModalProps {
  open: boolean
  record: MarineApplicationRow | null
  onClose: () => void
  onSubmit: (teamId: string, userId: string) => void
}

export function MarineApplicationAssignTeamModal({
  open,
  record,
  onClose,
  onSubmit,
}: MarineApplicationAssignTeamModalProps) {
  const [teamId, setTeamId] = useState('')
  const [userId, setUserId] = useState('')

  const teamOptions = useMemo(() => teamService.listActiveOptions(), [open])

  const userOptions = useMemo(() => {
    if (!teamId) return []
    return adminPortalUserService
      .listByTeamId(teamId)
      .filter(user => user.status === 'active')
      .map(user => ({ value: user.id, label: user.fullName }))
  }, [teamId])

  useEffect(() => {
    if (!open || !record) return
    const defaultTeamId =
      record.assignedTeamId && teamOptions.some(option => option.value === record.assignedTeamId)
        ? record.assignedTeamId
        : (teamOptions[0]?.value ?? '')
    setTeamId(defaultTeamId)

    const members = defaultTeamId
      ? adminPortalUserService
          .listByTeamId(defaultTeamId)
          .filter(user => user.status === 'active')
      : []
    const defaultUserId =
      record.assignedUserId && members.some(user => user.id === record.assignedUserId)
        ? record.assignedUserId
        : (members[0]?.id ?? '')
    setUserId(defaultUserId)
  }, [open, record, teamOptions])

  useEffect(() => {
    if (!teamId) {
      setUserId('')
      return
    }
    if (userOptions.some(option => option.value === userId)) return
    setUserId(userOptions[0]?.value ?? '')
  }, [teamId, userOptions, userId])

  if (!record) return null

  const subtitle = isBulkRow(record)
    ? `${record.id} · ${resolveApplicationCompanyName(record)} · ${record.totalApplicants} travelers`
    : `${record.id} · ${record.applicantName}`

  const canSubmit = Boolean(teamId && userId)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign team"
      subtitle={subtitle}
      size="sm"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Save assignment" onClick={() => onSubmit(teamId, userId)} disabled={!canSubmit} />
        </Stack>
      }
    >
      <Stack spacing={1.5} sx={{ pt: 0.5 }}>
        <FormField label="Team" required>
          <Select
            value={teamId}
            onChange={value => setTeamId(String(value))}
            options={teamOptions}
            placeholder="Select team"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Assigned user" required>
          <Select
            value={userId}
            onChange={value => setUserId(String(value))}
            options={userOptions}
            placeholder={teamId ? 'Select assigned user' : 'Select a team first'}
            size="sm"
            fullWidth
            disabled={!teamId || userOptions.length === 0}
          />
        </FormField>
      </Stack>
    </Modal>
  )
}
