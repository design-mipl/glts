import { useMemo } from 'react'
import { Box, Stack } from '@mui/material'
import {
  FormField,
  FormSection,
  Input,
  Modal,
  Select,
  Textarea,
  Toggle,
} from '@/design-system/UIComponents'
import { FORM_CONTROL } from '@/design-system/formControl'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { AssignmentSearchableSelect } from './AssignmentSearchableSelect'
import { getEnquiryAssignmentUserOptions } from '../utils/enquiryAssignmentOptions'

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

const FOLLOWUP_TYPE_OPTIONS = [
  { label: 'Call', value: 'call' },
  { label: 'Email', value: 'email' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Internal', value: 'internal' },
]

const FOLLOWUP_STATUS_OPTIONS = [
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Missed', value: 'missed' },
  { label: 'Rescheduled', value: 'rescheduled' },
]

const FOLLOWUP_OUTCOME_OPTIONS = [
  { label: 'Interested', value: 'interested' },
  { label: 'Quotation Sent', value: 'quotation_sent' },
  { label: 'Follow-up Required', value: 'follow_up_required' },
  { label: 'No Response', value: 'no_response' },
  { label: 'Change in Plans', value: 'change_in_plans' },
  { label: 'Not Interested', value: 'not_interested' },
]

interface AddFollowupModalProps {
  open: boolean
  value: FollowupModalValue
  onClose: () => void
  onChange: (next: FollowupModalValue) => void
  onSubmit: () => void
}

export function AddFollowupModal({ open, value, onClose, onChange, onSubmit }: AddFollowupModalProps) {
  const patch = (next: Partial<FollowupModalValue>) => onChange({ ...value, ...next })
  const userOptions = useMemo(() => getEnquiryAssignmentUserOptions(), [])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Follow-up"
      subtitle="Track upcoming communication and responsibilities."
      size="lg"
      sx={{
        '& .MuiDialogContent-root': {
          px: 2.5,
        },
      }}
      footer={
        <AdminFullPageFormFooter
          onCancel={onClose}
          onSave={onSubmit}
          saveLabel="Save Follow-up"
          cancelLabel="Cancel"
        />
      }
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2, md: 0 },
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            pr: { md: 2 },
            borderRight: { md: 1 },
            borderColor: { md: 'divider' },
          }}
        >
          <FormSection columns={ADMIN_MODAL_FORM_LAYOUT.fieldColumns}>
            <FormField label="Follow-up Type">
              <Select
                value={value.followupType}
                onChange={(next) => patch({ followupType: String(next) })}
                options={FOLLOWUP_TYPE_OPTIONS}
                placeholder="Select follow-up type"
                fullWidth
              />
            </FormField>
            <FormField label="Follow-up Status">
              <Select
                value={value.followupStatus}
                onChange={(next) => patch({ followupStatus: String(next) })}
                options={FOLLOWUP_STATUS_OPTIONS}
                placeholder="Select follow-up status"
                fullWidth
              />
            </FormField>

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

            <FormField label="Assigned User">
              <AssignmentSearchableSelect
                value={value.assignedUser}
                onChange={(assignedUser) => patch({ assignedUser })}
                options={userOptions}
                placeholder="Select user"
              />
            </FormField>
            <FormField label="Reminder Required">
              <Box sx={{ display: 'flex', alignItems: 'center', minHeight: FORM_CONTROL.heightSm }}>
                <Toggle
                  checked={value.reminderRequired}
                  onChange={(next) => patch({ reminderRequired: next })}
                />
              </Box>
            </FormField>
          </FormSection>
        </Box>

        <Box sx={{ pl: { md: 2 } }}>
          <Stack spacing={ADMIN_MODAL_FORM_LAYOUT.fieldGridGap}>
            <FormField label="Discussion Summary">
              <Textarea
                value={value.discussionSummary}
                onChange={(next) => patch({ discussionSummary: next })}
                placeholder="Summarize what was discussed"
                fullWidth
              />
            </FormField>
            <FormField label="Next Action">
              <Textarea
                value={value.nextAction}
                onChange={(next) => patch({ nextAction: next })}
                placeholder="Describe the next step"
                fullWidth
              />
            </FormField>
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
        </Box>
      </Box>
    </Modal>
  )
}
