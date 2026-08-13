import type { ReactNode } from 'react'
import { Divider, Stack } from '@mui/material'
import { DASHBOARD_SPACING } from '../../constants'
import type { ManagementFinanceDashboardData } from '../../types'
import { FinanceDashboardSections } from './FinanceDashboardSections'
import { FinanceExecutiveHeader } from './FinanceKpiStrip'

export interface ManagementFinanceDashboardProps {
  data: ManagementFinanceDashboardData
  loading?: boolean
  onNavigateAccounts?: () => void
  onNavigateInvoices?: () => void
  onNavigateCredit?: () => void
  onNavigateSlaCash?: () => void
  analyticsSlot?: ReactNode
}

/**
 * Unified management finance dashboard — compact header + workspace rows.
 */
export function ManagementFinanceDashboard({
  data,
  loading,
  onNavigateAccounts,
  onNavigateInvoices,
  onNavigateCredit,
  onNavigateSlaCash,
  analyticsSlot,
}: ManagementFinanceDashboardProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.dense} divider={<Divider flexItem />}>
      <FinanceExecutiveHeader
        kpiStrip={data.kpiStrip}
        riskCallouts={data.riskCallouts}
        loading={loading}
        onAvailableFundsClick={onNavigateAccounts}
        onOverdueClick={onNavigateInvoices}
        onCreditExposureClick={onNavigateCredit}
        onSlaCashClick={onNavigateSlaCash}
      />

      <FinanceDashboardSections data={data.workspace} loading={loading} compact />

      {analyticsSlot ? (
        <Stack component="section" spacing={DASHBOARD_SPACING.field} aria-label="Finance analytics">
          {analyticsSlot}
        </Stack>
      ) : null}
    </Stack>
  )
}
