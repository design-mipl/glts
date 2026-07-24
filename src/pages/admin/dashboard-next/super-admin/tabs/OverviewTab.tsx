import type { ReactNode } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import {
  Building2,
  ClipboardList,
  HandCoins,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import {
  MetricComparison,
  OperationsHealth,
  ProcessingTrend,
  DASHBOARD_SPACING,
} from '../../shared'
import {
  ExecutiveInsightCard,
  InsightBanner,
  IntelligenceRecommendationPanel,
  ManagementAlertCenter,
} from '../../shared/dashboard-intelligence'
import { AlertPanel, ExecutiveGrid, HighlightCard } from '../../shared/dashboard-ui-kit'
import type { SuperAdminDashboardTabProps } from '../types'

export const SA_ACTION_ICONS: Record<string, ReactNode> = {
  'qa-admin-next': <LayoutDashboard size={18} />,
  'qa-ops-next': <ClipboardList size={18} />,
  'qa-accounts-next': <HandCoins size={18} />,
  'qa-clients': <Users size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-legacy-admin': <Building2 size={18} />,
}

function alertTone(severity: string) {
  switch (severity) {
    case 'critical':
      return 'negative' as const
    case 'warning':
      return 'warning' as const
    case 'success':
      return 'positive' as const
    default:
      return 'info' as const
  }
}

function alertBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return 'Critical'
    case 'warning':
      return 'High'
    case 'info':
      return 'Medium'
    default:
      return 'Low'
  }
}

/** Overview — risks, approval trend, blocked cash detail, act-today alerts. */
export function OverviewTab({
  data,
  loading,
  onRetry,
  insights = [],
  recommendations = [],
  managementAlerts,
}: SuperAdminDashboardTabProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      {insights.length > 0 ? (
        <Stack spacing={DASHBOARD_SPACING.field}>
          {insights.slice(0, 2).map((insight) => (
            <InsightBanner key={insight.id} insight={insight} />
          ))}
        </Stack>
      ) : null}

      <Grid container spacing={DASHBOARD_SPACING.field}>
        <Grid size={{ xs: 12, md: 4 }}>
          <HighlightCard
            title="Cash blocked in fees"
            subtitle="Released when visa issues & fee hits client invoice"
            highlight={data.blockedCash.amount}
            highlightLabel={data.blockedCash.expectedReleaseLabel}
            loading={loading}
          >
            <Typography variant="caption" color="text.secondary">
              {data.blockedCash.note} · {data.blockedCash.applicationCount} applications.
            </Typography>
          </HighlightCard>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <ProcessingTrend
            title="Visa approval rate"
            subtitle="30-day rolling · network"
            points={data.approvalRateTrend30d}
            loading={loading}
            onRetry={onRetry}
          />
        </Grid>
      </Grid>

      <Grid container spacing={DASHBOARD_SPACING.field}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MetricComparison
            title="Working signals"
            metrics={data.metricComparison}
            loading={loading}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <OperationsHealth metrics={data.operationsHealth} loading={loading} />
        </Grid>
      </Grid>

      {managementAlerts && managementAlerts.length > 0 ? (
        <ManagementAlertCenter
          alerts={managementAlerts}
          loading={loading}
          defaultSort="severity"
        />
      ) : (
        <AlertPanel
          title="Executive alert center"
          loading={loading}
          maxItems={6}
          items={data.managementAlerts.map((alert) => ({
            id: alert.id,
            primary: alert.title,
            secondary: alert.description,
            badgeLabel: alertBadge(alert.severity),
            badgeTone: alertTone(alert.severity),
          }))}
        />
      )}

      {recommendations.length > 0 ? (
        <IntelligenceRecommendationPanel items={recommendations} />
      ) : null}

      {insights.length > 2 ? (
        <ExecutiveGrid columns={2}>
          {insights.slice(2).map((insight) => (
            <ExecutiveInsightCard key={insight.id} insight={insight} />
          ))}
        </ExecutiveGrid>
      ) : null}
    </Stack>
  )
}
