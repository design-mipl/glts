import { Stack, Typography } from '@mui/material'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'

interface FollowupsTabProps {
  enquiry: EnquiryRecord
  onAdd: () => void
  onMarkComplete: (followupId: string) => void
}

export function FollowupsTab({ enquiry, onAdd, onMarkComplete }: FollowupsTabProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="flex-end">
        <Button label="Add Follow-up" size="sm" onClick={onAdd} />
      </Stack>
      {enquiry.followups.map((entry) => (
        <BaseCard key={entry.id} sx={{ p: 2, boxShadow: 'none' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between">
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">{entry.followupType.toUpperCase()}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(entry.followupDate).toLocaleDateString()} {entry.followupTime}
              </Typography>
              <Typography variant="body2">{entry.discussionSummary}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Badge label={entry.followupStatus} color={entry.followupStatus === 'completed' ? 'success' : 'warning'} size="sm" />
              {entry.followupStatus !== 'completed' ? (
                <Button label="Mark Completed" size="sm" variant="outlined" onClick={() => onMarkComplete(entry.id)} />
              ) : null}
            </Stack>
          </Stack>
        </BaseCard>
      ))}
    </Stack>
  )
}
