import { useCallback, useMemo, useState } from 'react'
import type { TableState } from '@/design-system/UIComponents'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import type { OperationalCase, OperationsDeskGroupBy } from '@/shared/types/operationalCaseHandling'
import { INITIAL_TABLE_STATE } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import {
  applyOperationsDeskFilters,
  buildOperationsDeskStatusTabs,
  EMPTY_OPERATIONS_DESK_FILTERS,
  filterOperationsDeskRowsByStatusTab,
  groupOperationsDeskRows,
  type OperationsDeskStatusTab,
} from '../utils/operationalCaseHandlingUtils'

export function useOperationalCaseHandling() {
  const [deskFilters, setDeskFilters] = useState(EMPTY_OPERATIONS_DESK_FILTERS)
  const [statusTab, setStatusTab] = useState<OperationsDeskStatusTab>('Pending')
  const [groupBy, setGroupBy] = useState<OperationsDeskGroupBy>('none')
  const [tableState, setTableState] = useState<TableState>(INITIAL_TABLE_STATE)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)

  const allRows = useMemo(() => {
    void refreshKey
    return operationalCaseHandlingService.listForOperationsDesk()
  }, [refreshKey])

  const baseFilteredRows = useMemo(
    () => applyOperationsDeskFilters(allRows, { ...deskFilters, status: '' }),
    [allRows, deskFilters],
  )

  const statusTabs = useMemo(() => buildOperationsDeskStatusTabs(), [])

  const processedRows = useMemo(
    () => filterOperationsDeskRowsByStatusTab(baseFilteredRows, statusTab),
    [baseFilteredRows, statusTab],
  )

  const groupedRows = useMemo(
    () => groupOperationsDeskRows(processedRows, groupBy),
    [processedRows, groupBy],
  )

  const total = processedRows.length
  const paginatedRows = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return processedRows.slice(start, start + tableState.pageSize)
  }, [processedRows, tableState.page, tableState.pageSize])

  const paginatedGroups = useMemo(() => {
    if (groupBy === 'none') {
      return groupOperationsDeskRows(paginatedRows, 'none')
    }

    const start = tableState.page * tableState.pageSize
    const pageRows = processedRows.slice(start, start + tableState.pageSize)
    return groupOperationsDeskRows(pageRows, groupBy)
  }, [groupBy, paginatedRows, processedRows, tableState.page, tableState.pageSize])

  const selectedCase = useMemo(
    () => (selectedCaseId ? operationalCaseHandlingService.getById(selectedCaseId) : undefined),
    [selectedCaseId, refreshKey],
  )

  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1)
  }, [])

  const handleSearch = useCallback((query: string) => {
    setDeskFilters(f => ({ ...f, search: query }))
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const clearFilters = useCallback(() => {
    setDeskFilters(EMPTY_OPERATIONS_DESK_FILTERS)
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const selectCase = useCallback((row: OperationalCase) => {
    setSelectedCaseId(row.id)
  }, [])

  const closeDetail = useCallback(() => {
    setSelectedCaseId(null)
  }, [])

  const handleStatusTabChange = useCallback((tab: OperationsDeskStatusTab) => {
    setStatusTab(tab)
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const handleDocumentsSubmitted = useCallback(() => {
    setStatusTab('Document Submitted')
    setRefreshKey(k => k + 1)
  }, [])

  return {
    deskFilters,
    setDeskFilters,
    statusTab,
    setStatusTab: handleStatusTabChange,
    statusTabs,
    groupBy,
    setGroupBy,
    tableState,
    setTableState,
    allRows,
    processedRows,
    groupedRows,
    paginatedGroups,
    paginatedRows,
    total,
    selectedCaseId,
    selectedCase,
    searchValue: deskFilters.search,
    handleSearch,
    clearFilters,
    selectCase,
    closeDetail,
    refresh,
    handleDocumentsSubmitted,
  }
}
