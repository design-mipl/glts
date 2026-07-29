import type { CardMaster } from '@/shared/types/cardMaster'
import { formatMasterDate } from '../../utils/masterListingUtils'

export function getCardMasterCellValue(row: CardMaster, key: string): string {
  if (key === 'createdAudit') return row.createdAt
  if (key === 'updatedAudit') return row.updatedAt
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesCardMasterSearch(row: CardMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return row.cardName.toLowerCase().includes(normalized)
}

export function getCardMasterEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No cards found',
    emptyDescription: 'Add a card to manage payment cards used across operations.',
    emptyAction: { label: 'Add card', onClick: onCreate },
  }
}

export function downloadCardMasterCsv(rows: CardMaster[]) {
  const headers = [
    'Card Name',
    'Created By',
    'Created Date',
    'Updated By',
    'Updated Date',
  ]
  const lines = rows.map((row) =>
    [
      row.cardName,
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
  link.download = `card-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
