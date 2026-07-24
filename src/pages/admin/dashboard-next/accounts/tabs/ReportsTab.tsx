import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import {
  CreditCard,
  FileText,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Wallet,
} from 'lucide-react'
import {
  NotificationPanel,
  QuickActions,
  RecentReports,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AccountsDashboardTabProps } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-invoices': <FileText size={18} />,
  'qa-collections': <HandCoins size={18} />,
  'qa-vendor': <Wallet size={18} />,
  'qa-expenses': <CreditCard size={18} />,
  'qa-funds': <Landmark size={18} />,
  'qa-accounts-legacy': <LayoutDashboard size={18} />,
}

export function ReportsTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: AccountsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 7 }}>
        <RecentReports
          title="Finance reports"
          subtitle="Exports · GST · outstanding · vendor · reconciliation"
          items={data.recentReports}
          loading={loading}
          onRetry={onRetry}
          maxItems={8}
          onShowMore={() => onNavigate('/admin/dashboard/accounts')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <NotificationPanel
          title="Report notices"
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
