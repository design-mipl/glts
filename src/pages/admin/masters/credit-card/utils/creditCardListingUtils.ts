import type { CreditCardMaster } from '@/shared/types/creditCardMaster'
import { formatMasterDate } from '../../utils/masterListingUtils'

export function getCreditCardCellValue(row: CreditCardMaster, key: string): string {
  if (key === 'createdAudit') return `${row.createdBy} ${row.createdAt}`
  if (key === 'updatedAudit') return `${row.updatedBy} ${row.updatedAt}`
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesCreditCardSearch(row: CreditCardMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [row.cardName, row.description].some((part) => part.toLowerCase().includes(normalized))
}

export function getCreditCardEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No credit cards found',
    emptyDescription: 'Add a credit card type to manage accepted payment methods.',
    emptyAction: { label: 'Add credit card', onClick: onCreate },
  }
}

export function downloadCreditCardCsv(rows: CreditCardMaster[]) {
  const headers = [
    'Card Name',
    'Description',
    'Created By',
    'Created Date',
    'Updated By',
    'Updated Date',
  ]
  const lines = rows.map((row) =>
    [
      row.cardName,
      row.description,
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
  link.download = `credit-cards-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
