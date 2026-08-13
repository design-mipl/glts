import { LayoutDashboard } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { FinanceWorkspaceView } from '../../shared'
import type { AccountsDashboardTabProps } from '../types'

/**
 * Finance — management workspace + full client intelligence.
 * Segment analytics live on Overview; commercial KPIs live in the page hero.
 */
export function FinanceTab({ data, loading, onNavigate, onOpenTab }: AccountsDashboardTabProps) {
  return (
    <FinanceWorkspaceView
      data={{
        kpiStrip: data.financeKpiStrip,
        riskCallouts: data.financeRiskCallouts,
        workspace: data.financeWorkspace,
      }}
      loading={loading}
      onNavigateInvoices={() => onNavigate('/admin/finance/invoices')}
      onNavigateAccounts={() => onOpenTab?.('performance')}
      onNavigateCredit={() => onNavigate('/admin/customer-accounts/agreements')}
      onNavigateSlaCash={() => onNavigate('/admin/assignment-priority')}
      clientIntelligence={data.clientIntelligence}
      pulseAction={
        <Button
          label="Open Overview"
          variant="outlined"
          size="sm"
          startIcon={<LayoutDashboard size={14} />}
          onClick={() => onOpenTab?.('overview')}
        />
      }
    />
  )
}
