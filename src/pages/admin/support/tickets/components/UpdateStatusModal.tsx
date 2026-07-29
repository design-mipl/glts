import { Stack } from '@mui/material'
import { Button, FormField, Modal, Select } from '@/design-system/UIComponents'
import { supportTicketService } from '@/shared/services/supportTicketService'
import type { SupportTicketStatus } from '@/shared/types/supportTicket'
import { supportTicketStatusLabel } from '../config/supportTicketStatusConfig'

interface UpdateStatusModalProps {
  open: boolean
  currentStatus: SupportTicketStatus
  value: SupportTicketStatus
  onClose: () => void
  onChange: (next: SupportTicketStatus) => void
  onSubmit: () => void
}

export function UpdateStatusModal({
  open,
  currentStatus,
  value,
  onClose,
  onChange,
  onSubmit,
}: UpdateStatusModalProps) {
  const allowed = supportTicketService.getAllowedStatusTransitions(currentStatus)
  const options = allowed.map((status) => ({
    value: status,
    label: supportTicketStatusLabel[status],
  }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update status"
      subtitle={`Current status: ${supportTicketStatusLabel[currentStatus]}`}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Update" onClick={onSubmit} disabled={!allowed.length} />
        </Stack>
      }
    >
      <FormField label="Next status" required>
        <Select
          value={value}
          onChange={(next) => onChange(next as SupportTicketStatus)}
          options={options}
          placeholder={allowed.length ? 'Select status' : 'No transitions available'}
          disabled={!allowed.length}
        />
      </FormField>
    </Modal>
  )
}
