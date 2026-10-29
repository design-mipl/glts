import { useCallback, useImperativeHandle, useRef, useState, type Ref } from 'react'
import { Box, Typography } from '@mui/material'
import { FolderArchive } from 'lucide-react'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
} from '@/pages/website/theme/applyFlowTheme'

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

const DEFAULT_ACCEPT = '.zip,image/*,.pdf'

function fileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`
}

/**
 * Bulk document intake for the retail apply flow.
 *
 * Previously built on the design-system `FileUpload` card and `usePublicBrandColors()`,
 * which meant the busiest control on the Documents step rendered in the portal palette
 * while everything around it used the retail gold. It is now a plain drop target styled
 * from `applyFlowTheme`, matching `UploadTile`'s empty state.
 *
 * It deliberately renders no list of accepted files: the per-document rows are the single
 * source of truth for what has landed, and echoing filenames here produced the duplicate
 * "Uploaded documents" block that made the step twice as long as it needed to be.
 */
export function BulkUploadDropzone({
  onFilesSelected,
  accept = DEFAULT_ACCEPT,
  title = 'Upload folder or ZIP',
  caption = 'ZIP, images or PDF — we match each file to the documents below',
  disabled = false,
  openFilePickerRef,
}: BulkUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const knownKeysRef = useRef<Set<string>>(new Set())
  const [dragging, setDragging] = useState(false)

  useImperativeHandle(openFilePickerRef, () => ({
    open: () => inputRef.current?.click(),
  }))

  const handleFiles = useCallback(
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
    <Box sx={{ width: '100%' }}>
      <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event: React.DragEvent) => {
        if (disabled) return
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event: React.DragEvent) => {
        if (disabled) return
        event.preventDefault()
        setDragging(false)
        handleFiles(Array.from(event.dataTransfer.files ?? []))
      }}
      sx={{
        width: '100%',
        appearance: 'none',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        textAlign: 'left',
        px: 3,
        py: 2.25,
        borderRadius: applyRadius.control,
        border: `1px dashed ${dragging ? applyFlow.accent : applyFlow.hairlineStrong}`,
        backgroundColor: dragging ? applyFlow.accentSoft : applyFlow.surface,
        boxShadow: dragging ? `0 0 0 3px ${applyFlow.accentRing}` : 'none',
        opacity: disabled ? 0.55 : 1,
        transition: `border-color 150ms ${applyMotion.easeOut}, background-color 150ms ${applyMotion.easeOut}, box-shadow 150ms ${applyMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover:not(:disabled)': { borderColor: applyFlow.accentBorder },
        },
        '&:focus-visible': {
          outline: 'none',
          borderColor: applyFlow.accent,
          boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 30,
          height: 30,
          flex: '0 0 auto',
          display: 'grid',
          placeItems: 'center',
          borderRadius: applyRadius.chip,
          border: `1px solid ${applyFlow.hairline}`,
          backgroundColor: applyFlow.canvas,
          color: applyFlow.inkMuted,
        }}
      >
        <FolderArchive size={14} strokeWidth={1.9} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: 13.5,
            fontWeight: 600,
            color: applyFlow.ink,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: 12,
            color: applyFlow.inkMuted,
            mt: 0.5,
            lineHeight: 1.4,
          }}
        >
          {caption}
        </Typography>
      </Box>
      </Box>

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
    </Box>
  )
}
