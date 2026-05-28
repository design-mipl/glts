import { useState, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MuiButton from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import { useTheme, alpha } from '@mui/material/styles'
import { Upload, X, FileText } from 'lucide-react'
import type { SxProps, Theme } from '@mui/material/styles'

export interface FileUploadProps {
  label?: string
  /** Main line inside the drop zone (default: generic file picker copy). */
  dropzoneTitle?: string
  /** Secondary line inside the drop zone; falls back to accept/maxSize when omitted. */
  dropzoneCaption?: string
  browseLabel?: string
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  onUpload: (files: File[]) => void
  onError?: (error: string) => void
  disabled?: boolean
  helperText?: string
  error?: boolean
  preview?: boolean
  sx?: SxProps<Theme>
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileSignature(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`
}

function fileMatchesAccept(file: File, accept: string): boolean {
  const allowed = accept.split(',').map(token => token.trim()).filter(Boolean)
  return allowed.some(token => {
    if (token.startsWith('.')) {
      return file.name.toLowerCase().endsWith(token.toLowerCase())
    }
    if (token.endsWith('/*')) {
      const prefix = token.slice(0, -1)
      if (file.type && file.type.startsWith(prefix)) return true
      if (prefix === 'image/') {
        return /\.(png|jpe?g|gif|webp|bmp|svg|heic|heif|tiff?)$/i.test(file.name)
      }
      return false
    }
    return file.type === token
  })
}

export default function FileUpload({
  label,
  dropzoneTitle = 'Choose a file or drag & drop it here',
  dropzoneCaption,
  browseLabel = 'Browse Files',
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  onUpload,
  onError,
  disabled = false,
  helperText,
  error = false,
  preview = false,
  sx,
}: FileUploadProps) {
  const theme = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const filesRef = useRef<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

  const commitFiles = useCallback(
    (next: File[]) => {
      filesRef.current = next
      setFiles(next)
      onUpload(next)
    },
    [onUpload],
  )

  const processFiles = useCallback(
    (incoming: File[]) => {
      const currentFiles = filesRef.current
      if (maxFiles && currentFiles.length + incoming.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`)
        return
      }
      const valid: File[] = []
      for (const file of incoming) {
        if (maxSize && file.size > maxSize) {
          onError?.(`${file.name} exceeds max size of ${formatBytes(maxSize)}`)
          continue
        }
        if (accept) {
          if (!fileMatchesAccept(file, accept)) {
            onError?.(`${file.name} is not an allowed file type`)
            continue
          }
        }
        valid.push(file)

        if (preview && file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          setPreviewUrls((prev) => ({ ...prev, [file.name]: url }))
        }
      }
      if (valid.length) {
        const currentKeys = new Set(currentFiles.map(getFileSignature))
        const uniqueIncoming = valid.filter(file => !currentKeys.has(getFileSignature(file)))
        const next = multiple
          ? uniqueIncoming.length > 0
            ? [...currentFiles, ...uniqueIncoming]
            : currentFiles
          : valid
        if (next.length === currentFiles.length && multiple) {
          onError?.('This file is already in the upload list')
          return
        }
        commitFiles(next)
      }
    },
    [maxFiles, maxSize, accept, multiple, preview, commitFiles, onError],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setDragOver(true)
  }
  const handleDragLeave = () => setDragOver(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled) return
    processFiles(Array.from(e.dataTransfer.files))
  }
  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files))
    e.target.value = ''
  }
  const handleRemove = (signature: string) => {
    const removed = filesRef.current.find(file => getFileSignature(file) === signature)
    const next = filesRef.current.filter(file => getFileSignature(file) !== signature)
    commitFiles(next)
    if (removed && previewUrls[removed.name]) {
      URL.revokeObjectURL(previewUrls[removed.name])
      setPreviewUrls(prev => {
        const copy = { ...prev }
        delete copy[removed.name]
        return copy
      })
    }
  }

  return (
    <Box sx={sx}>
      {label && (
        <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
          {label}
        </Typography>
      )}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: error
            ? 'error.main'
            : dragOver
              ? 'primary.main'
              : theme.palette.divider,
          borderRadius: '8px',
          py: 6,
          px: 3,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          bgcolor: dragOver
            ? alpha(theme.palette.primary.main, 0.04)
            : theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.02)
              : '#F9FAFB',
          opacity: disabled ? 0.5 : 1,
          '&:hover': disabled ? {} : {
            borderColor: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.03),
          },
        }}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Upload size={22} color={theme.palette.primary.main} />
          </Box>
        </Box>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
          {dropzoneTitle}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          {dropzoneCaption ??
            `${accept ? accept.replace(/,/g, ', ') : 'All file types supported'}${maxSize ? ` — up to ${formatBytes(maxSize)}` : ''}`}
        </Typography>
        <MuiButton
          variant="outlined"
          size="small"
          onClick={(e) => { e.stopPropagation(); handleClick() }}
          disabled={disabled}
          sx={{
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'none',
            px: 2,
            py: 0.75,
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.04) },
          }}
        >
          {browseLabel}
        </MuiButton>
      </Box>

      {helperText && (
        <FormHelperText error={error} sx={{ mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}

      {files.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {files.map((file) => (
            <Box
              key={getFileSignature(file)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: '6px 8px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              {preview && previewUrls[file.name] ? (
                <Box
                  component="img"
                  src={previewUrls[file.name]}
                  alt={file.name}
                  sx={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                />
              ) : (
                <FileText size={24} style={{ opacity: 0.4, flexShrink: 0 }} />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" noWrap display="block">
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {formatBytes(file.size)}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => handleRemove(getFileSignature(file))}>
                <X size={16} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
