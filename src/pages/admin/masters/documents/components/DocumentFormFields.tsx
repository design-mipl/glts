import { Box } from '@mui/material'
import { FormField, FormSection, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { DocumentMasterFormData } from '@/shared/types/documentMaster'
import { documentStatusLabel } from '../config/documentStatusConfig'

interface DocumentFormFieldsProps {
  formData: DocumentMasterFormData
  onChange: (data: DocumentMasterFormData) => void
  errors: Record<string, string>
  documentId?: string
  /** modal = dialog create form (FormSection, no section cards) */
  variant?: 'default' | 'modal'
}

export function DocumentFormFields({
  formData,
  onChange,
  errors,
  documentId,
  variant = 'default',
}: DocumentFormFieldsProps) {
  const patch = (partial: Partial<DocumentMasterFormData>) =>
    onChange({ ...formData, ...partial })

  const fields = (
    <>
      {documentId ? (
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <FormField label="Document ID">
            <Input value={documentId} disabled size="sm" fullWidth />
          </FormField>
        </Box>
      ) : null}
      <FormField
        label="Document type"
        required
        error={Boolean(errors.documentType)}
        helperText={errors.documentType}
      >
        <Input
          value={formData.documentType}
          onChange={(value) => patch({ documentType: value })}
          placeholder="e.g. Passport, CDC, Invitation Letter"
          size="sm"
          fullWidth
        />
      </FormField>
      <FormField label="Status" required>
        <Select
          value={formData.status}
          onChange={(value) =>
            patch({ status: value as DocumentMasterFormData['status'] })
          }
          options={(
            Object.entries(documentStatusLabel) as [DocumentMasterFormData['status'], string][]
          ).map(([value, label]) => ({ value, label }))}
          size="sm"
          fullWidth
        />
      </FormField>
      {variant === 'modal' ? (
        <AdminFullPageFormFieldSpan>
          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(value) => patch({ description: value })}
              placeholder="Explain what this document is and where it is used"
              rows={4}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      ) : (
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(value) => patch({ description: value })}
              placeholder="Explain what this document is and where it is used"
              rows={4}
              fullWidth
            />
          </FormField>
        </Box>
      )}
    </>
  )

  if (variant === 'modal') {
    return (
      <FormSection title="Document details" columns={2}>
        {fields}
      </FormSection>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2,
      }}
    >
      {fields}
    </Box>
  )
}
