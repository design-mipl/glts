import { Box, Stack, Typography } from '@mui/material'
import { Badge, Button, EmptyState } from '@/design-system/UIComponents'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'
import {
  assignmentPriorityBadgeColor,
  assignmentPriorityLabel,
} from '../config/assignmentPriorityConfig'
import { passengerStatusBadgeColor, passengerStatusLabel } from '../config/assignmentStatusConfig'
import { formatSlaTimer, isSlaAtRisk } from '../utils/assignmentQueueListingUtils'
import type { DeskPassengerAction } from './AssignmentActionMenu'

interface OperationsDeskSectionListProps {
  title: string
  rows: OperationalPassengerRow[]
  selectedId?: string | null
  onSelect: (row: OperationalPassengerRow) => void
  onAction: (action: DeskPassengerAction, row: OperationalPassengerRow) => void
  showDeskActions?: boolean
}

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function OperationsDeskSectionList({
  title,
  rows,
  selectedId,
  onSelect,
  onAction,
  showDeskActions = true,
}: OperationsDeskSectionListProps) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" fontWeight={700}>
        {title}
        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          ({rows.length})
        </Typography>
      </Typography>
      {rows.length === 0 ? (
        <EmptyState title="No records" description={`No passengers in ${title.toLowerCase()}.`} />
      ) : (
        <Stack spacing={0.75}>
          {rows.map(row => {
            const isSelected = selectedId === row.id
            return (
              <Box
                key={row.id}
                onClick={() => onSelect(row)}
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? 'action.selected' : 'background.paper',
                  cursor: 'pointer',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Stack spacing={0.35} minWidth={0}>
                    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography variant="body2" fontWeight={700} noWrap>
                        {row.passengerName}
                      </Typography>
                      <Badge label={assignmentPriorityLabel[row.priority]} color={assignmentPriorityBadgeColor(row.priority)} size="sm" />
                      <Badge label={passengerStatusLabel[row.passengerStatus]} color={passengerStatusBadgeColor(row.passengerStatus)} size="sm" />
                      {isSlaAtRisk(row) ? <Badge label="SLA risk" color="error" size="sm" /> : null}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {row.gltsApplicationId} · {row.companyName}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                    {formatUpdated(row.lastUpdated)}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 0.75,
                    mt: 1,
                  }}
                >
                  <Meta label="Team" value={row.assignedTeam || '—'} />
                  <Meta label="User" value={row.assignedUser || '—'} />
                  <Meta label="SLA" value={formatSlaTimer(row)} />
                  <Meta label="Operational date" value={row.operationalDate} />
                </Box>
                {showDeskActions ? (
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1 }} onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant="outlined" label="Update status" onClick={() => onAction('update_status', row)} />
                    <Button size="sm" variant="text" label="Add remarks" onClick={() => onAction('add_notes', row)} />
                    <Button size="sm" variant="text" label="Upload proof" onClick={() => onAction('upload_proof', row)} />
                    <Button size="sm" variant="text" label="Complete" onClick={() => onAction('mark_complete', row)} />
                    <Button size="sm" variant="text" label="Escalate" onClick={() => onAction('escalate', row)} />
                  </Stack>
                ) : null}
              </Box>
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.15}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 10 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 12 }} noWrap>
        {value}
      </Typography>
    </Stack>
  )
}
