import { useMemo, useState, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Badge,
  RowActions,
  Select,
  type Column,
  type TableState,
} from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import type { OperationsWorkRow } from '../types'

function createTableState(pageSize = 10): TableState {
  return {
    page: 0,
    pageSize,
    sortKey: null,
    sortDirection: 'asc',
    filters: [],
    searchQuery: '',
    columnSearch: {},
    selectedRows: [],
    expandedRows: [],
    hiddenColumnKeys: [],
  }
}

const LIMIT_OPTIONS = [
  { label: '10 rows', value: '10' },
  { label: '25 rows', value: '25' },
  { label: '50 rows', value: '50' },
] as const

function priorityColor(priority: string): 'error' | 'warning' | 'info' | 'neutral' {
  const p = priority.toLowerCase()
  if (p === 'critical' || p === 'urgent') return 'error'
  if (p === 'high') return 'warning'
  if (p === 'medium') return 'info'
  return 'neutral'
}

function statusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('block')) return 'error'
  if (s.includes('progress')) return 'info'
  if (s.includes('open')) return 'warning'
  if (s.includes('complete') || s.includes('done')) return 'success'
  return 'neutral'
}

export function getOpsWorkCellValue(row: OperationsWorkRow, key: string): string {
  const value = row[key as keyof OperationsWorkRow]
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

export function buildOpsWorkColumns(options: {
  onOpen: (row: OperationsWorkRow) => void
  openLabel?: string
}): Column<OperationsWorkRow>[] {
  return [
    {
      key: 'glNumber',
      label: 'GL Number',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      searchable: true,
    },
    {
      key: 'applicant',
      label: 'Applicant',
      widthSize: 'lg',
      sortable: true,
      filterable: true,
      searchable: true,
    },
    {
      key: 'segment',
      label: 'Segment',
      widthSize: 'sm',
      sortable: true,
      filterable: true,
      render: (_value, row) => (
        <Typography variant="body2" sx={{ fontSize: 13, textTransform: 'capitalize' }}>
          {row.segment === 'b2b' ? 'B2B' : row.segment}
        </Typography>
      ),
    },
    {
      key: 'queueLabel',
      label: 'Queue',
      widthSize: 'lg',
      sortable: true,
      filterable: true,
      searchable: true,
    },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: 'sm',
      sortable: true,
      filterable: true,
      render: (_value, row) => (
        <Badge label={row.priority} color={priorityColor(row.priority)} />
      ),
    },
    {
      key: 'waitingTime',
      label: 'Waiting',
      widthSize: 'sm',
      sortable: true,
      filterable: true,
    },
    {
      key: 'assigneeLabel',
      label: 'Assignee',
      widthSize: 'md',
      sortable: true,
      filterable: true,
      searchable: true,
      render: (_value, row) => (
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap sx={{ fontSize: 13 }}>
            {row.assigneeLabel}
          </Typography>
          {row.showGroundBadge ? <Badge label="Ground" color="warning" /> : null}
        </Stack>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: true,
      filterable: true,
      render: (_value, row) => <Badge label={row.status} color={statusColor(row.status)} />,
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      width: 56,
      render: (_value, row) => (
        <RowActions
          actions={[
            {
              label: options.openLabel ?? 'Open',
              onClick: () => options.onOpen(row),
            },
          ]}
        />
      ),
    },
  ]
}

export interface OperationsWorkListingProps {
  title: string
  description?: string
  rows: OperationsWorkRow[]
  loading?: boolean
  onOpen: (row: OperationsWorkRow) => void
  onViewAll?: () => void
  viewAllLabel?: string
  openLabel?: string
  toolbar?: ReactNode
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
}

/** AdminListingTable wrapper — sort + column header filters like product listings. */
export function OperationsWorkListing({
  title,
  description,
  rows,
  loading = false,
  onOpen,
  onViewAll,
  viewAllLabel = 'View all',
  openLabel = 'Open',
  toolbar,
  pageSize = 10,
  emptyTitle = 'No matching cases',
  emptyDescription = 'Adjust filters or check back later.',
}: OperationsWorkListingProps) {
  const colors = usePublicBrandColors()
  const [limit, setLimit] = useState(pageSize)
  const [tableState, setTableState] = useState<TableState>(() => createTableState(pageSize))
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const columns = useMemo(
    () => buildOpsWorkColumns({ onOpen, openLabel }),
    [onOpen, openLabel],
  )

  const handleLimitChange = (value: string | number) => {
    const next = Number(value)
    setLimit(next)
    setTableState((prev) => ({ ...prev, pageSize: next, page: 0 }))
  }

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.25}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <ExecutiveSectionHeader
              title={title}
              description={description}
              actionLabel={onViewAll ? viewAllLabel : undefined}
              onAction={onViewAll}
            />
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
            {toolbar}
            <Box sx={{ width: { xs: '100%', sm: 120 } }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Rows per page"
                value={String(limit)}
                options={[...LIMIT_OPTIONS]}
                onChange={handleLimitChange}
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <AdminListingTable
          columns={columns}
          data={rows}
          filterSourceData={rows}
          rowKey="id"
          state={tableState}
          onStateChange={setTableState}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          getCellValue={getOpsWorkCellValue}
          stickyHeader
          enableColumnSort
          enableColumnFilters
          loading={loading}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          emptyAction={
            onViewAll ? { label: viewAllLabel, onClick: onViewAll } : undefined
          }
          onRowClick={onOpen}
        />
      </Box>
    </Box>
  )
}
