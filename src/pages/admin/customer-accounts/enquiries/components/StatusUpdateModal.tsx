import { Stack } from '@mui/material'
import { Button, FormField, Modal, Select, Textarea } from '@/design-system/UIComponents'
import type { ClientManagementPipelineStatus } from '@/shared/types/clientManagementPipeline'
import {
  clientManagementPipelineLabel,
  PIPELINE_REASON_REQUIRED_STATUSES,
} from '@/shared/config/clientManagementPipelineConfig'

interface StatusUpdateModalProps {
  open: boolean
  title?: string
  subtitle?: string
  value: string
  reason: string
  allowedStatuses: ClientManagementPipelineStatus[]
  onClose: () => void
  onReasonChange: (next: string) => void
  onStatusChange: (next: string) => void
  onSubmit: () => void
}

export function StatusUpdateModal({
  open,
  title = 'Update Status',
  subtitle = 'Status changes are audit logged and sync across linked Client Management records.',
  value,
  reason,
  allowedStatuses,
  onClose,
  onReasonChange,
  onStatusChange,
  onSubmit,
}: StatusUpdateModalProps) {
  const statusOptions = allowedStatuses.map((status) => ({
    label: clientManagementPipelineLabel[status],
    value: status,
  }))

  const reasonRequired = PIPELINE_REASON_REQUIRED_STATUSES.includes(
    value as ClientManagementPipelineStatus,
  )
  const canSubmit = !reasonRequired || reason.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
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
