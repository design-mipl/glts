import { cardMasterService } from '@/shared/services/cardMasterService'

export function listCardSelectOptions() {
  return cardMasterService.list().map(card => ({
    value: card.id,
    label: card.cardName,
  }))
}

export function resolveCardLabel(cardId: string): string {
  if (!cardId) return '—'
  return cardMasterService.getById(cardId)?.cardName ?? '—'
}
