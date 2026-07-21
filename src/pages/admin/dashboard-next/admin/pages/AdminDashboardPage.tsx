import {
  Activity,
  BarChart3,
  ClipboardList,
  FileText,
  LineChart,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardFilters, DashboardShell } from '../../shared'
import { useAdminDashboardNext } from '../hooks/useAdminDashboardNext'
import { ADMIN_DASHBOARD_NEXT_MOCK } from '../data/adminDashboardNextMock'
import {
  AnalyticsTab,
  OperationsTab,
  OverviewTab,
  ProductivityTab,
  ReportsTab,
} from '../tabs'
import type { AdminDashboardTabProps } from '../types'

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useAdminDashboardNext()
  const data = dashboard.data ?? ADMIN_DASHBOARD_NEXT_MOCK
  const loading = dashboard.isLoading

  const tabProps: AdminDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onPipelineStageClick: () => navigate('/admin/application-management/retail'),
    onVerificationOpen: () => navigate('/admin/application-management/retail'),
    onViewVerificationQueue: () => navigate('/admin/assignment-priority/retail'),
  }

  return (
    <DashboardShell
      badge="Next"
      title="Admin dashboard"
      subtitle="Executive overview of business operations."
      filters={<DashboardFilters filters={dashboard.filterConfigs} />}
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      defaultTab="overview"
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <FileText size={16} />,
          content: <OverviewTab {...tabProps} />,
        },
        {
          id: 'operations',
          label: 'Operations',
          icon: <ClipboardList size={16} />,
          content: <OperationsTab {...tabProps} />,
        },
        {
          id: 'productivity',
          label: 'Productivity',
          icon: <Activity size={16} />,
          content: <ProductivityTab {...tabProps} />,
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
          icon: <LineChart size={16} />,
          content: <ReportsTab {...tabProps} />,
        },
      ]}
    />
  )
}
