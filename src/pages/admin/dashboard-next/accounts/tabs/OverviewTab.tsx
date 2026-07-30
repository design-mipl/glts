import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  AlertTriangle,
  CreditCard,
  FileText,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Wallet,
} from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  AlertCenter,
  CollectionSummary,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import { AccountsExecutiveRow } from '../components/AccountsExecutiveRow'
import {
  AccountsCollectionsTrend,
  AccountsInfographics,
} from '../components/AccountsInfographics'
import type { AccountsDashboardTabProps } from '../types'

export const ACCOUNTS_ACTION_ICONS: Record<string, ReactNode> = {
  'qa-invoices': <FileText size={18} />,
  'qa-collections': <HandCoins size={18} />,
  'qa-vendor': <Wallet size={18} />,
  'qa-expenses': <CreditCard size={18} />,
  'qa-funds': <Landmark size={18} />,
  'qa-accounts-legacy': <LayoutDashboard size={18} />,
}

/** Overview — signal · executive row · multi-color infographics · trend + activity (ops layout). */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenTab,
}: AccountsDashboardTabProps) {
  const colors = usePublicBrandColors()
  const overdueCount = data.collectionRows.filter((r) =>
    r.status.toLowerCase().includes('overdue'),
  ).length
  const unallocatedCount = data.paymentAllocationRows.filter(
    (r) => r.allocationStatus !== 'Allocated',
  ).length
  const signalCount = overdueCount + unallocatedCount

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      {signalCount > 0 ? (
        <Box
          sx={{
            ...executiveCardLevel2Sx(colors),
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'error.main',
                color: 'error.contrastText',
                flexShrink: 0,
                opacity: 0.9,
              }}
            >
              <AlertTriangle size={16} />
            </Box>
            <Box minWidth={0}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                {overdueCount} overdue · {unallocatedCount} unallocated receipts
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Open the credit control desk to chase AR and allocate payments.
              </Typography>
            </Box>
          </Stack>
          <Button
            label="Open credit control"
            variant="outlined"
            size="sm"
            onClick={() => onOpenTab?.('work')}
          />
        </Box>
      ) : null}

      <AccountsExecutiveRow
        primaryVisualization={
          <CollectionSummary
            title="Collections funnel"
            subtitle="Primary visualization — outstanding vs collected"
            data={data.collectionSummary}
            loading={loading}
            onRetry={onRetry}
          />
        }
        alerts={
          <AlertCenter
            title="Financial alerts"
            subtitle="Overdue · reconciliation · vendor · follow-ups"
            alerts={data.notifications.map((n, index) => ({
              id: n.id,
              title: n.title,
              description: [n.body, n.createdAt].filter(Boolean).join(' · '),
              severity: index === 0 ? 'critical' : index === 1 ? 'warning' : 'info',
              onClick: () => onNavigate('/admin/finance/invoices'),
            }))}
            loading={loading}
            maxItems={5}
            onShowMore={() => onOpenTab?.('work')}
          />
        }
      />

      <AccountsInfographics data={data} loading={loading} />

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={DASHBOARD_SPACING.field}
        alignItems="stretch"
      >
        <Box flex={1.2} minWidth={0}>
          <AccountsCollectionsTrend data={data} loading={loading} />
        </Box>
        <Box flex={1} minWidth={0} sx={{ '& > *': { height: '100%' } }}>
          <RecentActivity
            title="Recent activity"
            items={data.recentActivity}
            loading={loading}
            onRetry={onRetry}
            maxItems={6}
          />
        </Box>
      </Stack>
    </Stack>
  )
}
