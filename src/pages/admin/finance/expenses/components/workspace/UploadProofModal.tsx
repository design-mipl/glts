import { Box, IconButton, Stack, Typography } from '@mui/material'
import { FileText, X } from 'lucide-react'
import { Button, FileUpload, FormField, Modal, Select } from '@/design-system/UIComponents'
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
        <FormField
          label="Proof file"
          required
          helperText="Attach bill, receipt, invoice, or supporting document (PDF, JPG, or PNG)."
        >
          <Stack spacing={1}>
            <FileUpload
              key={open ? `proof-upload-${fileName || 'empty'}` : 'proof-upload-closed'}
              compact
              dropzoneTitle="Choose a file or drag & drop it here"
              dropzoneCaption="PDF, JPG, or PNG · max 10 MB"
              browseLabel="Browse files"
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10 * 1024 * 1024}
              maxFiles={1}
              onUpload={files => onFileNameChange(files[0]?.name ?? '')}
            />
            {fileName.trim() ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  px: 1,
                  py: 0.75,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                  <FileText size={16} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, fontSize: 12, minWidth: 0 }}
                  noWrap
                  title={fileName}
                >
                  {fileName}
                </Typography>
                <IconButton
                  size="small"
                  aria-label={`Remove ${fileName}`}
                  onClick={() => onFileNameChange('')}
                >
                  <X size={14} />
                </IconButton>
              </Stack>
            ) : null}
          </Stack>
        </FormField>
      </Stack>
    </Modal>
  )
}
