import { useMemo } from 'react'
import { Button } from '@/design-system/UIComponents'
import { FinanceWorkspaceView, toSegmentComparisonRows } from '../../shared'
import type { SuperAdminDashboardTabProps } from '../types'

const ACCOUNTS_HREF = '/admin/dashboard-next/accounts'
const INVOICES_HREF = '/admin/finance/invoices'
const AGREEMENTS_HREF = '/admin/customer-accounts/agreements'
const ASSIGNMENT_HREF = '/admin/assignment-priority'

/** Finance — management workspace + segment revenue analytics. */
export function FinanceTab({ data, loading, onNavigate, onOpenTab }: SuperAdminDashboardTabProps) {
  const comparisonRows = useMemo(
    () => toSegmentComparisonRows(data.segmentCards),
    [data.segmentCards],
  )

  const openBusiness = () => onOpenTab?.('business')

  return (
    <FinanceWorkspaceView
      data={{
        kpiStrip: data.financeKpiStrip,
        riskCallouts: data.financeRiskCallouts,
        workspace: data.financeWorkspace,
      }}
      loading={loading}
      onNavigateAccounts={() => onNavigate(`${ACCOUNTS_HREF}?tab=finance`)}
      onNavigateInvoices={() => onNavigate(INVOICES_HREF)}
      onNavigateCredit={() => onNavigate(AGREEMENTS_HREF)}
      onNavigateSlaCash={() => onNavigate(ASSIGNMENT_HREF)}
      segmentAnalytics={{
        comparisonRows,
        revenueTrend: data.segmentRevenueTrend,
        applicationTrend: data.segmentApplicationTrend,
        onChartClick: openBusiness,
      }}
      clientIntelligence={{
        clientRows: data.clientRows,
        topRevenueClients: data.topRevenueClients,
        highRiskClients: data.highRiskClients,
        dormantClients: data.dormantClients,
        highMarginClientIntelligence: data.highMarginClientIntelligence,
        lowMarginClientIntelligence: data.lowMarginClientIntelligence,
      }}
      commercialHero={{
        revenueHero: data.revenueHero,
        collectionsHero: data.collectionsHero,
        netRevenue: data.executiveSummary.netRevenue,
        outstanding: data.executiveSummary.outstanding,
      }}
      onGrossRevenueClick={openBusiness}
      onNetRevenueClick={() => onOpenTab?.('finance')}
      onCollectionsClick={() => onOpenTab?.('finance')}
      onOutstandingClick={() => onNavigate(INVOICES_HREF)}
      pulseAction={
        <Button
          label="Accounts dashboard"
          variant="outlined"
          size="sm"
          onClick={() => onNavigate(`${ACCOUNTS_HREF}?tab=finance`)}
        />
      }
    />
  )
}
