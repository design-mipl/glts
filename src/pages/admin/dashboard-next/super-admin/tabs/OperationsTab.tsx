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
  ApplicationPipeline,
  MarineTimeline,
  OperationsHealth,
  PassportJourney,
  QuickActions,
  RecentActivity,
  RiskOverview,
  TeamCapacity,
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

export function OperationsTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onPipelineStageClick,
}: SuperAdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 5 }}>
        <OperationsHealth
          metrics={data.operationsHealth}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <ApplicationPipeline
          stages={data.pipelineStages}
          loading={loading}
          onRetry={onRetry}
          onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <TeamCapacity
          rows={data.teamCapacity}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/access/teams')}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <MarineTimeline
          rows={data.marineTimeline}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <PassportJourney
          stages={data.passportJourney.stages}
          journeyStatus={data.passportJourney.journeyStatus}
          eta={data.passportJourney.eta}
          trackingNumber={data.passportJourney.trackingNumber}
          courier={data.passportJourney.courier}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <RecentActivity
          items={data.recentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <RiskOverview
          alerts={data.riskAlerts}
          loading={loading}
          onRetry={onRetry}
          onShowMore={() => onNavigate('/admin/dashboard-next/operations')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions
            .filter((action) =>
              ['qa-ops-next', 'qa-admin-next', 'qa-legacy-admin'].includes(action.id),
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
