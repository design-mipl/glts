import { Stack } from '@mui/material'
import { Button, FormField, Input, Modal, Select, Textarea, Toggle } from '@/design-system/UIComponents'

export interface FollowupModalValue {
  followupType: string
  followupDate: string
  followupTime: string
  discussionSummary: string
  nextAction: string
  assignedUser: string
  reminderRequired: boolean
  followupStatus: string
}

interface AddFollowupModalProps {
  open: boolean
  value: FollowupModalValue
  onClose: () => void
  onChange: (next: FollowupModalValue) => void
  onSubmit: () => void
}

export function AddFollowupModal({ open, value, onClose, onChange, onSubmit }: AddFollowupModalProps) {
  const patch = (next: Partial<FollowupModalValue>) => onChange({ ...value, ...next })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Follow-up"
      subtitle="Track upcoming communication and responsibilities."
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="outlined" onClick={onClose} />
          <Button label="Save Follow-up" onClick={onSubmit} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <FormField label="Follow-up Type">
          <Select
            value={value.followupType}
            onChange={(next) => patch({ followupType: String(next) })}
            options={[
              { label: 'Call', value: 'call' },
              { label: 'Email', value: 'email' },
              { label: 'Meeting', value: 'meeting' },
              { label: 'WhatsApp', value: 'whatsapp' },
              { label: 'Internal', value: 'internal' },
            ]}
            fullWidth
          />
        </FormField>
        <FormField label="Follow-up Date">
          <Input type="date" value={value.followupDate} onChange={(next) => patch({ followupDate: next })} fullWidth />
        </FormField>
        <FormField label="Follow-up Time">
          <Input type="time" value={value.followupTime} onChange={(next) => patch({ followupTime: next })} fullWidth />
        </FormField>
        <FormField label="Discussion Summary">
          <Textarea value={value.discussionSummary} onChange={(next) => patch({ discussionSummary: next })} minRows={3} fullWidth />
        </FormField>
        <FormField label="Next Action">
          <Textarea value={value.nextAction} onChange={(next) => patch({ nextAction: next })} minRows={2} fullWidth />
        </FormField>
        <FormField label="Assigned User">
          <Input value={value.assignedUser} onChange={(next) => patch({ assignedUser: next })} fullWidth />
        </FormField>
        <FormField label="Reminder Required">
          <Toggle checked={value.reminderRequired} onChange={(next) => patch({ reminderRequired: next })} />
        </FormField>
        <FormField label="Follow-up Status">
          <Select
            value={value.followupStatus}
            onChange={(next) => patch({ followupStatus: String(next) })}
            options={[
              { label: 'Scheduled', value: 'scheduled' },
              { label: 'Completed', value: 'completed' },
              { label: 'Missed', value: 'missed' },
              { label: 'Rescheduled', value: 'rescheduled' },
            ]}
            fullWidth
          />
        </FormField>
      </Stack>
    </Modal>
  )
}
