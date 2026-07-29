import { useCallback, useMemo, useState } from 'react'
import { useDashboardQuery } from '../../shared/hooks/useDashboardQuery'
import type { DashboardFilterConfig } from '../../shared/types'
import {
  DEFAULT_OPERATIONS_DASHBOARD_FILTERS,
  OPERATIONS_COUNTRY_OPTIONS,
  OPERATIONS_DATE_OPTIONS,
  OPERATIONS_PRIORITY_OPTIONS,
  OPERATIONS_SEGMENT_OPTIONS,
  OPERATIONS_STATUS_OPTIONS,
  OPERATIONS_VISA_TYPE_OPTIONS,
} from '../data/operationsDashboardMock'
import { fetchOperationsDashboard } from '../services/operationsDashboardService'
import type { OperationsDashboardFilters } from '../types'

export function useOperationsDashboardNext() {
  const [filters, setFilters] = useState<OperationsDashboardFilters>(
    DEFAULT_OPERATIONS_DASHBOARD_FILTERS,
  )

  const load = useCallback(() => fetchOperationsDashboard(filters), [filters])
  const query = useDashboardQuery({ load })

  const filterConfigs: DashboardFilterConfig[] = useMemo(
    () => [
      {
        id: 'date',
        label: 'Date',
        options: OPERATIONS_DATE_OPTIONS,
        value: filters.date,
        onChange: (value) => setFilters((prev) => ({ ...prev, date: value })),
      },
      {
        id: 'country',
        label: 'Country',
        options: OPERATIONS_COUNTRY_OPTIONS,
        value: filters.country,
        onChange: (value) => setFilters((prev) => ({ ...prev, country: value })),
      },
      {
        id: 'visaType',
        label: 'Visa type',
        options: OPERATIONS_VISA_TYPE_OPTIONS,
        value: filters.visaType,
        onChange: (value) => setFilters((prev) => ({ ...prev, visaType: value })),
      },
      {
        id: 'status',
        label: 'Status',
        options: OPERATIONS_STATUS_OPTIONS,
        value: filters.status,
        onChange: (value) => setFilters((prev) => ({ ...prev, status: value })),
      },
      {
        id: 'priority',
        label: 'Priority',
        options: OPERATIONS_PRIORITY_OPTIONS,
        value: filters.priority,
        onChange: (value) => setFilters((prev) => ({ ...prev, priority: value })),
      },
      {
        id: 'segment',
        label: 'Business segment',
        options: OPERATIONS_SEGMENT_OPTIONS,
        value: filters.segment,
        onChange: (value) => setFilters((prev) => ({ ...prev, segment: value })),
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
