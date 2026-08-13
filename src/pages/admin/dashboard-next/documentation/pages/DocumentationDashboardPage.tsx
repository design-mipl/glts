import { useCallback, useMemo } from 'react'
import {
  ClipboardList,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DashboardWorkspace } from '../../shared'
import type { DashboardIntelligenceFilters } from '../../shared/dashboard-intelligence'
import { applicationPipelineStageHref } from '../../shared/config/applicationPipeline'
import { useDocumentationDashboardNext } from '../hooks/useDocumentationDashboardNext'
import {
  DOCUMENTATION_DASHBOARD_MOCK,
  resolveDocWorkDesk,
} from '../data/documentationDashboardMock'
import { buildDocumentationSearchItems } from '../data/documentationSearchItems'
import { DocumentationHeroStrip } from '../components/DocumentationHeroStrip'
import { OverviewTab, PerformanceTab, ReportsTab, WorkTab } from '../tabs'
import type { DocWorkDeskId, DocumentationDashboardTabProps } from '../types'

export function DocumentationDashboardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dashboard = useDocumentationDashboardNext()
  const data = dashboard.data ?? DOCUMENTATION_DASHBOARD_MOCK
  const loading = dashboard.isLoading
  const setFilters = dashboard.setFilters

  const workDesk = resolveDocWorkDesk(searchParams.get('desk'))

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
        country: filters.country || prev.country,
        applicationType:
          filters.segment &&
          ['retail', 'corporate', 'marine', 'b2b'].includes(filters.segment)
            ? filters.segment
            : prev.applicationType,
        search: filters.search,
      }))
    },
    [setFilters],
  )

  const openTab = useCallback(
    (tabId: string) => {
      const params = new URLSearchParams(searchParams)
      params.set('tab', tabId)
      if (tabId !== 'work') params.delete('desk')
      navigate({ search: `?${params.toString()}` }, { replace: true })
    },
    [navigate, searchParams],
  )

  const openWorkDesk = useCallback(
    (deskId: DocWorkDeskId) => {
      const params = new URLSearchParams(searchParams)
      params.set('tab', 'work')
      params.set('desk', deskId)
      navigate({ search: `?${params.toString()}` }, { replace: true })
    },
    [navigate, searchParams],
  )

  const handleKpiClick = useCallback(
    (kpiId: string) => {
      const target = data.kpiTargets[kpiId]
      if (!target) {
        openTab('work')
        return
      }
      if (target.kind === 'work') {
        openWorkDesk(target.desk)
        return
      }
      navigate(applicationPipelineStageHref(target.tab))
    },
    [data.kpiTargets, navigate, openTab, openWorkDesk],
  )

  const searchItems = useMemo(
    () =>
      buildDocumentationSearchItems({
        onNavigate: (href) => navigate(href),
        onOpenTab: openTab,
        onOpenWorkDesk: openWorkDesk,
      }),
    [navigate, openTab, openWorkDesk],
  )

  const workBadge =
    data.submissionPendingRows.length +
    data.pendingPaymentRows.length +
    data.arrangeInsuranceRows.length +
    data.waitingOnOpsRows.length

  const tabProps: DocumentationDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenTab: openTab,
    onOpenWorkDesk: openWorkDesk,
    onKpiClick: handleKpiClick,
  }

  return (
    <DashboardWorkspace
      workspaceId="documentation"
      title="Documentation dashboard"
      subtitle={`Documentation workbench for ${data.executiveName} — Submission Pending, Form Pending, Pending Payment.`}
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
      defaultTab="overview"
      hero={
        <DocumentationHeroStrip
          items={data.quickStats}
          loading={loading}
          onKpiClick={handleKpiClick}
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
          id: 'work',
          label: 'Work',
          icon: <ClipboardList size={16} />,
          badge: workBadge,
          content: <WorkTab key={workDesk} {...tabProps} initialDesk={workDesk} />,
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
