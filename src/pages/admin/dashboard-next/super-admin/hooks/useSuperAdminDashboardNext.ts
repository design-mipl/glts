import { useCallback, useMemo, useState } from 'react'
import { useDashboardQuery } from '../../shared/hooks/useDashboardQuery'
import type { DashboardFilterConfig } from '../../shared/types'
import {
  DEFAULT_SUPER_ADMIN_DASHBOARD_FILTERS,
  SUPER_ADMIN_APPLICATION_STATUS_OPTIONS,
  SUPER_ADMIN_BRANCH_OPTIONS,
  SUPER_ADMIN_CLIENT_OPTIONS,
  SUPER_ADMIN_COUNTRY_OPTIONS,
  SUPER_ADMIN_DATE_OPTIONS,
  SUPER_ADMIN_SEGMENT_OPTIONS,
  SUPER_ADMIN_VISA_TYPE_OPTIONS,
} from '../data/superAdminDashboardMock'
import { fetchSuperAdminDashboard } from '../services/superAdminDashboardService'
import type { SuperAdminDashboardFilters } from '../types'

export function useSuperAdminDashboardNext() {
  const [filters, setFilters] = useState<SuperAdminDashboardFilters>(
    DEFAULT_SUPER_ADMIN_DASHBOARD_FILTERS,
  )

  const load = useCallback(() => fetchSuperAdminDashboard(filters), [filters])
  const query = useDashboardQuery({ load })

  const filterConfigs: DashboardFilterConfig[] = useMemo(
    () => [
      {
        id: 'date',
        label: 'Date',
        options: SUPER_ADMIN_DATE_OPTIONS,
        value: filters.date,
        onChange: (value) => setFilters((prev) => ({ ...prev, date: value })),
      },
      {
        id: 'branch',
        label: 'Branch',
        options: SUPER_ADMIN_BRANCH_OPTIONS,
        value: filters.branch,
        onChange: (value) => setFilters((prev) => ({ ...prev, branch: value })),
      },
      {
        id: 'country',
        label: 'Country',
        options: SUPER_ADMIN_COUNTRY_OPTIONS,
        value: filters.country,
        onChange: (value) => setFilters((prev) => ({ ...prev, country: value })),
      },
      {
        id: 'segment',
        label: 'Business segment',
        options: SUPER_ADMIN_SEGMENT_OPTIONS,
        value: filters.segment,
        onChange: (value) => setFilters((prev) => ({ ...prev, segment: value })),
      },
      {
        id: 'client',
        label: 'Client',
        options: SUPER_ADMIN_CLIENT_OPTIONS,
        value: filters.client,
        onChange: (value) => setFilters((prev) => ({ ...prev, client: value })),
      },
      {
        id: 'visaType',
        label: 'Visa type',
        options: SUPER_ADMIN_VISA_TYPE_OPTIONS,
        value: filters.visaType,
        onChange: (value) => setFilters((prev) => ({ ...prev, visaType: value })),
      },
      {
        id: 'applicationStatus',
        label: 'Application status',
        options: SUPER_ADMIN_APPLICATION_STATUS_OPTIONS,
        value: filters.applicationStatus,
        onChange: (value) => setFilters((prev) => ({ ...prev, applicationStatus: value })),
      },
    ],
    [filters],
  )

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  return {
    filters,
    setFilters,
    setSearch,
    filterConfigs,
    data: query.data,
    status: query.status,
    error: query.error,
    retry: query.retry,
    isLoading: query.status === 'loading',
    isError: query.status === 'error',
  }
}
