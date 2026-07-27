import { FundBankCashReconciliation } from './FundSettlementReconciliation'
import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'

interface FundSettlementKpiRowProps {
  summary: FundBankSettlementSummary
}

export function FundSettlementKpiRow({ summary }: FundSettlementKpiRowProps) {
  return <FundBankCashReconciliation summary={summary} />
}
