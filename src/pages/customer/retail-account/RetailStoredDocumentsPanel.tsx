import { useCallback, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FileText, Plus, Trash2, Upload } from 'lucide-react'
import { Button, ConfirmDialog, Drawer, FormField, Input, Select, useToast } from '@/design-system/UIComponents'
import { applyFlow, applyFont, applyRadius } from '@/pages/website/theme/applyFlowTheme'
import {
  listStoredDocuments,
  removeStoredDocument,
  storedDocumentTypeLabel,
  upsertStoredDocument,
  type StoredDocument,
  type StoredDocumentType,
} from '@/shared/services/storedDocumentsService'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'

const DOC_TYPE_OPTIONS: { value: StoredDocumentType; label: string }[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'other', label: 'Other' },
]

export function RetailStoredDocumentsPanel() {
  const { showToast } = useToast()
  const [docs, setDocs] = useState(() => listStoredDocuments())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<StoredDocument | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [docType, setDocType] = useState<StoredDocumentType>('passport')
  const [label, setLabel] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileUrl, setFileUrl] = useState<string | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(() => setDocs(listStoredDocuments()), [])

  const openCreate = () => {
    setEditing(null)
    setDocType('passport')
    setLabel('')
    setFileName('')
    setFileUrl(undefined)
    setDrawerOpen(true)
  }

  const openReplace = (doc: StoredDocument) => {
    setEditing(doc)
    setDocType(doc.type)
    setLabel(doc.label)
    setFileName(doc.fileName)
    setFileUrl(doc.fileUrl)
    setDrawerOpen(true)
  }

  const handleSave = () => {
    if (!fileName.trim()) {
      showToast({ title: 'Choose a file', variant: 'error' })
      return
    }
    upsertStoredDocument({
      id: editing?.id,
      type: docType,
      label: label.trim() || storedDocumentTypeLabel(docType),
      fileName: fileName.trim(),
      fileUrl,
    })
    refresh()
    setDrawerOpen(false)
    showToast({ title: editing ? 'Document updated' : 'Document saved', variant: 'success' })
  }

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          borderRadius: applyRadius.card,
          bgcolor: applyFlow.surface,
          border: `1px solid ${applyFlow.hairline}`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography sx={{ fontFamily: applyFont.body, fontWeight: 800, fontSize: 15, color: applyFlow.ink }}>
            My Documents
          </Typography>
          <Button variant="text" size="sm" startIcon={<Plus size={14} />} onClick={openCreate}>
            Add
          </Button>
        </Stack>
        <Typography sx={{ fontSize: 12.5, color: applyFlow.inkMuted, mb: 2, lineHeight: 1.5 }}>
          Save passport, Aadhaar, PAN and reuse them on new visa applications.
        </Typography>

        {docs.length === 0 ? (
          <Box
            sx={{
              py: 2.5,
              textAlign: 'center',
              borderRadius: applyRadius.card,
              border: `1px dashed ${applyFlow.hairline}`,
            }}
          >
            <FileText size={22} color={applyFlow.inkFaint} />
            <Typography sx={{ mt: 1, fontSize: 13, color: applyFlow.inkMuted }}>No documents yet</Typography>
            <Button variant="outlined" size="sm" sx={{ mt: 1.5 }} startIcon={<Upload size={14} />} onClick={openCreate}>
              Upload
            </Button>
          </Box>
        ) : (
          <Stack spacing={1}>
            {docs.map(doc => (
              <Box
                key={doc.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  p: 1.25,
                  borderRadius: '8px',
                  bgcolor: applyFlow.canvas,
                  border: `1px solid ${applyFlow.hairlineSoft}`,
                }}
              >
                <FileText size={16} color={applyFlow.accentInk} style={{ flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: applyFlow.ink }} noWrap>
                    {doc.label}
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: applyFlow.inkMuted }} noWrap>
                    {doc.fileName} · {formatDisplayDate(doc.uploadedAt)}
                  </Typography>
                </Box>
                <Button variant="text" size="sm" onClick={() => openReplace(doc)}>
                  Replace
                </Button>
                <Button variant="text" size="sm" color="error" onClick={() => setDeleteId(doc.id)}>
                  <Trash2 size={14} />
                </Button>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Replace document' : 'Upload document'}
        width={420}
        footer={
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button variant="neutral" fullWidth onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" fullWidth onClick={handleSave}>
              Save
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <FormField label="Document type">
            <Select
              value={docType}
              onChange={v => setDocType(String(v) as StoredDocumentType)}
              options={DOC_TYPE_OPTIONS}
              disabled={Boolean(editing) && editing!.type !== 'other'}
              fullWidth
            />
          </FormField>
          <FormField label="Label" optional>
            <Input value={label} onChange={setLabel} placeholder={storedDocumentTypeLabel(docType)} />
          </FormField>
          <FormField label="File">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              hidden
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                setFileName(file.name)
                setFileUrl(URL.createObjectURL(file))
              }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Button variant="outlined" startIcon={<Upload size={14} />} onClick={() => fileInputRef.current?.click()}>
                Choose file
              </Button>
              <Typography sx={{ fontSize: 12, color: applyFlow.inkMuted }} noWrap>
                {fileName || 'No file selected'}
              </Typography>
            </Stack>
          </FormField>
        </Stack>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) removeStoredDocument(deleteId)
          refresh()
          setDeleteId(null)
          showToast({ title: 'Document removed', variant: 'success' })
        }}
        title="Remove document?"
        description="You can upload it again later from your account."
        confirmLabel="Remove"
        variant="destructive"
      />
    </>
  )
}
