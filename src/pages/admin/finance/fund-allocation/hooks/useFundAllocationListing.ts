import { useCallback, useMemo, useState } from 'react'
import type { TableState } from '@/design-system/UIComponents'
import { applyColumnFilters, INITIAL_TABLE_STATE, sortRows } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { useListingTabParam } from '@/shared/hooks/useListingTabParam'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import type {
  FundAllocationBatchRow,
  FundAllocationListingTab,
  FundAllocationPassengerRow,
  FundAllocationQueueFilters,
} from '@/shared/types/fundAllocation'
import {
  applyFundAllocationBatchFilters,
  getFundAllocationBatchCellValue,
  groupPassengersIntoAllocationBatches,
} from '@/shared/utils/fundAllocationBatchUtils'
import {
  applyFundAllocationFilters,
  EMPTY_FUND_ALLOCATION_FILTERS,
  filterRowsByListingTab,
  getFundAllocationCellValue,
} from '../utils/fundAllocationListingUtils'

const FUND_ALLOCATION_TAB_VALUES: readonly FundAllocationListingTab[] = [
  'pending_allocation',
  'allocated',
]

export function useFundAllocationListing() {
  const [listingTab, setListingTab] = useListingTabParam(
    FUND_ALLOCATION_TAB_VALUES,
    'pending_allocation',
  )
  const [queueFilters, setQueueFilters] = useState<FundAllocationQueueFilters>(EMPTY_FUND_ALLOCATION_FILTERS)
  const [tableState, setTableState] = useState<TableState>(INITIAL_TABLE_STATE)
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedPassengerId, setSelectedPassengerId] = useState<string | null>(null)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')

  const allRows = useMemo(() => {
    void refreshKey
    return fundAllocationService.list()
  }, [refreshKey])

  const tabFilteredRows = useMemo(
    () => filterRowsByListingTab(allRows, listingTab),
    [allRows, listingTab],
  )

  const filteredRows = useMemo(() => {
    return applyFundAllocationFilters(tabFilteredRows, { ...queueFilters, search: searchValue })
  }, [tabFilteredRows, queueFilters, searchValue])

  const filterSourceRows = filteredRows

  const processedRows = useMemo(() => {
    const columnFiltered = applyColumnFilters(filteredRows, columnFilters, getFundAllocationCellValue)
    return sortRows(columnFiltered, tableState.sortKey, tableState.sortDirection, getFundAllocationCellValue)
  }, [filteredRows, columnFilters, tableState.sortKey, tableState.sortDirection])

  const total = processedRows.length
  const paginatedRows = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return processedRows.slice(start, start + tableState.pageSize)
  }, [processedRows, tableState.page, tableState.pageSize])

  const allBatches = useMemo(() => {
    void refreshKey
    return groupPassengersIntoAllocationBatches(
      allRows.filter(row => row.allocationStatus === 'allocated'),
    )
  }, [allRows, refreshKey])

  const filteredBatches = useMemo(() => {
    return applyFundAllocationBatchFilters(allBatches, { ...queueFilters, search: searchValue })
  }, [allBatches, queueFilters, searchValue])

  const filterSourceBatches = filteredBatches

  const processedBatches = useMemo(() => {
    const columnFiltered = applyColumnFilters(
      filteredBatches,
      columnFilters,
      getFundAllocationBatchCellValue,
    )
    return sortRows(
      columnFiltered,
      tableState.sortKey,
      tableState.sortDirection,
      getFundAllocationBatchCellValue,
    )
  }, [filteredBatches, columnFilters, tableState.sortKey, tableState.sortDirection])

  const totalBatches = processedBatches.length
  const paginatedBatches = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return processedBatches.slice(start, start + tableState.pageSize)
  }, [processedBatches, tableState.page, tableState.pageSize])

  const selectedPassenger = useMemo(
    () => (selectedPassengerId ? allRows.find(row => row.id === selectedPassengerId) : undefined),
    [selectedPassengerId, allRows],
  )

  const selectedBatch = useMemo(
    () => (selectedBatchId ? allBatches.find(batch => batch.id === selectedBatchId) : undefined),
    [selectedBatchId, allBatches],
  )

  const refresh = useCallback(() => {
    setRefreshKey(key => key + 1)
  }, [])

  const mutateAndRefresh = useCallback((mutator: () => unknown) => {
    mutator()
    setRefreshKey(key => key + 1)
  }, [])

  const handleListingTabChange = useCallback((tab: FundAllocationListingTab) => {
    setListingTab(tab)
    setSelectedPassengerId(null)
    setSelectedBatchId(null)
    setTableState(state => ({ ...state, page: 0, selectedRows: [] }))
  }, [setListingTab])

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
    setTableState(state => ({ ...state, page: 0, selectedRows: [] }))
  }, [])

  const clearFilters = useCallback(() => {
    setQueueFilters(EMPTY_FUND_ALLOCATION_FILTERS)
    setSearchValue('')
    setColumnFilters({})
    setTableState(state => ({
      ...state,
      page: 0,
      sortKey: null,
      sortDirection: 'asc',
      selectedRows: [],
    }))
  }, [])

  const setQueueFiltersAndResetSelection = useCallback((next: FundAllocationQueueFilters) => {
    setQueueFilters(next)
    setTableState(state => ({ ...state, page: 0, selectedRows: [] }))
  }, [])

  const selectPassenger = useCallback((row: FundAllocationPassengerRow) => {
    setSelectedPassengerId(row.id)
    setSelectedBatchId(null)
  }, [])

  const selectBatch = useCallback((row: FundAllocationBatchRow) => {
    setSelectedBatchId(row.id)
    setSelectedPassengerId(null)
  }, [])

  const closeDetail = useCallback(() => {
    setSelectedPassengerId(null)
    setSelectedBatchId(null)
  }, [])

  return {
    listingTab,
    queueFilters,
    setQueueFilters: setQueueFiltersAndResetSelection,
    tableState,
    setTableState,
    columnFilters,
    setColumnFilters,
    allRows,
    filterSourceRows,
    paginatedRows,
    total,
    selectedPassenger,
    filterSourceBatches,
    paginatedBatches,
    totalBatches,
    selectedBatch,
    searchValue,
    handleListingTabChange,
    handleSearch,
    clearFilters,
    selectPassenger,
    selectBatch,
    closeDetail,
    refresh,
    mutateAndRefresh,
  }
}
