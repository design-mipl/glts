import { SEED_ORGANIZATION_LOCATIONS } from '@/shared/data/mockOrganizationLocations'
import type {
  OrganizationLocationMaster,
  OrganizationLocationMasterFormData,
  OrganizationLocationMasterListFilters,
} from '@/shared/types/organizationLocationMaster'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateId(): string {
  return `org-loc-${Math.floor(1000 + Math.random() * 9000)}`
}

function trimForm(data: OrganizationLocationMasterFormData) {
  return {
    name: data.name.trim(),
    organizationType: data.organizationType,
    contactPerson: data.contactPerson.trim(),
    mobileNumber: data.mobileNumber.trim(),
    emailAddress: data.emailAddress.trim(),
    address: data.address.trim(),
    countryId: data.countryId.trim(),
    country: data.country.trim(),
    state: data.state.trim(),
    city: data.city.trim(),
    pincode: data.pincode.trim(),
  }
}

let store: OrganizationLocationMaster[] = [...SEED_ORGANIZATION_LOCATIONS]

export const organizationLocationMasterService = {
  list(filters: OrganizationLocationMasterListFilters = {}): OrganizationLocationMaster[] {
    const organizationType = filters.organizationType ?? 'all'
    let rows = [...store]
    if (organizationType !== 'all') {
      rows = rows.filter((row) => row.organizationType === organizationType)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): OrganizationLocationMaster | undefined {
    return store.find((row) => row.id === id)
  },

  getByName(name: string, excludeId?: string): OrganizationLocationMaster | undefined {
    const normalized = name.trim().toLowerCase()
    return store.find(
      (row) =>
        row.name.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  create(
    data: OrganizationLocationMasterFormData,
  ): OrganizationLocationMaster | { error: 'duplicate_name' } {
    const next = trimForm(data)
    if (this.getByName(next.name)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: OrganizationLocationMaster = {
      id: generateId(),
      name: next.name,
      organizationType: next.organizationType,
      contactPerson: next.contactPerson,
      mobileNumber: next.mobileNumber,
      emailAddress: next.emailAddress,
      address: next.address,
      countryId: next.countryId,
      country: next.country,
      state: next.state,
      city: next.city,
      pincode: next.pincode,
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
    data: OrganizationLocationMasterFormData,
  ): OrganizationLocationMaster | { error: 'duplicate_name' } | undefined {
    const index = store.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const next = trimForm(data)
    if (this.getByName(next.name, id)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: OrganizationLocationMaster = {
      ...store[index],
      name: next.name,
      organizationType: next.organizationType,
      contactPerson: next.contactPerson,
      mobileNumber: next.mobileNumber,
      emailAddress: next.emailAddress,
      address: next.address,
      countryId: next.countryId,
      country: next.country,
      state: next.state,
      city: next.city,
      pincode: next.pincode,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    store = [...store.slice(0, index), updated, ...store.slice(index + 1)]
    return updated
  },

  delete(id: string): boolean {
    const index = store.findIndex((row) => row.id === id)
    if (index < 0) return false
    store = [...store.slice(0, index), ...store.slice(index + 1)]
    return true
  },
}
