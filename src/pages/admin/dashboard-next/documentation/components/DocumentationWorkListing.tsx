import { useMemo, useState, type ReactNode } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Pagination, useToast, type Column } from '@/design-system/UIComponents'
import {
  AdminListingGrid,
  AdminListingTable,
  AdminListingToolbar,
  type AdminListingGridItem,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'

export interface DocumentationWorkListingProps<T extends { id: string }> {
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
  searchPlaceholder?: string
  exportFileName?: string
  mapRowToGridItem?: (row: T) => AdminListingGridItem
}

function downloadListingCsv<T extends { id: string }>(
  rows: T[],
  columns: Column<T>[],
  getCellValue: (row: T, key: string) => string,
  fileName: string,
) {
  const exportColumns = columns.filter((col) => col.key !== 'actions')
  const headers = exportColumns.map((col) => col.label)
  const lines = rows.map((row) =>
    exportColumns
      .map((col) => `"${getCellValue(row, col.key).replace(/"/g, '""')}"`)
      .join(','),
  )
  const blob = new Blob([[headers.join(','), ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
}

function defaultGridItem<T extends { id: string }>(
  row: T,
  columns: Column<T>[],
  getCellValue: (row: T, key: string) => string,
): AdminListingGridItem {
  const keys = columns.filter((col) => col.key !== 'actions').map((col) => col.key)
  const title = keys[0] ? getCellValue(row, keys[0]) : row.id
  const subtitle = keys[1] ? getCellValue(row, keys[1]) : undefined
  const metaParts = keys.slice(2, 5).map((key) => getCellValue(row, key)).filter(Boolean)
  const statusKey = keys.find((key) => key.toLowerCase().includes('status'))
  return {
    id: row.id,
    title: title || row.id,
    subtitle,
    meta: metaParts.length ? metaParts.join(' · ') : undefined,
    status: statusKey ? getCellValue(row, statusKey) : undefined,
  }
}

/** Module-style listing for Documentation Work desks — toolbar · table/grid · pagination. */
export function DocumentationWorkListing<T extends { id: string }>({
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
  searchPlaceholder = 'Search…',
  exportFileName = 'documentation-work',
  mapRowToGridItem,
}: DocumentationWorkListingProps<T>) {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const { showToast } = useToast()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const listing = useCustomerListing({
    rows,
    getCellValue,
    initialPageSize: pageSize,
  })

  const memoColumns = useMemo(() => columns, [columns])
  const toolbarColumns = useMemo(
    () =>
      memoColumns
        .filter((col) => col.key !== 'actions')
        .map((col) => ({ key: col.key, label: col.label })),
    [memoColumns],
  )

  const gridItems = useMemo(() => {
    const mapper =
      mapRowToGridItem ??
      ((row: T) => defaultGridItem(row, memoColumns, getCellValue))
    return listing.paginatedRows.map(mapper)
  }, [listing.paginatedRows, mapRowToGridItem, memoColumns, getCellValue])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const handleExport = () => {
    downloadListingCsv(listing.filterSourceRows, memoColumns, getCellValue, exportFileName)
    showToast({
      title: 'Export started',
      description: 'Your listing export will download shortly.',
      variant: 'success',
    })
  }

  const hasSearch = Boolean(listing.tableState.searchQuery.trim())

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.25 }}>
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
          {toolbar ? (
            <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
              {toolbar}
            </Stack>
          ) : null}
        </Stack>
      </Box>

      <Box sx={{ px: 2, pb: 1.25 }}>
        <AdminListingToolbar
          searchValue={listing.tableState.searchQuery}
          onSearch={listing.handleSearch}
          searchPlaceholder={searchPlaceholder}
          onExport={handleExport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          columns={toolbarColumns}
          hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
          onHiddenColumnKeysChange={(keys) =>
            listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
          }
        />
      </Box>

      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        {viewMode === 'table' ? (
          <AdminListingTable<T>
            columns={memoColumns}
            data={listing.paginatedRows}
            filterSourceData={listing.filterSourceRows}
            rowKey="id"
            state={listing.tableState}
            onStateChange={listing.setTableState}
            columnFilters={listing.columnFilters}
            onColumnFiltersChange={listing.setColumnFilters}
            getCellValue={getCellValue}
            stickyHeader
            enableColumnSort
            enableColumnFilters
            loading={loading}
            emptyTitle={hasSearch ? 'No records match your search' : emptyTitle}
            emptyDescription={
              hasSearch ? 'Try a different search term or clear filters.' : emptyDescription
            }
            emptyAction={onViewAll ? { label: viewAllLabel, onClick: onViewAll } : undefined}
            onRowClick={onOpen}
          />
        ) : (
          <AdminListingGrid
            items={gridItems}
            onItemClick={
              onOpen
                ? (id) => {
                    const row = listing.paginatedRows.find((item) => item.id === id)
                    if (row) onOpen(row)
                  }
                : undefined
            }
          />
        )}
      </Box>

      <Box sx={{ bgcolor: footerBg, borderTop: 1, borderColor: 'divider' }}>
        <Pagination
          page={listing.tableState.page}
          pageSize={listing.tableState.pageSize}
          total={listing.total}
          onPage={(page) => listing.setTableState((state) => ({ ...state, page }))}
          onPageSize={(nextPageSize) =>
            listing.setTableState((state) => ({ ...state, pageSize: nextPageSize, page: 0 }))
          }
        />
      </Box>
    </Box>
  )
}

/** Generic cell value for documentation desk rows. */
export function getDocumentationWorkCellValue<T extends Record<string, unknown>>(
  row: T,
  key: string,
): string {
  const value = row[key]
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return value.toISOString()
  return String(value)
}
