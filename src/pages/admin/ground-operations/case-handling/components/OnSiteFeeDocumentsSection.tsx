import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { FileText, X } from 'lucide-react'
import { FileUpload, FormField } from '@/design-system/UIComponents'

interface OnSiteFeeDocumentsSectionProps {
  attachmentNames: string[]
  readOnly?: boolean
  onAdd: (fileNames: string[]) => void
  onRemove: (fileName: string) => void
  onError?: (message: string) => void
}

export function OnSiteFeeDocumentsSection({
  attachmentNames,
  readOnly = false,
  onAdd,
  onRemove,
  onError,
}: OnSiteFeeDocumentsSectionProps) {
  if (readOnly && attachmentNames.length === 0) return null

  return (
    <Stack spacing={1}>
      <Divider />
      {!readOnly ? (
        <FormField label="Upload documents" optional>
          <FileUpload
            key={`onsite-fee-docs-${attachmentNames.join('|')}`}
            compact
            multiple
            dropzoneTitle="Upload receipts or supporting documents"
            dropzoneCaption="PDF, JPG, or PNG · max 10 MB"
            browseLabel="Browse"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10 * 1024 * 1024}
            onUpload={files => {
              if (files.length === 0) return
              onAdd(files.map(file => file.name))
            }}
            onError={onError}
          />
        </FormField>
      ) : null}
      {attachmentNames.length > 0 ? (
        <Stack spacing={0.5}>
          {attachmentNames.map(fileName => (
            <Stack
              key={fileName}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                px: 1,
                py: 0.75,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                <FileText size={16} />
              </Box>
              <Typography variant="body2" sx={{ flex: 1, fontSize: 12, minWidth: 0 }} noWrap title={fileName}>
                {fileName}
              </Typography>
              {!readOnly ? (
                <IconButton
                  size="small"
                  aria-label={`Remove ${fileName}`}
                  onClick={() => onRemove(fileName)}
                >
                  <X size={14} />
                </IconButton>
              ) : null}
            </Stack>
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
}
