import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import {
  Building2,
  ClipboardList,
  HandCoins,
  LayoutDashboard,
  LineChart,
  Users,
} from 'lucide-react'
import {
  BranchPerformance,
  BusinessSegmentBreakdown,
  MetricComparison,
  NotificationPanel,
  OperationsHealth,
  QuickActions,
  QuickStats,
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

export function ExecutiveTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: SuperAdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <QuickStats
          title="Company snapshot"
          items={data.quickStats}
          loading={loading}
          onRetry={onRetry}
          columns={4}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <MetricComparison
          title="Executive KPIs"
          metrics={data.metricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RevenueSnapshot data={data.revenueSnapshot} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <OperationsHealth
          metrics={data.operationsHealth}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <BranchPerformance
          title="Branch performance"
          branches={data.branchPerformance}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <BusinessSegmentBreakdown
          title="Segment mix"
          slices={data.businessSegments}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <NotificationPanel
          title="Leadership alerts"
          items={data.notifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions.map((action) => ({
            id: action.id,
            title: action.title,
            description: action.description,
            badge: action.badge,
            icon: ACTION_ICONS[action.id] ?? <LineChart size={18} />,
            onClick: () => onNavigate(action.href),
          }))}
        />
      </Grid>
    </Grid>
  )
}
