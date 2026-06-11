import { SEED_JURISDICTION_MASTERS } from '@/shared/data/mockJurisdictionMasters'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import type { SelectOption } from '@/shared/types/taxMaster'
import type {
  JurisdictionMaster,
  JurisdictionMasterFormData,
  JurisdictionMasterListFilters,
} from '@/shared/types/jurisdictionMaster'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateJurisdictionId(): string {
  return `jurisdiction-${Math.floor(1000 + Math.random() * 9000)}`
}

let jurisdictionStore: JurisdictionMaster[] = [...SEED_JURISDICTION_MASTERS]

export const jurisdictionMasterService = {
  list(filters: JurisdictionMasterListFilters = {}): JurisdictionMaster[] {
    const { status = 'all' } = filters
    let rows = [...jurisdictionStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): JurisdictionMaster | undefined {
    return jurisdictionStore.find((row) => row.id === id)
  },

  getByName(name: string, excludeId?: string): JurisdictionMaster | undefined {
    const normalized = name.trim().toLowerCase()
    return jurisdictionStore.find(
      (row) =>
        row.name.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  listActiveOptions(): SelectOption[] {
    return jurisdictionStore
      .filter((row) => row.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((row) => ({ value: row.id, label: row.name }))
  },

  create(data: JurisdictionMasterFormData): JurisdictionMaster | { error: 'duplicate_name' } {
    if (this.getByName(data.name)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: JurisdictionMaster = {
      id: generateJurisdictionId(),
      name: data.name.trim(),
      description: data.description.trim(),
      status: data.status,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    jurisdictionStore = [record, ...jurisdictionStore]
    return record
  },

  update(
    id: string,
    data: JurisdictionMasterFormData,
  ): JurisdictionMaster | { error: 'duplicate_name' } | undefined {
    const index = jurisdictionStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    if (this.getByName(data.name, id)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: JurisdictionMaster = {
      ...jurisdictionStore[index],
      name: data.name.trim(),
      description: data.description.trim(),
      status: data.status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    jurisdictionStore = [
      ...jurisdictionStore.slice(0, index),
      updated,
      ...jurisdictionStore.slice(index + 1),
    ]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): JurisdictionMaster | undefined {
    const index = jurisdictionStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: JurisdictionMaster = {
      ...jurisdictionStore[index],
      status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    jurisdictionStore = [
      ...jurisdictionStore.slice(0, index),
      updated,
      ...jurisdictionStore.slice(index + 1),
    ]
    return updated
  },
}
