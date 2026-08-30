import { useCallback, useImperativeHandle, useRef, type Ref } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FolderArchive } from 'lucide-react'
import { FileUpload } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getElevatedCardSx } from '@/pages/website/theme/retailFlowTokens'

export interface BulkUploadDropzoneHandle {
  /** Opens the native file picker (used by TravellerUploadStatusRow re-upload). */
  open: () => void
}

export interface BulkUploadDropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  title?: string
  disabled?: boolean
  /** Optional imperative handle so parent rows can trigger “Browse” for re-upload. */
  openFilePickerRef?: Ref<BulkUploadDropzoneHandle | null>
}

const DEFAULT_ACCEPT = '.zip,image/*,.pdf'

function fileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`
}

/** Passport bulk upload — same FileUpload card as the customer application flow. */
export function BulkUploadDropzone({
  onFilesSelected,
  accept = DEFAULT_ACCEPT,
  title = 'Upload folder or ZIP',
  disabled = false,
  openFilePickerRef,
}: BulkUploadDropzoneProps) {
  const colors = usePublicBrandColors()
  const reuploadInputRef = useRef<HTMLInputElement>(null)
  const knownKeysRef = useRef<Set<string>>(new Set())

  useImperativeHandle(openFilePickerRef, () => ({
    open: () => reuploadInputRef.current?.click(),
  }))

  const handleUpload = useCallback(
    (files: File[]) => {
      const added = files.filter((file) => {
        const key = fileKey(file)
        if (knownKeysRef.current.has(key)) return false
        knownKeysRef.current.add(key)
        return true
      })
      if (added.length) onFilesSelected(added)
    },
    [onFilesSelected],
  )

  return (
    <Box
      sx={{
        ...getElevatedCardSx(colors.border),
        p: 1.5,
        borderRadius: '12px',
        bgcolor: colors.white,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <FolderArchive size={16} color={colors.greenBright} />
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.navy }}>{title}</Typography>
      </Stack>

      <FileUpload
        onUpload={handleUpload}
        accept={accept}
        multiple
        disabled={disabled}
        dropzoneTitle="Upload — choose files or drag & drop here"
        dropzoneCaption=".zip, images (JPG, PNG), PDF · one file per traveler"
        browseLabel="Browse files"
        sx={{
          // FileUpload defaults to py: 6, which is too tall for this 260px sidebar card.
          '& > div': { py: 1.5, px: 1.5 },
        }}
      />

      <input
        ref={reuploadInputRef}
        type="file"
        accept={accept}
        multiple
        hidden
        disabled={disabled}
        onChange={(event) => {
          if (event.target.files) onFilesSelected(Array.from(event.target.files))
          event.target.value = ''
        }}
      />
    </Box>
  )
}
