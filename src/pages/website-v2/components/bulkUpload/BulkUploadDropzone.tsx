import { useCallback, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { FolderUp } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getRingBorderSx, statusVisualRadius } from '@/pages/website-v2/theme/statusVisualTokens'

export interface BulkUploadDropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  title?: string
  caption?: string
  disabled?: boolean
}

const DEFAULT_ACCEPT = '.zip,image/jpeg,image/png,application/pdf'

/** Dashed green dropzone for uploading a whole passport folder or ZIP at once. */
export function BulkUploadDropzone({
  onFilesSelected,
  accept = DEFAULT_ACCEPT,
  title = 'Upload passport folder or ZIP',
  caption = 'Drag & drop, or browse — .zip, JPG, PNG, PDF',
  disabled = false,
}: BulkUploadDropzoneProps) {
  const colors = usePublicBrandColors()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (files: File[]) => {
      if (!files.length) return
      onFilesSelected(files)
    },
    [onFilesSelected],
  )

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
      onClick={() => !disabled && inputRef.current?.click()}
      sx={{
        ...getRingBorderSx(colors.greenDark, dragOver, colors.border),
        borderWidth: '1.5px',
        borderStyle: dragOver ? 'solid' : 'dashed',
        borderRadius: statusVisualRadius.card,
        bgcolor: colors.white,
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
      <Typography sx={{ fontSize: 12.5, color: colors.textMuted }}>{caption}</Typography>
    </Box>
  )
}
