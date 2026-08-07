import { SEED_SLA_MASTERS } from '@/shared/data/mockSlaMasters'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import {
  SLA_BULK_BANDS,
  SLA_DOMAIN_LABELS,
  emptySlaHoursPlan,
  getSlaStagesForScope,
  getSlaSubmoduleLabel,
  resolveSlaBulkBand,
  sumSlaStageHours,
  type SlaDomain,
  type SlaHoursPlan,
  type SlaMaster,
  type SlaMasterFormData,
  type SlaMasterListFilters,
  type SlaOpsStage,
  type SlaSubmodule,
} from '@/shared/types/slaMaster'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateSlaId(): string {
  return `sla-${Math.floor(1000 + Math.random() * 9000)}`
}

function clonePlan(plan: SlaHoursPlan): SlaHoursPlan {
  return {
    e2eHours: Number(plan.e2eHours) || 0,
    stages: { ...plan.stages },
  }
}

function normalizePlan(
  plan: SlaHoursPlan,
  module: SlaDomain,
  submodule: SlaSubmodule,
): SlaHoursPlan {
  const stages = emptySlaHoursPlan(module, submodule).stages
  for (const stage of getSlaStagesForScope(module, submodule)) {
    stages[stage] = Math.max(0, Number(plan.stages[stage]) || 0)
  }
  return {
    e2eHours: sumSlaStageHours(stages, module, submodule),
    stages,
  }
}

function planHasHours(
  plan: SlaHoursPlan,
  module: SlaDomain,
  submodule: SlaSubmodule,
): boolean {
  return sumSlaStageHours(plan.stages, module, submodule) > 0
}

function defaultName(module: SlaDomain, submodule: SlaSubmodule): string {
  return `${SLA_DOMAIN_LABELS[module]} · ${getSlaSubmoduleLabel(module, submodule)}`
}

let slaStore: SlaMaster[] = [...SEED_SLA_MASTERS]

export type SlaMasterSaveError =
  | 'duplicate_segment'
  | 'invalid_single_sum'
  | 'invalid_bulk_sum'
  | 'empty_e2e'

export const slaMasterService = {
  list(filters: SlaMasterListFilters = {}): SlaMaster[] {
    const { status = 'all', segment = 'all', domain = 'all' } = filters
    let rows = [...slaStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    if (segment !== 'all') {
      rows = rows.filter((row) => row.segment === segment)
    }
    if (domain !== 'all') {
      rows = rows.filter((row) => row.domain === domain)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): SlaMaster | undefined {
    return slaStore.find((row) => row.id === id)
  },

  getActiveBySegment(
    segment: Extract<SlaSubmodule, 'marine' | 'corporate' | 'retail' | 'b2b'>,
    domain: SlaDomain = 'application_management',
  ): SlaMaster | undefined {
    return slaStore.find(
      (row) => row.domain === domain && row.segment === segment && row.status === 'active',
    )
  },

  findByDomainSegment(
    domain: SlaDomain,
    segment: SlaSubmodule,
    excludeId?: string,
  ): SlaMaster | undefined {
    return slaStore.find(
      (row) =>
        row.domain === domain &&
        row.segment === segment &&
        (excludeId ? row.id !== excludeId : true),
    )
  },

  create(data: SlaMasterFormData): SlaMaster | { error: SlaMasterSaveError } {
    const validationError = this.validateForm(data)
    if (validationError) return { error: validationError }
    if (this.findByDomainSegment(data.domain, data.segment)) {
      return { error: 'duplicate_segment' }
    }

    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: SlaMaster = {
      id: generateSlaId(),
      domain: data.domain,
      segment: data.segment,
      name: data.name.trim() || defaultName(data.domain, data.segment),
      status: data.status,
      single: normalizePlan(data.single, data.domain, data.segment),
      bulkBands: {
        '0_10': normalizePlan(data.bulkBands['0_10'], data.domain, data.segment),
        '11_20': normalizePlan(data.bulkBands['11_20'], data.domain, data.segment),
        '21_plus': normalizePlan(data.bulkBands['21_plus'], data.domain, data.segment),
      },
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    slaStore = [record, ...slaStore]
    return record
  },

  update(
    id: string,
    data: SlaMasterFormData,
  ): SlaMaster | { error: SlaMasterSaveError } | undefined {
    const index = slaStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined

    const validationError = this.validateForm(data)
    if (validationError) return { error: validationError }
    if (this.findByDomainSegment(data.domain, data.segment, id)) {
      return { error: 'duplicate_segment' }
    }

    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: SlaMaster = {
      ...slaStore[index],
      domain: data.domain,
      segment: data.segment,
      name: data.name.trim() || defaultName(data.domain, data.segment),
      status: data.status,
      single: normalizePlan(data.single, data.domain, data.segment),
      bulkBands: {
        '0_10': normalizePlan(data.bulkBands['0_10'], data.domain, data.segment),
        '11_20': normalizePlan(data.bulkBands['11_20'], data.domain, data.segment),
        '21_plus': normalizePlan(data.bulkBands['21_plus'], data.domain, data.segment),
      },
      updatedBy: actor,
      updatedAt: timestamp,
    }
    slaStore = [...slaStore.slice(0, index), updated, ...slaStore.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): SlaMaster | undefined {
    const index = slaStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: SlaMaster = {
      ...slaStore[index],
      status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    slaStore = [...slaStore.slice(0, index), updated, ...slaStore.slice(index + 1)]
    return updated
  },

  validateForm(data: SlaMasterFormData): SlaMasterSaveError | null {
    if (!planHasHours(data.single, data.domain, data.segment)) return 'empty_e2e'
    for (const band of SLA_BULK_BANDS) {
      const plan = data.bulkBands[band] ?? emptySlaHoursPlan(data.domain, data.segment)
      if (!planHasHours(plan, data.domain, data.segment)) return 'empty_e2e'
    }
    return null
  },

  getPlanHours(
    record: SlaMaster,
    applicationType: 'single' | 'bulk',
    totalApplicants = 1,
  ): SlaHoursPlan {
    if (applicationType === 'single') return clonePlan(record.single)
    const band = resolveSlaBulkBand(totalApplicants)
    return clonePlan(record.bulkBands[band])
  },

  getStageHours(
    record: SlaMaster,
    applicationType: 'single' | 'bulk',
    stage: SlaOpsStage,
    totalApplicants = 1,
  ): number {
    return this.getPlanHours(record, applicationType, totalApplicants).stages[stage] ?? 0
  },
}
