import { useCallback, useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  Bell,
  CalendarDays,
  ClipboardList,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
  ListTodo,
  Ship,
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
import { useOperationsDashboardNext } from '../hooks/useOperationsDashboardNext'
import { OPERATIONS_DASHBOARD_MOCK } from '../data/operationsDashboardMock'
import { buildOperationsSearchItems } from '../data/operationsSearchItems'
import { OperationsExecutiveRow } from '../components/OperationsExecutiveRow'
import { OperationsHeroStrip } from '../components/OperationsHeroStrip'
import {
  AppointmentsTab,
  MarineTab,
  MyWorkTab,
  OPS_ACTION_ICONS,
  OverviewTab,
  PerformanceTab,
  QueuesTab,
  ReportsTab,
} from '../tabs'
import type { OperationsDashboardTabProps } from '../types'

function OperationsWorkspaceActions({
  unreadCount,
  notifications,
}: {
  unreadCount: number
  notifications: typeof OPERATIONS_DASHBOARD_MOCK.notifications
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
          id: 'ops-notifications',
          title: 'Operations notifications',
          subtitle: `${unreadCount} unread`,
          entityType: 'custom',
          entityId: 'notifications',
          meta: {
            count: notifications.length,
            preview: notifications[0]?.title,
          },
        })
      }
      aria-label={`Open operations notifications, ${unreadCount} unread`}
    />
  )
}

export function OperationsDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useOperationsDashboardNext()
  const data = dashboard.data ?? OPERATIONS_DASHBOARD_MOCK
  const loading = dashboard.isLoading
  const setFilters = dashboard.setFilters

  const onFiltersChange = useCallback(
    (filters: DashboardIntelligenceFilters) => {
      setFilters((prev) => ({
        ...prev,
        date:
          filters.datePreset === 'custom'
            ? prev.date
            : filters.datePreset,
        country: filters.country,
        visaType: filters.visaType,
        status: filters.status,
        segment: filters.segment,
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
      buildOperationsSearchItems({
        onNavigate: (href) => navigate(href),
        onOpenTab: openTab,
      }),
    [navigate, openTab],
  )

  const unreadCount = data.notifications.filter((n) => n.unread).length

  const tabProps: OperationsDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenApplication: (href) => navigate(href),
    onPipelineStageClick: (stageId) =>
      navigate(`/admin/application-management/retail?stage=${stageId}`),
    onVerificationOpen: () => navigate('/admin/application-management/retail'),
    onViewVerificationQueue: () => navigate('/admin/assignment-priority/retail'),
    onQueueRowClick: () => navigate('/admin/application-management/retail'),
    onJobClick: () => navigate('/admin/application-management/retail'),
  }

  const showMarineTab = loading || data.marinePriorityCases.length > 0

  return (
    <DashboardWorkspace
      workspaceId="operations"
      title="Operations dashboard"
      subtitle={`Workbench for ${data.consultantName} — know what needs attention and start the next task.`}
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
      extraActions={
        <OperationsWorkspaceActions unreadCount={unreadCount} notifications={data.notifications} />
      }
      defaultTab="overview"
      hero={<OperationsHeroStrip items={data.myQuickStats} loading={loading} />}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} />,
          content: (
            <Stack spacing={DASHBOARD_SPACING.field}>
              <OperationsExecutiveRow
                alerts={
                  <AlertCenter
                    title="My alerts"
                    alerts={data.notifications.map((n, index) => ({
                      id: n.id,
                      title: n.title,
                      description: [n.body, n.createdAt].filter(Boolean).join(' · '),
                      severity: index === 0 ? 'critical' : index === 1 ? 'warning' : 'info',
                    }))}
                    loading={loading}
                    maxItems={4}
                    onShowMore={() => openTab('my-work')}
                  />
                }
                primaryVisualization={
                  <ApplicationPipeline
                    title="Queue status"
                    subtitle="Primary visualization — your pipeline health"
                    stages={data.myPipelineStages}
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
                      icon: OPS_ACTION_ICONS[action.id],
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
          id: 'my-work',
          label: 'My Work',
          icon: <ClipboardList size={16} />,
          badge: data.myPendingVerification.length,
          content: <MyWorkTab {...tabProps} />,
        },
        {
          id: 'queues',
          label: 'Queues',
          icon: <ListTodo size={16} />,
          badge: data.queueItems.length,
          content: <QueuesTab {...tabProps} />,
        },
        ...(showMarineTab
          ? [
              {
                id: 'marine',
                label: 'Marine',
                icon: <Ship size={16} />,
                badge: data.marinePriorityCases.length,
                content: <MarineTab {...tabProps} />,
              },
            ]
          : []),
        {
          id: 'appointments',
          label: 'Appointments',
          icon: <CalendarDays size={16} />,
          badge: data.todaysJobs.length,
          content: <AppointmentsTab {...tabProps} />,
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
