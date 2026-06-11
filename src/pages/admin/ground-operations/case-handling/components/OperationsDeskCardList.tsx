import { Box, Stack, Typography } from '@mui/material'
import { Badge, EmptyState } from '@/design-system/UIComponents'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { priorityBadgeColor, statusBadgeColor } from '../utils/operationalCaseHandlingUtils'

interface OperationsDeskCardListProps {
  rows: OperationalCase[]
  selectedId?: string | null
  onSelect: (row: OperationalCase) => void
  emptyTitle: string
  emptyDescription: string
}

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function OperationsDeskCardList({
  rows,
  selectedId,
  onSelect,
  emptyTitle,
  emptyDescription,
}: OperationsDeskCardListProps) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
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
              transition: 'border-color 0.15s, background-color 0.15s',
              '&:hover': {
                borderColor: isSelected ? 'primary.main' : 'action.focus',
                bgcolor: isSelected ? 'action.selected' : 'action.hover',
              },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Stack spacing={0.35} minWidth={0}>
                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Typography variant="body2" fontWeight={700}>
                    {row.applicationId}
                  </Typography>
                  <Badge label={row.priority} color={priorityBadgeColor(row.priority)} size="sm" />
                  <Badge label={row.status} color={statusBadgeColor(row.status)} size="sm" />
                </Stack>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {row.companyName}
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
              <Meta label="Executive" value={row.assignedExecutive || '—'} />
              <Meta label="Services" value={row.servicesSummary} />
              <Meta label="Expenses" value={row.expenseSummary} />
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.15}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 10 }}>
        {label}
      </Typography>
      <Typography variant="body2" noWrap sx={{ fontSize: 12 }}>
        {value}
      </Typography>
    </Stack>
  )
}
