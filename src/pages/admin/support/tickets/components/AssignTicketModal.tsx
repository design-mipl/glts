import { Stack } from '@mui/material'
import { Button, FormField, Modal, Select } from '@/design-system/UIComponents'
import { supportTicketService } from '@/shared/services/supportTicketService'

interface AssignTicketModalProps {
  open: boolean
  value: string
  onClose: () => void
  onChange: (next: string) => void
  onSubmit: () => void
}

export function AssignTicketModal({ open, value, onClose, onChange, onSubmit }: AssignTicketModalProps) {
  const options = supportTicketService.getAssigneeOptions().map((name) => ({
    value: name,
    label: name,
  }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign ticket"
      subtitle="Assign a support executive to own this ticket."
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Assign" onClick={onSubmit} disabled={!value.trim()} />
        </Stack>
      }
    >
      <FormField label="Support executive" required>
        <Select
          value={value}
          onChange={(next) => onChange(String(next))}
          options={options}
          placeholder="Select assignee"
        />
      </FormField>
    </Modal>
  )
}
