import { Grid } from '@mui/material'
import { RecentActivity, DASHBOARD_SPACING } from '../../shared'
import { AdminPendingVerificationSection } from '../components/AdminPendingVerificationSection'
import type { AdminDashboardTabProps } from '../types'

/** Applications story — pending verification listing + recent activity. */
export function ApplicationsTab({
  data,
  loading,
  onRetry,
  onViewVerificationQueue,
}: AdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <AdminPendingVerificationSection
          loading={loading}
          onViewQueue={onViewVerificationQueue}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RecentActivity
          title="Application activity"
          items={data.recentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
    </Grid>
  )
}
