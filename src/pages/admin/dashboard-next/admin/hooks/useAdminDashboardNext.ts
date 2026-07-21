import { useCallback, useMemo, useState } from 'react'
import { useDashboardQuery } from '../../shared/hooks/useDashboardQuery'
import type { DashboardFilterConfig } from '../../shared/types'
import {
  ADMIN_DASHBOARD_NEXT_PERIOD_OPTIONS,
  ADMIN_DASHBOARD_NEXT_REGION_OPTIONS,
  ADMIN_DASHBOARD_NEXT_SEGMENT_OPTIONS,
  DEFAULT_ADMIN_DASHBOARD_NEXT_FILTERS,
} from '../data/adminDashboardNextMock'
import { fetchAdminDashboardNext } from '../services/adminDashboardNextService'
import type { AdminDashboardNextFilters } from '../types'

export function useAdminDashboardNext() {
  const [filters, setFilters] = useState<AdminDashboardNextFilters>(
    DEFAULT_ADMIN_DASHBOARD_NEXT_FILTERS,
  )

  const load = useCallback(() => fetchAdminDashboardNext(filters), [filters])
  const query = useDashboardQuery({ load })

  const filterConfigs: DashboardFilterConfig[] = useMemo(
    () => [
      {
        id: 'period',
        label: 'Period',
        options: ADMIN_DASHBOARD_NEXT_PERIOD_OPTIONS,
        value: filters.period,
        onChange: (value) => setFilters((prev) => ({ ...prev, period: value })),
      },
      {
        id: 'region',
        label: 'Region',
        options: ADMIN_DASHBOARD_NEXT_REGION_OPTIONS,
        value: filters.region,
        onChange: (value) => setFilters((prev) => ({ ...prev, region: value })),
      },
      {
        id: 'segment',
        label: 'Segment',
        options: ADMIN_DASHBOARD_NEXT_SEGMENT_OPTIONS,
        value: filters.segment,
        onChange: (value) => setFilters((prev) => ({ ...prev, segment: value })),
      },
    ],
    [filters],
  )

  return {
    filters,
    setFilters,
    filterConfigs,
    data: query.data,
    status: query.status,
    error: query.error,
    retry: query.retry,
    isLoading: query.status === 'loading',
    isError: query.status === 'error',
  }
}
