import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import { ClipboardList, FileText, HandCoins, Truck } from 'lucide-react'
import {
  NotificationPanel,
  QuickActions,
  RecentReports,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AdminDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-retail-queue': <ClipboardList size={18} />,
  'qa-applications': <FileText size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-ground': <Truck size={18} />,
}

export function ReportsTab({ data, loading, onRetry, onNavigate }: AdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 7 }}>
        <RecentReports
          items={data.recentReports}
          loading={loading}
          onRetry={onRetry}
          maxItems={8}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <NotificationPanel
          items={data.notifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
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
