import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FormField, Input, Modal, RichTextEditor } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import {
  DOCUMENT_DESCRIPTION_RICH_TEXT_MIN_HEIGHT,
  DOCUMENT_DESCRIPTION_RICH_TEXT_TOOLBAR,
} from '@/pages/admin/masters/country/config/documentDescriptionRichText'
import { normalizeRichTextForSave } from '@/shared/utils/richTextUtils'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { JurisdictionDocumentGroup } from '@/shared/types/countryMaster'

export interface AddDocumentModalResult {
  documentId: string
  description: string
}

interface AddDocumentModalProps {
  open: boolean
  group: JurisdictionDocumentGroup
  onClose: () => void
  onAdd: (result: AddDocumentModalResult) => void
}

export function AddDocumentModal({ open, group, onClose, onAdd }: AddDocumentModalProps) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [description, setDescription] = useState('')

  const documents = useMemo(() => {
    const q = search.trim().toLowerCase()
    return documentMasterService.list({ status: 'active' }).filter(
      (doc) =>
        !q ||
        doc.documentType.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q),
    )
  }, [search])

  const selectedDoc = useMemo(
    () => (selectedId ? documentMasterService.getById(selectedId) : undefined),
    [selectedId],
  )

  useEffect(() => {
    if (!open) {
      setSearch('')
      setSelectedId(null)
      setDescription('')
      return
    }
    if (selectedDoc) {
      setDescription(selectedDoc.description)
    } else {
      setDescription('')
    }
  }, [open, selectedDoc])

  const handleClose = () => {
    onClose()
  }

  const handleAdd = () => {
    if (!selectedId) return
    onAdd({ documentId: selectedId, description: normalizeRichTextForSave(description) })
  }

  const groupLabel =
    group === 'optional' ? 'optional' : group === 'common' ? 'common' : 'jurisdiction'

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add From Document Master"
      subtitle={`Select a ${groupLabel} document and customize its description`}
      size="lg"
      footer={
        <AdminFullPageFormFooter
          onCancel={handleClose}
          onSave={handleAdd}
          saveLabel="Add document"
          disabled={!selectedId}
        />
      }
    >
      <FormField label="Search documents">
        <Input value={search} onChange={setSearch} placeholder="Search by name…" size="sm" />
      </FormField>
      <Stack spacing={0.5} sx={{ mt: 2, maxHeight: 240, overflow: 'auto' }}>
        {documents.map((doc) => {
          const isSelected = selectedId === doc.id
          return (
            <Stack
              key={doc.id}
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                border: 1,
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'action.selected' : 'transparent',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => setSelectedId(doc.id)}
            >
              <Typography variant="body2" fontWeight={600}>
                {doc.documentType}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {doc.description}
              </Typography>
            </Stack>
          )
        })}
        {documents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No matching documents.
          </Typography>
        ) : null}
      </Stack>

      {selectedDoc ? (
        <Box sx={{ mt: 2 }}>
          <AdminFullPageFormFieldSpan>
            <FormField label="Description" optional>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Customize description for this jurisdiction"
                minHeight={DOCUMENT_DESCRIPTION_RICH_TEXT_MIN_HEIGHT}
                toolbar={DOCUMENT_DESCRIPTION_RICH_TEXT_TOOLBAR}
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
        </Box>
      ) : null}
    </Modal>
  )
}
