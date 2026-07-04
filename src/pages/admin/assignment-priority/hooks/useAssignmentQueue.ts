import { useCallback, useMemo, useState } from 'react'
import type { TableState } from '@/design-system/UIComponents'
import { applyColumnFilters, INITIAL_TABLE_STATE, sortRows } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { operationalPassengerAssignmentService } from '@/shared/services/operationalPassengerAssignmentService'
import type {
  AssignmentListingTab,
  AssignmentQueueFilters,
  OperationalPassengerRow,
} from '@/shared/types/operationalPassengerAssignment'
import type { AssignmentSegmentConfig } from '../config/assignmentSegmentConfig'
import {
  applyAssignmentQueueFilters,
  EMPTY_ASSIGNMENT_QUEUE_FILTERS,
  filterRowsByListingTab,
  getAssignmentCellValue,
} from '../utils/assignmentQueueListingUtils'

export function useAssignmentQueue(segmentConfig: AssignmentSegmentConfig) {
  const [listingTab, setListingTab] = useState<AssignmentListingTab>('pending_assignment')
  const [queueFilters, setQueueFilters] = useState<AssignmentQueueFilters>(EMPTY_ASSIGNMENT_QUEUE_FILTERS)
  const [tableState, setTableState] = useState<TableState>(INITIAL_TABLE_STATE)
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedPassengerId, setSelectedPassengerId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')

  const allRows = useMemo(() => {
    void refreshKey
    return operationalPassengerAssignmentService.list(segmentConfig.segment)
  }, [refreshKey, segmentConfig.segment])

  const tabFilteredRows = useMemo(
    () => filterRowsByListingTab(allRows, listingTab),
    [allRows, listingTab],
  )

  const filteredRows = useMemo(() => {
    return applyAssignmentQueueFilters(tabFilteredRows, { ...queueFilters, search: searchValue })
  }, [tabFilteredRows, queueFilters, searchValue])

  const filterSourceRows = filteredRows

  const processedRows = useMemo(() => {
    const columnFiltered = applyColumnFilters(filteredRows, columnFilters, getAssignmentCellValue)
    return sortRows(columnFiltered, tableState.sortKey, tableState.sortDirection, getAssignmentCellValue)
  }, [filteredRows, columnFilters, tableState.sortKey, tableState.sortDirection])

  const total = processedRows.length
  const paginatedRows = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return processedRows.slice(start, start + tableState.pageSize)
  }, [processedRows, tableState.page, tableState.pageSize])

  const selectedPassenger = useMemo(
    () => (selectedPassengerId ? allRows.find(r => r.id === selectedPassengerId) : undefined),
    [selectedPassengerId, allRows],
  )

  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1)
  }, [])

  const mutateAndRefresh = useCallback((mutator: () => unknown) => {
    mutator()
    setRefreshKey(k => k + 1)
  }, [])

  const handleListingTabChange = useCallback((tab: AssignmentListingTab) => {
    setListingTab(tab)
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const clearFilters = useCallback(() => {
    setQueueFilters(EMPTY_ASSIGNMENT_QUEUE_FILTERS)
    setSearchValue('')
    setColumnFilters({})
    setTableState(state => ({ ...state, page: 0, sortKey: null, sortDirection: 'asc' }))
  }, [])

  const selectPassenger = useCallback((row: OperationalPassengerRow) => {
    setSelectedPassengerId(row.id)
  }, [])

  const closeDetail = useCallback(() => {
    setSelectedPassengerId(null)
  }, [])

  return {
    listingTab,
    queueFilters,
    setQueueFilters,
    tableState,
    setTableState,
    columnFilters,
    setColumnFilters,
    allRows,
    filterSourceRows,
    paginatedRows,
    total,
    selectedPassengerId,
    selectedPassenger,
    searchValue,
    handleListingTabChange,
    handleSearch,
    clearFilters,
    selectPassenger,
    closeDetail,
    refresh,
    mutateAndRefresh,
  }
}
