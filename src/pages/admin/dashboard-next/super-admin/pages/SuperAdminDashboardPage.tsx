import { useCallback, useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  Anchor,
  BarChart3,
  Briefcase,
  Building2,
  FileSpreadsheet,
  HandCoins,
  LayoutDashboard,
  Network,
  Ship,
  Store,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCenter,
  DASHBOARD_SPACING,
  DashboardExecutiveRow,
  DashboardWorkspace,
  ProcessingTrend,
  QuickActions,
} from '../../shared'
import { SuperAdminHeroStrip } from '../components/SuperAdminHeroStrip'
import type { DashboardIntelligenceFilters } from '../../shared/dashboard-intelligence'
import { useSuperAdminDashboardNext } from '../hooks/useSuperAdminDashboardNext'
import { SUPER_ADMIN_DASHBOARD_MOCK } from '../data/superAdminDashboardMock'
import {
  SUPER_ADMIN_FORECASTS,
  SUPER_ADMIN_INSIGHTS,
  SUPER_ADMIN_MANAGEMENT_ALERTS,
  SUPER_ADMIN_RECOMMENDATIONS,
  buildSuperAdminSearchItems,
} from '../data/superAdminIntelligenceMock'
import {
  AnalyticsTab,
  B2bTab,
  BusinessTab,
  ClientsTab,
  CorporateTab,
  FinanceTab,
  MarineTab,
  OperationsTab,
  OverviewTab,
  ReportsTab,
  RetailTab,
  SA_ACTION_ICONS,
} from '../tabs'
import type { SuperAdminDashboardFilters, SuperAdminDashboardTabProps } from '../types'

function mapIntelligenceToHookFilters(
  filters: DashboardIntelligenceFilters,
): SuperAdminDashboardFilters {
  return {
    date: filters.datePreset === 'custom' ? 'month' : filters.datePreset,
    branch: filters.branch,
    country: filters.country,
    segment: filters.segment,
    client: filters.client,
    visaType: filters.visaType,
    applicationStatus: filters.status,
    search: filters.search,
  }
}

export function SuperAdminDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useSuperAdminDashboardNext()
  const data = dashboard.data ?? SUPER_ADMIN_DASHBOARD_MOCK
  const loading = dashboard.isLoading
  const setHookFilters = dashboard.setFilters

  const onFiltersChange = useCallback(
    (filters: DashboardIntelligenceFilters) => {
      setHookFilters(mapIntelligenceToHookFilters(filters))
    },
    [setHookFilters],
  )

  const searchItems = useMemo(
    () =>
      buildSuperAdminSearchItems({
        onNavigate: (href) => navigate(href),
        onJump: (sectionId) => {
          const tabMap: Record<string, string> = {
            'executive-hero': 'overview',
            'revenue-trend': 'business',
            'business-segments': 'business',
            'revenue-intelligence': 'business',
            'client-intelligence': 'clients',
            'marine-intelligence': 'marine',
            finance: 'finance',
            operations: 'operations',
            sales: 'analytics',
            'management-alerts': 'overview',
            'staff-productivity': 'analytics',
            'quick-actions': 'overview',
            corporate: 'corporate',
            retail: 'retail',
            b2b: 'b2b',
          }
          const tab = tabMap[sectionId] ?? 'overview'
          navigate({ search: `?tab=${tab}` }, { replace: true })
        },
      }),
    [navigate],
  )

  const tabProps: SuperAdminDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenClient: () => navigate('/admin/customer-accounts/corporate-accounts'),
    onPipelineStageClick: () => navigate('/admin/application-management/marine'),
    insights: SUPER_ADMIN_INSIGHTS,
    recommendations: SUPER_ADMIN_RECOMMENDATIONS,
    managementAlerts: SUPER_ADMIN_MANAGEMENT_ALERTS,
    forecasts: SUPER_ADMIN_FORECASTS,
  }

  return (
    <DashboardWorkspace
      workspaceId="super-admin"
      title="Executive command center"
      subtitle="How are we performing · where are the risks · what to act on today"
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      initialFilters={{
        datePreset:
          dashboard.filters.date === 'today' ||
          dashboard.filters.date === 'week' ||
          dashboard.filters.date === 'month' ||
          dashboard.filters.date === 'quarter' ||
          dashboard.filters.date === 'year'
            ? dashboard.filters.date
            : 'month',
        branch: dashboard.filters.branch,
        country: dashboard.filters.country,
        segment: dashboard.filters.segment,
        client: dashboard.filters.client,
        visaType: dashboard.filters.visaType,
        status: dashboard.filters.applicationStatus,
        search: dashboard.filters.search,
      }}
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
      defaultTab="overview"
      hero={
        <SuperAdminHeroStrip
          revenue={data.revenueHero}
          items={data.heroKpis}
          blockedCash={data.blockedCash}
          loading={loading}
        />
      }
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} />,
          content: (
            <Stack spacing={DASHBOARD_SPACING.field}>
              <DashboardExecutiveRow
                alerts={
                  <AlertCenter
                    title="Management alerts"
                    alerts={(SUPER_ADMIN_MANAGEMENT_ALERTS.length > 0
                      ? SUPER_ADMIN_MANAGEMENT_ALERTS
                      : data.managementAlerts
                    ).map((alert) => {
                      const severity =
                        alert.severity === 'critical'
                          ? 'critical'
                          : alert.severity === 'high' || alert.severity === 'warning'
                            ? 'warning'
                            : alert.severity === 'success'
                              ? 'success'
                              : 'info'
                      return {
                        id: alert.id,
                        title: alert.title,
                        description:
                          'description' in alert && alert.description
                            ? alert.description
                            : 'businessImpact' in alert
                              ? alert.businessImpact
                              : undefined,
                        severity,
                      }
                    })}
                    loading={loading}
                    maxItems={4}
                  />
                }
                primaryVisualization={
                  <ProcessingTrend
                    title="Business performance trend"
                    subtitle="Revenue vs collections — primary board visualization"
                    points={data.revenueTrend}
                    secondaryLabel="Collected"
                    loading={loading}
                    onRetry={dashboard.retry}
                  />
                }
                quickActions={
                  <QuickActions
                    title="Quick actions"
                    variant="tiles"
                    columns={2}
                    loading={loading}
                    items={data.quickActions.slice(0, 6).map((action) => ({
                      id: action.id,
                      title: action.title,
                      description: action.description,
                      badge: action.badge,
                      icon: SA_ACTION_ICONS[action.id],
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
          id: 'business',
          label: 'Business',
          icon: <Briefcase size={16} />,
          content: <BusinessTab {...tabProps} />,
        },
        {
          id: 'marine',
          label: 'Marine',
          icon: <Ship size={16} />,
          content: <MarineTab {...tabProps} />,
        },
        {
          id: 'corporate',
          label: 'Corporate',
          icon: <Building2 size={16} />,
          content: <CorporateTab {...tabProps} />,
        },
        {
          id: 'retail',
          label: 'Retail',
          icon: <Store size={16} />,
          content: <RetailTab {...tabProps} />,
        },
        {
          id: 'b2b',
          label: 'B2B',
          icon: <Network size={16} />,
          content: <B2bTab {...tabProps} />,
        },
        {
          id: 'operations',
          label: 'Operations',
          icon: <Anchor size={16} />,
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
          icon: <Users size={16} />,
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
