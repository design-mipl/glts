import { Box, Stack, Typography } from '@mui/material'
import type { OperationalTimelineEvent } from '@/shared/types/operationalCaseHandling'

interface OperationalTimelineProps {
  events: OperationalTimelineEvent[]
}

export function OperationalTimeline({ events }: OperationalTimelineProps) {
  if (events.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary">
        No operational history yet.
      </Typography>
    )
  }

  return (
    <Stack spacing={0}>
      {events.map((event, index) => (
        <Stack key={event.id} direction="row" spacing={1.25} sx={{ minHeight: 36 }}>
          <Stack alignItems="center" sx={{ width: 14, flexShrink: 0 }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: index === 0 ? 'primary.main' : 'action.selected',
                mt: 0.6,
              }}
            />
            {index < events.length - 1 ? (
              <Box sx={{ width: 1, flex: 1, bgcolor: 'divider', my: 0.25 }} />
            ) : null}
          </Stack>
          <Stack spacing={0.15} sx={{ pb: 1.25, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {event.displayDate}
              {event.actor ? ` · ${event.actor}` : ''}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12, lineHeight: 1.35 }}>
              {event.label}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}
