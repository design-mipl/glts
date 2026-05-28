import { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { ColumnFilter, DataTable } from '@/design-system/UIComponents'
import type { Column, TableState } from '@/design-system/UIComponents'

export interface CustomerListingTableProps<T> {
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
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: { label: string; onClick: () => void }
  loading?: boolean
  stickyHeader?: boolean
}

export function CustomerListingTable<T extends object>({
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
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyAction,
  loading = false,
  stickyHeader = false,
}: CustomerListingTableProps<T>) {
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null)

  const columnLabels = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of columns) {
      if (c.key !== 'actions') map[c.key] = c.label
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

  const handleColumnFilterClick = (event: React.MouseEvent<HTMLElement>, columnKey: string) => {
    setFilterAnchor(event.currentTarget)
    setActiveFilterColumn(columnKey)
  }

  const handleFilterApply = (columnKey: string, values: string[]) => {
    onColumnFiltersChange({ ...columnFilters, [columnKey]: values })
    onStateChange({ ...state, page: 0 })
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <DataTable
        columns={columns}
        data={data}
        rowKey={rowKey as string}
        state={state}
        onStateChange={onStateChange}
        onRowClick={onRowClick}
        loading={loading}
        hideToolbar
        hidePagination
        embedded
        stickyHeader={stickyHeader}
        showColumnSearch={false}
        onColumnFilterClick={handleColumnFilterClick}
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
        onApply={handleFilterApply}
      />
    </Box>
  )
}
