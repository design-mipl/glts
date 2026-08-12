import { resolveBankLabel } from '@/shared/utils/bankMasterOptions'

/**
 * @deprecated Prefer listBankSelectOptions() from bankMasterOptions.
 * Kept as a thin re-export surface for settlement helpers that resolve stored ids.
 */
export function resolveDestinationBankAccountLabel(accountId: string | undefined): string {
  const value = accountId?.trim()
  if (!value) return '—'
  const fromMaster = resolveBankLabel(value)
  if (fromMaster !== '—') return fromMaster
  // Fallback for legacy mock ids that predate Bank Master
  return value
}

export function isBankTransferAllocation(transferType: string | undefined): boolean {
  return transferType === 'bank_transfer'
}
