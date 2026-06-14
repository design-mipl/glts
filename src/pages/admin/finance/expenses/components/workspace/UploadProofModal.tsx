import { Stack } from '@mui/material'
import { Button, FormField, Input, Modal, Select } from '@/design-system/UIComponents'
import type { ApplicationExpenseProofDocumentType } from '@/shared/types/applicationExpenseManagement'
import { EXPENSE_PROOF_TYPE_OPTIONS } from '../../config/expenseDetailFormConfig'

interface UploadProofModalProps {
  open: boolean
  expenseName?: string
  onClose: () => void
  fileName: string
  onFileNameChange: (value: string) => void
  documentType: ApplicationExpenseProofDocumentType | ''
  onDocumentTypeChange: (value: ApplicationExpenseProofDocumentType | '') => void
  onSubmit: () => void
}

export function UploadProofModal({
  open,
  expenseName,
  onClose,
  fileName,
  onFileNameChange,
  documentType,
  onDocumentTypeChange,
  onSubmit,
}: UploadProofModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={expenseName ? `Upload proof · ${expenseName}` : 'Upload proof'}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Save proof" onClick={onSubmit} disabled={!fileName.trim() || !documentType} />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <FormField label="Document type" required>
          <Select
            value={documentType}
            onChange={value => onDocumentTypeChange(String(value) as ApplicationExpenseProofDocumentType)}
            options={EXPENSE_PROOF_TYPE_OPTIONS}
            placeholder="Select document type"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Proof file name" required helperText="Mock upload — enter a file name">
          <Input
            value={fileName}
            onChange={onFileNameChange}
            placeholder="invoice.pdf"
            size="sm"
            fullWidth
          />
        </FormField>
      </Stack>
    </Modal>
  )
}
