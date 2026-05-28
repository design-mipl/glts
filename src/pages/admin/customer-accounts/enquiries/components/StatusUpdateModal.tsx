import { Stack } from '@mui/material'
import { Button, FormField, Modal, Select, Textarea } from '@/design-system/UIComponents'
import { enquiryStatusOptions } from '../config/enquiryFilterConfig'

interface StatusUpdateModalProps {
  open: boolean
  value: string
  reason: string
  onClose: () => void
  onReasonChange: (next: string) => void
  onStatusChange: (next: string) => void
  onSubmit: () => void
}

export function StatusUpdateModal({
  open,
  value,
  reason,
  onClose,
  onReasonChange,
  onStatusChange,
  onSubmit,
}: StatusUpdateModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Enquiry Status"
      subtitle="Status changes are audit logged and should include context."
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="outlined" onClick={onClose} />
          <Button label="Update Status" onClick={onSubmit} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <FormField label="Status">
          <Select value={value} onChange={(next) => onStatusChange(String(next))} options={enquiryStatusOptions.slice(1)} fullWidth />
        </FormField>
        <FormField label="Reason">
          <Textarea value={reason} onChange={onReasonChange} minRows={4} fullWidth />
        </FormField>
      </Stack>
    </Modal>
  )
}
