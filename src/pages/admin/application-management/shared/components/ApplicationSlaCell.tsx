import { Box, Typography } from '@mui/material'
import { Badge, Tooltip } from '@/design-system/UIComponents'
import type { ApplicationListingSlaRow } from '@/shared/utils/applicationSlaUtils'
import {
  applicationSlaBadgeColor,
  applicationSlaBadgeLabel,
  resolveApplicationOpsSlaDisplay,
} from '@/shared/utils/applicationSlaUtils'
import type { SlaSegment } from '@/shared/types/slaMaster'

interface ApplicationSlaCellProps {
  row: ApplicationListingSlaRow
  segment: SlaSegment
  queueStage: string | null
}

export function ApplicationSlaCell({ row, segment, queueStage }: ApplicationSlaCellProps) {
  const display = resolveApplicationOpsSlaDisplay(row, segment, queueStage)

  if (!display) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        —
      </Typography>
    )
  }

  const tooltip = [
    `${display.stageLabel}: ${display.stageHours}h target · ${display.remainingLabel} left`,
    `E2E ops: ${display.e2eHours}h target · ${display.e2eRemainingLabel} left`,
  ].join('\n')

  return (
    <Tooltip content={tooltip} placement="top">
      <Box sx={{ display: 'inline-flex', maxWidth: '100%' }}>
        <Badge
          label={applicationSlaBadgeLabel(display)}
          color={applicationSlaBadgeColor(display.state)}
          size="sm"
        />
      </Box>
    </Tooltip>
  )
}
