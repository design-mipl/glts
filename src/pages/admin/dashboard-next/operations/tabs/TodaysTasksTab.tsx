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
  Announcements,
  QuickActions,
  RecentActivity,
  TodaysJobs,
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

export function TodaysTasksTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onJobClick,
}: OperationsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <TodaysJobs
          title="Today's checklist"
          subtitle="Priority · due time · quick start"
          rows={data.todaysJobs}
          loading={loading}
          onRetry={onRetry}
          onRowClick={(row) => onJobClick?.(row.id)}
          onViewAll={() => onNavigate('/admin/application-management/retail')}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <RecentActivity
          title="Today's progress"
          items={data.todaysActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions.slice(0, 4).map((action) => ({
            id: action.id,
            title: action.title,
            description: action.description,
            badge: action.badge,
            icon: ACTION_ICONS[action.id],
            onClick: () => onNavigate(action.href),
          }))}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Announcements
          items={data.announcements}
          loading={loading}
          onRetry={onRetry}
          maxItems={4}
        />
      </Grid>
    </Grid>
  )
}
