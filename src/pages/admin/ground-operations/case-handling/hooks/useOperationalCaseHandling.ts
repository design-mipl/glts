import { useCallback, useMemo, useState } from 'react'
import type { TableState } from '@/design-system/UIComponents'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import {
  applyColumnFilters,
  INITIAL_TABLE_STATE,
  sortRows,
} from '@/pages/customer/features/shared/hooks/useCustomerListing'
import {
  applyOperationsDeskFilters,
  applyPriorityQueueFilters,
  EMPTY_OPERATIONS_DESK_FILTERS,
  EMPTY_PRIORITY_QUEUE_FILTERS,
  type CaseHandlingTab,
} from '../utils/operationalCaseHandlingUtils'
import { getOperationalCaseCellValue } from '../utils/operationalCaseHandlingUtils'

export function useOperationalCaseHandling() {
  const [activeTab, setActiveTab] = useState<CaseHandlingTab>('priority_queue')
  const [priorityFilters, setPriorityFilters] = useState(EMPTY_PRIORITY_QUEUE_FILTERS)
  const [deskFilters, setDeskFilters] = useState(EMPTY_OPERATIONS_DESK_FILTERS)
  const [tableState, setTableState] = useState<TableState>(INITIAL_TABLE_STATE)
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)

  const allRows = useMemo(() => {
    void refreshKey
    return operationalCaseHandlingService.list()
  }, [refreshKey])

  const teamCapacity = useMemo(() => {
    void refreshKey
    return operationalCaseHandlingService.getTeamCapacity()
  }, [refreshKey])

  const tabFilteredRows = useMemo(() => {
    if (activeTab === 'operations_desk') {
      return applyOperationsDeskFilters(allRows, deskFilters)
    }
    return applyPriorityQueueFilters(allRows, priorityFilters)
  }, [activeTab, allRows, priorityFilters, deskFilters])

  const filterSourceRows = tabFilteredRows

  const processedRows = useMemo(() => {
    if (activeTab !== 'priority_queue') {
      return tabFilteredRows
    }
    const columnFiltered = applyColumnFilters(
      tabFilteredRows,
      columnFilters,
      getOperationalCaseCellValue,
    )
    return sortRows(
      columnFiltered,
      tableState.sortKey,
      tableState.sortDirection,
      getOperationalCaseCellValue,
    )
  }, [activeTab, tabFilteredRows, columnFilters, tableState.sortKey, tableState.sortDirection])

  const total = processedRows.length
  const paginatedRows = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return processedRows.slice(start, start + tableState.pageSize)
  }, [processedRows, tableState.page, tableState.pageSize])

  const selectedCase = useMemo(
    () => (selectedCaseId ? operationalCaseHandlingService.getById(selectedCaseId) : undefined),
    [selectedCaseId, refreshKey],
  )

  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1)
  }, [])

  const handleTabChange = useCallback((tab: CaseHandlingTab) => {
    setActiveTab(tab)
    setTableState(state => ({ ...state, page: 0, sortKey: null, sortDirection: null }))
    setColumnFilters({})
    setSelectedCaseId(null)
  }, [])

  const handleSearch = useCallback(
    (query: string) => {
      if (activeTab === 'operations_desk') {
        setDeskFilters(f => ({ ...f, search: query }))
      } else {
        setPriorityFilters(f => ({ ...f, search: query }))
      }
      setTableState(state => ({ ...state, page: 0 }))
    },
    [activeTab],
  )

  const searchValue =
    activeTab === 'operations_desk' ? deskFilters.search : priorityFilters.search

  const clearFilters = useCallback(() => {
    if (activeTab === 'operations_desk') {
      setDeskFilters(EMPTY_OPERATIONS_DESK_FILTERS)
    } else {
      setPriorityFilters(EMPTY_PRIORITY_QUEUE_FILTERS)
    }
    setColumnFilters({})
    setTableState(state => ({
      ...state,
      page: 0,
      sortKey: null,
      sortDirection: null,
    }))
  }, [activeTab])

  const handleColumnFiltersChange = useCallback((filters: Record<string, string[]>) => {
    setColumnFilters(filters)
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const selectCase = useCallback((row: OperationalCase) => {
    setSelectedCaseId(row.id)
  }, [])

  const closeDetail = useCallback(() => {
    setSelectedCaseId(null)
  }, [])

  const mutateAndRefresh = useCallback(
    (mutator: () => OperationalCase | undefined) => {
      const result = mutator()
      if (result) {
        setSelectedCaseId(result.id)
      }
      refresh()
      return result
    },
    [refresh],
  )

  return {
    activeTab,
    priorityFilters,
    setPriorityFilters,
    deskFilters,
    setDeskFilters,
    tableState,
    setTableState,
    columnFilters,
    setColumnFilters: handleColumnFiltersChange,
    filterSourceRows,
    allRows,
    processedRows,
    paginatedRows,
    total,
    teamCapacity,
    selectedCaseId,
    selectedCase,
    searchValue,
    handleTabChange,
    handleSearch,
    clearFilters,
    selectCase,
    closeDetail,
    refresh,
    mutateAndRefresh,
  }
}
