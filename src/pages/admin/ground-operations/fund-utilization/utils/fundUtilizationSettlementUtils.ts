import type { FundSettlementUserOption } from '@/shared/types/fundUtilization'
import type { FundAllocationBatchRow } from '@/shared/types/fundAllocation'
import { isBankTransferAllocation } from '@/shared/constants/fundSettlementBankAccounts'
import {
  resolveDestinationBankAccountLabel,
} from '@/shared/constants/fundSettlementBankAccounts'

export function isFundUtilizationBankBatch(batch: FundAllocationBatchRow): boolean {
  return isBankTransferAllocation(batch.fundTransfer?.transferType)
}

export function buildFundSettlementUserOptions(
  teamUsers: Array<{ value: string; label: string; team: string }>,
): FundSettlementUserOption[] {
  const seen = new Set<string>()
  const options: FundSettlementUserOption[] = []

  for (const user of teamUsers) {
    if (seen.has(user.value)) continue
    seen.add(user.value)
    options.push({ value: user.value, label: user.label })
  }

  return options.sort((a, b) => a.label.localeCompare(b.label))
}

export function resolveOverallSettlementBankAccountLabel(
  bankBatches: FundAllocationBatchRow[],
): string {
  const accountIds = [
    ...new Set(
      bankBatches
        .map(batch => batch.fundTransfer?.destinationBankAccount?.trim())
        .filter(Boolean),
    ),
  ]

  if (accountIds.length === 0) return '—'
  if (accountIds.length === 1) return resolveDestinationBankAccountLabel(accountIds[0])

  const labels = accountIds
    .map(id => resolveDestinationBankAccountLabel(id))
    .filter(label => label !== '—')

  if (labels.length <= 2) return labels.join(' · ')
  return `${labels.length} team bank accounts`
}
