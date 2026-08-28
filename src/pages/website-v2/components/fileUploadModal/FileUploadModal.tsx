import { useCallback, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { AlertCircle, FileText, Upload, X } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getAccentButtonSx,
  getQuietButtonSx,
} from '@/pages/website-v2/theme/applyFlowTheme'

export interface FileUploadModalProps {
  open: boolean
  onClose: () => void
  /** Shown in the modal title, e.g. "Bank statement". */
  documentName: string
  description?: string
  /** MIME/extension accept string passed to the file input. */
  accept?: string
  /** Human-readable format list shown under the dropzone, e.g. "JPEG, PNG, PDF". */
  acceptLabel?: string
  maxSizeMb?: number
  multiple?: boolean
  onUpload: (files: File[]) => void
}

const DEFAULT_ACCEPT = 'image/jpeg,image/png,application/pdf'
const DEFAULT_ACCEPT_LABEL = 'JPEG, PNG, PDF'
const DEFAULT_MAX_SIZE_MB = 5

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** File-type document upload (bank statements, etc). Distinct from the camera-based capture flows. */
export function FileUploadModal({
  open,
  onClose,
  documentName,
  description,
  accept = DEFAULT_ACCEPT,
  acceptLabel = DEFAULT_ACCEPT_LABEL,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
  multiple = false,
  onUpload,
}: FileUploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const maxSizeBytes = maxSizeMb * 1024 * 1024

  const acceptFiles = useCallback(
    (incoming: File[]) => {
      if (!incoming.length) return
      const oversized = incoming.find((file) => file.size > maxSizeBytes)
      if (oversized) {
        setError(`${oversized.name} is larger than ${maxSizeMb}MB`)
        return
      }
      setError(null)
      setFiles(multiple ? incoming : incoming.slice(0, 1))
    },
    [maxSizeBytes, maxSizeMb, multiple],
  )

  function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    setDragOver(false)
    acceptFiles(Array.from(event.dataTransfer.files))
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) acceptFiles(Array.from(event.target.files))
    event.target.value = ''
  }

  function handleRemove(name: string) {
    setFiles((prev) => prev.filter((file) => file.name !== name))
  }

  function resetAndClose() {
    setFiles([])
    setError(null)
    setDragOver(false)
    onClose()
  }

  function handleSubmit() {
    if (!files.length) return
    onUpload(files)
    resetAndClose()
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={`Upload ${documentName}`}
      subtitle={description}
      size="sm"
      footer={
        <Stack direction="row" spacing={1.25} justifyContent="flex-end" sx={{ width: '100%' }}>
          <Box component="button" type="button" onClick={resetAndClose} sx={{ ...getQuietButtonSx(), px: 3, py: 1.25 }}>
            Cancel
          </Box>
          <Box
            component="button"
            type="button"
            disabled={!files.length}
            onClick={handleSubmit}
            sx={{ ...getAccentButtonSx(), border: 'none', px: 3, py: 1.25 }}
          >
            Upload
          </Box>
        </Stack>
      }
    >
      <Box
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        sx={{
          border: `1px ${dragOver ? 'solid' : 'dashed'} ${dragOver ? applyFlow.accent : applyFlow.hairlineStrong}`,
          borderRadius: applyRadius.card,
          bgcolor: dragOver ? applyFlow.accentSoft : applyFlow.canvas,
          boxShadow: dragOver ? `0 0 0 3px ${applyFlow.accentRing}` : 'none',
          transition: `border-color 150ms ${applyMotion.easeOut}, background-color 150ms ${applyMotion.easeOut}, box-shadow 150ms ${applyMotion.easeOut}`,
          px: 2.5,
          py: 4,
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={handleInputChange}
        />
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: applyRadius.full,
            border: `1px solid ${applyFlow.hairline}`,
            bgcolor: applyFlow.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.25,
            color: applyFlow.inkMuted,
          }}
        >
          <Upload size={18} strokeWidth={1.75} />
        </Box>
        <Typography sx={{ fontFamily: applyFont.body, fontSize: 13.5, fontWeight: 600, color: applyFlow.ink, mb: 0.5 }}>
          Drag & drop your file here, or{' '}
          <Box component="span" sx={{ color: applyFlow.accentInk, fontWeight: 700 }}>
            browse
          </Box>
        </Typography>
        <Typography sx={{ fontFamily: applyFont.body, fontSize: 12, color: applyFlow.inkMuted }}>
          {acceptLabel} · max {maxSizeMb}MB
        </Typography>
      </Box>

      {error ? (
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.25, color: applyFlow.critical }}>
          <AlertCircle size={14} />
          <Typography sx={{ fontFamily: applyFont.body, fontSize: 12, fontWeight: 600 }}>{error}</Typography>
        </Stack>
      ) : null}

      {files.length > 0 ? (
        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
          {files.map((file) => (
            <Stack
              key={file.name}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                px: 1.25,
                py: 0.85,
                borderRadius: applyRadius.control,
                border: `1px solid ${applyFlow.hairline}`,
                bgcolor: applyFlow.surface,
              }}
            >
              <FileText size={16} style={{ color: applyFlow.inkMuted }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontFamily: applyFont.body, fontSize: 12.5, fontWeight: 600, color: applyFlow.ink }} noWrap>
                  {file.name}
                </Typography>
                <Typography sx={{ fontFamily: applyFont.mono, fontSize: 11, color: applyFlow.inkMuted }}>
                  {formatBytes(file.size)}
                </Typography>
              </Box>
              <Box
                component="button"
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  handleRemove(file.name)
                }}
                sx={{
                  appearance: 'none',
                  border: 'none',
                  background: 'none',
                  p: 0.25,
                  cursor: 'pointer',
                  color: applyFlow.inkMuted,
                  display: 'inline-flex',
                  '&:hover': { color: applyFlow.ink },
                }}
              >
                <X size={14} />
              </Box>
            </Stack>
          ))}
        </Stack>
      ) : null}
    </Modal>
  )
}
