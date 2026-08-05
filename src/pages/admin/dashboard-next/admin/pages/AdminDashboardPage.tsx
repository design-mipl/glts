import { useCallback, useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LineChart,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DASHBOARD_SPACING,
  DashboardWorkspace,
} from '../../shared'
import { useAdminDashboardNext, DEFAULT_ADMIN_DASHBOARD_NEXT_FILTERS } from '../hooks/useAdminDashboardNext'
import { ADMIN_DASHBOARD_NEXT_MOCK } from '../data/adminDashboardNextMock'
import { buildAdminSearchItems } from '../data/adminSearchItems'
import { listLogisticsInTransitRows } from '../../shared/utils/mapLogisticsInTransitRows'
import { AdminApplicationFunnelSection } from '../components/AdminApplicationFunnelSection'
import { AdminExecutiveRow } from '../components/AdminExecutiveRow'
import { AdminHeroStrip } from '../components/AdminHeroStrip'
import { NeedsImmediateAttentionSection } from '@/pages/admin/dashboard/components'
import {
  AnalyticsTab,
  ApplicationsTab,
  OperationsTab,
  OverviewTab,
  ProductivityTab,
  ReportsTab,
  RiskComplianceTab,
} from '../tabs'
import { resolveAdminAttentionIcon } from '../utils/resolveAdminAttentionIcon'
import type { AdminDashboardTabProps } from '../types'
import { applicationPipelineStageHref } from '../../shared/config/applicationPipeline'

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useAdminDashboardNext()
  const data =
    dashboard.data ??
    (() => {
      const fallback = structuredClone(ADMIN_DASHBOARD_NEXT_MOCK)
      fallback.inTransitCourierRows = listLogisticsInTransitRows()
      return fallback
    })()
  const loading = dashboard.isLoading

  const openTab = useCallback(
    (tabId: string) => {
      navigate({ search: `?tab=${tabId}` }, { replace: true })
    },
    [navigate],
  )

  const searchItems = useMemo(
    () =>
      buildAdminSearchItems({
        onNavigate: (href) => navigate(href),
        onOpenTab: openTab,
      }),
    [navigate, openTab],
  )

  const tabProps: AdminDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onPipelineStageClick: (stageId) => {
      navigate(applicationPipelineStageHref(stageId))
    },
    onVerificationOpen: () => navigate('/admin/application-management/marine'),
    onViewVerificationQueue: () =>
      navigate('/admin/application-management/marine?tab=verification_pending'),
  }

  return (
    <DashboardWorkspace
      workspaceId="admin"
      title="Admin dashboard"
      subtitle="Executive overview of business operations — applications, delivery risk, and throughput."
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      initialFilters={DEFAULT_ADMIN_DASHBOARD_NEXT_FILTERS}
      onFiltersChange={dashboard.setFilters}
      searchItems={searchItems}
      defaultTab="overview"
      hero={<AdminHeroStrip items={data.quickStats} loading={loading} />}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} />,
          content: (
            <Stack spacing={DASHBOARD_SPACING.field}>
              <AdminExecutiveRow
                primaryVisualization={
                  <AdminApplicationFunnelSection
                    stages={data.pipelineStages}
                    loading={loading}
                    onRetry={dashboard.retry}
                    onNavigate={(href) => navigate(href)}
                  />
                }
                quickActions={
                  <NeedsImmediateAttentionSection
                    alerts={data.attentionAlerts}
                    resolveIcon={resolveAdminAttentionIcon}
                    density="compact"
                    onOpenAlertCenter={() => openTab('risk-compliance')}
                    onViewAlert={(alert) => {
                      navigate(
                        `/admin/ground-operations/case-handling?attention=${encodeURIComponent(alert.id)}`,
                      )
                    }}
                  />
                }
              />
              <OverviewTab
                {...tabProps}
                onOpenVisaAnalytics={() => openTab('analytics')}
              />
            </Stack>
          ),
        },
        {
          id: 'applications',
          label: 'Applications',
          icon: <FileText size={16} />,
          badge: data.pendingVerification.length,
          content: <ApplicationsTab {...tabProps} />,
        },
        {
          id: 'operations',
          label: 'Operations',
          icon: <ClipboardList size={16} />,
          badge:
            data.inTransitCourierRows?.length || data.operationsHealth.delayedCases,
          content: <OperationsTab {...tabProps} />,
        },
        {
          id: 'teams-productivity',
          label: 'Teams & Productivity',
          icon: <Users size={16} />,
          content: <ProductivityTab {...tabProps} />,
        },
        {
          id: 'analytics',
          label: 'Visa Analytics',
          icon: <BarChart3 size={16} />,
          content: <AnalyticsTab {...tabProps} />,
        },
        {
          id: 'risk-compliance',
          label: 'Risk & Compliance',
          icon: <ShieldAlert size={16} />,
          badge: data.riskAlerts.length,
          content: <RiskComplianceTab {...tabProps} />,
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
