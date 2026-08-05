import { Stack } from '@mui/material'
import { RecentActivity, DASHBOARD_SPACING } from '../../shared'
import { VisaAnalyticsOverviewSnapshot } from '../analytics/VisaAnalyticsTab'
import type { AdminDashboardTabProps } from '../types'
export { ACTION_ICONS, KPI_ICONS } from './overviewIcons'

export interface OverviewTabProps extends AdminDashboardTabProps {
  onOpenVisaAnalytics?: () => void
}

/**
 * Overview story:
 * 1. Recent activity — what’s moving now
 * 2. Visa performance — thin snapshot (deep dive on Analytics)
 *
 * Funnel + Needs Immediate Attention live in the page executive row.
 * Ops / risk alerts live on Operations and Risk tabs.
 */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenVisaAnalytics,
}: OverviewTabProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <RecentActivity
        items={data.recentActivity}
        loading={loading}
        onRetry={onRetry}
        maxItems={5}
      />

      <VisaAnalyticsOverviewSnapshot
        loading={loading}
        onOpenAnalytics={
          onOpenVisaAnalytics ?? (() => onNavigate('/admin/dashboard-next?tab=analytics'))
        }
      />
    </Stack>
  )
}
