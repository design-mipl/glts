export const DESTINATION_BANK_ACCOUNT_OPTIONS = [
  { value: 'hdfc-ops-4421', label: 'HDFC · Ops Float · ****4421' },
  { value: 'icici-delhi-1005', label: 'ICICI · Delhi Team · ****1005' },
  { value: 'sbi-vfs-7788', label: 'SBI · VFS Settlement · ****7788' },
] as const

export function resolveDestinationBankAccountLabel(accountId: string | undefined): string {
  const value = accountId?.trim()
  if (!value) return '—'
  const match = DESTINATION_BANK_ACCOUNT_OPTIONS.find(option => option.value === value)
  return match?.label ?? value
}

export function isBankTransferAllocation(transferType: string | undefined): boolean {
  return transferType === 'bank_transfer'
}
