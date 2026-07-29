import { SEED_COUNTRY_GROUPS } from '@/shared/data/mockCountryGroups'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import type {
  CountryGroupMaster,
  CountryGroupMasterFormData,
  CountryGroupMasterListFilters,
} from '@/shared/types/countryGroupMaster'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateCountryGroupId(): string {
  return `cg-${Math.floor(1000 + Math.random() * 9000)}`
}

let store: CountryGroupMaster[] = SEED_COUNTRY_GROUPS.map((g) => ({
  ...g,
  countryIds: [...g.countryIds],
}))

export const countryGroupMasterService = {
  list(filters: CountryGroupMasterListFilters = {}): CountryGroupMaster[] {
    const { status = 'all' } = filters
    let rows = [...store]
    if (status !== 'all') {
      rows = rows.filter((g) => g.status === status)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): CountryGroupMaster | undefined {
    return store.find((g) => g.id === id)
  },

  getByName(name: string, excludeId?: string): CountryGroupMaster | undefined {
    const normalized = name.trim().toLowerCase()
    return store.find(
      (g) => g.name.toLowerCase() === normalized && (excludeId ? g.id !== excludeId : true),
    )
  },

  listSelectOptions(): { value: string; label: string }[] {
    return this.list({ status: 'active' })
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((g) => ({ value: g.id, label: g.name }))
  },

  /** Active Country Master options for group membership MultiSelect. */
  listCountryOptions(): { value: string; label: string }[] {
    return countryMasterAdminService
      .list({ status: 'active' })
      .map((c) => ({ value: c.id, label: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label))
  },

  resolveCountryNames(countryIds: string[]): string[] {
    return countryIds
      .map((id) => countryMasterAdminService.getById(id)?.name ?? id)
      .filter(Boolean)
  },

  resolveCountries(countryIds: string[]): { id: string; name: string }[] {
    return countryIds.map((id) => ({
      id,
      name: countryMasterAdminService.getById(id)?.name ?? id,
    }))
  },

  create(data: CountryGroupMasterFormData): CountryGroupMaster | { error: 'duplicate_name' } {
    if (this.getByName(data.name)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: CountryGroupMaster = {
      id: generateCountryGroupId(),
      name: data.name.trim(),
      countryIds: [...data.countryIds],
      status: data.status,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    store = [record, ...store]
    return record
  },

  update(
    id: string,
    data: CountryGroupMasterFormData,
  ): CountryGroupMaster | { error: 'duplicate_name' } | undefined {
    const index = store.findIndex((g) => g.id === id)
    if (index < 0) return undefined
    if (this.getByName(data.name, id)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: CountryGroupMaster = {
      ...store[index],
      name: data.name.trim(),
      countryIds: [...data.countryIds],
      status: data.status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    store = [...store.slice(0, index), updated, ...store.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): CountryGroupMaster | undefined {
    const index = store.findIndex((g) => g.id === id)
    if (index < 0) return undefined
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: CountryGroupMaster = {
      ...store[index],
      status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    store = [...store.slice(0, index), updated, ...store.slice(index + 1)]
    return updated
  },
}
