import { useCallback, useMemo, useState } from 'react'
import { useDashboardQuery } from '../../shared/hooks/useDashboardQuery'
import type { DashboardFilterConfig } from '../../shared/types'
import {
  DEFAULT_GROUND_OPS_DASHBOARD_FILTERS,
  GROUND_OPS_CASE_STATUS_OPTIONS,
  GROUND_OPS_DATE_OPTIONS,
  GROUND_OPS_EXECUTIVE_OPTIONS,
  GROUND_OPS_PRIORITY_OPTIONS,
  GROUND_OPS_TEAM_OPTIONS,
} from '../config/groundOperationsDashboardFilters'
import { fetchGroundOperationsDashboard } from '../services/groundOperationsDashboardService'
import type { GroundOperationsDashboardFilters } from '../types'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'

export function useGroundOperationsDashboardNext() {
  const [filters, setFilters] = useState<GroundOperationsDashboardFilters>({
    ...DEFAULT_GROUND_OPS_DASHBOARD_FILTERS,
  })

  const load = useCallback(() => fetchGroundOperationsDashboard(filters), [filters])
  const query = useDashboardQuery({ load })

  const executiveOptions = useMemo(() => {
    const names = [
      ...new Set(
        operationalCaseHandlingService
          .list()
          .map(row => row.assignedExecutive.trim())
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b))
    return [
      ...GROUND_OPS_EXECUTIVE_OPTIONS,
      ...names.map(name => ({ label: name, value: name })),
    ]
  }, [query.data])

  const filterConfigs: DashboardFilterConfig[] = useMemo(
    () => [
      {
        id: 'date',
        label: 'Date',
        options: GROUND_OPS_DATE_OPTIONS,
        value: filters.date,
        onChange: value => setFilters(prev => ({ ...prev, date: value })),
      },
      {
        id: 'team',
        label: 'Team',
        options: GROUND_OPS_TEAM_OPTIONS,
        value: filters.team,
        onChange: value => setFilters(prev => ({ ...prev, team: value })),
      },
      {
        id: 'executive',
        label: 'Executive',
        options: executiveOptions,
        value: filters.executive,
        onChange: value => setFilters(prev => ({ ...prev, executive: value })),
      },
      {
        id: 'caseStatus',
        label: 'Case status',
        options: GROUND_OPS_CASE_STATUS_OPTIONS,
        value: filters.caseStatus,
        onChange: value => setFilters(prev => ({ ...prev, caseStatus: value })),
      },
      {
        id: 'priority',
        label: 'Priority',
        options: GROUND_OPS_PRIORITY_OPTIONS,
        value: filters.priority,
        onChange: value => setFilters(prev => ({ ...prev, priority: value })),
      },
    ],
    [executiveOptions, filters],
  )

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }))
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
