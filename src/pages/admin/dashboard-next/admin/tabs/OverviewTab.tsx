import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  HandCoins,
  IndianRupee,
  ShieldAlert,
  Truck,
} from 'lucide-react'
import {
  AlertCenter,
  ApplicationPipeline,
  NotificationPanel,
  PendingVerification,
  QuickActions,
  QuickStats,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AdminDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-retail-queue': <ClipboardList size={18} />,
  'qa-applications': <FileText size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-ground': <Truck size={18} />,
}

const KPI_ICONS: Record<string, ReactNode> = {
  'open-cases': <FileText size={18} />,
  'sla-at-risk': <ShieldAlert size={18} />,
  'completed-today': <CheckCircle2 size={18} />,
  'revenue-mtd': <IndianRupee size={18} />,
}

export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onPipelineStageClick,
  onVerificationOpen,
  onViewVerificationQueue,
}: AdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <QuickStats
          items={data.quickStats.map((item) => ({
            ...item,
            icon: KPI_ICONS[item.id] ?? item.icon,
          }))}
          loading={loading}
          onRetry={onRetry}
          columns={4}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
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
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <QuickActions
          title="Quick actions"
          variant="tiles"
          columns={2}
          loading={loading}
          items={data.quickActions.map((action) => ({
            id: action.id,
            title: action.title,
            icon: ACTION_ICONS[action.id],
            onClick: () => onNavigate(action.href),
          }))}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <ApplicationPipeline
          stages={data.pipelineStages}
          loading={loading}
          onRetry={onRetry}
          onStageClick={(stageId) => onPipelineStageClick?.(stageId)}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <PendingVerification
          rows={data.pendingVerification}
          loading={loading}
          onRetry={onRetry}
          onViewAll={onViewVerificationQueue}
          onAction={(row) => onVerificationOpen?.(row.id)}
          onRowClick={(row) => onVerificationOpen?.(row.id)}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <NotificationPanel
          title="Desk updates"
          items={data.notifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <RecentActivity
          items={data.recentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
    </Grid>
  )
}
