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

/** Overview — signal · executive row · multi-color infographics · trend + activity. */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenTab,
}: AccountsDashboardTabProps) {
  const colors = usePublicBrandColors()

  const pendingFunds = data.fundAllocationRows.filter((r) => r.allocationStatus === 'Pending').length
  const pendingClaims = data.claimSheetRows.filter((r) => r.status === 'Pending review').length
  const awaitingVendor = data.vendorBillingRows.reduce((sum, r) => sum + r.awaitingInvoiceCount, 0)
  const overdueCount = data.collectionRows.filter((r) =>
    r.status.toLowerCase().includes('overdue'),
  ).length
  const exceptionCount = data.invoiceExceptionRows.filter((r) =>
    ['draft', 'pending', 'awaiting'].some((s) => r.status.toLowerCase().includes(s)),
  ).length

  const signalParts = [
    pendingFunds > 0 ? `${pendingFunds} fund requests` : null,
    pendingClaims > 0 ? `${pendingClaims} claim sheets` : null,
    awaitingVendor > 0 ? `${awaitingVendor} vendor charges` : null,
    overdueCount > 0 ? `${overdueCount} overdue AR` : null,
    exceptionCount > 0 ? `${exceptionCount} invoice exceptions` : null,
  ].filter(Boolean)

  const moduleAlerts = [
    {
      id: 'alert-funds',
      title: 'Pending fund allocation',
      description: `${pendingFunds} Ops requests from Assignment Priority`,
      severity: pendingFunds > 0 ? ('warning' as const) : ('info' as const),
      onClick: () => onNavigate('/admin/finance/fund-allocation?tab=pending_allocation'),
    },
    {
      id: 'alert-claims',
      title: 'Claim sheets pending review',
      description: `${pendingClaims} Ground Ops sheets await approve / reject`,
      severity: pendingClaims > 0 ? ('critical' as const) : ('info' as const),
      onClick: () => onNavigate('/admin/finance/fund-allocation?tab=claim_sheets'),
    },
    {
      id: 'alert-vendor',
      title: 'Vendor charges awaiting invoice',
      description: `${awaitingVendor} charges across vendor billing`,
      severity: awaitingVendor > 0 ? ('warning' as const) : ('info' as const),
      onClick: () => onNavigate('/admin/finance/vendor-billing'),
    },
    {
      id: 'alert-exceptions',
      title: 'Unbilled / refunds / credit notes',
      description: `${data.invoiceExceptionRows.length} invoice exceptions open`,
      severity: exceptionCount > 0 ? ('warning' as const) : ('info' as const),
      onClick: () => onNavigate('/admin/finance/invoices'),
    },
    ...data.notifications.slice(0, 2).map((n, index) => ({
      id: n.id,
      title: n.title,
      description: [n.body, n.createdAt].filter(Boolean).join(' · '),
      severity: (index === 0 ? 'critical' : 'info') as 'critical' | 'info',
      onClick: () => onOpenTab?.('work'),
    })),
  ]

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      {signalParts.length > 0 ? (
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
                {signalParts.join(' · ')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Open Work desks for expenses, funds, vendor billing, invoicing, and credit control.
              </Typography>
            </Box>
          </Stack>
          <Button
            label="Open Work"
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
            subtitle="Funds · claim sheets · vendor · invoices · AR"
            alerts={moduleAlerts}
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
