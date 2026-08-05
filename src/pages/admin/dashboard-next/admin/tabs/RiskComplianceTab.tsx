import { Grid } from '@mui/material'
import {
  Announcements,
  RiskOverview,
  SLAOverview,
  TeamCapacity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AdminDashboardTabProps } from '../types'

/** Risk & Compliance — SLA, risk alerts, capacity (throughput lives on Operations). */
export function RiskComplianceTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: AdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <RiskOverview
          alerts={data.riskAlerts}
          loading={loading}
          onRetry={onRetry}
          onShowMore={() => onNavigate('/admin/application-management/retail')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SLAOverview items={data.slaOverview} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TeamCapacity
          rows={data.teamCapacity}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/user-management/teams')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <Announcements
          items={data.announcements}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
    </Grid>
  )
}
