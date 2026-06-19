import { Stack } from '@mui/material'
import { Button, FormField, Input, Modal, Select, Textarea } from '@/design-system/UIComponents'
import { enquiryPriorityOptions } from '../config/enquiryFilterConfig'

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
          <Input value={value.assignedTeam} onChange={(next) => patch({ assignedTeam: next })} placeholder="e.g. Marine Ops, Corporate Ops" fullWidth />
        </FormField>
        <FormField label="Assigned User">
          <Input value={value.assignedUser} onChange={(next) => patch({ assignedUser: next })} placeholder="Enter assignee name" fullWidth />
        </FormField>
        <FormField label="Branch">
          <Input value={value.branch} onChange={(next) => patch({ branch: next })} placeholder="e.g. Mumbai, Dubai" fullWidth />
        </FormField>
        <FormField label="Priority">
          <Select
            value={value.priority}
            onChange={(next) => patch({ priority: String(next) })}
            options={enquiryPriorityOptions.slice(1)}
            placeholder="Select priority"
            fullWidth
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
