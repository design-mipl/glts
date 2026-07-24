import { useCallback, useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  Bell,
  Briefcase,
  FileSpreadsheet,
  LayoutDashboard,
  MapPinned,
  Package,
  Receipt,
  Wallet,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/design-system/UIComponents'
import {
  AlertCenter,
  DASHBOARD_SPACING,
  DashboardWorkspace,
  QuickActions,
  RouteTimeline,
} from '../../shared'
import type { DashboardIntelligenceFilters } from '../../shared/dashboard-intelligence'
import { useDrilldownOptional } from '../../shared/dashboard-intelligence'
import { GROUND_OPERATIONS_DASHBOARD_MOCK } from '../data/groundOperationsDashboardMock'
import { buildGroundSearchItems } from '../data/groundSearchItems'
import { useGroundOperationsDashboardNext } from '../hooks/useGroundOperationsDashboardNext'
import { GroundExecutiveRow } from '../components/GroundExecutiveRow'
import { GroundHeroStrip } from '../components/GroundHeroStrip'
import {
  CourierTab,
  ExpensesTab,
  GROUND_ACTION_ICONS,
  OverviewTab,
  ReportsTab,
  RoutesTab,
  SettlementsTab,
  TodaysJobsTab,
} from '../tabs'
import type { GroundOperationsDashboardTabProps } from '../types'

function GroundWorkspaceActions({
  unreadCount,
  notifications,
}: {
  unreadCount: number
  notifications: typeof GROUND_OPERATIONS_DASHBOARD_MOCK.notifications
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
          id: 'ground-notifications',
          title: 'Field notifications',
          subtitle: `${unreadCount} unread`,
          entityType: 'custom',
          entityId: 'notifications',
          meta: {
            count: notifications.length,
            preview: notifications[0]?.title,
          },
        })
      }
      aria-label={`Open field notifications, ${unreadCount} unread`}
    />
  )
}

export function GroundOperationsDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useGroundOperationsDashboardNext()
  const data = dashboard.data ?? GROUND_OPERATIONS_DASHBOARD_MOCK
  const loading = dashboard.isLoading
  const setFilters = dashboard.setFilters

  const openDesk = () => navigate('/admin/ground-operations/case-handling')
  const openLogistics = () => navigate('/admin/ground-operations/logistics')
  const openFunds = () => navigate('/admin/ground-operations/funds')

  const onFiltersChange = useCallback(
    (filters: DashboardIntelligenceFilters) => {
      setFilters((prev) => ({
        ...prev,
        date:
          filters.datePreset === 'custom'
            ? prev.date
            : filters.datePreset,
        branch: filters.branch,
        assignmentStatus: filters.status === 'all' ? prev.assignmentStatus : filters.status,
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
      buildGroundSearchItems({
        onNavigate: (href) => navigate(href),
        onOpenTab: openTab,
      }),
    [navigate, openTab],
  )

  const unreadCount = data.notifications.filter((n) => n.unread).length
  const pendingSettlements = data.fundCaseRows.filter((row) =>
    /pending|review/i.test(row.status),
  ).length

  const tabProps: GroundOperationsDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenJob: openDesk,
    onOpenAppointment: openDesk,
    onOpenPassport: openLogistics,
    onOpenFundCase: openFunds,
  }

  return (
    <DashboardWorkspace
      workspaceId="ground-operations"
      title="Ground Operations dashboard"
      subtitle={`Field workspace for ${data.executiveName} — assignments, routes, logistics, and settlements.`}
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
      extraActions={
        <GroundWorkspaceActions unreadCount={unreadCount} notifications={data.notifications} />
      }
      defaultTab="overview"
      hero={<GroundHeroStrip items={data.quickStats} loading={loading} />}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} />,
          content: (
            <Stack spacing={DASHBOARD_SPACING.field}>
              <GroundExecutiveRow
                alerts={
                  <AlertCenter
                    title="Field alerts"
                    alerts={data.notifications.map((n, index) => ({
                      id: n.id,
                      title: n.title,
                      description: [n.body, n.createdAt].filter(Boolean).join(' · '),
                      severity: index === 0 ? 'critical' : index === 1 ? 'warning' : 'info',
                    }))}
                    loading={loading}
                    maxItems={4}
                    onShowMore={() => openTab('todays-jobs')}
                  />
                }
                primaryVisualization={
                  <RouteTimeline
                    title="Today's route timeline"
                    subtitle="Primary visualization — stops and field cadence"
                    events={data.routeTimeline}
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
                      icon: GROUND_ACTION_ICONS[action.id],
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
          id: 'todays-jobs',
          label: "Today's Jobs",
          icon: <Briefcase size={16} />,
          badge: data.todaysJobs.length,
          content: <TodaysJobsTab {...tabProps} />,
        },
        {
          id: 'routes',
          label: 'Routes',
          icon: <MapPinned size={16} />,
          badge: data.routeTimeline.length,
          content: <RoutesTab {...tabProps} />,
        },
        {
          id: 'expenses',
          label: 'Expenses',
          icon: <Receipt size={16} />,
          content: <ExpensesTab {...tabProps} />,
        },
        {
          id: 'settlements',
          label: 'Settlements',
          icon: <Wallet size={16} />,
          badge: pendingSettlements || data.settlementRows.length,
          content: <SettlementsTab {...tabProps} />,
        },
        {
          id: 'courier',
          label: 'Courier',
          icon: <Package size={16} />,
          badge: data.passportRows.length,
          content: <CourierTab {...tabProps} />,
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
