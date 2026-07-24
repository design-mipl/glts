import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { ClipboardList, FileText, HandCoins, Truck } from 'lucide-react'
import {
  Announcements,
  ProcessingTrend,
  QuickActions,
  RecentActivity,
  TeamCapacity,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AdminDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-retail-queue': <ClipboardList size={18} />,
  'qa-applications': <FileText size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-ground': <Truck size={18} />,
}

export function ProductivityTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: AdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
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
        <RecentActivity
          items={data.recentActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Announcements
          items={data.announcements}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
