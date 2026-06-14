import { useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import { Badge, EmptyState } from '@/design-system/UIComponents'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import type { OperationsDeskGroup } from '../utils/operationalCaseHandlingUtils'
import {
  formatJoiningDate,
  priorityBadgeColor,
  statusBadgeColor,
} from '../utils/operationalCaseHandlingUtils'

interface OperationsDeskCardListProps {
  groups: OperationsDeskGroup[]
  groupBy: string
  selectedId?: string | null
  onSelect: (row: OperationalCase) => void
  emptyTitle: string
  emptyDescription: string
}

export function OperationsDeskCardList({
  groups,
  groupBy,
  selectedId,
  onSelect,
  emptyTitle,
  emptyDescription,
}: OperationsDeskCardListProps) {
  const totalRows = groups.reduce((sum, group) => sum + group.rows.length, 0)

  if (totalRows === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </Box>
    )
  }

  return (
    <Stack spacing={1.25} sx={{ p: 2 }}>
      {groups.map(group =>
        groupBy === 'none' ? (
          group.rows.map(row => (
            <OperationsDeskPassengerCard
              key={row.id}
              row={row}
              isSelected={selectedId === row.id}
              onSelect={onSelect}
            />
          ))
        ) : (
          <OperationsDeskGroupSection
            key={group.key}
            group={group}
            groupBy={groupBy}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ),
      )}
    </Stack>
  )
}

function OperationsDeskGroupSection({
  group,
  groupBy,
  selectedId,
  onSelect,
}: {
  group: OperationsDeskGroup
  groupBy: string
  selectedId?: string | null
  onSelect: (row: OperationalCase) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const hideBatchContext = groupBy === 'application'

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setExpanded(v => !v)}
        sx={{ px: 1.5, py: 1, cursor: 'pointer', bgcolor: 'action.hover' }}
      >
        <Stack spacing={0.2} minWidth={0}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {group.label}
          </Typography>
          {group.subtitle ? (
            <Typography variant="caption" color="text.secondary" noWrap>
              {group.subtitle}
            </Typography>
          ) : null}
        </Stack>
        <ChevronDown
          size={16}
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}
        />
      </Stack>
      <Collapse in={expanded}>
        <Stack spacing={0.75} sx={{ p: 1, pt: 0.5 }}>
          {group.rows.map(row => (
            <OperationsDeskPassengerCard
              key={row.id}
              row={row}
              isSelected={selectedId === row.id}
              onSelect={onSelect}
              compact
              hideBatchContext={hideBatchContext}
            />
          ))}
        </Stack>
      </Collapse>
    </Box>
  )
}

function OperationsDeskPassengerCard({
  row,
  isSelected,
  onSelect,
  compact = false,
  hideBatchContext = false,
}: {
  row: OperationalCase
  isSelected: boolean
  onSelect: (row: OperationalCase) => void
  compact?: boolean
  hideBatchContext?: boolean
}) {
  const showNextAction = row.status !== 'Completed' && Boolean(row.nextAction) && row.nextAction !== '—'

  return (
    <Box
      onClick={() => onSelect(row)}
      sx={{
        px: compact ? 1.25 : 1.5,
        py: compact ? 1 : 1.25,
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
      {compact ? (
        <SlimPassengerCardBody row={row} showNextAction={showNextAction} hideBatchContext={hideBatchContext} />
      ) : (
        <FullPassengerCardBody row={row} showNextAction={showNextAction} />
      )}
    </Box>
  )
}

function formatRoutingContext(row: OperationalCase): string {
  return [row.country, row.visaType, row.jurisdiction, row.assignedTeam].filter(Boolean).join(' · ')
}

function RoutingContextLine({ row }: { row: OperationalCase }) {
  return (
    <Typography
      variant="body2"
      noWrap
      sx={{
        fontSize: 13,
        fontWeight: 600,
        color: 'text.primary',
        lineHeight: 1.45,
      }}
    >
      {formatRoutingContext(row)}
    </Typography>
  )
}

function PassengerIdentityRow({ row }: { row: OperationalCase }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
      <Stack spacing={0.25} minWidth={0} flex={1}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 15, lineHeight: 1.3 }}>
          {row.passengerName}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, lineHeight: 1.4 }}>
          {row.passengerRank} · {row.operationalId}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap justifyContent="flex-end" sx={{ flexShrink: 0 }}>
        <Badge label={row.status} color={statusBadgeColor(row.status)} size="sm" />
        <Badge label={row.priority} color={priorityBadgeColor(row.priority)} size="sm" />
      </Stack>
    </Stack>
  )
}

function FullPassengerCardBody({
  row,
  showNextAction,
}: {
  row: OperationalCase
  showNextAction: boolean
}) {
  return (
    <Stack spacing={1}>
      <PassengerIdentityRow row={row} />
      <RoutingContextLine row={row} />

      <Box
        sx={{
          px: 1.25,
          py: 1,
          borderRadius: 1.25,
          bgcolor: 'action.hover',
          border: 1,
          borderColor: 'divider',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: showNextAction ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
            md: showNextAction ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          },
          gap: 1,
        }}
      >
        {showNextAction ? (
          <ActionMeta label="Next action" value={row.nextAction} emphasize />
        ) : null}
        <ActionMeta label="Joining date" value={formatJoiningDate(row.joiningDate)} />
        <ActionMeta label="Executive" value={row.assignedExecutive || '—'} />
        <ActionMeta label="Expense" value={row.expenseSummary} />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, lineHeight: 1.45 }} noWrap>
        Batch {row.applicationId} · {row.companyName} · {row.vesselName}
      </Typography>
    </Stack>
  )
}

function SlimPassengerCardBody({
  row,
  showNextAction,
  hideBatchContext,
}: {
  row: OperationalCase
  showNextAction: boolean
  hideBatchContext: boolean
}) {
  const focusParts = [
    showNextAction ? `Next: ${row.nextAction}` : null,
    `Joining ${formatJoiningDate(row.joiningDate)}`,
    row.expenseSummary,
  ].filter(Boolean)

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }} noWrap>
          {row.passengerName}
          <Typography component="span" variant="caption" color="text.secondary" sx={{ fontSize: 11, ml: 0.75 }}>
            · {row.passengerRank}
          </Typography>
        </Typography>
        <Badge label={row.status} color={statusBadgeColor(row.status)} size="sm" />
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }} noWrap>
        {row.operationalId}
        {!hideBatchContext ? ` · ${row.applicationId}` : ''}
      </Typography>

      <RoutingContextLine row={row} />

      <Typography variant="caption" sx={{ fontSize: 11, lineHeight: 1.45 }} noWrap>
        {focusParts.join('  ·  ')}
      </Typography>
    </Stack>
  )
}

function ActionMeta({
  label,
  value,
  emphasize = false,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <Stack spacing={0.2} minWidth={0}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.3 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        noWrap
        sx={{
          fontSize: 12,
          fontWeight: emphasize ? 600 : 500,
          color: emphasize ? 'text.primary' : 'text.primary',
        }}
      >
        {value || '—'}
      </Typography>
    </Stack>
  )
}
