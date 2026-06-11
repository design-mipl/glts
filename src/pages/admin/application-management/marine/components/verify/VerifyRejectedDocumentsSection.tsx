import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { AlertTriangle } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { VerifyRejectedDocumentEntry } from '../../utils/verifyDocumentsUtils'
import {
  VERIFY_DOCUMENT_GRID_SX,
  VerifyDocumentCard,
} from './VerifyDocumentChecklistSection'

interface VerifyRejectedDocumentsSectionProps {
  entries: VerifyRejectedDocumentEntry[]
  onPreview: (entry: VerifyRejectedDocumentEntry) => void
  onVerify: (entry: VerifyRejectedDocumentEntry) => void
  onReject: (entry: VerifyRejectedDocumentEntry) => void
  onRequestReupload: (entry: VerifyRejectedDocumentEntry) => void
  onGltsUpload?: (entry: VerifyRejectedDocumentEntry) => void
}

function RejectedDocumentCard({
  entry,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
  onGltsUpload,
}: {
  entry: VerifyRejectedDocumentEntry
  onPreview: () => void
  onVerify: () => void
  onReject: () => void
  onRequestReupload: () => void
  onGltsUpload?: () => void
}) {
  const contextLabel =
    entry.scope === 'global'
      ? 'Common document'
      : entry.travelerName
        ? `Traveler · ${entry.travelerName}`
        : undefined

  return (
    <Stack spacing={0.75}>
      {contextLabel ? (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, fontWeight: 600 }}>
          {contextLabel}
        </Typography>
      ) : null}
      <VerifyDocumentCard
        document={entry.document}
        onPreview={onPreview}
        onVerify={onVerify}
        onReject={onReject}
        onRequestReupload={onRequestReupload}
        onGltsUpload={onGltsUpload}
      />
    </Stack>
  )
}

export function VerifyRejectedDocumentsSection({
  entries,
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
        borderColor: 'error.main',
        bgcolor: alpha(theme.palette.error.main, 0.06),
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(theme.palette.error.main, 0.12),
              color: 'error.main',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={16} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color="error.main">
              Rejected documents
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {entries.length} document{entries.length === 1 ? '' : 's'} need customer action before submission.
            </Typography>
          </Box>
        </Stack>

        <Box sx={VERIFY_DOCUMENT_GRID_SX}>
          {entries.map(entry => (
            <RejectedDocumentCard
              key={`${entry.scope}-${entry.travelerId ?? 'global'}-${entry.document.documentId}`}
              entry={entry}
              onPreview={() => onPreview(entry)}
              onVerify={() => onVerify(entry)}
              onReject={() => onReject(entry)}
              onRequestReupload={() => onRequestReupload(entry)}
              onGltsUpload={onGltsUpload ? () => onGltsUpload(entry) : undefined}
            />
          ))}
        </Box>
      </Stack>
    </BaseCard>
  )
}
