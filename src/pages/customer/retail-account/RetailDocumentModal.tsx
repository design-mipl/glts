import { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FileText, Upload, X } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import { FileUploadModal } from '@/pages/website/components/fileUploadModal/FileUploadModal'
import { PhotoCaptureFlow } from '@/pages/website/pages/RetailApplyFlowPage/components/capture/PhotoCaptureFlow'
import { PassportCaptureFlow } from '@/pages/website/pages/RetailApplyFlowPage/components/capture/PassportCaptureFlow'
import type { RetailCapturedImage } from '@/pages/website/pages/RetailApplyFlowPage/types'
import { ApplySelect, ApplyTextField, FieldLabel } from '@/pages/website/theme/applyFormControls'
import {
  applyFlow,
  applyFlowButtonPadding,
  applyFont,
  applyRadius,
  getAccentButtonSx,
  getQuietButtonSx,
} from '@/pages/website/theme/applyFlowTheme'
import {
  storedDocumentTypeLabel,
  type StoredDocument,
  type StoredDocumentType,
} from '@/shared/services/storedDocumentsService'
import { retailModalCloseBtnSx } from './retailAccountModalChrome'

const DOC_TYPE_OPTIONS: { label: string; value: StoredDocumentType }[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'photo', label: 'Passport Photo' },
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'other', label: 'Other' },
]

type UploadFlow = 'photo' | 'passport' | 'file'

export interface RetailDocumentModalProps {
  open: boolean
  editing: StoredDocument | null
  ownerName: string
  onClose: () => void
  onSave: (payload: {
    id?: string
    type: StoredDocumentType
    label: string
    fileName: string
    fileUrl?: string
  }) => void
}

