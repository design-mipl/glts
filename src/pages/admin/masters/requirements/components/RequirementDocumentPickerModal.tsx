import { useEffect, useMemo, useState, type HTMLAttributes } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { FormField, FormSection, Modal } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import {
  autocompleteOutlinedFieldSx,
  autocompleteSlotProps,
  FORM_CONTROL,
  formControlHeight,
} from '@/design-system/formControl'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { DocumentMaster } from '@/shared/types/documentMaster'

interface RequirementDocumentPickerModalProps {
  open: boolean
  title?: string
  subtitle?: string
  /** Document Master ids already mapped in this context (excluded from selectable list). */
  excludeDocumentIds?: string[]
  onClose: () => void
  onAdd: (documentId: string) => void
}

export function RequirementDocumentPickerModal({
  open,
  title = 'Add document',
  subtitle = 'Select a document from Document Master',
  excludeDocumentIds = [],
  onClose,
  onAdd,
}: RequirementDocumentPickerModalProps) {
  const theme = useTheme()
  const [selectedDoc, setSelectedDoc] = useState<DocumentMaster | null>(null)

  const excludeSet = useMemo(() => new Set(excludeDocumentIds), [excludeDocumentIds])

  const documents = useMemo(
    () => documentMasterService.list({ status: 'active' }).filter((doc) => !excludeSet.has(doc.id)),
    [excludeSet],
  )

  useEffect(() => {
    if (!open) setSelectedDoc(null)
  }, [open])

  const fieldSx = autocompleteOutlinedFieldSx(theme, formControlHeight('sm'))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size="md"
      footer={
        <AdminFullPageFormFooter
          onCancel={onClose}
          onSave={() => {
            if (!selectedDoc) return
            onAdd(selectedDoc.id)
            onClose()
          }}
          saveLabel="Add document"
          disabled={!selectedDoc}
        />
      }
    >
      <FormSection columns={1} sx={{ mb: 0, gap: ADMIN_MODAL_FORM_LAYOUT.fieldGridGap }}>
        <FormField label="Document" required>
          <Autocomplete
            options={documents}
            value={selectedDoc}
            onChange={(_, next) => setSelectedDoc(next)}
            getOptionLabel={(doc) => doc.documentType}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            noOptionsText="No active documents available"
            slotProps={autocompleteSlotProps(theme)}
            sx={{ width: '100%', ...fieldSx }}
            renderOption={(props, doc) => {
              const { key, ...rest } = props as { key: string } & HTMLAttributes<HTMLLIElement>
              return (
                <li key={key} {...rest}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: FORM_CONTROL.fontSize, fontWeight: 600 }}
                    >
                      {doc.documentType}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontSize: '11px' }}
                    >
                      {doc.id}
                    </Typography>
                  </Box>
                </li>
              )
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search documents…"
                size="small"
                variant="outlined"
                fullWidth
                sx={fieldSx}
              />
            )}
          />
        </FormField>
      </FormSection>
    </Modal>
  )
}
