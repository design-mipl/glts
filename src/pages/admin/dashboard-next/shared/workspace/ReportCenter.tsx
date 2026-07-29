import { Grid, Stack, Typography } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import {
  InsightCard,
  ExecutiveGrid,
  RankingList,
} from '../dashboard-ui-kit'
import { NotificationPanel, QuickActions, RecentReports } from '../widgets'
import type { RecentReportItem } from '../widgets/common/RecentReports'
import type { NotificationItem } from '../widgets/common/NotificationPanel'
import type { DashboardQuickActionItem } from '../types'
import { DASHBOARD_SPACING } from '../constants'
import { exportDashboardSnapshot } from '../dashboard-intelligence'

export interface ReportCenterProps {
  recentReports: RecentReportItem[]
  scheduledReports?: RecentReportItem[]
  savedReports?: RecentReportItem[]
  downloadHistory?: NotificationItem[]
  exportActions?: DashboardQuickActionItem[]
  loading?: boolean
  onRetry?: () => void
  onExportCsv?: () => void
  onExportFilters?: () => void
  exportPayload?: unknown
  exportTitle?: string
  /**
   * Phase 6 placeholder mode — shell layout only.
   * Enterprise Report Center features remain deferred.
   */
  placeholder?: boolean
}

const DEFAULT_SCHEDULED: RecentReportItem[] = [
  {
    id: 'sched-weekly',
    name: 'Weekly operations digest',
    category: 'Scheduled',
    generatedAt: 'Every Monday 07:00',
  },
  {
    id: 'sched-month',
    name: 'Monthly executive pack',
    category: 'Scheduled',
    generatedAt: '1st of month 06:30',
  },
]

const DEFAULT_SAVED: RecentReportItem[] = [
  {
    id: 'saved-board',
    name: 'Board pack — Q2',
    category: 'Saved',
    generatedAt: 'Pinned',
  },
]

/**
 * Reusable Reports tab layout for every Dashboard Next workspace.
 * Always the last tab.
 */
export function ReportCenter({
  recentReports,
  scheduledReports = DEFAULT_SCHEDULED,
  savedReports = DEFAULT_SAVED,
  downloadHistory = [],
  exportActions = [],
  loading,
  onRetry,
  onExportCsv,
  onExportFilters,
  exportPayload,
  exportTitle = 'Dashboard export',
  placeholder = false,
}: ReportCenterProps) {
  const handleCsv = () => {
    if (placeholder) return
    if (onExportCsv) {
      onExportCsv()
      return
    }
    void exportDashboardSnapshot({
      format: 'csv',
      title: exportTitle,
      payload: exportPayload ?? recentReports,
    })
  }

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <Typography variant="subtitle1" fontWeight={700}>
        Report center
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {placeholder
          ? 'Placeholder shell — enterprise report center is coming soon. Layout preview only.'
          : 'Executive, operational, scheduled, and saved reports — plus export of the current workspace.'}
      </Typography>

      {placeholder ? (
        <InsightCard title="Coming soon" accent="info" density="compact">
          <Typography variant="body2" color="text.secondary">
            Scheduled delivery, saved packs, PDF/Excel/PowerPoint export, and full report history will
            land in the Enterprise Report Center. This tab keeps the workspace structure consistent
            until then.
          </Typography>
        </InsightCard>
      ) : null}

      <Grid container spacing={DASHBOARD_SPACING.field}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RecentReports
            title="Recent reports"
            subtitle={placeholder ? 'Preview · not connected' : 'Executive · operational · finance'}
            items={recentReports}
            loading={loading}
            onRetry={onRetry}
            maxItems={8}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={DASHBOARD_SPACING.field}>
            <RankingList
              title="Scheduled reports"
              items={scheduledReports.map((item, index) => ({
                id: item.id,
                primary: item.name,
                secondary: placeholder ? `${item.generatedAt} · Coming soon` : item.generatedAt,
                rank: index + 1,
                value: item.category,
              }))}
              loading={loading}
            />
            <RankingList
              title="Saved reports"
              items={savedReports.map((item, index) => ({
                id: item.id,
                primary: item.name,
                secondary: placeholder ? `${item.generatedAt} · Coming soon` : item.generatedAt,
                rank: index + 1,
                value: item.category,
              }))}
              loading={loading}
            />
          </Stack>
        </Grid>
      </Grid>

      <ExecutiveGrid columns={3}>
        <InsightCard title="Export dashboard" accent="info" density="compact">
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {placeholder
                ? 'Export is deferred. CSV / PDF / Excel will unlock with the Report Center.'
                : 'Download the current filtered snapshot.'}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                label={placeholder ? 'Export CSV (soon)' : 'Export CSV'}
                variant="contained"
                size="sm"
                onClick={handleCsv}
                disabled={placeholder}
              />
              <Button
                label="Export filters"
                variant="outlined"
                size="sm"
                onClick={onExportFilters}
                disabled={placeholder || !onExportFilters}
              />
              <Button label="PDF (soon)" variant="text" size="sm" disabled />
              <Button label="Excel (soon)" variant="text" size="sm" disabled />
            </Stack>
          </Stack>
        </InsightCard>
        <InsightCard title="Report history" density="compact">
          <NotificationPanel
            title="Recent downloads"
            items={
              downloadHistory.length > 0
                ? downloadHistory
                : [
                    {
                      id: 'dl-1',
                      title: placeholder ? 'No downloads yet' : 'CSV export completed',
                      body: placeholder
                        ? 'Coming soon with the Enterprise Report Center'
                        : 'Last workspace download',
                      createdAt: 'Today',
                    },
                  ]
            }
            loading={loading}
            maxItems={4}
          />
        </InsightCard>
        <InsightCard title="Shortcuts" density="compact">
          {placeholder ? (
            <Typography variant="body2" color="text.secondary">
              Report shortcuts are coming soon.
            </Typography>
          ) : exportActions.length > 0 ? (
            <QuickActions columns={1} loading={loading} items={exportActions} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Wire module-specific report shortcuts from the host dashboard.
            </Typography>
          )}
        </InsightCard>
      </ExecutiveGrid>
    </Stack>
  )
}
