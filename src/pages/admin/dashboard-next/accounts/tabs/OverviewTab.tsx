import type { ReactNode } from 'react'
import { Box, Grid, Stack } from '@mui/material'
import {
  CreditCard,
  FileText,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Wallet,
} from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import {
  AlertCenter,
  ClientSegmentMixChart,
  DashboardRankChart,
  RecentActivity,
  DASHBOARD_SPACING,
  SegmentComparisonSection,
  SegmentGrowthTrendSection,
  SegmentRevenueCollectionsSection,
} from '../../shared'
import { AccountsInfographics } from '../components/AccountsInfographics'
import { AccountsWorkloadPanel } from '../components/AccountsWorkloadPanel'
import type { AccountsDashboardTabProps } from '../types'
import { getAccountsWorkloadCounts } from '../utils/accountsWorkloadUtils'
import { buildAccountsFinanceRiskAlerts } from '../utils/accountsFinancePulseUtils'

export const ACCOUNTS_ACTION_ICONS: Record<string, ReactNode> = {
  'qa-invoices': <FileText size={18} />,
  'qa-collections': <HandCoins size={18} />,
  'qa-vendor': <Wallet size={18} />,
  'qa-expenses': <CreditCard size={18} />,
  'qa-funds': <Landmark size={18} />,
  'qa-accounts-legacy': <LayoutDashboard size={18} />,
}

/**
 * Overview — restructured bands (content preserved):
 * 1. Act now · 2. Desk snapshot · 3. Commercial · 4. Portfolio · 5. Activity
 */
export function OverviewTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenTab,
}: AccountsDashboardTabProps) {
  const workload = getAccountsWorkloadCounts(data)
  const financeRiskAlerts = buildAccountsFinanceRiskAlerts(data)

  const exceptionCount = data.invoiceExceptionRows.filter((r) =>
    ['draft', 'pending', 'awaiting'].some((s) => r.status.toLowerCase().includes(s)),
  ).length

  const moduleAlerts = [
    ...financeRiskAlerts.map((alert) => ({
      ...alert,
      onClick:
        alert.id === 'alert-blocked-cash' || alert.id === 'alert-available-funds'
          ? () => onOpenTab?.('finance')
          : alert.id === 'alert-sla-cash'
            ? () => onNavigate('/admin/assignment-priority')
            : alert.id === 'alert-credit-exposure'
              ? () => onNavigate('/admin/customer-accounts/agreements')
              : () => onNavigate('/admin/finance/invoices'),
    })),
    {
      id: 'alert-reconciliations',
      title: 'Pending reconciliations',
      description: `${workload.pendingReconciliations} insurance · tickets · couriers · credit cards`,
      severity: workload.pendingReconciliations > 0 ? ('warning' as const) : ('info' as const),
      onClick: () => onNavigate('/admin/finance/reconciliation'),
    },
    {
      id: 'alert-claim-recon',
      title: 'Claim sheet reconciliation',
      description: `${workload.pendingClaimRecon} approved sheets await book entry`,
      severity: workload.pendingClaimRecon > 0 ? ('warning' as const) : ('info' as const),
      onClick: () => onNavigate('/admin/finance/reconciliation?tab=approved_claim_sheet'),
    },
    {
      id: 'alert-claims',
      title: 'Claim sheets pending review',
      description: `${workload.pendingClaimApprovals} Ground Ops sheets await approve / reject`,
      severity: workload.pendingClaimApprovals > 0 ? ('critical' as const) : ('info' as const),
      onClick: () => onNavigate('/admin/finance/fund-allocation?tab=claim_sheets'),
    },
    {
      id: 'alert-vendor',
      title: 'Vendor invoices awaiting',
      description: `${workload.awaitingVendor} charges across vendor billing`,
      severity: workload.awaitingVendor > 0 ? ('warning' as const) : ('info' as const),
      onClick: () => onNavigate('/admin/finance/vendor-billing'),
    },
    {
      id: 'alert-invoices-generate',
      title: 'Invoices pending to be generated',
      description: `${workload.invoicesToGenerate} visa cases ready to invoice`,
      severity: workload.invoicesToGenerate > 0 ? ('warning' as const) : ('info' as const),
      onClick: () => onOpenTab?.('work'),
    },
    {
      id: 'alert-client-submissions',
      title: 'Pending client submissions',
      description: `${workload.pendingClientSubmissions} invoice submissions due or awaiting data`,
      severity: workload.pendingClientSubmissions > 0 ? ('warning' as const) : ('info' as const),
      onClick: () => onOpenTab?.('work'),
    },
    {
      id: 'alert-funds',
      title: 'Pending fund allocation',
      description: `${workload.pendingFunds} Ops requests from Assignment Priority`,
      severity: workload.pendingFunds > 0 ? ('warning' as const) : ('info' as const),
      onClick: () => onNavigate('/admin/finance/fund-allocation?tab=pending_allocation'),
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
    <Stack spacing={DASHBOARD_SPACING.section}>
      {/* 1. Act now */}
      <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ height: '100%', minWidth: 0, '& > *': { height: '100%' } }}>
            <AlertCenter
              title="Needs attention"
              subtitle="Cash risk · overdue · credit · desks · submissions"
              alerts={moduleAlerts}
              loading={loading}
              maxItems={6}
              onShowMore={() => onOpenTab?.('work')}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ height: '100%', minWidth: 0, '& > *': { height: '100%' } }}>
            <AccountsWorkloadPanel data={data} loading={loading} />
          </Box>
        </Grid>
      </Grid>

      {/* 2. Desk snapshot */}
      <AccountsInfographics data={data} loading={loading} />

      {/* 3. Commercial */}
      <SegmentComparisonSection
        rows={data.segmentComparison}
        loading={loading}
        action={
          <Button
            label="Open Performance"
            variant="outlined"
            size="sm"
            onClick={() => onOpenTab?.('performance')}
          />
        }
      />

      <SegmentRevenueCollectionsSection
        rows={data.segmentComparison}
        loading={loading}
        onChartClick={() => onOpenTab?.('performance')}
      />

      <SegmentGrowthTrendSection
        revenueTrend={data.segmentRevenueTrend}
        applicationTrend={data.segmentApplicationTrend}
        loading={loading}
        onChartClick={() => onOpenTab?.('performance')}
      />

      {/* 4. Portfolio */}
      <Stack spacing={DASHBOARD_SPACING.field}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'flex-start' }}
          justifyContent="space-between"
          spacing={1}
        >
          <ExecutiveSectionHeader
            title="Portfolio snapshot"
            description="Segment mix and top accounts — open Finance for full client intelligence"
          />
          <Button
            label="Open Finance"
            variant="outlined"
            size="sm"
            startIcon={<HandCoins size={14} />}
            onClick={() => onOpenTab?.('finance')}
          />
        </Stack>
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <ClientSegmentMixChart rows={data.clientIntelligence.clientRows} loading={loading} />
          </Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <DashboardRankChart
              title="Top accounts by revenue"
              items={data.clientIntelligence.topRevenueClients}
              loading={loading}
              valueLabel="Revenue"
              initialTopN="5"
            />
          </Grid>
        </Grid>
      </Stack>

      {/* 5. Activity */}
      <RecentActivity
        title="Recent activity"
        items={data.recentActivity}
        loading={loading}
        onRetry={onRetry}
        maxItems={6}
      />
    </Stack>
  )
}
