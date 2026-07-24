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
  AgeingAnalysis,
  CollectionSummary,
  NotificationPanel,
  QuickActions,
  QuickStats,
  RecentActivity,
  RevenueSnapshot,
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

export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: AccountsDashboardTabProps) {
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <QuickStats
          items={data.quickStats}
          loading={loading}
          onRetry={onRetry}
          columns={4}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <NotificationPanel
          title="Financial alerts"
          items={data.notifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={4}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <QuickActions
          title="Quick actions"
          variant="tiles"
          columns={3}
          loading={loading}
          items={data.quickActions.map((action) => ({
            id: action.id,
            title: action.title,
            icon: ACTION_ICONS[action.id],
            onClick: () => onNavigate(action.href),
          }))}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RevenueSnapshot data={data.revenueSnapshot} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CollectionSummary
          data={data.collectionSummary}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <AgeingAnalysis buckets={data.ageingBuckets} loading={loading} onRetry={onRetry} />
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
