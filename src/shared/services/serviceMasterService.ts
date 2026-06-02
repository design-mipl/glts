import { SEED_SERVICE_MASTERS } from '@/shared/data/mockServiceMasters'
import type {
  ServiceMaster,
  ServiceMasterFormData,
  ServiceMasterListFilters,
} from '@/shared/types/serviceMaster'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateServiceId(): string {
  return `svc-${Math.floor(10000 + Math.random() * 90000)}`
}

function parsePrice(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  if (Number.isNaN(num) || num < 0) return null
  return num
}

let serviceStore: ServiceMaster[] = [...SEED_SERVICE_MASTERS]

export const serviceMasterService = {
  list(filters: ServiceMasterListFilters = {}): ServiceMaster[] {
    const { status = 'all', category = 'all', currency = 'all' } = filters
    let rows = [...serviceStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    if (category !== 'all') {
      rows = rows.filter((row) => row.category === category)
    }
    if (currency !== 'all') {
      rows = rows.filter((row) => row.currency === currency)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): ServiceMaster | undefined {
    return serviceStore.find((row) => row.id === id)
  },

  getByServiceCode(code: string, excludeId?: string): ServiceMaster | undefined {
    const normalized = code.trim().toLowerCase()
    return serviceStore.find(
      (row) =>
        row.serviceCode.toLowerCase() === normalized &&
        (excludeId ? row.id !== excludeId : true),
    )
  },

  create(data: ServiceMasterFormData): ServiceMaster | { error: 'duplicate_code' } {
    if (this.getByServiceCode(data.serviceCode)) {
      return { error: 'duplicate_code' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: ServiceMaster = {
      id: generateServiceId(),
      serviceCode: data.serviceCode.trim(),
      serviceName: data.serviceName.trim(),
      description: data.description.trim(),
      category: data.category as ServiceMaster['category'],
      subcategory: data.subcategory.trim(),
      defaultPrice: parsePrice(data.defaultPrice),
      currency: data.currency as ServiceMaster['currency'],
      mappedSacCodeId: data.mappedSacCodeId.trim() || null,
      gstRateId: data.gstRateId.trim() || null,
      tdsSectionId: data.tdsSectionId.trim() || null,
      applicableFor: [...data.applicableFor],
      status: data.status,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    serviceStore = [record, ...serviceStore]
    return record
  },

  update(
    id: string,
    data: ServiceMasterFormData,
  ): ServiceMaster | { error: 'duplicate_code' } | undefined {
    const index = serviceStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    if (this.getByServiceCode(data.serviceCode, id)) {
      return { error: 'duplicate_code' }
    }
    const updated: ServiceMaster = {
      ...serviceStore[index],
      serviceCode: data.serviceCode.trim(),
      serviceName: data.serviceName.trim(),
      description: data.description.trim(),
      category: data.category as ServiceMaster['category'],
      subcategory: data.subcategory.trim(),
      defaultPrice: parsePrice(data.defaultPrice),
      currency: data.currency as ServiceMaster['currency'],
      mappedSacCodeId: data.mappedSacCodeId.trim() || null,
      gstRateId: data.gstRateId.trim() || null,
      tdsSectionId: data.tdsSectionId.trim() || null,
      applicableFor: [...data.applicableFor],
      status: data.status,
      updatedBy: getMasterActor(),
      updatedAt: nowIso(),
    }
    serviceStore = [...serviceStore.slice(0, index), updated, ...serviceStore.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): ServiceMaster | undefined {
    const existing = serviceStore.find((row) => row.id === id)
    if (!existing) return undefined
    return this.update(id, {
      serviceCode: existing.serviceCode,
      serviceName: existing.serviceName,
      description: existing.description,
      category: existing.category,
      subcategory: existing.subcategory,
      defaultPrice: existing.defaultPrice != null ? String(existing.defaultPrice) : '',
      currency: existing.currency,
      mappedSacCodeId: existing.mappedSacCodeId ?? '',
      gstRateId: existing.gstRateId ?? '',
      tdsSectionId: existing.tdsSectionId ?? '',
      applicableFor: existing.applicableFor,
      status,
    }) as ServiceMaster | undefined
  },
}
