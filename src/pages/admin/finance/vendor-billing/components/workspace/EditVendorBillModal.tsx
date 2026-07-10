import { Grid, Stack } from '@mui/material'
import { Button, FileUpload, FormField, Input, Modal, Textarea, useToast } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'

export interface EditVendorBillFormValue {
  vendorInvoiceNumber: string
  invoiceDate: string
  dueDate: string
  invoiceFileName: string
  remarks: string
}

interface EditVendorBillModalProps {
  open: boolean
  vendorInvoiceNumber?: string
  invoiceAmount?: number
  value: EditVendorBillFormValue
  onChange: (value: EditVendorBillFormValue) => void
  onClose: () => void
  onSubmit: () => void
  loading?: boolean
}

export function EditVendorBillModal({
  open,
  vendorInvoiceNumber,
  invoiceAmount,
  value,
  onChange,
  onClose,
  onSubmit,
  loading,
}: EditVendorBillModalProps) {
  const { showToast } = useToast()
  const patch = (partial: Partial<EditVendorBillFormValue>) => onChange({ ...value, ...partial })
  const canSubmit =
    value.vendorInvoiceNumber.trim().length > 0 &&
    value.invoiceDate.trim().length > 0 &&
    value.dueDate.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={vendorInvoiceNumber ? `Edit vendor bill · ${vendorInvoiceNumber}` : 'Edit vendor bill'}
      loading={loading}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Save changes" onClick={onSubmit} loading={loading} disabled={!canSubmit} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <FormField label="Invoice amount" helperText="Derived from selected charges and cannot be edited here.">
          <Input
            value={invoiceAmount != null ? formatInr(invoiceAmount) : '—'}
            disabled
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Vendor invoice number" required>
          <Input
            value={value.vendorInvoiceNumber}
            onChange={v => patch({ vendorInvoiceNumber: v })}
            placeholder="Vendor invoice reference"
            size="sm"
            fullWidth
          />
        </FormField>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Invoice date" required>
              <Input
                value={value.invoiceDate}
                onChange={v => patch({ invoiceDate: v })}
                placeholder="YYYY-MM-DD"
                size="sm"
                fullWidth
              />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Due date" required>
              <Input
                value={value.dueDate}
                onChange={v => patch({ dueDate: v })}
                placeholder="YYYY-MM-DD"
                size="sm"
                fullWidth
              />
            </FormField>
          </Grid>
        </Grid>
        <FormField label="Upload invoice" optional>
          <FileUpload
            key={open ? 'vendor-bill-edit-upload-open' : 'vendor-bill-edit-upload-closed'}
            compact
            dropzoneTitle="Upload vendor invoice"
            dropzoneCaption="PDF, JPG, or PNG · max 10 MB"
            browseLabel="Browse file"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10 * 1024 * 1024}
            maxFiles={1}
            onUpload={files => patch({ invoiceFileName: files[0]?.name ?? '' })}
            onError={message => showToast({ title: 'Upload failed', description: message, variant: 'error' })}
            helperText={
              value.invoiceFileName
                ? `Selected: ${value.invoiceFileName}`
                : 'Attach or replace the vendor invoice document'
            }
          />
        </FormField>
        <FormField label="Remarks" optional>
          <Textarea
            value={value.remarks}
            onChange={v => patch({ remarks: v })}
            rows={3}
            placeholder="Internal notes for this vendor bill…"
          />
        </FormField>
      </Stack>
    </Modal>
  )
}
