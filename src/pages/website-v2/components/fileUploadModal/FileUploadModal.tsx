import { useCallback, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { AlertCircle, FileText, Upload, X } from 'lucide-react'
import { Button, Modal } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getRingBorderSx, statusElevatedCardShadow, statusVisualRadius, getElevatedStatusCardSx } from '@/pages/website-v2/theme/statusVisualTokens'

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
  const colors = usePublicBrandColors()
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
          <Button label="Cancel" variant="outlined" onClick={resetAndClose} />
          <Button label="Upload" variant="contained" disabled={!files.length} onClick={handleSubmit} />
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
          ...getRingBorderSx(colors.greenDark, dragOver, colors.border),
          borderStyle: dragOver ? 'solid' : 'dashed',
          borderRadius: statusVisualRadius.card,
          bgcolor: colors.surfaceAlt,
          boxShadow: dragOver
            ? `0 0 0 3px ${colors.greenDark}26, ${statusElevatedCardShadow}`
            : statusElevatedCardShadow,
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
            borderRadius: statusVisualRadius.full,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.25,
            color: colors.textSecondary,
          }}
        >
          <Upload size={18} strokeWidth={1.75} />
        </Box>
        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: colors.navy, mb: 0.5 }}>
          Drag & drop your file here, or{' '}
          <Box component="span" sx={{ color: colors.greenDark, fontWeight: 700 }}>
            browse
          </Box>
        </Typography>
        <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
          {acceptLabel} · max {maxSizeMb}MB
        </Typography>
      </Box>

      {error ? (
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.25, color: '#DC2626' }}>
          <AlertCircle size={14} />
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{error}</Typography>
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
                borderRadius: statusVisualRadius.control,
                ...getElevatedStatusCardSx(colors.border),
                bgcolor: colors.white,
              }}
            >
              <FileText size={16} color={colors.textSecondary} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: colors.navy }} noWrap>
                  {file.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
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
                  color: colors.textMuted,
                  display: 'inline-flex',
                  '&:hover': { color: colors.navy },
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
