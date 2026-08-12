import { useCallback, useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  Briefcase,
  ClipboardList,
  FileSpreadsheet,
  LayoutDashboard,
  Package,
  Wallet,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCenter,
  DASHBOARD_SPACING,
  DashboardWorkspace,
  QuickActions,
  RouteTimeline,
} from '../../shared'
import type { DashboardIntelligenceFilters } from '../../shared/dashboard-intelligence'
import { DEFAULT_GROUND_OPS_DASHBOARD_FILTERS } from '../config/groundOperationsDashboardFilters'
import { buildGroundOperationsDashboardFromServices } from '../data/buildGroundOperationsDashboardFromServices'
import { buildGroundSearchItems } from '../data/groundSearchItems'
import { useGroundOperationsDashboardNext } from '../hooks/useGroundOperationsDashboardNext'
import { GroundExecutiveRow } from '../components/GroundExecutiveRow'
import { GroundHeroStrip } from '../components/GroundHeroStrip'
import {
  ClaimSheetsTab,
  CourierTab,
  GROUND_ACTION_ICONS,
  OverviewTab,
  ReportsTab,
  SettlementsTab,
  TodaysJobsTab,
} from '../tabs'
import type { GroundOperationsDashboardTabProps } from '../types'

export function GroundOperationsDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useGroundOperationsDashboardNext()
  const data =
    dashboard.data ??
    buildGroundOperationsDashboardFromServices({ ...DEFAULT_GROUND_OPS_DASHBOARD_FILTERS })
  const loading = dashboard.isLoading
  const setFilters = dashboard.setFilters

  const openDesk = () => navigate('/admin/ground-operations/case-handling')
  const openLogistics = () => navigate('/admin/ground-operations/logistics')
  const openFunds = () => navigate('/admin/ground-operations/funds')

  const onFiltersChange = useCallback(
    (filters: DashboardIntelligenceFilters) => {
      setFilters(prev => ({
        ...prev,
        date:
          filters.datePreset === 'custom' ||
          filters.datePreset === 'date' ||
          filters.datePreset === 'range'
            ? prev.date
            : filters.datePreset === 'all'
              ? 'all'
              : filters.datePreset || prev.date,
        team: filters.branch === 'all' ? 'all' : filters.branch || prev.team,
        caseStatus: filters.status === 'all' ? 'all' : filters.status || prev.caseStatus,
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
        onNavigate: href => navigate(href),
        onOpenTab: openTab,
      }),
    [navigate, openTab],
  )

  const rejectedClaims = data.claimSheetRows.filter(row => /rejected/i.test(row.status)).length
  const inTransitCount = data.passportRows.filter(row => /in\s*transit/i.test(row.status)).length

  const tabProps: GroundOperationsDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: href => navigate(href),
    onOpenJob: openDesk,
    onOpenAppointment: openDesk,
    onOpenPassport: openLogistics,
    onOpenFundCase: openFunds,
    onOpenClaimSheet: openDesk,
  }

  return (
    <DashboardWorkspace
      workspaceId="ground-operations"
      title="Ground Operations dashboard"
      subtitle={`Live pulse for ${data.executiveName} — Operations Desk, logistics, claim sheets, and fund utilization.`}
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
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
                      severity:
                        /reject/i.test(n.title)
                          ? 'critical'
                          : index === 0
                            ? 'warning'
                            : 'info',
                    }))}
                    loading={loading}
                    maxItems={4}
                    onShowMore={() => openTab('operations-desk')}
                  />
                }
                primaryVisualization={
                  <RouteTimeline
                    title="Desk activity timeline"
                    subtitle="Recent Operations Desk and logistics events"
                    events={data.routeTimeline}
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
                    items={data.quickActions.map(action => ({
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
          id: 'operations-desk',
          label: 'Operations Desk',
          icon: <Briefcase size={16} />,
          badge: data.todaysJobs.length,
          content: <TodaysJobsTab {...tabProps} />,
        },
        {
          id: 'logistics',
          label: 'Logistics',
          icon: <Package size={16} />,
          badge: inTransitCount || data.passportRows.length,
          content: <CourierTab {...tabProps} />,
        },
        {
          id: 'claim-sheets',
          label: 'Claim sheets',
          icon: <ClipboardList size={16} />,
          badge: rejectedClaims || data.claimSheetRows.length,
          content: <ClaimSheetsTab {...tabProps} />,
        },
        {
          id: 'funds',
          label: 'Fund utilization',
          icon: <Wallet size={16} />,
          badge: data.fundCaseRows.length,
          content: <SettlementsTab {...tabProps} />,
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
