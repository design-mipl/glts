import { useCallback, useEffect, useMemo, useState } from 'react'
import { FileText, FileCheck, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import type { CustomerKpiItem } from '@/pages/customer/features/shared/components/listing/CustomerListingKpis'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import type { BulkBatchRow, SingleApplicationRow } from '../data/applicationFlowData'
import type {
  ApplicationListingFilterState,
  ApplicationListingTab,
  ApplicationSortPreset,
} from '../types/applicationListing.types'
import { EMPTY_APPLICATION_LISTING_FILTERS } from '../types/applicationListing.types'
import {
  applyAdvancedFilters,
  computeListingKpis,
  filterByTab,
  getFilterOptions,
  getListingCellValue,
  matchesListingSearch,
  sortPresetToTableState,
} from '../utils/applicationListingUtils'

export interface UseApplicationListingWorkspaceOptions {
  singles: SingleApplicationRow[]
  bulks: BulkBatchRow[]
}

export function useApplicationListingWorkspace({ singles, bulks }: UseApplicationListingWorkspaceOptions) {
  const [activeTab, setActiveTab] = useState<ApplicationListingTab>('all')
  const [advancedFilters, setAdvancedFilters] = useState<ApplicationListingFilterState>(
    EMPTY_APPLICATION_LISTING_FILTERS,
  )
  const [sortPreset, setSortPreset] = useState<ApplicationSortPreset>('latest_created')

  const tabFilteredRows = useMemo(() => filterByTab([...singles, ...bulks], activeTab), [singles, bulks, activeTab])

  const advancedFilteredSource = useMemo(
    () => applyAdvancedFilters(tabFilteredRows, advancedFilters),
    [tabFilteredRows, advancedFilters],
  )

  const listing = useCustomerListing({
    rows: advancedFilteredSource,
    getCellValue: getListingCellValue,
    searchMatch: matchesListingSearch,
    initialPageSize: 10,
  })

  const sortState = useMemo(() => sortPresetToTableState(sortPreset), [sortPreset])

  useEffect(() => {
    listing.setTableState(s => ({
      ...s,
      sortKey: sortState.sortKey,
      sortDirection: sortState.sortDirection,
      page: 0,
    }))
  }, [sortState.sortKey, sortState.sortDirection])

  const handleTabChange = useCallback(
    (tab: ApplicationListingTab) => {
      setActiveTab(tab)
      listing.setTableState(s => ({ ...s, page: 0 }))
    },
    [listing],
  )

  const handleSortPresetChange = useCallback(
    (preset: ApplicationSortPreset) => {
      setSortPreset(preset)
      listing.setTableState(s => ({ ...s, page: 0 }))
    },
    [listing],
  )

  const handleAdvancedFiltersChange = useCallback(
    (next: ApplicationListingFilterState) => {
      setAdvancedFilters(next)
      listing.setTableState(s => ({ ...s, page: 0 }))
    },
    [listing],
  )

  const clearAdvancedFilters = useCallback(() => {
    setAdvancedFilters(EMPTY_APPLICATION_LISTING_FILTERS)
    listing.setTableState(s => ({ ...s, page: 0 }))
  }, [listing])

  const kpiMetrics = useMemo(() => computeListingKpis(singles, bulks), [singles, bulks])

  const kpis: CustomerKpiItem[] = useMemo(
    () => [
      { id: 'total', label: 'Total applications', value: String(kpiMetrics.total), icon: FileText, color: 'primary' },
      { id: 'draft', label: 'Draft applications', value: String(kpiMetrics.draft), icon: FileCheck, color: 'info' },
      {
        id: 'corrections',
        label: 'Pending corrections',
        value: String(kpiMetrics.pendingCorrections),
        icon: AlertTriangle,
        color: 'warning',
      },
      { id: 'review', label: 'Under review', value: String(kpiMetrics.underReview), icon: Clock, color: 'info' },
      {
        id: 'completed',
        label: 'Completed applications',
        value: String(kpiMetrics.completed),
        icon: CheckCircle2,
        color: 'success',
      },
    ],
    [kpiMetrics],
  )

  const filterOptions = useMemo(() => getFilterOptions(singles, bulks), [singles, bulks])

  const hasActiveFilters = useMemo(
    () =>
      Object.values(advancedFilters).some(v => v !== '') ||
      Boolean(listing.tableState.searchQuery.trim()) ||
      Object.values(listing.columnFilters).some(v => v.length > 0),
    [advancedFilters, listing.tableState.searchQuery, listing.columnFilters],
  )

  return {
    activeTab,
    setActiveTab: handleTabChange,
    advancedFilters,
    setAdvancedFilters: handleAdvancedFiltersChange,
    clearAdvancedFilters,
    sortPreset,
    setSortPreset: handleSortPresetChange,
    kpis,
    filterOptions,
    listing,
    hasActiveFilters,
  }
}
