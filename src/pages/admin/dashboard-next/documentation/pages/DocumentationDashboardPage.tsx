import { useCallback, useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  Activity,
  Bell,
  ClipboardCheck,
  FileSpreadsheet,
  FileStack,
  LayoutDashboard,
  Send,
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
import { useDocumentationDashboardNext } from '../hooks/useDocumentationDashboardNext'
import { DOCUMENTATION_DASHBOARD_MOCK } from '../data/documentationDashboardMock'
import { buildDocumentationSearchItems } from '../data/documentationSearchItems'
import { DocumentationExecutiveRow } from '../components/DocumentationExecutiveRow'
import { DocumentationHeroStrip } from '../components/DocumentationHeroStrip'
import { DOC_ACTION_ICONS } from '../components/docActionIcons'
import {
  ActivityTab,
  OverviewTab,
  ProcessingTab,
  QcTab,
  ReportsTab,
  SubmissionTab,
} from '../tabs'
import type { DocumentationDashboardTabProps } from '../types'

function DocumentationWorkspaceActions({
  unreadCount,
  notifications,
}: {
  unreadCount: number
  notifications: typeof DOCUMENTATION_DASHBOARD_MOCK.notifications
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
          id: 'documentation-notifications',
          title: 'Documentation notifications',
          subtitle: `${unreadCount} unread`,
          entityType: 'custom',
          entityId: 'notifications',
          meta: {
            count: notifications.length,
            preview: notifications[0]?.title,
          },
        })
      }
      aria-label={`Open documentation notifications, ${unreadCount} unread`}
    />
  )
}

export function DocumentationDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useDocumentationDashboardNext()
  const data = dashboard.data ?? DOCUMENTATION_DASHBOARD_MOCK
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
        country: filters.country || prev.country,
        applicationType:
          filters.segment && ['retail', 'corporate', 'marine'].includes(filters.segment)
            ? filters.segment
            : prev.applicationType,
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
      buildDocumentationSearchItems({
        onNavigate: (href) => navigate(href),
        onOpenTab: openTab,
      }),
    [navigate, openTab],
  )

  const unreadCount = data.notifications.filter((n) => n.unread).length

  const tabProps: DocumentationDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenTab: openTab,
  }

  return (
    <DashboardWorkspace
      workspaceId="documentation"
      title="Documentation dashboard"
      subtitle={`Document processing queue for ${data.executiveName} — applications assigned to you.`}
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      onRefresh={dashboard.retry}
      onFiltersChange={onFiltersChange}
      searchItems={searchItems}
      extraActions={
        <DocumentationWorkspaceActions
          unreadCount={unreadCount}
          notifications={data.notifications}
        />
      }
      defaultTab="overview"
      hero={<DocumentationHeroStrip items={data.quickStats} loading={loading} />}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} />,
          content: (
            <Stack spacing={DASHBOARD_SPACING.field}>
              <DocumentationExecutiveRow
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
                    onShowMore={() => openTab('activity')}
                  />
                }
                primaryVisualization={
                  <ApplicationPipeline
                    title="Documentation pipeline"
                    subtitle="Primary visualization — stage health across your queue"
                    stages={data.pipelineStages}
                    loading={loading}
                    onRetry={dashboard.retry}
                    onStageClick={(stageId) => {
                      navigate(`/admin/application-management/marine?stage=${stageId}`)
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
                      icon: DOC_ACTION_ICONS[action.id],
                      onClick: () => {
                        if (action.href.includes('?tab=')) {
                          const tab = action.href.split('?tab=')[1]?.split('&')[0]
                          if (tab) openTab(tab)
                        } else {
                          navigate(action.href)
                        }
                      },
                    }))}
                  />
                }
              />
              <OverviewTab {...tabProps} />
            </Stack>
          ),
        },
        {
          id: 'processing',
          label: 'Processing',
          icon: <FileStack size={16} />,
          badge: data.myApplications.length,
          content: <ProcessingTab {...tabProps} />,
        },
        {
          id: 'qc',
          label: 'QC',
          icon: <ClipboardCheck size={16} />,
          badge: data.reviewQcQueue.length,
          content: <QcTab {...tabProps} />,
        },
        {
          id: 'submission',
          label: 'Submission',
          icon: <Send size={16} />,
          badge: data.readyForSubmission.length + data.submissionPending.length,
          content: <SubmissionTab {...tabProps} />,
        },
        {
          id: 'activity',
          label: 'Activity',
          icon: <Activity size={16} />,
          content: <ActivityTab {...tabProps} />,
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
