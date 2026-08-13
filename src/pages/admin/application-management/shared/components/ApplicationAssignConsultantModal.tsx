import { useEffect, useMemo, useState } from 'react'
import { Stack } from '@mui/material'
import { Button, Checkbox, FormField, Modal, Select } from '@/design-system/UIComponents'
import {
  type ApplicationPriority,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { isBulkRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { resolveApplicationCompanyName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'
import { APPLICATION_PRIORITY_OPTIONS } from '../config/applicationConsultantConfig'
import type { ApplicationConsultantAssignmentPayload } from '../utils/applicationConsultantUtils'

type AssignableApplicationRow = SingleApplicationRow | BulkBatchRow

interface ApplicationAssignConsultantModalProps {
  open: boolean
  record: AssignableApplicationRow | null
  onClose: () => void
  onSubmit: (payload: ApplicationConsultantAssignmentPayload) => void
}

export function ApplicationAssignConsultantModal({
  open,
  record,
  onClose,
  onSubmit,
}: ApplicationAssignConsultantModalProps) {
  const [teamId, setTeamId] = useState('')
  const [userId, setUserId] = useState('')
  const [priority, setPriority] = useState<ApplicationPriority>('Medium')
  const [isVip, setIsVip] = useState(false)

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
      ? adminPortalUserService.listByTeamId(defaultTeamId).filter(user => user.status === 'active')
      : []
    const defaultUserId =
      record.assignedUserId && members.some(user => user.id === record.assignedUserId)
        ? record.assignedUserId
        : (members[0]?.id ?? '')
    setUserId(defaultUserId)
    setPriority(record.priority ?? 'Medium')
    setIsVip(Boolean(record.isVip))
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

  const canSubmit = Boolean(teamId && userId && priority)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign consultant"
      subtitle={subtitle}
      size="sm"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Save assignment"
            onClick={() => onSubmit({ teamId, userId, priority, isVip })}
            disabled={!canSubmit}
          />
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
        <FormField label="Consultant" required>
          <Select
            value={userId}
            onChange={value => setUserId(String(value))}
            options={userOptions}
            placeholder={teamId ? 'Select consultant' : 'Select a team first'}
            size="sm"
            fullWidth
            disabled={!teamId || userOptions.length === 0}
          />
        </FormField>
        <FormField label="Priority" required>
          <Select
            value={priority}
            onChange={value => setPriority(String(value) as ApplicationPriority)}
            options={APPLICATION_PRIORITY_OPTIONS}
            placeholder="Select priority"
            size="sm"
            fullWidth
          />
        </FormField>
        <Checkbox
          label="Mark as VIP (Green Star)"
          checked={isVip}
          onChange={setIsVip}
          size="sm"
        />
      </Stack>
    </Modal>
  )
}
