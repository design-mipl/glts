import { Grid } from '@mui/material'
import {
  Announcements,
  ProcessingTrend,
  RiskOverview,
  SLAOverview,
  TeamCapacity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AdminDashboardTabProps } from '../types'

/** Risk & Compliance story — SLA, risk alerts, capacity signals. */
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
          onViewAll={() => onNavigate('/admin/access/teams')}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ProcessingTrend
          points={data.processingTrend}
          loading={loading}
          onRetry={onRetry}
          secondaryLabel="Completions"
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
