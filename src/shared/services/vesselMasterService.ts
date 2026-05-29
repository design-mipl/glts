import { SEED_VESSEL_MASTERS } from '@/shared/data/mockVesselMasters'
import { GLTS_VESSEL_IDS } from '@/pages/customer/data/portalIds'
import { getCustomerActor } from '@/pages/customer/features/shared/utils/customerActor'
import type {
  VesselActivity,
  VesselMaster,
  VesselMasterDeleteResult,
  VesselMasterFormData,
  VesselMasterListFilters,
  VesselMasterStatus,
} from '@/shared/types/vesselMaster'

function nowIso() {
  return new Date().toISOString()
}

function generateVesselId(): string {
  const suffix = Math.floor(100 + Math.random() * 900)
  return `GLTS-VSL-${suffix}`
}

function generateActivityId(): string {
  return `vsl-act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function makeActivity(action: string, detail: string): VesselActivity {
  return {
    id: generateActivityId(),
    timestamp: nowIso(),
    actor: getCustomerActor(),
    action,
    detail,
  }
}

const VESSEL_IN_USE_IDS = new Set<string>([GLTS_VESSEL_IDS.oceanStar])

let vesselStore: VesselMaster[] = [...SEED_VESSEL_MASTERS]

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function formToVessel(data: VesselMasterFormData) {
  return {
    linkedEntityId: data.linkedEntityId?.trim() || undefined,
    vesselName: data.vesselName.trim(),
    imoNumber: data.imoNumber.trim(),
    vesselType: data.vesselType,
    flagCountry: data.flagCountry.trim(),
    portOfRegistry: data.portOfRegistry.trim(),
    contactPersonName: data.contactPersonName.trim(),
    contactPersonEmail: data.contactPersonEmail.trim(),
    contactPersonMobile: data.contactPersonMobile.trim(),
    status: data.status,
    notes: data.notes.trim(),
  }
}

export const vesselMasterService = {
  list(filters: VesselMasterListFilters = {}): VesselMaster[] {
    const { status = 'all', vesselType = 'all', flagCountry, corporateAccountId, linkedEntityId, query } = filters
    const q = normalizeQuery(query)
    let rows = [...vesselStore]

    if (status !== 'all') {
      rows = rows.filter(row => row.status === status)
    }

    if (corporateAccountId) {
      rows = rows.filter(row => row.corporateAccountId === corporateAccountId)
    }

    if (linkedEntityId) {
      rows = rows.filter(row => row.linkedEntityId === linkedEntityId)
    }

    if (vesselType !== 'all') {
      rows = rows.filter(row => row.vesselType === vesselType)
    }

    if (flagCountry && flagCountry !== 'all') {
      rows = rows.filter(row => row.flagCountry === flagCountry)
    }

    if (q) {
      rows = rows.filter(
        row =>
          row.vesselName.toLowerCase().includes(q) ||
          row.imoNumber.includes(q) ||
          row.contactPersonName.toLowerCase().includes(q),
      )
    }

    return rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  getById(id: string): VesselMaster | undefined {
    return vesselStore.find(row => row.id === id)
  },

  isImoTaken(imo: string, excludeId?: string): boolean {
    const normalized = imo.trim()
    return vesselStore.some(row => row.imoNumber === normalized && row.id !== excludeId)
  },

  create(data: VesselMasterFormData, corporateAccountId?: string): VesselMaster {
    const timestamp = nowIso()
    const record: VesselMaster = {
      id: generateVesselId(),
      corporateAccountId,
      ...formToVessel(data),
      createdAt: timestamp,
      updatedAt: timestamp,
      activities: [makeActivity('Vessel created', `${data.vesselName.trim()} (IMO ${data.imoNumber.trim()}) registered.`)],
    }
    vesselStore = [record, ...vesselStore]
    return record
  },

  update(id: string, data: VesselMasterFormData): VesselMaster | undefined {
    const index = vesselStore.findIndex(row => row.id === id)
    if (index < 0) return undefined

    const updated: VesselMaster = {
      ...vesselStore[index],
      ...formToVessel(data),
      updatedAt: nowIso(),
      activities: [
        makeActivity('Vessel updated', `${data.vesselName.trim()} details were updated.`),
        ...vesselStore[index].activities,
      ],
    }
    vesselStore = [...entityStoreSlice(index, updated)]
    return updated
  },

  setStatus(id: string, status: VesselMasterStatus): VesselMaster | undefined {
    const existing = vesselStore.find(row => row.id === id)
    if (!existing) return undefined
    const label = status === 'active' ? 'activated' : 'inactivated'
    const index = vesselStore.findIndex(row => row.id === id)
    const updated: VesselMaster = {
      ...existing,
      status,
      updatedAt: nowIso(),
      activities: [
        makeActivity(`Vessel ${label}`, `Status changed to ${status}.`),
        ...existing.activities,
      ],
    }
    vesselStore = [...entityStoreSlice(index, updated)]
    return updated
  },

  remove(id: string): VesselMasterDeleteResult {
    const existing = vesselStore.find(row => row.id === id)
    if (!existing) return { ok: false, reason: 'not_found' }
    if (this.isVesselInUse(id)) return { ok: false, reason: 'in_use' }
    vesselStore = vesselStore.filter(row => row.id !== id)
    return { ok: true }
  },

  isVesselInUse(id: string): boolean {
    return VESSEL_IN_USE_IDS.has(id)
  },

  getFlagCountryOptions(): string[] {
    const countries = new Set(vesselStore.map(row => row.flagCountry).filter(Boolean))
    return Array.from(countries).sort()
  },
}

function entityStoreSlice(index: number, updated: VesselMaster): VesselMaster[] {
  return [...vesselStore.slice(0, index), updated, ...vesselStore.slice(index + 1)]
}
