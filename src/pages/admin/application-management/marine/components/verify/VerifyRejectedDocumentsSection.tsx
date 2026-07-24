import { Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { BaseCard } from '@/design-system/UIComponents'
import type { VerifyRejectedDocumentEntry } from '../../utils/verifyDocumentsUtils'
import { VERIFY_DOCUMENT_STACK_SX, VerifyDocumentCard } from './VerifyDocumentChecklistSection'

interface VerifyRejectedDocumentsSectionProps {
  entries: VerifyRejectedDocumentEntry[]
  previewOnly?: boolean
  onPreview: (entry: VerifyRejectedDocumentEntry) => void
  onVerify: (entry: VerifyRejectedDocumentEntry) => void
  onReject: (entry: VerifyRejectedDocumentEntry) => void
  onRequestReupload: (entry: VerifyRejectedDocumentEntry) => void
  onGltsUpload?: (entry: VerifyRejectedDocumentEntry) => void
}

function RejectedDocumentCard({
  entry,
  previewOnly = false,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
  onGltsUpload,
}: {
  entry: VerifyRejectedDocumentEntry
  previewOnly?: boolean
  onPreview: () => void
  onVerify: () => void
  onReject: () => void
  onRequestReupload: () => void
  onGltsUpload?: () => void
}) {
  return (
    <VerifyDocumentCard
      document={entry.document}
      previewOnly={previewOnly}
      onPreview={onPreview}
      onVerify={onVerify}
      onReject={onReject}
      onRequestReupload={onRequestReupload}
      onGltsUpload={onGltsUpload}
    />
  )
}

export function VerifyRejectedDocumentsSection({
  entries,
  previewOnly = false,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
  onGltsUpload,
}: VerifyRejectedDocumentsSectionProps) {
  const theme = useTheme()

  if (entries.length === 0) return null

  return (
    <BaseCard
      sx={{
        p: 2,
        borderWidth: 1,
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.error.main, 0.06),
        boxShadow: 'none',
      }}
    >
      <Stack spacing={1.5}>
        <Stack spacing={0.25}>
          <Typography variant="subtitle2" fontWeight={700} color="error.main">
            Rejected documents
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {entries.length} document{entries.length === 1 ? '' : 's'} need customer action before submission.
          </Typography>
        </Stack>

        <Stack sx={VERIFY_DOCUMENT_STACK_SX}>
          {entries.map(entry => (
            <RejectedDocumentCard
              key={`${entry.scope}-${entry.travelerId ?? 'global'}-${entry.document.documentId}`}
              entry={entry}
              previewOnly={previewOnly}
              onPreview={() => onPreview(entry)}
              onVerify={() => onVerify(entry)}
              onReject={() => onReject(entry)}
              onRequestReupload={() => onRequestReupload(entry)}
              onGltsUpload={onGltsUpload ? () => onGltsUpload(entry) : undefined}
            />
          ))}
        </Stack>
      </Stack>
    </BaseCard>
  )
}
