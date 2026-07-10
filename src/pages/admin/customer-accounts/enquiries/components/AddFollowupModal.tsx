import { Box, Divider, Stack } from '@mui/material'
import { Button, FormField, Input, Modal, Select, Textarea, Toggle } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'

export interface FollowupModalValue {
  followupType: string
  followupDate: string
  followupTime: string
  discussionSummary: string
  nextAction: string
  assignedUser: string
  reminderRequired: boolean
  followupStatus: string
  outcome: string
}

const FOLLOWUP_OUTCOME_OPTIONS = [
  { label: 'Interested', value: 'interested' },
  { label: 'Quotation Sent', value: 'quotation_sent' },
  { label: 'Follow-up Required', value: 'follow_up_required' },
  { label: 'No Response', value: 'no_response' },
  { label: 'Change in Plans', value: 'change_in_plans' },
  { label: 'Not Interested', value: 'not_interested' },
]

const modalFieldRowSx = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: ADMIN_MODAL_FORM_LAYOUT.fieldGridGap,
} as const

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
      size="md"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
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
            placeholder="Select follow-up type"
            fullWidth
          />
        </FormField>
        <Box sx={modalFieldRowSx}>
          <FormField label="Follow-up Date">
            <Input
              type="date"
              value={value.followupDate}
              onChange={(next) => patch({ followupDate: next })}
              placeholder="Select date"
              fullWidth
            />
          </FormField>
          <FormField label="Follow-up Time">
            <Input
              type="time"
              value={value.followupTime}
              onChange={(next) => patch({ followupTime: next })}
              placeholder="Select time"
              fullWidth
            />
          </FormField>
        </Box>
        <FormField label="Discussion Summary">
          <Textarea
            value={value.discussionSummary}
            onChange={(next) => patch({ discussionSummary: next })}
            placeholder="Summarize what was discussed"
            minRows={2}
            fullWidth
          />
        </FormField>
        <FormField label="Next Action">
          <Textarea
            value={value.nextAction}
            onChange={(next) => patch({ nextAction: next })}
            placeholder="Describe the next step"
            minRows={2}
            fullWidth
          />
        </FormField>
        <Box sx={modalFieldRowSx}>
          <FormField label="Assigned User">
            <Input
              value={value.assignedUser}
              onChange={(next) => patch({ assignedUser: next })}
              placeholder="Who owns this follow-up"
              fullWidth
            />
          </FormField>
          <FormField label="Reminder Required">
            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 34 }}>
              <Toggle checked={value.reminderRequired} onChange={(next) => patch({ reminderRequired: next })} />
            </Box>
          </FormField>
        </Box>
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
            placeholder="Select follow-up status"
            fullWidth
          />
        </FormField>

        <Divider />

        <FormField label="Outcome">
          <Select
            value={value.outcome}
            onChange={(next) => patch({ outcome: String(next) })}
            options={FOLLOWUP_OUTCOME_OPTIONS}
            placeholder="Select outcome"
            fullWidth
          />
        </FormField>
      </Stack>
    </Modal>
  )
}
