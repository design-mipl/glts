import { Box, Grid, Stack } from '@mui/material'
import {
  BarChart3,
  Briefcase,
  Building2,
  ClipboardList,
  FileSpreadsheet,
  HandCoins,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FormField, Input } from '@/design-system/UIComponents'
import { DashboardFilters, DashboardShell, DASHBOARD_SPACING } from '../../shared'
import { useSuperAdminDashboardNext } from '../hooks/useSuperAdminDashboardNext'
import { SUPER_ADMIN_DASHBOARD_MOCK } from '../data/superAdminDashboardMock'
import {
  AnalyticsTab,
  ClientsTab,
  ExecutiveTab,
  FinanceTab,
  OperationsTab,
  ReportsTab,
} from '../tabs'
import type { SuperAdminDashboardTabProps } from '../types'

export function SuperAdminDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useSuperAdminDashboardNext()
  const data = dashboard.data ?? SUPER_ADMIN_DASHBOARD_MOCK
  const loading = dashboard.isLoading

  const tabProps: SuperAdminDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenClient: () => navigate('/admin/customer-accounts/corporate-accounts'),
    onPipelineStageClick: () => navigate('/admin/application-management/retail'),
  }

  return (
    <DashboardShell
      badge="Next"
      title="Super Admin dashboard"
      subtitle="Executive command center for company performance, risk, and strategic trends."
      filters={
        <Stack spacing={DASHBOARD_SPACING.field}>
          <Grid container spacing={DASHBOARD_SPACING.field}>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <FormField label="Search">
                <Input
                  fullWidth
                  size="sm"
                  placeholder="Client, segment, branch…"
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
      defaultTab="executive"
      tabs={[
        {
          id: 'executive',
          label: 'Executive',
          icon: <Briefcase size={16} />,
          content: <ExecutiveTab {...tabProps} />,
        },
        {
          id: 'operations',
          label: 'Operations',
          icon: <ClipboardList size={16} />,
          content: <OperationsTab {...tabProps} />,
        },
        {
          id: 'finance',
          label: 'Finance',
          icon: <HandCoins size={16} />,
          content: <FinanceTab {...tabProps} />,
        },
        {
          id: 'clients',
          label: 'Clients',
          icon: <Building2 size={16} />,
          content: <ClientsTab {...tabProps} />,
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
