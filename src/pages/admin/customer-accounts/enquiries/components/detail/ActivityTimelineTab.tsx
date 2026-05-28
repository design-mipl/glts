import { Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'

export function ActivityTimelineTab({ enquiry }: { enquiry: EnquiryRecord }) {
  return (
    <Stack spacing={1.5}>
      {enquiry.activities.map((activity) => (
        <BaseCard key={activity.id} sx={{ p: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">{activity.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(activity.timestamp).toLocaleString()} by {activity.actor}
            </Typography>
            <Typography variant="body2">{activity.description}</Typography>
          </Stack>
        </BaseCard>
      ))}
    </Stack>
  )
}
