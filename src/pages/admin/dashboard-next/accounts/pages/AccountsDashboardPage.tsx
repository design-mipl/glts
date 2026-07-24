import { Box, Grid, Stack } from '@mui/material'
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  HandCoins,
  LayoutDashboard,
  Scale,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FormField, Input } from '@/design-system/UIComponents'
import { DashboardFilters, DashboardShell, DASHBOARD_SPACING } from '../../shared'
import { useAccountsDashboardNext } from '../hooks/useAccountsDashboardNext'
import { ACCOUNTS_DASHBOARD_MOCK } from '../data/accountsDashboardMock'
import {
  AnalyticsTab,
  CollectionsTab,
  InvoicingTab,
  OverviewTab,
  ReconciliationTab,
  ReportsTab,
} from '../tabs'
import type { AccountsDashboardTabProps } from '../types'

export function AccountsDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useAccountsDashboardNext()
  const data = dashboard.data ?? ACCOUNTS_DASHBOARD_MOCK
  const loading = dashboard.isLoading

  const openInvoices = () => navigate('/admin/finance/invoices')
  const openVendorBilling = () => navigate('/admin/finance/vendor-billing')

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
    <DashboardShell
      badge="Next"
      title="Accounts dashboard"
      subtitle="Finance workspace for collections, invoicing, reconciliation, and cash discipline."
      filters={
        <Stack spacing={DASHBOARD_SPACING.field}>
          <Grid container spacing={DASHBOARD_SPACING.field}>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <FormField label="Search">
                <Input
                  fullWidth
                  size="sm"
                  placeholder="Invoice, client, vendor, reference…"
                  value={dashboard.filters.search}
                  onChange={dashboard.setSearch}
                />
              </FormField>
            </Grid>
          </Grid>
          <Box>
            <DashboardFilters filters={dashboard.filterConfigs} />
          </Box>
        </Stack>
      }
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      defaultTab="overview"
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} />,
          content: <OverviewTab {...tabProps} />,
        },
        {
          id: 'collections',
          label: 'Collections',
          icon: <HandCoins size={16} />,
          content: <CollectionsTab {...tabProps} />,
        },
        {
          id: 'invoicing',
          label: 'Invoicing',
          icon: <FileText size={16} />,
          content: <InvoicingTab {...tabProps} />,
        },
        {
          id: 'reconciliation',
          label: 'Reconciliation',
          icon: <Scale size={16} />,
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
