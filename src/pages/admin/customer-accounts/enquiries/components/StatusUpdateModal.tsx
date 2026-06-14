import { Stack } from '@mui/material'
import { Button, FormField, Modal, Select, Textarea } from '@/design-system/UIComponents'
import type { EnquiryStatus } from '@/shared/types/enquiry'
import { enquiryStatusLabel } from '../config/enquiryStatusConfig'

const REASON_REQUIRED_STATUSES: EnquiryStatus[] = ['closed', 'rejected', 'on_hold']

interface StatusUpdateModalProps {
  open: boolean
  value: string
  reason: string
  allowedStatuses: EnquiryStatus[]
  onClose: () => void
  onReasonChange: (next: string) => void
  onStatusChange: (next: string) => void
  onSubmit: () => void
}

export function StatusUpdateModal({
  open,
  value,
  reason,
  allowedStatuses,
  onClose,
  onReasonChange,
  onStatusChange,
  onSubmit,
}: StatusUpdateModalProps) {
  const statusOptions = allowedStatuses.map((status) => ({
    label: enquiryStatusLabel[status],
    value: status,
  }))

  const reasonRequired = REASON_REQUIRED_STATUSES.includes(value as EnquiryStatus)
  const canSubmit = !reasonRequired || reason.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Enquiry Status"
      subtitle="Status changes are audit logged and should include context."
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Update Status" onClick={onSubmit} disabled={!canSubmit} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <FormField label="Status">
          <Select
            value={value}
            onChange={(next) => onStatusChange(String(next))}
            options={statusOptions}
            placeholder="Select new status"
            fullWidth
          />
        </FormField>
        <FormField
          label="Reason"
          required={reasonRequired}
          helperText={reasonRequired ? 'Reason is required for this status change.' : undefined}
        >
          <Textarea
            value={reason}
            onChange={onReasonChange}
            placeholder="Explain why the status is changing"
            minRows={4}
            fullWidth
          />
        </FormField>
      </Stack>
    </Modal>
  )
}
