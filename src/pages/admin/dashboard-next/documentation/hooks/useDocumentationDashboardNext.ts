import { useCallback, useMemo, useState } from 'react'
import { useAdminSession } from '@/pages/admin/hooks/useAdminSession'
import { useDashboardQuery } from '../../shared/hooks/useDashboardQuery'
import type { DashboardFilterConfig } from '../../shared/types'
import { MOCK_DOCUMENTATION_EXECUTIVE_NAME } from '@/pages/admin/dashboard/documentation/data/documentationDashboardMock'
import {
  DEFAULT_DOCUMENTATION_DASHBOARD_FILTERS,
  DOC_APPLICATION_TYPE_OPTIONS,
  DOC_COUNTRY_OPTIONS,
  DOC_DATE_OPTIONS,
} from '../data/documentationDashboardMock'
import { fetchDocumentationDashboard } from '../services/documentationDashboardService'
import type { DocumentationDashboardFilters } from '../types'

export function useDocumentationDashboardNext() {
  const { user } = useAdminSession()
  const executiveName =
    user.name === 'GLTS Admin' ? MOCK_DOCUMENTATION_EXECUTIVE_NAME : user.name

  const [filters, setFilters] = useState<DocumentationDashboardFilters>(
    DEFAULT_DOCUMENTATION_DASHBOARD_FILTERS,
  )

  const load = useCallback(
    () => fetchDocumentationDashboard(filters, executiveName),
    [filters, executiveName],
  )
  const query = useDashboardQuery({ load })

  const filterConfigs: DashboardFilterConfig[] = useMemo(
    () => [
      {
        id: 'date',
        label: 'Date',
        options: DOC_DATE_OPTIONS,
        value: filters.date,
        onChange: (value) => setFilters((prev) => ({ ...prev, date: value })),
      },
      {
        id: 'country',
        label: 'Country',
        options: DOC_COUNTRY_OPTIONS,
        value: filters.country,
        onChange: (value) => setFilters((prev) => ({ ...prev, country: value })),
      },
      {
        id: 'applicationType',
        label: 'Application type',
        options: DOC_APPLICATION_TYPE_OPTIONS,
        value: filters.applicationType,
        onChange: (value) => setFilters((prev) => ({ ...prev, applicationType: value })),
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
    executiveName,
    data: query.data,
    status: query.status,
    error: query.error,
    retry: query.retry,
    isLoading: query.status === 'loading',
    isError: query.status === 'error',
  }
}
