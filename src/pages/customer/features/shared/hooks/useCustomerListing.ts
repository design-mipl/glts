import { useMemo, useState, useCallback } from 'react'
import type { TableState } from '@/design-system/UIComponents'

export const INITIAL_TABLE_STATE: TableState = {
  page: 0,
  pageSize: 10,
  sortKey: null,
  sortDirection: null,
  filters: [],
  searchQuery: '',
  columnSearch: {},
  selectedRows: [],
  expandedRows: [],
  hiddenColumnKeys: [],
}

export function applyColumnFilters<T>(
  rows: T[],
  columnFilters: Record<string, string[]>,
  getCellValue: (row: T, key: string) => string,
): T[] {
  return rows.filter(row =>
    Object.entries(columnFilters).every(([key, values]) => {
      if (!values.length) return true
      return values.includes(getCellValue(row, key))
    }),
  )
}

export function sortRows<T>(
  rows: T[],
  sortKey: string | null,
  sortDirection: TableState['sortDirection'],
  getCellValue: (row: T, key: string) => string,
): T[] {
  if (!sortKey || !sortDirection) return rows
  const sorted = [...rows].sort((a, b) => {
    const av = getCellValue(a, sortKey).toLowerCase()
    const bv = getCellValue(b, sortKey).toLowerCase()
    return av.localeCompare(bv, undefined, { numeric: true })
  })
  return sortDirection === 'desc' ? sorted.reverse() : sorted
}

export interface UseCustomerListingOptions<T> {
  rows: T[]
  getCellValue: (row: T, key: string) => string
  searchMatch?: (row: T, query: string) => boolean
  initialPageSize?: number
}

export function useCustomerListing<T>({
  rows,
  getCellValue,
  searchMatch,
  initialPageSize = 10,
}: UseCustomerListingOptions<T>) {
  const [tableState, setTableState] = useState<TableState>({
    ...INITIAL_TABLE_STATE,
    pageSize: initialPageSize,
  })
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const defaultSearch = useCallback(
    (row: T, query: string) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      return Object.keys(row as object).some(k => {
        const v = getCellValue(row, k)
        return v.toLowerCase().includes(q)
      })
    },
    [getCellValue],
  )

  const match = searchMatch ?? defaultSearch

  const searchedRows = useMemo(() => {
    if (!tableState.searchQuery.trim()) return rows
    return rows.filter(r => match(r, tableState.searchQuery))
  }, [rows, tableState.searchQuery, match])

  const columnFilteredRows = useMemo(
    () => applyColumnFilters(searchedRows, columnFilters, getCellValue),
    [searchedRows, columnFilters, getCellValue],
  )

  const sortedRows = useMemo(
    () => sortRows(columnFilteredRows, tableState.sortKey, tableState.sortDirection, getCellValue),
    [columnFilteredRows, tableState.sortKey, tableState.sortDirection, getCellValue],
  )

  const paginatedRows = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return sortedRows.slice(start, start + tableState.pageSize)
  }, [sortedRows, tableState.page, tableState.pageSize])

  const handleSearch = useCallback((q: string) => {
    setTableState(s => ({ ...s, searchQuery: q, page: 0 }))
  }, [])

  const handleColumnFiltersChange = useCallback((filters: Record<string, string[]>) => {
    setColumnFilters(filters)
    setTableState(s => ({ ...s, page: 0 }))
  }, [])

  return {
    tableState,
    setTableState,
    columnFilters,
    setColumnFilters: handleColumnFiltersChange,
    filterSourceRows: searchedRows,
    filteredRows: sortedRows,
    paginatedRows,
    total: sortedRows.length,
    handleSearch,
  }
}
