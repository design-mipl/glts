import { useMemo, useState, type ReactNode } from 'react'
import { Box, Stack } from '@mui/material'
import { Select, type Column, type TableState } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'

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

export interface AccountsWorkListingProps<T extends { id: string }> {
  title: string
  description?: string
  rows: T[]
  columns: Column<T>[]
  getCellValue: (row: T, key: string) => string
  loading?: boolean
  onOpen?: (row: T) => void
  onViewAll?: () => void
  viewAllLabel?: string
  toolbar?: ReactNode
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
}

/** AdminListingTable wrapper — sort + column header filters like product listings / ops. */
export function AccountsWorkListing<T extends { id: string }>({
  title,
  description,
  rows,
  columns,
  getCellValue,
  loading = false,
  onOpen,
  onViewAll,
  viewAllLabel = 'View all',
  toolbar,
  pageSize = 10,
  emptyTitle = 'No matching records',
  emptyDescription = 'Adjust filters or check back later.',
}: AccountsWorkListingProps<T>) {
  const colors = usePublicBrandColors()
  const [limit, setLimit] = useState(pageSize)
  const [tableState, setTableState] = useState<TableState>(() => createTableState(pageSize))
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const memoColumns = useMemo(() => columns, [columns])

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
        <AdminListingTable<T>
          columns={memoColumns}
          data={rows}
          filterSourceData={rows}
          rowKey="id"
          state={tableState}
          onStateChange={setTableState}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          getCellValue={getCellValue}
          stickyHeader
          enableColumnSort
          enableColumnFilters
          loading={loading}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          emptyAction={onViewAll ? { label: viewAllLabel, onClick: onViewAll } : undefined}
          onRowClick={onOpen}
        />
      </Box>
    </Box>
  )
}
