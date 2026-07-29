import {
  FundBankCashReconciliation,
  FundExpenseSettlementReconciliation,
} from '@/pages/admin/ground-operations/fund-utilization/components/FundSettlementReconciliation'
import type { FundTransferType } from '@/shared/types/fundAllocation'
import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'
import { isClaimSheetBankTransferKpis } from '@/shared/types/groundOpsClaimSheet'

interface ClaimSheetKpiSnapshotProps {
  kpis: FundBankSettlementSummary
  fundTransferType?: FundTransferType | ''
}

export function ClaimSheetKpiSnapshot({ kpis, fundTransferType }: ClaimSheetKpiSnapshotProps) {
  if (isClaimSheetBankTransferKpis(fundTransferType)) {
    return <FundBankCashReconciliation summary={kpis} />
  }

  return (
    <FundExpenseSettlementReconciliation
      allocatedAmount={kpis.allocatedAmount}
      expensesIncurred={kpis.expensesIncurred}
      settlementAmount={kpis.settlementAmount}
    />
  )
}
