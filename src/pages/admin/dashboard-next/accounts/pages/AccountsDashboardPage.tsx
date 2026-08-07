import { useCallback, useMemo } from 'react'
import {
  ClipboardList,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardWorkspace } from '../../shared'
import type { DashboardIntelligenceFilters } from '../../shared/dashboard-intelligence'
import { useAccountsDashboardNext } from '../hooks/useAccountsDashboardNext'
import { ACCOUNTS_DASHBOARD_MOCK } from '../data/accountsDashboardMock'
import { buildAccountsSearchItems } from '../data/accountsSearchItems'
import { AccountsHeroStrip } from '../components/AccountsHeroStrip'
import { OverviewTab, PerformanceTab, ReportsTab, WorkTab } from '../tabs'
import type { AccountsDashboardTabProps } from '../types'

export function AccountsDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useAccountsDashboardNext()
  const data = dashboard.data ?? ACCOUNTS_DASHBOARD_MOCK
  const loading = dashboard.isLoading
  const setFilters = dashboard.setFilters

  const openInvoices = () => navigate('/admin/finance/invoices')
  const openVendorBilling = () => navigate('/admin/finance/vendor-billing')

  const onFiltersChange = useCallback(
    (filters: DashboardIntelligenceFilters) => {
      setFilters((prev) => ({
        ...prev,
        date:
          filters.datePreset === 'custom' ||
          filters.datePreset === 'date' ||
          filters.datePreset === 'range'
            ? prev.date
            : filters.datePreset,
        client: filters.client,
        segment: filters.segment,
        country: filters.country,
        invoiceStatus: filters.status === 'all' ? prev.invoiceStatus : filters.status,
        search: filters.search,
      }))
    },
    [setFilters],
  )

  const openTab = useCallback(
    (tabId: string) => {
      navigate({ search: `?tab=${tabId}` }, { replace: true })
    },
    [navigate],
  )

  const searchItems = useMemo(
    () =>
      buildAccountsSearchItems({
        onNavigate: (href) => navigate(href),
        onOpenTab: openTab,
      }),
    [navigate, openTab],
  )

  const workBadge =
    data.expenseDailyRows.length +
    data.fundAllocationRows.filter((r) => r.allocationStatus === 'Pending').length +
    data.claimSheetRows.filter((r) => r.status === 'Pending review').length +
    data.vendorBillingRows.reduce((sum, r) => sum + r.awaitingInvoiceCount, 0) +
    data.invoiceExceptionRows.length +
    data.followUpRows.length

  const tabProps: AccountsDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenTab: openTab,
    onOpenInvoice: openInvoices,
    onOpenCollection: openInvoices,
    onOpenReconciliation: openVendorBilling,
  }

  return (
    <DashboardWorkspace
      workspaceId="accounts"
      title="Accounts dashboard"
      subtitle="Finance workspace for expenses, fund allocation, vendor billing, invoicing, and credit control."
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
      defaultTab="overview"
      hero={<AccountsHeroStrip items={data.quickStats} loading={loading} />}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} />,
          content: <OverviewTab {...tabProps} />,
        },
        {
          id: 'work',
          label: 'Work',
          icon: <ClipboardList size={16} />,
          badge: workBadge,
          content: <WorkTab {...tabProps} />,
        },
        {
          id: 'performance',
          label: 'Performance',
          icon: <Gauge size={16} />,
          content: <PerformanceTab {...tabProps} />,
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <FileSpreadsheet size={16} />,
          content: <ReportsTab {...tabProps} />,
        },
      ]}
    />
  )
}
