import { useCallback, useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  BarChart3,
  Bell,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LineChart,
  ShieldAlert,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/design-system/UIComponents'
import {
  AlertCenter,
  ApplicationPipeline,
  DASHBOARD_SPACING,
  DashboardWorkspace,
  QuickActions,
} from '../../shared'
import type { DashboardIntelligenceFilters } from '../../shared/dashboard-intelligence'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import { useAdminDashboardNext } from '../hooks/useAdminDashboardNext'
import { ADMIN_DASHBOARD_NEXT_MOCK } from '../data/adminDashboardNextMock'
import { buildAdminSearchItems } from '../data/adminSearchItems'
import { AdminExecutiveRow } from '../components/AdminExecutiveRow'
import { AdminHeroStrip } from '../components/AdminHeroStrip'
import {
  ACTION_ICONS,
  AnalyticsTab,
  ApplicationsTab,
  OperationsTab,
  OverviewTab,
  ReportsTab,
  RiskComplianceTab,
} from '../tabs'
import type { AdminDashboardTabProps } from '../types'

function AdminNotificationsAction({
  count,
  onOpen,
}: {
  count: number
  onOpen: () => void
}) {
  return (
    <Button
      label={count > 0 ? `Alerts (${count})` : 'Alerts'}
      variant="outlined"
      size="sm"
      startIcon={<Bell size={16} />}
      onClick={onOpen}
      aria-label={`Open notifications, ${count} unread`}
    />
  )
}

function AdminWorkspaceActions({
  unreadCount,
  notifications,
}: {
  unreadCount: number
  notifications: typeof ADMIN_DASHBOARD_NEXT_MOCK.notifications
}) {
  const drilldown = useDrilldownOptional()
  return (
    <AdminNotificationsAction
      count={unreadCount}
      onOpen={() =>
        drilldown?.openDrilldown({
          id: 'admin-notifications',
          title: 'Admin notifications',
          subtitle: `${unreadCount} unread`,
          entityType: 'custom',
          entityId: 'notifications',
          meta: {
            count: notifications.length,
            preview: notifications[0]?.title,
          },
        })
      }
    />
  )
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useAdminDashboardNext()
  const data = dashboard.data ?? ADMIN_DASHBOARD_NEXT_MOCK
  const loading = dashboard.isLoading
  const setFilters = dashboard.setFilters

  const onFiltersChange = useCallback(
    (filters: DashboardIntelligenceFilters) => {
      setFilters((prev) => ({
        ...prev,
        period:
          filters.datePreset === 'week' ||
          filters.datePreset === 'quarter' ||
          filters.datePreset === 'year' ||
          filters.datePreset === 'month' ||
          filters.datePreset === 'today'
            ? filters.datePreset
            : prev.period,
        region: filters.branch === 'all' ? prev.region : filters.branch,
        segment: filters.segment === 'all' ? 'all' : filters.segment,
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
      buildAdminSearchItems({
        onNavigate: (href) => navigate(href),
        onOpenTab: openTab,
      }),
    [navigate, openTab],
  )

  const unreadCount = data.notifications.filter((n) => n.unread).length

  const tabProps: AdminDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onPipelineStageClick: (stageId) => {
      navigate(`/admin/application-management/retail?stage=${stageId}`)
    },
    onVerificationOpen: () => navigate('/admin/application-management/retail'),
    onViewVerificationQueue: () => navigate('/admin/assignment-priority/retail'),
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
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
      extraActions={
        <AdminWorkspaceActions unreadCount={unreadCount} notifications={data.notifications} />
      }
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
                alerts={
                  <AlertCenter
                    title="Alerts & notifications"
                    alerts={data.notifications.map((n, index) => ({
                      id: n.id,
                      title: n.title,
                      description: [n.body, n.createdAt].filter(Boolean).join(' · '),
                      severity: index === 0 ? 'critical' : index === 1 ? 'warning' : 'info',
                    }))}
                    loading={loading}
                    maxItems={4}
                    onShowMore={() => openTab('risk-compliance')}
                  />
                }
                primaryVisualization={
                  <ApplicationPipeline
                    title="Application funnel"
                    subtitle="Primary visualization — stage health across the network"
                    stages={data.pipelineStages}
                    loading={loading}
                    onRetry={dashboard.retry}
                    onStageClick={(stageId) => {
                      navigate(`/admin/application-management/retail?stage=${stageId}`)
                    }}
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
                      icon: ACTION_ICONS[action.id],
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
          badge: data.operationsHealth.delayedCases,
          content: <OperationsTab {...tabProps} />,
        },
        {
          id: 'analytics',
          label: 'Analytics',
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