function captureFileName(type: StoredDocumentType, ext = 'jpg') {
  const slug = type === 'other' ? 'document' : type
  return `${slug}-${Date.now()}.${ext}`
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** Retail account document vault — apply-flow modal + the same upload/capture flows as apply. */
export function RetailDocumentModal({
  open,
  editing,
  ownerName,
  onClose,
  onSave,
}: RetailDocumentModalProps) {
  const [docType, setDocType] = useState<StoredDocumentType>('passport')
  const [label, setLabel] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileUrl, setFileUrl] = useState<string | undefined>()
  const [uploadFlow, setUploadFlow] = useState<UploadFlow | null>(null)

  useEffect(() => {
    if (!open) {
      setUploadFlow(null)
      return
    }
    setDocType(editing?.type ?? 'passport')
    setLabel(editing?.label ?? '')
    setFileName(editing?.fileName ?? '')
    setFileUrl(editing?.fileUrl)
    setUploadFlow(null)
  }, [open, editing])

  const documentTitle = useMemo(
    () => label.trim() || storedDocumentTypeLabel(docType),
    [label, docType],
  )

  const initialPhoto = useMemo(
    () => (fileUrl && docType === 'photo' ? { dataUrl: fileUrl, capturedAt: new Date().toISOString() } : undefined),
    [fileUrl, docType],
  )

  const initialPassport = useMemo(
    () =>
      fileUrl && docType === 'passport'
        ? { dataUrl: fileUrl, capturedAt: new Date().toISOString() }
        : undefined,
    [fileUrl, docType],
  )

  const canSave = Boolean(fileName.trim())

  const openUploadFlow = () => {
    if (docType === 'photo') setUploadFlow('photo')
    else if (docType === 'passport') setUploadFlow('passport')
    else setUploadFlow('file')
  }

  const applyCapturedImage = (image: RetailCapturedImage, name: string) => {
    setFileName(name)
    setFileUrl(image.dataUrl)
    setUploadFlow(null)
  }

  const handleSave = () => {
    if (!canSave) return
    onSave({
      id: editing?.id,
      type: docType,
      label: label.trim() || storedDocumentTypeLabel(docType),
      fileName: fileName.trim(),
      fileUrl,
    })
  }

  if (!open) return null

  if (uploadFlow === 'photo') {
    return (
      <PhotoCaptureFlow
        applicantName={ownerName}
        initialImage={initialPhoto}
        onClose={() => setUploadFlow(null)}
        onConfirm={image => applyCapturedImage(image, captureFileName('photo'))}
      />
    )
  }

  if (uploadFlow === 'passport') {
    return (
      <PassportCaptureFlow
        applicantName={ownerName}
        initialPassport={initialPassport}
        onClose={() => setUploadFlow(null)}
        onConfirm={result => applyCapturedImage(result.passport, captureFileName('passport'))}
      />
    )
  }

  if (uploadFlow === 'file') {
    return (
      <FileUploadModal
        open
        documentName={documentTitle}
        description="Save this once and reuse it on future applications."
        accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
        acceptLabel="JPEG, PNG, PDF, WebP"
        onClose={() => setUploadFlow(null)}
        onUpload={async files => {
          const file = files[0]
          if (!file) return
          const dataUrl = await fileToDataUrl(file)
          setFileName(file.name)
          setFileUrl(dataUrl)
          setUploadFlow(null)
        }}
      />
    )
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      hideCloseButton
      sx={{
        width: { xs: '100%', sm: 480 },
        maxHeight: { xs: '100%', sm: 'min(640px, 90vh)' },
        borderRadius: { xs: 0, sm: applyRadius.card },
        border: { xs: 'none', sm: `1px solid ${applyFlow.hairline}` },
        boxShadow: { xs: 'none', sm: '0 16px 48px rgba(15, 23, 42, 0.12)' },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: applyFlow.surface,
          px: { xs: 4, sm: 5 },
          py: { xs: 4, sm: 4.5 },
        },
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: applyFont.display,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: applyFlow.ink,
              }}
            >
              {editing ? 'Replace document' : 'Add document'}
            </Typography>
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontSize: 13,
                color: applyFlow.inkMuted,
                mt: 1,
                lineHeight: 1.45,
              }}
            >
              Upload once and attach it to any future application.
            </Typography>
          </Box>
          <Box component="button" type="button" aria-label="Close" onClick={onClose} sx={retailModalCloseBtnSx}>
            <X size={15} />
          </Box>
        </Stack>

        <Stack spacing={2.75}>
          <Box>
            <FieldLabel htmlFor="retail-doc-type">Document type</FieldLabel>
            {editing && editing.type !== 'other' ? (
              <Typography
                sx={{
                  fontFamily: applyFont.body,
                  fontSize: 14,
                  fontWeight: 600,
                  color: applyFlow.ink,
                  px: 2.75,
                  py: 1.75,
                  border: `1px solid ${applyFlow.hairline}`,
                  borderRadius: applyRadius.control,
                  bgcolor: applyFlow.canvas,
                }}
              >
                {storedDocumentTypeLabel(docType)}
              </Typography>
            ) : (
              <ApplySelect
                id="retail-doc-type"
                value={docType}
                options={DOC_TYPE_OPTIONS}
                onChange={value => setDocType(value as StoredDocumentType)}
                aria-label="Document type"
              />
            )}
          </Box>
          <Box>
            <FieldLabel htmlFor="retail-doc-label">Label</FieldLabel>
            <ApplyTextField
              id="retail-doc-label"
              value={label}
              placeholder={storedDocumentTypeLabel(docType)}
              onChange={setLabel}
            />
          </Box>
          <Box>
            <FieldLabel required>File</FieldLabel>
            <Box
              component="button"
              type="button"
              onClick={openUploadFlow}
              sx={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                appearance: 'none',
                border: `1px ${fileName ? 'solid' : 'dashed'} ${applyFlow.hairlineStrong}`,
                borderRadius: applyRadius.card,
                bgcolor: fileName ? applyFlow.surface : applyFlow.canvas,
                p: 2.25,
                transition: `border-color 150ms ease, background-color 150ms ease`,
                '&:hover': { borderColor: applyFlow.accentBorder, bgcolor: applyFlow.accentSoft },
                '&:focus-visible': {
                  outline: 'none',
                  borderColor: applyFlow.accent,
                  boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: applyRadius.full,
                    border: `1px solid ${applyFlow.hairline}`,
                    bgcolor: applyFlow.surface,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {fileName ? <FileText size={18} color={applyFlow.accentInk} /> : <Upload size={18} color={applyFlow.inkMuted} />}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontFamily: applyFont.body, fontSize: 13.5, fontWeight: 600, color: applyFlow.ink }}>
                    {fileName ? 'Replace file' : 'Upload file'}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: applyFlow.inkMuted, mt: 0.25 }} noWrap>
                    {fileName || (docType === 'photo' ? 'Camera or device upload' : docType === 'passport' ? 'Scan or upload passport' : 'PDF or image · max 5MB')}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.25}>
          <Box component="button" type="button" onClick={onClose} sx={{ ...getQuietButtonSx(), flex: 1, minHeight: 44 }}>
            Cancel
          </Box>
          <Box
            component="button"
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            sx={{ ...getAccentButtonSx(), ...applyFlowButtonPadding.lg, flex: 1, minHeight: 44, border: 'none' }}
          >
            {editing ? 'Replace' : 'Save document'}
          </Box>
        </Stack>
      </Stack>
    </Modal>
  )
}
