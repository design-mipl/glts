import { useCallback, useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  ClipboardList,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DASHBOARD_SPACING, DashboardWorkspace } from '../../shared'
import type { DashboardIntelligenceFilters } from '../../shared/dashboard-intelligence'
import { useOperationsDashboardNext } from '../hooks/useOperationsDashboardNext'
import { buildOperationsDashboardFromMocks } from '../data/buildOperationsDashboardFromMocks'
import { buildOperationsSearchItems } from '../data/operationsSearchItems'
import { OperationsHeroStrip } from '../components/OperationsHeroStrip'
import {
  OverviewTab,
  PerformanceTab,
  ReportsTab,
  WorkTab,
} from '../tabs'
import type { OperationsDashboardTabProps } from '../types'
import { opsPipelineStageToApplicationHref } from '../utils/opsSegmentPaths'

export function OperationsDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useOperationsDashboardNext()
  const data = dashboard.data ?? buildOperationsDashboardFromMocks()
  const loading = dashboard.isLoading
  const setFilters = dashboard.setFilters

  const onFiltersChange = useCallback(
    (filters: DashboardIntelligenceFilters) => {
      setFilters((prev) => ({
        ...prev,
        date:
          filters.datePreset === 'custom' ||
          filters.datePreset === 'date' ||
          filters.datePreset === 'range'
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

  const workBadge = data.queueRows.filter(
    (row) => !row.showGroundBadge && (row.assigneeKind === 'user' || row.assigneeKind === 'unassigned'),
  ).length

  const tabProps: OperationsDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenApplication: (href) => navigate(href),
    onOpenTab: openTab,
    onPipelineStageClick: (stageId) => navigate(opsPipelineStageToApplicationHref(stageId)),
  }

  return (
    <DashboardWorkspace
      workspaceId="operations"
      title="Operations dashboard"
      subtitle={`Workbench for ${data.consultantName} — verification, payment, and ground handoffs across segments.`}
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
      defaultTab="overview"
      hero={
        <OperationsHeroStrip
          items={data.myQuickStats}
          loading={loading}
          onNavigate={(href) => navigate(href)}
        />
      }
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} />,
          content: (
            <Stack spacing={DASHBOARD_SPACING.field}>
              <OverviewTab {...tabProps} />
            </Stack>
          ),
        },
        {
          id: 'work',
          label: 'Work',
          icon: <ClipboardList size={16} />,
          badge: workBadge,
          content: <WorkTab {...tabProps} />,
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
