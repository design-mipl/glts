import { Box, Grid } from '@mui/material'
import { AlertCenter, RecentActivity, DASHBOARD_SPACING } from '../../shared'
import type { AdminDashboardTabProps } from '../types'
export { ACTION_ICONS, KPI_ICONS } from './overviewIcons'

export interface OverviewTabProps extends AdminDashboardTabProps {
  onShowMoreAlerts?: () => void
}

/** Overview story — alerts and recent activity side by side. */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onShowMoreAlerts,
}: OverviewTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ height: '100%', minWidth: 0, '& > *': { height: '100%' } }}>
          <AlertCenter
            title="Alerts & notifications"
            alerts={data.notifications.map((n, index) => ({
              id: n.id,
              title: n.title,
              description: [n.body, n.createdAt].filter(Boolean).join(' · '),
              severity: index === 0 ? 'critical' : index === 1 ? 'warning' : 'info',
            }))}
            loading={loading}
            maxItems={4}
            onShowMore={onShowMoreAlerts}
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ height: '100%', minWidth: 0, '& > *': { height: '100%' } }}>
          <RecentActivity
            items={data.recentActivity}
            loading={loading}
            onRetry={onRetry}
            maxItems={6}
          />
        </Box>
      </Grid>
    </Grid>
  )
}
