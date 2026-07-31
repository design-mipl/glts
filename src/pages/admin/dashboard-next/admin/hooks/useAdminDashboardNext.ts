import { useCallback, useState } from 'react'
import { useDashboardQuery } from '../../shared/hooks/useDashboardQuery'
import {
  DEFAULT_INTELLIGENCE_FILTERS,
  type DashboardIntelligenceFilters,
} from '../../shared/dashboard-intelligence'
import { fetchAdminDashboardNext } from '../services/adminDashboardNextService'
import type { AdminDashboardNextFilters } from '../types'

export const DEFAULT_ADMIN_DASHBOARD_NEXT_FILTERS: AdminDashboardNextFilters = {
  ...DEFAULT_INTELLIGENCE_FILTERS,
  /** Business performance board is reviewed daily. */
  datePreset: 'today',
}

export function useAdminDashboardNext() {
  const [filters, setFilters] = useState<AdminDashboardNextFilters>(
    DEFAULT_ADMIN_DASHBOARD_NEXT_FILTERS,
  )

  const load = useCallback(() => fetchAdminDashboardNext(filters), [filters])
  const query = useDashboardQuery({ load })

  const handleFiltersChange = useCallback((next: DashboardIntelligenceFilters) => {
    setFilters(next)
  }, [])

  return {
    filters,
    setFilters: handleFiltersChange,
    data: query.data,
    status: query.status,
    error: query.error,
    retry: query.retry,
    isLoading: query.status === 'loading',
    isError: query.status === 'error',
  }
}
