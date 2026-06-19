import { useCallback, useEffect, useMemo, useState, type HTMLAttributes } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import {
  FileUpload,
  FormField,
  FormSection,
  Modal,
  RichTextEditor,
  Select,
} from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import {
  autocompleteOutlinedFieldSx,
  autocompleteSlotProps,
  FORM_CONTROL,
  formControlHeight,
} from '@/design-system/formControl'
import {
  DOCUMENT_DESCRIPTION_RICH_TEXT_MIN_HEIGHT,
  DOCUMENT_DESCRIPTION_RICH_TEXT_TOOLBAR,
} from '@/pages/admin/masters/country/config/documentDescriptionRichText'
import { getDocumentOwnerTypeOptions } from '@/pages/admin/masters/country/config/documentOwnerTypeConfig'
import { ensureRichTextHtml, normalizeRichTextForSave } from '@/shared/utils/richTextUtils'
import { readFileAsDataUrl } from '@/shared/utils/imageSource'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { DocumentMaster } from '@/shared/types/documentMaster'
import type {
  BusinessSegment,
  CountryJurisdictionDocumentRule,
  DocumentOwnerType,
  JurisdictionDocumentGroup,
} from '@/shared/types/countryMaster'

const SAMPLE_DOCUMENT_MAX_BYTES = 5 * 1024 * 1024
const SAMPLE_DOCUMENT_ACCEPT = '.pdf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf'

export interface DocumentSampleFile {
  fileName: string
  url: string
}

export interface AddDocumentModalResult {
  documentId: string
  description: string
  ownerType: DocumentOwnerType
  sampleDocument?: DocumentSampleFile
}

interface AddDocumentModalProps {
  open: boolean
  segment: BusinessSegment
  group: JurisdictionDocumentGroup
  editRule?: CountryJurisdictionDocumentRule
  onClose: () => void
  onSubmit: (result: AddDocumentModalResult) => void
}

function sampleFromRule(rule: CountryJurisdictionDocumentRule): DocumentSampleFile | null {
  if (!rule.hasSample || !rule.sampleDocumentUrl) return null
  return {
    fileName: rule.sampleDocumentName ?? 'Sample document',
    url: rule.sampleDocumentUrl,
  }
}

