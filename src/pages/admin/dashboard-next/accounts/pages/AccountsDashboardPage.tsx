import { useCallback, useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  BarChart3,
  Bell,
  FileSpreadsheet,
  FileText,
  HandCoins,
  LayoutDashboard,
  Scale,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/design-system/UIComponents'
import {
  AlertCenter,
  CollectionSummary,
  DASHBOARD_SPACING,
  DashboardWorkspace,
  QuickActions,
} from '../../shared'
import type { DashboardIntelligenceFilters } from '../../shared/dashboard-intelligence'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import { useAccountsDashboardNext } from '../hooks/useAccountsDashboardNext'
import { ACCOUNTS_DASHBOARD_MOCK } from '../data/accountsDashboardMock'
import { buildAccountsSearchItems } from '../data/accountsSearchItems'
import { AccountsExecutiveRow } from '../components/AccountsExecutiveRow'
import { AccountsHeroStrip } from '../components/AccountsHeroStrip'
import {
  ACCOUNTS_ACTION_ICONS,
  AnalyticsTab,
  CollectionsTab,
  InvoicingTab,
  OverviewTab,
  ReconciliationTab,
  ReportsTab,
} from '../tabs'
import type { AccountsDashboardTabProps } from '../types'

function AccountsWorkspaceActions({
  unreadCount,
  notifications,
}: {
  unreadCount: number
  notifications: typeof ACCOUNTS_DASHBOARD_MOCK.notifications
}) {
  const drilldown = useDrilldownOptional()
  return (
    <Button
      label={unreadCount > 0 ? `Alerts (${unreadCount})` : 'Alerts'}
      variant="outlined"
      size="sm"
      startIcon={<Bell size={16} />}
      onClick={() =>
        drilldown?.openDrilldown({
          id: 'accounts-notifications',
          title: 'Financial notifications',
          subtitle: `${unreadCount} unread`,
          entityType: 'custom',
          entityId: 'notifications',
          meta: {
            count: notifications.length,
            preview: notifications[0]?.title,
          },
        })
      }
      aria-label={`Open financial notifications, ${unreadCount} unread`}
    />
  )
}

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
          filters.datePreset === 'custom'
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

  const unreadCount = data.notifications.filter((n) => n.unread).length

  const tabProps: AccountsDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenInvoice: openInvoices,
    onOpenCollection: openInvoices,
    onOpenReconciliation: openVendorBilling,
  }

  return (
    <DashboardWorkspace
      workspaceId="accounts"
      title="Accounts dashboard"
      subtitle="Finance workspace for collections, invoicing, reconciliation, and cash discipline."
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
      extraActions={
        <AccountsWorkspaceActions unreadCount={unreadCount} notifications={data.notifications} />
      }
      defaultTab="overview"
      hero={<AccountsHeroStrip items={data.quickStats} loading={loading} />}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} />,
          content: (
            <Stack spacing={DASHBOARD_SPACING.field}>
              <AccountsExecutiveRow
                alerts={
                  <AlertCenter
                    title="Financial alerts"
                    alerts={data.notifications.map((n, index) => ({
                      id: n.id,
                      title: n.title,
                      description: [n.body, n.createdAt].filter(Boolean).join(' · '),
                      severity: index === 0 ? 'critical' : index === 1 ? 'warning' : 'info',
                    }))}
                    loading={loading}
                    maxItems={4}
                    onShowMore={() => openTab('collections')}
                  />
                }
                primaryVisualization={
                  <CollectionSummary
                    title="Collections funnel"
                    subtitle="Primary visualization — outstanding vs collected"
                    data={data.collectionSummary}
                    loading={loading}
                    onRetry={dashboard.retry}
                  />
                }
                quickActions={
                  <QuickActions
                    title="Quick actions"
                    variant="tiles"
                    columns={1}
                    loading={loading}
                    items={data.quickActions.map((action) => ({
                      id: action.id,
                      title: action.title,
                      description: action.description,
                      badge: action.badge,
                      icon: ACCOUNTS_ACTION_ICONS[action.id],
                      onClick: () => navigate(action.href),
                    }))}
                  />
                }
              />
              <OverviewTab {...tabProps} />
            </Stack>
          ),
        },
        {
          id: 'collections',
          label: 'Collections',
          icon: <HandCoins size={16} />,
          badge: data.collectionRows.length,
          content: <CollectionsTab {...tabProps} />,
        },
        {
          id: 'invoices',
          label: 'Invoices',
          icon: <FileText size={16} />,
          badge: data.invoiceRows.length,
          content: <InvoicingTab {...tabProps} />,
        },
        {
          id: 'reconciliation',
          label: 'Reconciliation',
          icon: <Scale size={16} />,
          badge: data.reconciliationRows.length,
          content: <ReconciliationTab {...tabProps} />,
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <BarChart3 size={16} />,
          content: <AnalyticsTab {...tabProps} />,
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
