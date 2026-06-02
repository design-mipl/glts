import { SEED_SAC_CODE_MASTERS } from '@/shared/data/mockSacCodeMasters'
import type { SelectOption } from '@/shared/types/taxMaster'
import type {
  SacCodeMaster,
  SacCodeMasterFormData,
  SacCodeMasterListFilters,
} from '@/shared/types/sacCodeMaster'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateSacId(): string {
  return `sac-${Math.floor(10000 + Math.random() * 90000)}`
}

let sacStore: SacCodeMaster[] = [...SEED_SAC_CODE_MASTERS]

export const sacCodeMasterService = {
  list(filters: SacCodeMasterListFilters = {}): SacCodeMaster[] {
    const { status = 'all', category = 'all' } = filters
    let rows = [...sacStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    if (category !== 'all') {
      rows = rows.filter((row) => row.category === category)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): SacCodeMaster | undefined {
    return sacStore.find((row) => row.id === id)
  },

  getBySacCode(code: string, excludeId?: string): SacCodeMaster | undefined {
    const normalized = code.trim().toLowerCase()
    return sacStore.find(
      (row) =>
        row.sacCode.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  listActiveOptions(): SelectOption[] {
    return sacStore
      .filter((row) => row.status === 'active')
      .sort((a, b) => a.sacCode.localeCompare(b.sacCode))
      .map((row) => ({
        value: row.id,
        label: `${row.sacCode} · ${row.sacTitle}`,
      }))
  },

  create(data: SacCodeMasterFormData): SacCodeMaster {
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: SacCodeMaster = {
      id: generateSacId(),
      sacCode: data.sacCode.trim(),
      sacTitle: data.sacTitle.trim(),
      description: data.description.trim(),
      category: data.category as SacCodeMaster['category'],
      defaultGstRateId: data.defaultGstRateId,
      defaultTdsSectionId: data.defaultTdsSectionId.trim() || null,
      applicableFor: [...data.applicableFor],
      status: data.status,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    sacStore = [record, ...sacStore]
    return record
  },

  update(id: string, data: SacCodeMasterFormData): SacCodeMaster | undefined {
    const index = sacStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const updated: SacCodeMaster = {
      ...sacStore[index],
      sacCode: data.sacCode.trim(),
      sacTitle: data.sacTitle.trim(),
      description: data.description.trim(),
      category: data.category as SacCodeMaster['category'],
      defaultGstRateId: data.defaultGstRateId,
      defaultTdsSectionId: data.defaultTdsSectionId.trim() || null,
      applicableFor: [...data.applicableFor],
      status: data.status,
      updatedBy: getMasterActor(),
      updatedAt: nowIso(),
    }
    sacStore = [...sacStore.slice(0, index), updated, ...sacStore.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): SacCodeMaster | undefined {
    const existing = sacStore.find((row) => row.id === id)
    if (!existing) return undefined
    return this.update(id, {
      sacCode: existing.sacCode,
      sacTitle: existing.sacTitle,
      description: existing.description,
      category: existing.category,
      defaultGstRateId: existing.defaultGstRateId,
      defaultTdsSectionId: existing.defaultTdsSectionId ?? '',
      applicableFor: existing.applicableFor,
      status,
    })
  },
}
