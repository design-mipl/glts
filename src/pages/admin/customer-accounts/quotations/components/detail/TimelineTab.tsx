import { Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import type { QuotationRecord } from '@/shared/types/quotation'
import { formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'

export function TimelineTab({ quotation }: { quotation: QuotationRecord }) {
  return (
    <Stack spacing={1}>
      {quotation.activities.map((activity) => (
        <BaseCard key={activity.id} sx={{ p: 2 }}>
          <Typography variant="subtitle2">{activity.action}</Typography>
          <Typography variant="body2" color="text.secondary">
            {activity.actor} · {formatDisplayDateTime(activity.timestamp)}
          </Typography>
          <Typography variant="body2">{activity.detail}</Typography>
        </BaseCard>
      ))}
    </Stack>
  )
}
