import { useCallback, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FileText, Plus, Replace, Trash2, Upload } from 'lucide-react'
import {
  Button,
  ConfirmDialog,
  Drawer,
  FormField,
  Input,
  Select,
  useToast,
} from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  listStoredDocuments,
  removeStoredDocument,
  storedDocumentTypeLabel,
  upsertStoredDocument,
  type StoredDocument,
  type StoredDocumentType,
} from '@/shared/services/storedDocumentsService'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'

const DOC_TYPE_OPTIONS: { value: StoredDocumentType; label: string }[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'other', label: 'Other' },
]

function statusTone(status: StoredDocument['status']): 'success' | 'warning' | 'neutral' {
  if (status === 'ready') return 'success'
  if (status === 'expired') return 'warning'
  return 'neutral'
}

export function StoredDocumentsSection() {
  const colors = usePublicBrandColors()
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setFileUrl(URL.createObjectURL(file))
  }

  const handleSave = () => {
    if (!fileName.trim()) {
      showToast({ title: 'Choose a file', description: 'Upload a document before saving.', variant: 'error' })
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
    showToast({
      title: editing ? 'Document updated' : 'Document saved',
      description: 'You can reuse this when applying for a visa.',
      variant: 'success',
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    removeStoredDocument(deleteId)
    refresh()
    setDeleteId(null)
    showToast({ title: 'Document removed', variant: 'success' })
  }

  const empty = docs.length === 0

  return (
    <>
      <CustomerDetailSection
        title="Stored Documents"
        action={
          <Button variant="outlined" startIcon={<Plus size={14} />} onClick={openCreate}>
            Upload document
          </Button>
        }
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 640 }}>
          Save commonly used documents once — passport, Aadhaar, PAN, and more — then reuse them on new visa
          applications without uploading again.
        </Typography>

        {empty ? (
          <Box
            sx={{
              border: `1px dashed ${colors.border}`,
              borderRadius: '12px',
              p: 3,
              textAlign: 'center',
              bgcolor: colors.surface,
            }}
          >
            <FileText size={28} color={colors.textMuted} />
            <Typography sx={{ mt: 1.5, fontWeight: 700, fontSize: 14, color: colors.navy }}>
              No stored documents yet
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.textSecondary, mb: 2 }}>
              Upload your passport or ID to speed up the next application.
            </Typography>
            <Button variant="contained" startIcon={<Upload size={14} />} onClick={openCreate}>
              Upload document
            </Button>
          </Box>
        ) : (
          <Stack spacing={1.25}>
            {docs.map(doc => (
              <Box
                key={doc.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: '12px',
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.white,
                  flexWrap: 'wrap',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    bgcolor: `${colors.greenBright}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={18} color={colors.greenBright} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 140 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography sx={{ fontWeight: 700, fontSize: 13, color: colors.navy }}>
                      {doc.label}
                    </Typography>
                    <CustomerStatusChip label={doc.status} tone={statusTone(doc.status)} />
                  </Stack>
                  <Typography sx={{ fontSize: 12, color: colors.textSecondary, mt: 0.25 }} noWrap>
                    {doc.fileName} · Updated {formatDisplayDateTime(doc.uploadedAt)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <Button
                    variant="text"
                    size="sm"
                    startIcon={<Replace size={14} />}
                    onClick={() => openReplace(doc)}
                  >
                    Replace
                  </Button>
                  <Button
                    variant="text"
                    size="sm"
                    color="error"
                    startIcon={<Trash2 size={14} />}
                    onClick={() => setDeleteId(doc.id)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </CustomerDetailSection>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Replace document' : 'Upload document'}
        width={440}
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
          <FormField label="Display label" optional>
            <Input
              value={label}
              onChange={v => setLabel(v)}
              placeholder={storedDocumentTypeLabel(docType)}
            />
          </FormField>
          <FormField label="File">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              hidden
              onChange={handleFileChange}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Button variant="outlined" startIcon={<Upload size={14} />} onClick={() => fileInputRef.current?.click()}>
                Choose file
              </Button>
              <Typography sx={{ fontSize: 12, color: colors.textSecondary }} noWrap>
                {fileName || 'No file selected'}
              </Typography>
            </Stack>
          </FormField>
        </Stack>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove stored document?"
        description="This document will no longer be available to reuse on new applications."
        confirmLabel="Remove"
        variant="destructive"
      />
    </>
  )
}

/** Standalone page for /retail/documents */
export function StoredDocumentsPage() {
  const colors = usePublicBrandColors()
  return (
    <Box>
      <Typography component="h1" sx={{ fontWeight: 700, fontSize: 22, color: colors.navy, mb: 0.5 }}>
        Stored Documents
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 3, maxWidth: 640 }}>
        Keep identity and travel documents ready for reuse across visa applications.
      </Typography>
      <StoredDocumentsSection />
    </Box>
  )
}
