import { useCallback, useMemo, useState } from 'react'
import type { TableState } from '@/design-system/UIComponents'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { INITIAL_TABLE_STATE } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import {
  applyLogisticsDeskFilters,
  buildLogisticsStatusTabs,
  EMPTY_OPERATIONS_DESK_FILTERS,
  filterLogisticsRowsByStatusTab,
  groupOperationsDeskRows,
  type LogisticsStatusTab,
} from '../../case-handling/utils/operationalCaseHandlingUtils'

export function useLogisticsDesk() {
  const [deskFilters, setDeskFilters] = useState(EMPTY_OPERATIONS_DESK_FILTERS)
  const [statusTab, setStatusTab] = useState<LogisticsStatusTab>('Document Submitted')
  const [tableState, setTableState] = useState<TableState>(INITIAL_TABLE_STATE)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)

  const allRows = useMemo(() => {
    void refreshKey
    return operationalCaseHandlingService.listForLogistics()
  }, [refreshKey])

  const baseFilteredRows = useMemo(
    () => applyLogisticsDeskFilters(allRows, { ...deskFilters, status: '' }),
    [allRows, deskFilters],
  )

  const statusTabs = useMemo(() => buildLogisticsStatusTabs(), [])

  const processedRows = useMemo(
    () => filterLogisticsRowsByStatusTab(baseFilteredRows, statusTab),
    [baseFilteredRows, statusTab],
  )

  const total = processedRows.length
  const paginatedRows = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return processedRows.slice(start, start + tableState.pageSize)
  }, [processedRows, tableState.page, tableState.pageSize])

  const paginatedGroups = useMemo(
    () => groupOperationsDeskRows(paginatedRows, 'none'),
    [paginatedRows],
  )

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

  const handleStatusTabChange = useCallback((tab: LogisticsStatusTab) => {
    setStatusTab(tab)
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const handleCaseStatusChanged = useCallback((tab: LogisticsStatusTab) => {
    setStatusTab(tab)
    setRefreshKey(k => k + 1)
  }, [])

  return {
    deskFilters,
    setDeskFilters,
    statusTab,
    setStatusTab: handleStatusTabChange,
    statusTabs,
    tableState,
    setTableState,
    allRows,
    processedRows,
    paginatedGroups,
    total,
    selectedCase,
    searchValue: deskFilters.search,
    handleSearch,
    clearFilters,
    selectCase,
    closeDetail,
    refresh,
    handleCaseStatusChanged,
  }
}
