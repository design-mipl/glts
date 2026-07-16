import { useCallback, useMemo, useState } from 'react'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import type { FundAllocationPassengerRow } from '@/shared/types/fundAllocation'

interface TableState {
  page: number
  pageSize: number
}

function matchesSearch(row: FundAllocationPassengerRow, search: string): boolean {
  const q = search.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    row.passengerName,
    row.gltsApplicationId,
    row.gltsApplicantId,
    row.passportNo,
    row.companyName,
    row.country,
    row.visaType,
    row.jurisdiction,
    row.assignedTeam,
    row.assignedUser,
    row.allocatedTo,
    row.cardName,
    row.allocationNotes,
    ...row.selectedServices.map(s => s.serviceName),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export function useFundUtilizationListing() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [tableState, setTableState] = useState<TableState>({ page: 0, pageSize: 10 })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const allRows = useMemo(() => {
    void refreshKey
    return fundAllocationService
      .list()
      .filter(row => row.allocationStatus === 'allocated')
      .sort((a, b) => {
        const aAt = a.allocatedAt || ''
        const bAt = b.allocatedAt || ''
        if (aAt !== bAt) return bAt.localeCompare(aAt)
        return a.passengerName.localeCompare(b.passengerName)
      })
  }, [refreshKey])

  const filteredRows = useMemo(
    () => allRows.filter(row => matchesSearch(row, searchValue)),
    [allRows, searchValue],
  )

  const total = filteredRows.length

  const paginatedRows = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return filteredRows.slice(start, start + tableState.pageSize)
  }, [filteredRows, tableState.page, tableState.pageSize])

  const selectedRecord = useMemo(
    () => (selectedId ? allRows.find(row => row.id === selectedId) ?? null : null),
    [allRows, selectedId],
  )

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
    setTableState(state => ({ ...state, page: 0 }))
  }, [])

  const selectRecord = useCallback((row: FundAllocationPassengerRow) => {
    setSelectedId(row.id)
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
    tableState,
    setTableState,
    paginatedRows,
    total,
    selectedRecord,
    selectRecord,
    closeDetail,
    refresh,
  }
}
