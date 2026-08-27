import { useCallback, useImperativeHandle, useRef, useState, type Ref } from 'react'
import { Box, Typography } from '@mui/material'
import { Cloud, FolderUp } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  getRingBorderSx,
  statusElevatedCardShadow,
  statusVisualRadius,
} from '@/pages/website-v2/theme/statusVisualTokens'

export interface BulkUploadDropzoneHandle {
  /** Opens the native file picker (used by TravellerUploadStatusRow re-upload). */
  open: () => void
}

export interface BulkUploadDropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  title?: string
  caption?: string
  disabled?: boolean
  /** Optional imperative handle so parent rows can trigger “Browse” for re-upload. */
  openFilePickerRef?: Ref<BulkUploadDropzoneHandle | null>
}

const DEFAULT_ACCEPT = '.zip,image/jpeg,image/png,application/pdf'

/** Dashed green dropzone for uploading a whole passport folder or ZIP at once. */
export function BulkUploadDropzone({
  onFilesSelected,
  accept = DEFAULT_ACCEPT,
  title = 'Upload a passport folder or ZIP',
  caption = "Anything we can't auto-identify goes into a tray for you to sort in a tap. ZIP, JPG, PNG, or PDF.",
  disabled = false,
  openFilePickerRef,
}: BulkUploadDropzoneProps) {
  const colors = usePublicBrandColors()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  useImperativeHandle(openFilePickerRef, () => ({
    open: () => inputRef.current?.click(),
  }))

  const handleFiles = useCallback(
    (files: File[]) => {
      if (!files.length) return
      onFilesSelected(files)
    },
    [onFilesSelected],
  )

  function openFilePicker() {
    if (!disabled) inputRef.current?.click()
  }

  return (
    <Box
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragOver(false)
        if (disabled) return
        handleFiles(Array.from(event.dataTransfer.files))
      }}
      onClick={openFilePicker}
      sx={{
        ...getRingBorderSx(colors.greenDark, dragOver, colors.border),
        borderWidth: '1.5px',
        borderStyle: dragOver ? 'solid' : 'dashed',
        borderRadius: statusVisualRadius.card,
        bgcolor: colors.white,
        boxShadow: dragOver
          ? `0 0 0 3px ${colors.greenDark}26, ${statusElevatedCardShadow}`
          : statusElevatedCardShadow,
        px: 3,
        py: 5,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        hidden
        disabled={disabled}
        onChange={(event) => {
          if (event.target.files) handleFiles(Array.from(event.target.files))
          event.target.value = ''
        }}
      />
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: statusVisualRadius.full,
          bgcolor: colors.greenMuted,
          color: colors.greenDark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 1.5,
        }}
      >
        <FolderUp size={22} strokeWidth={1.75} />
      </Box>
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.navy, mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ fontSize: 12.5, color: colors.textMuted, mb: 2.5, maxWidth: 360, mx: 'auto' }}>
        {caption}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          component="button"
          type="button"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation()
            openFilePicker()
          }}
          sx={{
            appearance: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            bgcolor: colors.greenDark,
            color: '#fff',
            borderRadius: statusVisualRadius.control,
            px: 2,
            py: 1,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'inherit',
            lineHeight: 1.2,
          }}
        >
          Browse files
        </Box>

        {/* TODO: wire Google Drive / cloud import when available */}
        <Box
          component="button"
          type="button"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation()
          }}
          sx={{
            appearance: 'none',
            border: `1.5px solid ${colors.greenDark}`,
            cursor: disabled ? 'not-allowed' : 'pointer',
            bgcolor: colors.greenMuted,
            color: colors.greenDark,
            borderRadius: statusVisualRadius.control,
            px: 2,
            py: 1,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'inherit',
            lineHeight: 1.2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
          }}
        >
          <Cloud size={15} strokeWidth={2} />
          Import from Drive
        </Box>
      </Box>
    </Box>
  )
}
