import { useCallback, useMemo } from 'react'
import {
  Anchor,
  BarChart3,
  Briefcase,
  ClipboardList,
  FileSpreadsheet,
  HandCoins,
  Layers,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardWorkspace } from '../../shared'
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
import { SuperAdminHeroStrip } from '../components/SuperAdminHeroStrip'
import {
  AnalyticsTab,
  BusinessTab,
  ClientsTab,
  FinanceTab,
  OperationsTab,
  OverviewTab,
  ReportsTab,
  SegmentsTab,
  WorkTab,
  getSuperAdminWorkBadgeCount,
} from '../tabs'
import type { SuperAdminDashboardFilters, SuperAdminDashboardTabProps } from '../types'

function mapIntelligenceToHookFilters(
  filters: DashboardIntelligenceFilters,
): SuperAdminDashboardFilters {
  return {
    date:
      filters.datePreset === 'custom' ||
      filters.datePreset === 'date' ||
      filters.datePreset === 'range'
        ? 'month'
        : filters.datePreset,
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

  const openTab = useCallback(
    (tabId: string) => {
      navigate({ search: `?tab=${tabId}` }, { replace: true })
    },
    [navigate],
  )

  const openSegments = useCallback(
    (segment: 'marine' | 'corporate' | 'retail' | 'b2b' | 'all' = 'all') => {
      const params = new URLSearchParams()
      params.set('tab', 'segments')
      if (segment !== 'all') params.set('segment', segment)
      navigate({ search: `?${params.toString()}` }, { replace: true })
    },
    [navigate],
  )

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
            'marine-intelligence': 'segments',
            finance: 'finance',
            operations: 'operations',
            sales: 'analytics',
            'management-alerts': 'overview',
            'staff-productivity': 'analytics',
            'quick-actions': 'overview',
            corporate: 'segments',
            retail: 'segments',
            b2b: 'segments',
            segments: 'segments',
            reports: 'reports',
            work: 'work',
          }
          const segmentBySection: Record<string, 'marine' | 'corporate' | 'retail' | 'b2b'> = {
            'marine-intelligence': 'marine',
            corporate: 'corporate',
            retail: 'retail',
            b2b: 'b2b',
          }
          const segment = segmentBySection[sectionId]
          if (segment) {
            openSegments(segment)
            return
          }
          const tab = tabMap[sectionId] ?? 'overview'
          if (tab === 'segments') {
            openSegments('all')
            return
          }
          openTab(tab)
        },
      }),
    [navigate, openSegments, openTab],
  )

  const workBadge = getSuperAdminWorkBadgeCount(data, SUPER_ADMIN_MANAGEMENT_ALERTS)

  const tabProps: SuperAdminDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenTab: openTab,
    onOpenClient: () => navigate('/admin/customer-accounts/corporate-accounts'),
    onPipelineStageClick: (stageId) =>
      navigate(`/admin/application-management/marine?tab=${encodeURIComponent(stageId)}`),
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
          collections={data.collectionsHero}
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
          content: <OverviewTab {...tabProps} />,
        },
        {
          id: 'business',
          label: 'Business',
          icon: <Briefcase size={16} />,
          content: <BusinessTab {...tabProps} />,
        },
        {
          id: 'segments',
          label: 'Segments',
          icon: <Layers size={16} />,
          content: <SegmentsTab {...tabProps} />,
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
          id: 'work',
          label: 'Work',
          icon: <ClipboardList size={16} />,
          badge: workBadge,
          content: <WorkTab {...tabProps} />,
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
