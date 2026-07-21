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
  NotificationPanel,
  QuickActions,
  RecentReports,
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

export function ReportsTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: SuperAdminDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 7 }}>
        <RecentReports
          title="Executive reports"
          subtitle="Monthly · quarterly · revenue · branch · operations · finance"
          items={data.recentReports}
          loading={loading}
          onRetry={onRetry}
          maxItems={8}
          onShowMore={() => onNavigate('/admin/dashboard/accounts')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <NotificationPanel
          title="Export history"
          items={data.reportNotifications}
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
