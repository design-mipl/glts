import { useCallback, useMemo, useState } from 'react'
import { useDashboardQuery } from '../../shared/hooks/useDashboardQuery'
import type { DashboardFilterConfig } from '../../shared/types'
import {
  ACCOUNTS_BRANCH_OPTIONS,
  ACCOUNTS_CLIENT_OPTIONS,
  ACCOUNTS_COLLECTION_STATUS_OPTIONS,
  ACCOUNTS_COUNTRY_OPTIONS,
  ACCOUNTS_DATE_OPTIONS,
  ACCOUNTS_INVOICE_STATUS_OPTIONS,
  ACCOUNTS_SEGMENT_OPTIONS,
  ACCOUNTS_VENDOR_OPTIONS,
  DEFAULT_ACCOUNTS_DASHBOARD_FILTERS,
} from '../data/accountsDashboardMock'
import { fetchAccountsDashboard } from '../services/accountsDashboardService'
import type { AccountsDashboardFilters } from '../types'

export function useAccountsDashboardNext() {
  const [filters, setFilters] = useState<AccountsDashboardFilters>(
    DEFAULT_ACCOUNTS_DASHBOARD_FILTERS,
  )

  const load = useCallback(() => fetchAccountsDashboard(filters), [filters])
  const query = useDashboardQuery({ load })

  const filterConfigs: DashboardFilterConfig[] = useMemo(
    () => [
      {
        id: 'date',
        label: 'Date',
        options: ACCOUNTS_DATE_OPTIONS,
        value: filters.date,
        onChange: (value) => setFilters((prev) => ({ ...prev, date: value })),
      },
      {
        id: 'branch',
        label: 'Branch',
        options: ACCOUNTS_BRANCH_OPTIONS,
        value: filters.branch,
        onChange: (value) => setFilters((prev) => ({ ...prev, branch: value })),
      },
      {
        id: 'segment',
        label: 'Business segment',
        options: ACCOUNTS_SEGMENT_OPTIONS,
        value: filters.segment,
        onChange: (value) => setFilters((prev) => ({ ...prev, segment: value })),
      },
      {
        id: 'client',
        label: 'Client',
        options: ACCOUNTS_CLIENT_OPTIONS,
        value: filters.client,
        onChange: (value) => setFilters((prev) => ({ ...prev, client: value })),
      },
      {
        id: 'invoiceStatus',
        label: 'Invoice status',
        options: ACCOUNTS_INVOICE_STATUS_OPTIONS,
        value: filters.invoiceStatus,
        onChange: (value) => setFilters((prev) => ({ ...prev, invoiceStatus: value })),
      },
      {
        id: 'collectionStatus',
        label: 'Collection status',
        options: ACCOUNTS_COLLECTION_STATUS_OPTIONS,
        value: filters.collectionStatus,
        onChange: (value) => setFilters((prev) => ({ ...prev, collectionStatus: value })),
      },
      {
        id: 'vendor',
        label: 'Vendor',
        options: ACCOUNTS_VENDOR_OPTIONS,
        value: filters.vendor,
        onChange: (value) => setFilters((prev) => ({ ...prev, vendor: value })),
      },
      {
        id: 'country',
        label: 'Country',
        options: ACCOUNTS_COUNTRY_OPTIONS,
        value: filters.country,
        onChange: (value) => setFilters((prev) => ({ ...prev, country: value })),
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
