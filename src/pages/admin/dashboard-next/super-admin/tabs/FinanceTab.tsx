import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import {
  Building2,
  ClipboardList,
  HandCoins,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import {
  AgeingAnalysis,
  BranchPerformance,
  CollectionSummary,
  MetricComparison,
  NotificationPanel,
  ProcessingTrend,
  QuickActions,
  RevenueSnapshot,
  DASHBOARD_SPACING,
} from '../../shared'
import type { SuperAdminDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-admin-next': <LayoutDashboard size={18} />,
  'qa-ops-next': <ClipboardList size={18} />,
  'qa-accounts-next': <HandCoins size={18} />,
  'qa-clients': <Users size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-legacy-admin': <Building2 size={18} />,
}

export function FinanceTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: SuperAdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <RevenueSnapshot data={data.revenueSnapshot} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CollectionSummary
          data={data.collectionSummary}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <AgeingAnalysis buckets={data.ageingBuckets} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <BranchPerformance
          title="Branch revenue"
          branches={data.branchPerformance}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <MetricComparison
          title="Finance KPIs"
          metrics={data.financeMetricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <ProcessingTrend
          title="Revenue vs collections"
          points={data.processingTrend}
          secondaryLabel="Collected"
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <NotificationPanel
          title="Finance notices"
          items={data.financeNotifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions
            .filter((action) =>
              ['qa-accounts-next', 'qa-finance', 'qa-admin-next'].includes(action.id),
            )
            .map((action) => ({
              id: action.id,
              title: action.title,
              description: action.description,
              badge: action.badge,
              icon: ACTION_ICONS[action.id],
              onClick: () => onNavigate(action.href),
            }))}
        />
      </Grid>
    </Grid>
  )
}
