import { useMemo, useState, type ReactNode } from 'react'
import { Box, Stack } from '@mui/material'
import { Select, type Column, type TableState } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'

function createTableState(pageSize: number): TableState {
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

export interface DashboardAdminListingProps<T extends { id: string }> {
  title: string
  description?: string
  columns: Column<T>[]
  rows: T[]
  getCellValue: (row: T, key: string) => string
  loading?: boolean
  onRowClick?: (row: T) => void
  onViewAll?: () => void
  viewAllLabel?: string
  pageSize?: number
  showRowLimit?: boolean
  enableColumnSort?: boolean
  enableColumnFilters?: boolean
  emptyTitle?: string
  emptyDescription?: string
  toolbar?: ReactNode
}

/**
 * Standard admin listing chrome for dashboard tables —
 * AdminListingTable + executive card header (same pattern as product listings).
 */
export function DashboardAdminListing<T extends { id: string }>({
  title,
  description,
  columns,
  rows,
  getCellValue,
  loading = false,
  onRowClick,
  onViewAll,
  viewAllLabel = 'View all',
  pageSize = 10,
  showRowLimit = true,
  enableColumnSort = true,
  enableColumnFilters = true,
  emptyTitle = 'No records found',
  emptyDescription = 'Adjust filters or check back later.',
  toolbar,
}: DashboardAdminListingProps<T>) {
  const colors = usePublicBrandColors()
  const [limit, setLimit] = useState(pageSize)
  const [tableState, setTableState] = useState<TableState>(() => createTableState(pageSize))
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const columnsMemo = useMemo(() => columns, [columns])

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
            {showRowLimit ? (
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
            ) : null}
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <AdminListingTable
          columns={columnsMemo}
          data={rows}
          filterSourceData={rows}
          rowKey="id"
          state={tableState}
          onStateChange={setTableState}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          getCellValue={getCellValue}
          stickyHeader
          enableColumnSort={enableColumnSort}
          enableColumnFilters={enableColumnFilters}
          loading={loading}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          emptyAction={
            onViewAll ? { label: viewAllLabel, onClick: onViewAll } : undefined
          }
          onRowClick={onRowClick}
        />
      </Box>
    </Box>
  )
}
