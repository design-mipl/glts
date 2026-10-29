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
  customer_rejected: {
    title: 'Rejected by Ops team',
    subtitle: count =>
      `${count} document${count === 1 ? '' : 's'} rejected in Verification Pending. Visible in the customer portal.`,
    tone: 'error',
  },
  qc_flagged: {
    title: 'Rejected by Document team',
    subtitle: count =>
      `${count} document${count === 1 ? '' : 's'} rejected in Submission Pending. Upload a replacement, or reject again to move it to Rejected by Ops team.`,
    tone: 'warning',
  },
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
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.45 }}>
            {subtitle ?? copy.subtitle(entries.length)}
          </Typography>
        </Stack>

        <Stack sx={VERIFY_DOCUMENT_STACK_SX}>
          {entries.map(entry => (
            <VerifyDocumentCard
              key={`${entry.scope}-${entry.travelerId ?? 'global'}-${entry.document.documentId}`}
              document={entry.document}
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
