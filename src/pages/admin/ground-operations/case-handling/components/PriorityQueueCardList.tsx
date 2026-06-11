import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Badge,
  ColumnFilter,
  ColumnHeader,
  EmptyState,
  RowActions,
} from '@/design-system/UIComponents'
import type { Column, TableState } from '@/design-system/UIComponents'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import {
  getOperationalCaseCellValue,
  PRIORITY_QUEUE_COLUMNS,
  PRIORITY_QUEUE_GRID_TEMPLATE,
  priorityBadgeColor,
  statusBadgeColor,
} from '../utils/operationalCaseHandlingUtils'
import type { AdminCaseAction } from './OperationalCaseActionMenu'

interface PriorityQueueCardListProps {
  rows: OperationalCase[]
  filterSourceRows: OperationalCase[]
  selectedId?: string | null
  onSelect: (row: OperationalCase) => void
  onAction: (action: AdminCaseAction, row: OperationalCase) => void
  emptyTitle: string
  emptyDescription: string
  tableState: TableState
  onTableStateChange: (state: TableState) => void
  columnFilters: Record<string, string[]>
  onColumnFiltersChange: (filters: Record<string, string[]>) => void
}

function formatUpdated(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function PriorityQueueCardList({
  rows,
  filterSourceRows,
  selectedId,
  onSelect,
  onAction,
  emptyTitle,
  emptyDescription,
  tableState,
  onTableStateChange,
  columnFilters,
  onColumnFiltersChange,
}: PriorityQueueCardListProps) {
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null)

  const columnLabels = useMemo(() => {
    const map: Record<string, string> = {}
    for (const col of PRIORITY_QUEUE_COLUMNS) {
      if (col.key !== 'actions') map[col.key] = col.label
    }
    return map
  }, [])

  const uniqueValues = useMemo(() => {
    if (!activeFilterColumn) return []
    const values = new Set<string>()
    for (const row of filterSourceRows) {
      values.add(getOperationalCaseCellValue(row, activeFilterColumn))
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [activeFilterColumn, filterSourceRows])

  const handleSort = (key: string) => {
    let dir = tableState.sortDirection
    if (tableState.sortKey !== key) dir = 'asc'
    else if (dir === 'asc') dir = 'desc'
    else if (dir === 'desc') dir = null
    else dir = 'asc'
    onTableStateChange({
      ...tableState,
      page: 0,
      sortKey: dir === null ? null : key,
      sortDirection: dir,
    })
  }

  const handleFilterClick = (event: MouseEvent<HTMLElement>, columnKey: string) => {
    setFilterAnchor(event.currentTarget)
    setActiveFilterColumn(columnKey)
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <>
      <Stack spacing={0.75}>
        <Box
          sx={{
            display: { xs: 'none', lg: 'grid' },
            gridTemplateColumns: PRIORITY_QUEUE_GRID_TEMPLATE,
            gap: 1,
            px: 1.5,
            py: 1,
            bgcolor: 'action.hover',
            borderRadius: 1,
            alignItems: 'end',
          }}
        >
          {PRIORITY_QUEUE_COLUMNS.map(col => (
            <Box key={col.key} sx={{ minWidth: 0 }}>
              {col.key === 'actions' ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{
                    textTransform: 'uppercase',
                    letterSpacing: 0.35,
                    fontSize: 10,
                    textAlign: 'center',
                    display: 'block',
                    pb: 0.5,
                  }}
                >
                  Actions
                </Typography>
              ) : (
                <ColumnHeader
                  column={col as Column}
                  sortKey={tableState.sortKey}
                  sortDirection={tableState.sortDirection}
                  onSort={handleSort}
                  searchValue=""
                  onSearch={() => {}}
                  filterCount={(columnFilters[col.key] ?? []).length}
                  showColumnSearch={false}
                  enableColumnSort={col.sortable !== false}
                  onFilterClick={
                    col.filterable !== false
                      ? e => handleFilterClick(e, col.key)
                      : undefined
                  }
                />
              )}
            </Box>
          ))}
        </Box>

        {rows.map(row => {
          const isSelected = selectedId === row.id
          return (
            <Box
              key={row.id}
              onClick={() => onSelect(row)}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: PRIORITY_QUEUE_GRID_TEMPLATE,
                },
                gap: { xs: 0.75, lg: 1 },
                alignItems: 'center',
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
              <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {row.applicationId}
                </Typography>
                {row.carryForward ? (
                  <Badge label="Moved to Next Day" color="warning" size="sm" />
                ) : null}
              </Stack>

              <Cell label="Company" value={row.companyName} hideOnDesktop />
              <StackedCell
                label="Country / Visa"
                primary={row.country}
                secondary={row.visaType}
                hideOnDesktop
              />
              <Cell label="Applicants" value={String(row.applicantCount)} hideOnDesktop />

              <Box>
                <Badge label={row.priority} color={priorityBadgeColor(row.priority)} size="sm" />
              </Box>

              <Box>
                <Badge label={row.status} color={statusBadgeColor(row.status)} size="sm" />
              </Box>

              <StackedCell
                label="Team / Executive"
                primary={row.assignedTeam || '—'}
                secondary={row.assignedExecutive || 'Unassigned'}
                hideOnDesktop
              />

              <Box
                onClick={e => e.stopPropagation()}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <RowActions row={row} actions={buildAdminMenuItems(onAction)} />
              </Box>

              <Box sx={{ display: { xs: 'block', lg: 'none' }, gridColumn: '1 / -1' }}>
                <Typography variant="caption" color="text.secondary">
                  {row.country} · {row.visaType} · {row.applicantCount} applicants · Updated{' '}
                  {formatUpdated(row.lastUpdated)}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Stack>

      <ColumnFilter
        open={Boolean(activeFilterColumn)}
        anchorEl={filterAnchor}
        columnKey={activeFilterColumn}
        columnLabel={activeFilterColumn ? (columnLabels[activeFilterColumn] ?? activeFilterColumn) : ''}
        uniqueValues={uniqueValues}
        selectedValues={activeFilterColumn ? (columnFilters[activeFilterColumn] ?? []) : []}
        onClose={() => {
          setFilterAnchor(null)
          setActiveFilterColumn(null)
        }}
        onApply={(columnKey, values) => {
          onColumnFiltersChange({ ...columnFilters, [columnKey]: values })
          onTableStateChange({ ...tableState, page: 0 })
        }}
      />
    </>
  )
}

function StackedCell({
  label,
  primary,
  secondary,
  hideOnDesktop,
}: {
  label: string
  primary: string
  secondary: string
  hideOnDesktop?: boolean
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: hideOnDesktop ? { lg: 'none' } : 'none', mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" noWrap sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>
        {primary}
      </Typography>
      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', lineHeight: 1.3 }}>
        {secondary}
      </Typography>
    </Box>
  )
}

function Cell({
  label,
  value,
  hideOnDesktop,
}: {
  label: string
  value: string
  hideOnDesktop?: boolean
}) {
  return (
    <Box sx={{ minWidth: 0, display: hideOnDesktop ? { xs: 'block', lg: 'block' } : undefined }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: hideOnDesktop ? { lg: 'none' } : 'none', mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" noWrap sx={{ fontSize: 12 }}>
        {value}
      </Typography>
    </Box>
  )
}

function buildAdminMenuItems(onAction: (action: AdminCaseAction, row: OperationalCase) => void) {
  return [
    { label: 'Set priority', onClick: (row: OperationalCase) => onAction('set_priority', row) },
    { label: 'Assign team', onClick: (row: OperationalCase) => onAction('assign_team', row) },
    { label: 'Assign executive', onClick: (row: OperationalCase) => onAction('assign_executive', row) },
    { label: 'Reassign', onClick: (row: OperationalCase) => onAction('reassign', row) },
    { label: 'Move to next day', onClick: (row: OperationalCase) => onAction('move_next_day', row) },
  ]
}
