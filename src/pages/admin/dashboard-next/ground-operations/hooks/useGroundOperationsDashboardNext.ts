import { useCallback, useMemo, useState } from 'react'
import { useDashboardQuery } from '../../shared/hooks/useDashboardQuery'
import type { DashboardFilterConfig } from '../../shared/types'
import {
  DEFAULT_GROUND_OPS_DASHBOARD_FILTERS,
  GROUND_OPS_APPOINTMENT_STATUS_OPTIONS,
  GROUND_OPS_ASSIGNMENT_STATUS_OPTIONS,
  GROUND_OPS_BRANCH_OPTIONS,
  GROUND_OPS_CITY_OPTIONS,
  GROUND_OPS_DATE_OPTIONS,
  GROUND_OPS_EXECUTIVE_OPTIONS,
  GROUND_OPS_PRIORITY_OPTIONS,
} from '../data/groundOperationsDashboardMock'
import { fetchGroundOperationsDashboard } from '../services/groundOperationsDashboardService'
import type { GroundOperationsDashboardFilters } from '../types'

export function useGroundOperationsDashboardNext() {
  const [filters, setFilters] = useState<GroundOperationsDashboardFilters>(
    DEFAULT_GROUND_OPS_DASHBOARD_FILTERS,
  )

  const load = useCallback(() => fetchGroundOperationsDashboard(filters), [filters])
  const query = useDashboardQuery({ load })

  const filterConfigs: DashboardFilterConfig[] = useMemo(
    () => [
      {
        id: 'date',
        label: 'Date',
        options: GROUND_OPS_DATE_OPTIONS,
        value: filters.date,
        onChange: (value) => setFilters((prev) => ({ ...prev, date: value })),
      },
      {
        id: 'branch',
        label: 'Branch',
        options: GROUND_OPS_BRANCH_OPTIONS,
        value: filters.branch,
        onChange: (value) => setFilters((prev) => ({ ...prev, branch: value })),
      },
      {
        id: 'city',
        label: 'City',
        options: GROUND_OPS_CITY_OPTIONS,
        value: filters.city,
        onChange: (value) => setFilters((prev) => ({ ...prev, city: value })),
      },
      {
        id: 'executive',
        label: 'Executive',
        options: GROUND_OPS_EXECUTIVE_OPTIONS,
        value: filters.executive,
        onChange: (value) => setFilters((prev) => ({ ...prev, executive: value })),
      },
      {
        id: 'assignmentStatus',
        label: 'Assignment status',
        options: GROUND_OPS_ASSIGNMENT_STATUS_OPTIONS,
        value: filters.assignmentStatus,
        onChange: (value) => setFilters((prev) => ({ ...prev, assignmentStatus: value })),
      },
      {
        id: 'appointmentStatus',
        label: 'Appointment status',
        options: GROUND_OPS_APPOINTMENT_STATUS_OPTIONS,
        value: filters.appointmentStatus,
        onChange: (value) => setFilters((prev) => ({ ...prev, appointmentStatus: value })),
      },
      {
        id: 'priority',
        label: 'Priority',
        options: GROUND_OPS_PRIORITY_OPTIONS,
        value: filters.priority,
        onChange: (value) => setFilters((prev) => ({ ...prev, priority: value })),
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
