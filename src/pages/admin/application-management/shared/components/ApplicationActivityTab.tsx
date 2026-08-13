import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Badge, BaseCard, Button, EmptyState } from '@/design-system/UIComponents'
import { applicationCaseActivityService } from '@/shared/services/applicationCaseActivityService'
import type { ApplicationActivityModule } from '@/shared/types/applicationCaseActivity'
import { formatDisplayDateTime } from '@/shared/utils/formatDisplayDate'

interface ApplicationActivityTabProps {
  applicationId: string
  travelerName?: string
}

function moduleBadgeColor(
  module: ApplicationActivityModule,
): 'neutral' | 'info' | 'success' | 'warning' | 'error' {
  switch (module) {
    case 'assignment':
      return 'info'
    case 'documents':
      return 'warning'
    case 'payment':
      return 'success'
    case 'logistics':
      return 'info'
    case 'status':
      return 'neutral'
    case 'form':
      return 'neutral'
    case 'remarks':
      return 'neutral'
    case 'application':
    default:
      return 'neutral'
  }
}

function moduleLabel(module: ApplicationActivityModule): string {
  switch (module) {
    case 'assignment':
      return 'Assignment'
    case 'documents':
      return 'Documents'
    case 'payment':
      return 'Payment'
    case 'logistics':
      return 'Logistics'
    case 'status':
      return 'Status'
    case 'form':
      return 'Form'
    case 'remarks':
      return 'Remarks'
    case 'application':
    default:
      return 'Application'
  }
}

export function ApplicationActivityTab({ applicationId, travelerName }: ApplicationActivityTabProps) {
  const [refreshKey, setRefreshKey] = useState(0)
  const events = useMemo(() => {
    void refreshKey
    return applicationCaseActivityService.listActivity(applicationId)
  }, [applicationId, refreshKey])

  if (!applicationId.trim()) {
    return <EmptyState title="No application selected" description="Open a case to view activity." />
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Case events will appear here as ops work through this application."
        action={{
          label: 'Refresh',
          onClick: () => setRefreshKey(key => key + 1),
        }}
      />
    )
  }

  return (
    <Stack spacing={1.25} sx={{ flex: 1, minHeight: 0, width: '100%', overflow: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
          End-to-end case activity{travelerName ? ` · focused traveler: ${travelerName}` : ''}
        </Typography>
        <Button label="Refresh" size="sm" variant="neutral" onClick={() => setRefreshKey(key => key + 1)} />
      </Stack>
      {events.map(event => (
        <BaseCard key={event.id} sx={{ p: 1.5 }}>
          <Stack spacing={0.75}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>
                {event.action}
              </Typography>
              <Badge label={moduleLabel(event.module)} color={moduleBadgeColor(event.module)} size="sm" />
            </Stack>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              {event.actor} · {formatDisplayDateTime(event.occurredAt)}
              {event.travelerName ? ` · ${event.travelerName}` : ''}
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.primary', wordBreak: 'break-word' }}>
              {event.detail}
            </Typography>
          </Stack>
        </BaseCard>
      ))}
      <Box sx={{ height: 4 }} />
    </Stack>
  )
}
