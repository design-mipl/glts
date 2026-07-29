import { Alert, Stack } from '@mui/material'
import { Button, Modal } from '@/design-system/UIComponents'

interface ConvertToQuotationDialogProps {
  open: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConvertToQuotationDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: ConvertToQuotationDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Convert to Quotation"
      subtitle="Generate a quotation record from this enquiry."
      loading={loading}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Approve Conversion" onClick={onConfirm} />
        </Stack>
      }
    >
      <Alert severity="info">This will mark the enquiry as converted and create a quotation draft.</Alert>
    </Modal>
  )
}
