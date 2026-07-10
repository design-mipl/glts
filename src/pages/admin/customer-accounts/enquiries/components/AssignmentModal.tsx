import { useMemo } from 'react'
import { Stack } from '@mui/material'
import { Button, FormField, Input, Modal, Textarea } from '@/design-system/UIComponents'
import { AssignmentSearchableSelect } from './AssignmentSearchableSelect'
import {
  getEnquiryAssignmentBranchOptions,
  getEnquiryAssignmentPriorityOptions,
  getEnquiryAssignmentTeamOptions,
  getEnquiryAssignmentUserOptions,
} from '../utils/enquiryAssignmentOptions'

export interface AssignmentModalValue {
  assignedTeam: string
  assignedUser: string
  branch: string
  priority: string
  slaTarget: string
  assignmentNotes: string
}

interface AssignmentModalProps {
  open: boolean
  value: AssignmentModalValue
  onClose: () => void
  onChange: (next: AssignmentModalValue) => void
  onSubmit: () => void
}

export function AssignmentModal({ open, value, onClose, onChange, onSubmit }: AssignmentModalProps) {
  const patch = (next: Partial<AssignmentModalValue>) => onChange({ ...value, ...next })

  const teamOptions = useMemo(() => getEnquiryAssignmentTeamOptions(), [])
  const userOptions = useMemo(
    () => getEnquiryAssignmentUserOptions(value.assignedTeam),
    [value.assignedTeam],
  )
  const branchOptions = useMemo(() => getEnquiryAssignmentBranchOptions(), [])
  const priorityOptions = useMemo(() => getEnquiryAssignmentPriorityOptions(), [])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assignment & Ownership"
      subtitle="Assign team, user, priority and SLA target."
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Save Assignment" onClick={onSubmit} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <FormField label="Assigned Team">
          <AssignmentSearchableSelect
            value={value.assignedTeam}
            onChange={(assignedTeam) => patch({ assignedTeam })}
            options={teamOptions}
            placeholder="Select team"
          />
        </FormField>
        <FormField label="Assigned User">
          <AssignmentSearchableSelect
            value={value.assignedUser}
            onChange={(assignedUser) => patch({ assignedUser })}
            options={userOptions}
            placeholder="Select user"
          />
        </FormField>
        <FormField label="Branch">
          <AssignmentSearchableSelect
            value={value.branch}
            onChange={(branch) => patch({ branch })}
            options={branchOptions}
            placeholder="Select branch"
          />
        </FormField>
        <FormField label="Priority">
          <AssignmentSearchableSelect
            value={value.priority}
            onChange={(priority) => patch({ priority })}
            options={priorityOptions}
            placeholder="Select priority"
          />
        </FormField>
        <FormField label="SLA Target">
          <Input type="date" value={value.slaTarget} onChange={(next) => patch({ slaTarget: next })} placeholder="Select SLA target date" fullWidth />
        </FormField>
        <FormField label="Assignment Notes">
          <Textarea
            value={value.assignmentNotes}
            onChange={(next) => patch({ assignmentNotes: next })}
            placeholder="Add context for this assignment"
            minRows={3}
            fullWidth
          />
        </FormField>
      </Stack>
    </Modal>
  )
}
