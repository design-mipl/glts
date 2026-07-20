import { useCallback, useMemo, useState } from 'react'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import type { FundAllocationBatchRow, FundAllocationQueueFilters } from '@/shared/types/fundAllocation'
import { applyFundAllocationBatchFilters } from '@/shared/utils/fundAllocationBatchUtils'
import {
  EMPTY_FUND_ALLOCATION_FILTERS,
  getFundAllocationFilterOptions,
} from '@/pages/admin/finance/fund-allocation/utils/fundAllocationListingUtils'

interface TableState {
  page: number
  pageSize: number
}

export function useFundUtilizationListing() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [queueFilters, setQueueFilters] = useState<FundAllocationQueueFilters>(EMPTY_FUND_ALLOCATION_FILTERS)
  const [tableState, setTableState] = useState<TableState>({ page: 0, pageSize: 10 })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const allBatches = useMemo(() => {
    void refreshKey
    return fundAllocationService.listAllocatedBatches()
  }, [refreshKey])

  const allocatedPassengers = useMemo(() => {
    void refreshKey
    return fundAllocationService.list().filter(row => row.allocationStatus === 'allocated')
  }, [refreshKey])

  const filterOptions = useMemo(
    () => getFundAllocationFilterOptions(allocatedPassengers),
    [allocatedPassengers],
  )

  const filteredBatches = useMemo(
    () => applyFundAllocationBatchFilters(allBatches, { ...queueFilters, search: searchValue }),
    [allBatches, queueFilters, searchValue],
  )

  const total = filteredBatches.length

  const paginatedBatches = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return filteredBatches.slice(start, start + tableState.pageSize)
  }, [filteredBatches, tableState.page, tableState.pageSize])

  const selectedRecord = useMemo(
    () => (selectedId ? allBatches.find(batch => batch.id === selectedId) ?? null : null),
    [allBatches, selectedId],
  )

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const setQueueFiltersAndResetPage = useCallback((next: FundAllocationQueueFilters) => {
    setQueueFilters(next)
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const clearFilters = useCallback(() => {
    setQueueFilters(EMPTY_FUND_ALLOCATION_FILTERS)
    setSearchValue('')
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const selectRecord = useCallback((batch: FundAllocationBatchRow) => {
    setSelectedId(batch.id)
  }, [])

  const closeDetail = useCallback(() => {
    setSelectedId(null)
  }, [])

  const refresh = useCallback(() => {
    setRefreshKey(key => key + 1)
  }, [])

  return {
    searchValue,
    handleSearch,
    queueFilters,
    setQueueFilters: setQueueFiltersAndResetPage,
    clearFilters,
    filterOptions,
    tableState,
    setTableState,
    paginatedBatches,
    total,
    selectedRecord,
    selectRecord,
    closeDetail,
    refresh,
    refreshKey,
  }
}
