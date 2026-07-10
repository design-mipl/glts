import { SEED_CREDIT_CARD_MASTERS } from '@/shared/data/mockCreditCardMasters'
import type {
  CreditCardMaster,
  CreditCardMasterFormData,
} from '@/shared/types/creditCardMaster'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateCreditCardId(): string {
  return `credit-card-${Math.floor(1000 + Math.random() * 9000)}`
}

let creditCardStore: CreditCardMaster[] = [...SEED_CREDIT_CARD_MASTERS]

export const creditCardMasterService = {
  list(): CreditCardMaster[] {
    return [...creditCardStore].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): CreditCardMaster | undefined {
    return creditCardStore.find((row) => row.id === id)
  },

  getByCardName(cardName: string, excludeId?: string): CreditCardMaster | undefined {
    const normalized = cardName.trim().toLowerCase()
    return creditCardStore.find(
      (row) =>
        row.cardName.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  create(data: CreditCardMasterFormData): CreditCardMaster | { error: 'duplicate_name' } {
    if (this.getByCardName(data.cardName)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: CreditCardMaster = {
      id: generateCreditCardId(),
      cardName: data.cardName.trim(),
      description: data.description.trim(),
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    creditCardStore = [record, ...creditCardStore]
    return record
  },

  update(
    id: string,
    data: CreditCardMasterFormData,
  ): CreditCardMaster | { error: 'duplicate_name' } | undefined {
    const index = creditCardStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    if (this.getByCardName(data.cardName, id)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: CreditCardMaster = {
      ...creditCardStore[index],
      cardName: data.cardName.trim(),
      description: data.description.trim(),
      updatedBy: actor,
      updatedAt: timestamp,
    }
    creditCardStore = [
      ...creditCardStore.slice(0, index),
      updated,
      ...creditCardStore.slice(index + 1),
    ]
    return updated
  },

  delete(id: string): boolean {
    const index = creditCardStore.findIndex((row) => row.id === id)
    if (index < 0) return false
    creditCardStore = [
      ...creditCardStore.slice(0, index),
      ...creditCardStore.slice(index + 1),
    ]
    return true
  },
}
