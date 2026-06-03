import { useCallback, useEffect, useMemo, useState } from 'react'
import { FileText, FileCheck, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import type { CustomerKpiItem } from '@/pages/customer/features/shared/components/listing/CustomerListingKpis'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import type { BulkBatchRow, SingleApplicationRow } from '../data/applicationFlowData'
import type { ApplicationListingTab, ApplicationSortPreset } from '../types/applicationListing.types'
import {
  computeListingKpis,
  filterByTab,
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
  const [sortPreset, setSortPreset] = useState<ApplicationSortPreset>('latest_created')

  const tabFilteredRows = useMemo(() => filterByTab([...singles, ...bulks], activeTab), [singles, bulks, activeTab])

  const listing = useCustomerListing({
    rows: tabFilteredRows,
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

  return {
    activeTab,
    setActiveTab: handleTabChange,
    sortPreset,
    setSortPreset: handleSortPresetChange,
    kpis,
    listing,
  }
}