export function AddDocumentModal({
  open,
  segment,
  group,
  editRule,
  onClose,
  onSubmit,
}: AddDocumentModalProps) {
  const theme = useTheme()
  const isEdit = Boolean(editRule)
  const [selectedDoc, setSelectedDoc] = useState<DocumentMaster | null>(null)
  const [ownerType, setOwnerType] = useState<DocumentOwnerType | ''>('')
  const [description, setDescription] = useState('')
  const [sampleFile, setSampleFile] = useState<DocumentSampleFile | null>(null)
  const [sampleError, setSampleError] = useState<string | undefined>()
  const fieldsEnabled = Boolean(selectedDoc)

  const documents = useMemo(
    () => documentMasterService.list({ status: 'active' }),
    [],
  )

  const ownerTypeOptions = useMemo(() => getDocumentOwnerTypeOptions(segment), [segment])

  useEffect(() => {
    if (!open) {
      setSelectedDoc(null)
      setOwnerType('')
      setDescription('')
      setSampleFile(null)
      setSampleError(undefined)
      return
    }

    if (editRule) {
      const master = documentMasterService.getById(editRule.documentId)
      setSelectedDoc(master ?? null)
      setOwnerType(editRule.ownerType ?? '')
      setDescription(ensureRichTextHtml(editRule.description ?? master?.description ?? ''))
      setSampleFile(sampleFromRule(editRule))
      setSampleError(undefined)
      return
    }

    setSelectedDoc(null)
    setOwnerType('')
    setDescription('')
    setSampleFile(null)
    setSampleError(undefined)
  }, [open, editRule])

  useEffect(() => {
    if (!open || isEdit || !selectedDoc) return
    setDescription(ensureRichTextHtml(selectedDoc.description))
    setSampleFile(null)
    setSampleError(undefined)
  }, [open, isEdit, selectedDoc])

  useEffect(() => {
    if (!open || !isEdit || !editRule || !selectedDoc) return
    if (selectedDoc.id !== editRule.documentId) {
      setDescription(ensureRichTextHtml(selectedDoc.description))
    }
  }, [open, isEdit, editRule, selectedDoc])

  const handleSampleUpload = useCallback(async (files: File[]) => {
    if (!files.length) {
      setSampleFile(null)
      setSampleError(undefined)
      return
    }
    const file = files[0]
    setSampleError(undefined)
    try {
      const url = await readFileAsDataUrl(file)
      setSampleFile({ fileName: file.name, url })
    } catch {
      setSampleError('Could not read the selected file. Try another document.')
    }
  }, [])

  const handleClose = () => {
    onClose()
  }

  const handleSave = () => {
    if (!selectedDoc || !ownerType) return
    onSubmit({
      documentId: selectedDoc.id,
      description: normalizeRichTextForSave(description),
      ownerType,
      sampleDocument: sampleFile ?? undefined,
    })
  }

  const groupLabel =
    group === 'optional' ? 'optional' : group === 'common' ? 'common' : 'jurisdiction'

  const fieldSx = autocompleteOutlinedFieldSx(theme, formControlHeight('sm'))

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit document' : 'Add From Document Master'}
      subtitle={
        isEdit
          ? `Update ${groupLabel} document details for this jurisdiction`
          : `Select a ${groupLabel} document and customize its description`
      }
      size="lg"
      footer={
        <AdminFullPageFormFooter
          onCancel={handleClose}
          onSave={handleSave}
          saveLabel={isEdit ? 'Save' : 'Add document'}
          disabled={!selectedDoc || !ownerType}
        />
      }
    >
      <FormSection columns={ADMIN_MODAL_FORM_LAYOUT.fieldColumns} sx={{ mb: 0 }}>
        <FormField label="Document" required>
          <Autocomplete
            options={documents}
            value={selectedDoc}
            onChange={(_, next) => setSelectedDoc(next)}
            getOptionLabel={(doc) => doc.documentType}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            slotProps={autocompleteSlotProps(theme)}
            sx={{ width: '100%', ...fieldSx }}
            renderOption={(props, doc) => {
              const { key, ...rest } = props as { key: string } & HTMLAttributes<HTMLLIElement>
              return (
                <li key={key} {...rest}>
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: FORM_CONTROL.fontSize, fontWeight: 600 }}>
                      {doc.documentType}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                      {doc.description}
                    </Typography>
                  </Box>
                </li>
              )
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by name or description…"
                size="small"
                variant="outlined"
                fullWidth
                slotProps={{
                  formHelperText: { sx: { mx: 0, mt: '4px', fontSize: FORM_CONTROL.helperFontSize } },
                }}
                sx={fieldSx}
              />
            )}
          />
        </FormField>

        <FormField label="Type" required>
          <Select
            value={ownerType}
            onChange={(v) => setOwnerType(v as DocumentOwnerType)}
            options={ownerTypeOptions}
            placeholder="Select type"
            size="sm"
            fullWidth
          />
        </FormField>

        <AdminFullPageFormFieldSpan>
          <FormField label="Description" optional>
            <RichTextEditor
              key={selectedDoc?.id ?? 'no-document'}
              value={description}
              onChange={setDescription}
              placeholder="Select a document to customize its description"
              minHeight={DOCUMENT_DESCRIPTION_RICH_TEXT_MIN_HEIGHT}
              toolbar={DOCUMENT_DESCRIPTION_RICH_TEXT_TOOLBAR}
              disabled={!fieldsEnabled}
            />
          </FormField>
        </AdminFullPageFormFieldSpan>

        <AdminFullPageFormFieldSpan>
          <FormField
            label="Sample document"
            optional
            helperText={
              sampleError ??
              (sampleFile ? `${sampleFile.fileName} attached (mock storage).` : undefined)
            }
            error={Boolean(sampleError)}
          >
            <FileUpload
              compact
              accept={SAMPLE_DOCUMENT_ACCEPT}
              maxSize={SAMPLE_DOCUMENT_MAX_BYTES}
              maxFiles={1}
              dropzoneTitle="Upload sample or template"
              dropzoneCaption="PDF, DOC, DOCX, JPG, PNG, WebP — up to 5 MB"
              browseLabel="Browse"
              onUpload={(files) => void handleSampleUpload(files)}
              onError={setSampleError}
              disabled={!fieldsEnabled}
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </FormSection>
    </Modal>
  )
}

export function documentFormResultToRulePatch(
  result: AddDocumentModalResult,
): Pick<
  CountryJurisdictionDocumentRule,
  | 'documentId'
  | 'description'
  | 'ownerType'
  | 'hasSample'
  | 'sampleDocumentName'
  | 'sampleDocumentUrl'
  | 'ocrEnabled'
> {
  return {
    documentId: result.documentId,
    description: result.description || undefined,
    ownerType: result.ownerType,
    hasSample: Boolean(result.sampleDocument?.url),
    sampleDocumentName: result.sampleDocument?.fileName,
    sampleDocumentUrl: result.sampleDocument?.url,
    ocrEnabled: result.documentId === 'passport',
  }
}
