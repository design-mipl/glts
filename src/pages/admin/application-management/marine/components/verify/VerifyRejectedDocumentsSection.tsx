import { Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { BaseCard } from '@/design-system/UIComponents'
import type { VerifyRejectedDocumentEntry } from '../../utils/verifyDocumentsUtils'
import { VERIFY_DOCUMENT_STACK_SX, VerifyDocumentCard } from './VerifyDocumentChecklistSection'

export type RejectedDocumentsSectionVariant = 'qc_flagged' | 'customer_rejected'

interface VerifyRejectedDocumentsSectionProps {
  entries: VerifyRejectedDocumentEntry[]
  variant?: RejectedDocumentsSectionVariant
  title?: string
  subtitle?: string
  previewOnly?: boolean
  onPreview: (entry: VerifyRejectedDocumentEntry) => void
  onVerify: (entry: VerifyRejectedDocumentEntry) => void
  onReject: (entry: VerifyRejectedDocumentEntry) => void
  onRequestReupload: (entry: VerifyRejectedDocumentEntry) => void
  onGltsUpload?: (entry: VerifyRejectedDocumentEntry) => void
}

const SECTION_COPY: Record<
  RejectedDocumentsSectionVariant,
  { title: string; subtitle: (count: number) => string; tone: 'warning' | 'error' }
> = {
  qc_flagged: {
    title: 'Rejected from Submission Pending',
    subtitle: count =>
      `${count} document${count === 1 ? '' : 's'} rejected during QC / Submission Pending. Internal only — confirm, update the remark, or upload a replacement before notifying the customer.`,
    tone: 'warning',
  },
  customer_rejected: {
    title: 'Rejected in Verification Pending',
    subtitle: count =>
      `${count} document${count === 1 ? '' : 's'} rejected during Verification Pending. Update the remark, keep the rejection, or upload a replacement. Visible in the customer portal.`,
    tone: 'error',
  },
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
  variant = 'customer_rejected',
  title,
  subtitle,
  previewOnly = false,
  onPreview,
  onVerify,
  onReject,
  onRequestReupload,
  onGltsUpload,
}: VerifyRejectedDocumentsSectionProps) {
  const theme = useTheme()

  if (entries.length === 0) return null

  const copy = SECTION_COPY[variant]
  const toneColor = copy.tone === 'warning' ? theme.palette.warning.main : theme.palette.error.main

  return (
    <BaseCard
      sx={{
        p: 2,
        borderWidth: 1,
        borderColor: 'divider',
        bgcolor: alpha(toneColor, 0.06),
        boxShadow: 'none',
      }}
    >
      <Stack spacing={1.5}>
        <Stack spacing={0.25}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: toneColor }}>
            {title ?? copy.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {subtitle ?? copy.subtitle(entries.length)}
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
