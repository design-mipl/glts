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

function deriveServiceCode(name: string): string {
  const slug = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)
  return slug ? `SVC-${slug}` : `SVC-${Date.now()}`
}

function uniqueServiceCode(name: string, excludeId?: string): string {
  let code = deriveServiceCode(name)
  let suffix = 1
  while (serviceMasterService.getByServiceCode(code, excludeId)) {
    code = `${deriveServiceCode(name)}-${suffix}`
    suffix += 1
  }
  return code
}

let serviceStore: ServiceMaster[] = [...SEED_SERVICE_MASTERS]

export const serviceMasterService = {
  list(filters: ServiceMasterListFilters = {}): ServiceMaster[] {
    const { status = 'all', category = 'all', serviceType = 'all' } = filters
    let rows = [...serviceStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    if (category !== 'all') {
      rows = rows.filter((row) => row.category === category)
    }
    if (serviceType !== 'all') {
      rows = rows.filter((row) => row.serviceType === serviceType)
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

  create(data: ServiceMasterFormData): ServiceMaster {
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: ServiceMaster = {
      id: generateServiceId(),
      serviceCode: uniqueServiceCode(data.serviceName),
      serviceName: data.serviceName.trim(),
      description: data.description.trim(),
      serviceType: data.serviceType as ServiceMaster['serviceType'],
      category: 'Visa Services',
      subcategory: 'General',
      defaultPrice: parsePrice(data.defaultPrice),
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
  ): ServiceMaster | undefined {
    const index = serviceStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const existing = serviceStore[index]
    const updated: ServiceMaster = {
      ...existing,
      serviceName: data.serviceName.trim(),
      description: data.description.trim(),
      serviceType: data.serviceType as ServiceMaster['serviceType'],
      defaultPrice: parsePrice(data.defaultPrice),
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
    return this.update(id, { ...serviceToFormData(existing), status })
  },
}

function serviceToFormData(row: ServiceMaster): ServiceMasterFormData {
  return {
    serviceName: row.serviceName,
    description: row.description,
    serviceType: row.serviceType,
    defaultPrice: row.defaultPrice != null ? String(row.defaultPrice) : '',
    mappedSacCodeId: row.mappedSacCodeId ?? '',
    gstRateId: row.gstRateId ?? '',
    tdsSectionId: row.tdsSectionId ?? '',
    applicableFor: [...row.applicableFor],
    status: row.status,
  }
}
