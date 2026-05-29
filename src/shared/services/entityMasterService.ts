import { SEED_ENTITY_MASTERS } from '@/shared/data/mockEntityMasters'
import { GLTS_ENTITY_IDS } from '@/pages/customer/data/portalIds'
import { getCustomerActor } from '@/pages/customer/features/shared/utils/customerActor'
import type {
  EntityActivity,
  EntityMaster,
  EntityMasterDeleteResult,
  EntityMasterFormData,
  EntityMasterListFilters,
  EntityMasterStatus,
} from '@/shared/types/entityMaster'

function nowIso() {
  return new Date().toISOString()
}

function generateEntityId(): string {
  const suffix = Math.floor(100 + Math.random() * 900)
  return `GLTS-ENT-${suffix}`
}

function generateActivityId(): string {
  return `ent-act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function makeActivity(action: string, detail: string): EntityActivity {
  return {
    id: generateActivityId(),
    timestamp: nowIso(),
    actor: getCustomerActor(),
    action,
    detail,
  }
}

/** Mock application references for guarded delete */
const ENTITY_IN_USE_IDS = new Set<string>([GLTS_ENTITY_IDS.mumbaiBranch])

let entityStore: EntityMaster[] = [...SEED_ENTITY_MASTERS]

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function formToEntity(data: EntityMasterFormData): Omit<EntityMaster, 'id' | 'createdAt' | 'updatedAt' | 'activities'> {
  return {
    entityName: data.entityName.trim(),
    contactPersonName: data.contactPersonName.trim(),
    contactPersonEmail: data.contactPersonEmail.trim(),
    contactPersonMobile: data.contactPersonMobile.trim(),
    location: data.location.trim(),
    city: data.city.trim(),
    country: data.country.trim(),
    status: data.status,
    notes: data.notes.trim(),
  }
}

export const entityMasterService = {
  list(filters: EntityMasterListFilters = {}): EntityMaster[] {
    const { status = 'all', country, corporateAccountId, query } = filters
    const q = normalizeQuery(query)
    let rows = [...entityStore]

    if (status !== 'all') {
      rows = rows.filter(row => row.status === status)
    }

    if (corporateAccountId) {
      rows = rows.filter(row => row.corporateAccountId === corporateAccountId)
    }

    if (country && country !== 'all') {
      rows = rows.filter(row => row.country === country)
    }

    if (q) {
      rows = rows.filter(
        row =>
          row.entityName.toLowerCase().includes(q) ||
          row.contactPersonName.toLowerCase().includes(q) ||
          row.location.toLowerCase().includes(q) ||
          row.city.toLowerCase().includes(q) ||
          row.country.toLowerCase().includes(q),
      )
    }

    return rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  getById(id: string): EntityMaster | undefined {
    return entityStore.find(row => row.id === id)
  },

  create(data: EntityMasterFormData, corporateAccountId?: string): EntityMaster {
    const timestamp = nowIso()
    const record: EntityMaster = {
      id: generateEntityId(),
      corporateAccountId,
      ...formToEntity(data),
      createdAt: timestamp,
      updatedAt: timestamp,
      activities: [makeActivity('Entity created', `${data.entityName.trim()} added to entity master.`)],
    }
    entityStore = [record, ...entityStore]
    return record
  },

  update(id: string, data: EntityMasterFormData): EntityMaster | undefined {
    const index = entityStore.findIndex(row => row.id === id)
    if (index < 0) return undefined

    const updated: EntityMaster = {
      ...entityStore[index],
      ...formToEntity(data),
      updatedAt: nowIso(),
      activities: [
        makeActivity('Entity updated', `${data.entityName.trim()} details were updated.`),
        ...entityStore[index].activities,
      ],
    }
    entityStore = [...entityStore.slice(0, index), updated, ...entityStore.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: EntityMasterStatus): EntityMaster | undefined {
    const existing = entityStore.find(row => row.id === id)
    if (!existing) return undefined
    const label = status === 'active' ? 'activated' : 'inactivated'
    const index = entityStore.findIndex(row => row.id === id)
    const updated: EntityMaster = {
      ...existing,
      status,
      updatedAt: nowIso(),
      activities: [
        makeActivity(`Entity ${label}`, `Status changed to ${status}.`),
        ...existing.activities,
      ],
    }
    entityStore = [...entityStore.slice(0, index), updated, ...entityStore.slice(index + 1)]
    return updated
  },

  remove(id: string): EntityMasterDeleteResult {
    const existing = entityStore.find(row => row.id === id)
    if (!existing) return { ok: false, reason: 'not_found' }
    if (this.isEntityInUse(id)) return { ok: false, reason: 'in_use' }
    entityStore = entityStore.filter(row => row.id !== id)
    return { ok: true }
  },

  isEntityInUse(id: string): boolean {
    return ENTITY_IN_USE_IDS.has(id)
  },

  getCountryOptions(): string[] {
    const countries = new Set(entityStore.map(row => row.country).filter(Boolean))
    return Array.from(countries).sort()
  },
}
