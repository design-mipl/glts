import { bankMasterService } from '@/shared/services/bankMasterService'

export function listBankSelectOptions() {
  return bankMasterService.list().map(bank => ({
    value: bank.id,
    label: bank.bankName,
  }))
}

/** Options keyed by bank name — for forms that store the display name (e.g. vendor). */
export function listBankNameSelectOptions() {
  return bankMasterService.list().map(bank => ({
    value: bank.bankName,
    label: bank.bankName,
  }))
}

export function resolveBankLabel(bankId: string): string {
  if (!bankId) return '—'
  return bankMasterService.getById(bankId)?.bankName ?? '—'
}
