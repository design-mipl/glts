import { Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import type { QuotationRecord } from '@/shared/types/quotation'
import { quotationVersionStatusLabel } from '../../config/quotationStatusConfig'

export function ApprovalHistoryTab({ quotation }: { quotation: QuotationRecord }) {
  const entries = quotation.pricingVersions
    .flatMap((version) =>
      version.approvalHistory.map((entry) => ({
        ...entry,
        versionLabel: version.versionLabel,
      })),
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (entries.length === 0) {
    return (
      <BaseCard sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No approval history yet.
        </Typography>
      </BaseCard>
    )
  }

  return (
    <Stack spacing={1}>
      {entries.map((entry, index) => (
        <BaseCard key={`${entry.timestamp}-${index}`} sx={{ p: 2 }}>
          <Typography variant="subtitle2">
            {entry.versionLabel} · {quotationVersionStatusLabel[entry.status as keyof typeof quotationVersionStatusLabel] ?? entry.status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {entry.actor} · {new Date(entry.timestamp).toLocaleString()}
          </Typography>
          {entry.remarks ? <Typography variant="body2">{entry.remarks}</Typography> : null}
        </BaseCard>
      ))}
    </Stack>
  )
}
