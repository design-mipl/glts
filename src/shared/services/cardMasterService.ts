import { SEED_CARD_MASTERS } from '@/shared/data/mockCardMasters'
import type { CardMaster, CardMasterFormData } from '@/shared/types/cardMaster'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateCardId(): string {
  return `card-${Math.floor(1000 + Math.random() * 9000)}`
}

let cardStore: CardMaster[] = [...SEED_CARD_MASTERS]

export const cardMasterService = {
  list(): CardMaster[] {
    return [...cardStore].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): CardMaster | undefined {
    return cardStore.find((row) => row.id === id)
  },

  getByCardName(cardName: string, excludeId?: string): CardMaster | undefined {
    const normalized = cardName.trim().toLowerCase()
    return cardStore.find(
      (row) =>
        row.cardName.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  create(data: CardMasterFormData): CardMaster | { error: 'duplicate_name' } {
    if (this.getByCardName(data.cardName)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: CardMaster = {
      id: generateCardId(),
      cardName: data.cardName.trim(),
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    cardStore = [record, ...cardStore]
    return record
  },

  update(
    id: string,
    data: CardMasterFormData,
  ): CardMaster | { error: 'duplicate_name' } | undefined {
    const index = cardStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    if (this.getByCardName(data.cardName, id)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: CardMaster = {
      ...cardStore[index],
      cardName: data.cardName.trim(),
      updatedBy: actor,
      updatedAt: timestamp,
    }
    cardStore = [
      ...cardStore.slice(0, index),
      updated,
      ...cardStore.slice(index + 1),
    ]
    return updated
  },

  delete(id: string): boolean {
    const index = cardStore.findIndex((row) => row.id === id)
    if (index < 0) return false
    cardStore = [
      ...cardStore.slice(0, index),
      ...cardStore.slice(index + 1),
    ]
    return true
  },
}
