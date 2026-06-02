import { Stack } from '@mui/material'
import { Button, FormField, Input, Modal, Textarea } from '@/design-system/UIComponents'

export interface ShareInvoiceModalValue {
  email: string
  paymentTerms: string
  dueDate: string
  message: string
}

interface ShareInvoiceModalProps {
  open: boolean
  onClose: () => void
  value: ShareInvoiceModalValue
  onChange: (value: ShareInvoiceModalValue) => void
  onSubmit: () => void
  loading?: boolean
  invoiceId?: string
}

export function ShareInvoiceModal({
  open,
  onClose,
  value,
  onChange,
  onSubmit,
  loading,
  invoiceId,
}: ShareInvoiceModalProps) {
  const patch = (partial: Partial<ShareInvoiceModalValue>) => onChange({ ...value, ...partial })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={invoiceId ? `Share invoice ${invoiceId}` : 'Share invoice'}
      loading={loading}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="outlined" onClick={onClose} />
          <Button label="Send invoice" onClick={onSubmit} loading={loading} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <FormField label="Recipient email">
          <Input value={value.email} onChange={v => patch({ email: v })} size="sm" fullWidth />
        </FormField>
        <FormField label="Payment terms">
          <Input value={value.paymentTerms} onChange={v => patch({ paymentTerms: v })} size="sm" fullWidth />
        </FormField>
        <FormField label="Due date">
          <Input value={value.dueDate} onChange={v => patch({ dueDate: v })} size="sm" fullWidth placeholder="YYYY-MM-DD" />
        </FormField>
        <FormField label="Message (optional)">
          <Textarea value={value.message} onChange={v => patch({ message: v })} rows={3} fullWidth />
        </FormField>
      </Stack>
    </Modal>
  )
}
