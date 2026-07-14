import { creditCardMasterService } from '@/shared/services/creditCardMasterService'

export function listCreditCardSelectOptions() {
  return creditCardMasterService.list().map(card => ({
    value: card.id,
    label: card.cardName,
  }))
}

export function resolveCreditCardLabel(cardId: string): string {
  if (!cardId) return '—'
  return creditCardMasterService.getById(cardId)?.cardName ?? '—'
}
