import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { ColumnFilter, DataTable } from '@/design-system/UIComponents'
import type { Column, TableState } from '@/design-system/UIComponents'
import type { BulkAction } from '@/design-system/UIComponents'

export interface AdminListingTableProps<T extends object> {
  columns: Column<T>[]
  data: T[]
  filterSourceData: T[]
  rowKey: keyof T & string
  state: TableState
  onStateChange: (state: TableState) => void
  columnFilters: Record<string, string[]>
  onColumnFiltersChange: (filters: Record<string, string[]>) => void
  getCellValue: (row: T, key: string) => string
  onRowClick?: (row: T) => void
  loading?: boolean
  bulkActions?: BulkAction[]
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: { label: string; onClick: () => void }
  stickyHeader?: boolean
  /** When false, column header sort controls are hidden. Default true. */
  enableColumnSort?: boolean
  /** When false, column header filter controls are hidden. Default true. */
  enableColumnFilters?: boolean
  /** Renders expandable row panel; adds accordion chevron column. */
  renderExpanded?: (row: T) => ReactNode
}

export function AdminListingTable<T extends object>({
  columns,
  data,
  filterSourceData,
  rowKey,
  state,
  onStateChange,
  columnFilters,
  onColumnFiltersChange,
  getCellValue,
  onRowClick,
  loading = false,
  bulkActions,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyAction,
  stickyHeader = false,
  enableColumnSort = true,
  enableColumnFilters = true,
  renderExpanded,
}: AdminListingTableProps<T>) {
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null)

  const columnLabels = useMemo(() => {
    const map: Record<string, string> = {}
    for (const col of columns) {
      if (col.key !== 'actions') map[col.key] = col.label
    }
    return map
  }, [columns])

  const uniqueValues = useMemo(() => {
    if (!activeFilterColumn) return []
    const values = new Set<string>()
    for (const row of filterSourceData) {
      values.add(getCellValue(row, activeFilterColumn))
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [activeFilterColumn, filterSourceData, getCellValue])

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <DataTable
        columns={columns}
        enableColumnSort={enableColumnSort}
        data={data}
        rowKey={rowKey as string}
        state={state}
        onStateChange={onStateChange}
        onRowClick={onRowClick}
        loading={loading}
        bulkActions={bulkActions}
        hideToolbar
        hidePagination
        embedded
        stickyHeader={stickyHeader}
        showColumnSearch={false}
        onColumnFilterClick={
          enableColumnFilters
            ? (event, columnKey) => {
                setFilterAnchor(event.currentTarget)
                setActiveFilterColumn(columnKey)
              }
            : undefined
        }
        renderExpanded={renderExpanded}
        emptyState={{
          title: emptyTitle,
          description: emptyDescription,
          action: emptyAction,
        }}
      />
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
          onStateChange({ ...state, page: 0 })
        }}
      />
    </Box>
  )
}
