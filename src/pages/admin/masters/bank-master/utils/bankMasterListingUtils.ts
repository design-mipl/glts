import type { BankMaster } from '@/shared/types/bankMaster'
import { formatMasterDate } from '../../utils/masterListingUtils'

export function getBankMasterCellValue(row: BankMaster, key: string): string {
  if (key === 'createdAudit') return row.createdAt
  if (key === 'updatedAudit') return row.updatedAt
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesBankMasterSearch(row: BankMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return row.bankName.toLowerCase().includes(normalized)
}

export function getBankMasterEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No banks found',
    emptyDescription: 'Add a bank to manage banks used across operations and fund allocation.',
    emptyAction: { label: 'Add bank', onClick: onCreate },
  }
}

export function downloadBankMasterCsv(rows: BankMaster[]) {
  const headers = [
    'Bank Name',
    'Created By',
    'Created Date',
    'Updated By',
    'Updated Date',
  ]
  const lines = rows.map((row) =>
    [
      row.bankName,
      row.createdBy,
      formatMasterDate(row.createdAt),
      row.updatedBy,
      formatMasterDate(row.updatedAt),
    ]
      .map((cell) => `"${cell}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `bank-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
