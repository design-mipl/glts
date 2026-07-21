import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import {
  Anchor,
  ClipboardList,
  FileText,
  MapPinned,
  MessageSquare,
  Ship,
} from 'lucide-react'
import {
  ApplicationPipeline,
  MarineTimeline,
  NotificationPanel,
  PassportJourney,
  PendingVerification,
  QuickActions,
  QuickStats,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { OperationsDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-my-apps': <FileText size={18} />,
  'qa-verification': <ClipboardList size={18} />,
  'qa-appointments': <MapPinned size={18} />,
  'qa-marine': <Ship size={18} />,
  'qa-passport': <Anchor size={18} />,
  'qa-followups': <MessageSquare size={18} />,
}

export function MyWorkTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onPipelineStageClick,
  onVerificationOpen,
  onViewVerificationQueue,
}: OperationsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <QuickStats
          title="My workload"
          subtitle={`Assigned to ${data.consultantName}`}
          items={data.myQuickStats}
          loading={loading}
          onRetry={onRetry}
          columns={4}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <NotificationPanel
          title="My alerts"
          items={data.notifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={4}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <PendingVerification
          title="My pending verification"
          subtitle="Waiting on you"
          rows={data.myPendingVerification}
          loading={loading}
          onRetry={onRetry}
          onViewAll={onViewVerificationQueue}
          onAction={(row) => onVerificationOpen?.(row.id)}
          onRowClick={(row) => onVerificationOpen?.(row.id)}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <ApplicationPipeline
          title="My pipeline"
          subtitle="Only applications assigned to you"
          stages={data.myPipelineStages}
          loading={loading}
          onRetry={onRetry}
          onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <PassportJourney
          title="My passport follow-ups"
          stages={data.myPassportJourney.stages}
          journeyStatus={data.myPassportJourney.journeyStatus}
          eta={data.myPassportJourney.eta}
          trackingNumber={data.myPassportJourney.trackingNumber}
          courier={data.myPassportJourney.courier}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <MarineTimeline
          title="My marine cases"
          subtitle="Critical marine work assigned to you"
          rows={data.myMarineTimeline}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <RecentActivity
          title="My recent activity"
          items={data.myRecentActivity}
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
            icon: ACTION_ICONS[action.id],
            onClick: () => onNavigate(action.href),
          }))}
        />
      </Grid>
    </Grid>
  )
}
