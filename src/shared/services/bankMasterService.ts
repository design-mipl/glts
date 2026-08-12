import { SEED_BANK_MASTERS } from '@/shared/data/mockBankMasters'
import type { BankMaster, BankMasterFormData } from '@/shared/types/bankMaster'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateBankId(): string {
  return `bank-${Math.floor(1000 + Math.random() * 9000)}`
}

let bankStore: BankMaster[] = [...SEED_BANK_MASTERS]

export const bankMasterService = {
  list(): BankMaster[] {
    return [...bankStore].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): BankMaster | undefined {
    return bankStore.find((row) => row.id === id)
  },

  getByBankName(bankName: string, excludeId?: string): BankMaster | undefined {
    const normalized = bankName.trim().toLowerCase()
    return bankStore.find(
      (row) =>
        row.bankName.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  create(data: BankMasterFormData): BankMaster | { error: 'duplicate_name' } {
    if (this.getByBankName(data.bankName)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: BankMaster = {
      id: generateBankId(),
      bankName: data.bankName.trim(),
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    bankStore = [record, ...bankStore]
    return record
  },

  update(
    id: string,
    data: BankMasterFormData,
  ): BankMaster | { error: 'duplicate_name' } | undefined {
    const index = bankStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    if (this.getByBankName(data.bankName, id)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: BankMaster = {
      ...bankStore[index],
      bankName: data.bankName.trim(),
      updatedBy: actor,
      updatedAt: timestamp,
    }
    bankStore = [
      ...bankStore.slice(0, index),
      updated,
      ...bankStore.slice(index + 1),
    ]
    return updated
  },

  delete(id: string): boolean {
    const index = bankStore.findIndex((row) => row.id === id)
    if (index < 0) return false
    bankStore = [
      ...bankStore.slice(0, index),
      ...bankStore.slice(index + 1),
    ]
    return true
  },
}
