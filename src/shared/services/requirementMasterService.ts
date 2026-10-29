import { SEED_REQUIREMENT_MASTERS } from '@/shared/data/mockRequirementMasters'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import type {
  RequirementMaster,
  RequirementMasterFormData,
  RequirementMasterKpiCounts,
  RequirementMasterListFilters,
} from '@/shared/types/requirementMaster'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateRequirementId(): string {
  return `req-${Math.floor(1000 + Math.random() * 9000)}`
}

function cloneForm(data: RequirementMasterFormData): RequirementMasterFormData {
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    status: data.status,
    questions: data.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt.trim(),
      required: question.required,
      options: question.options.map((option) => ({
        id: option.id,
        label: option.label.trim(),
        documentIds: [...option.documentIds],
      })),
    })),
  }
}

function cloneRecord(row: RequirementMaster): RequirementMaster {
  return {
    ...row,
    questions: row.questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({
        ...option,
        documentIds: [...option.documentIds],
      })),
    })),
  }
}

let requirementStore: RequirementMaster[] = SEED_REQUIREMENT_MASTERS.map(cloneRecord)

export const requirementMasterService = {
  list(filters: RequirementMasterListFilters = {}): RequirementMaster[] {
    const { status = 'all' } = filters
    let rows = [...requirementStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): RequirementMaster | undefined {
    return requirementStore.find((row) => row.id === id)
  },

  getKpiCounts(rows = requirementStore): RequirementMasterKpiCounts {
    return {
      total: rows.length,
      active: rows.filter((row) => row.status === 'active').length,
      inactive: rows.filter((row) => row.status === 'inactive').length,
    }
  },

  toFormData(record: RequirementMaster): RequirementMasterFormData {
    return {
      name: record.name,
      description: record.description,
      status: record.status,
      questions: record.questions.map((question) => ({
        ...question,
        options: question.options.map((option) => ({
          ...option,
          documentIds: [...option.documentIds],
        })),
      })),
    }
  },

  create(data: RequirementMasterFormData): RequirementMaster {
    const form = cloneForm(data)
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: RequirementMaster = {
      id: generateRequirementId(),
      ...form,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    requirementStore = [record, ...requirementStore]
    return record
  },

  update(id: string, data: RequirementMasterFormData): RequirementMaster | undefined {
    const index = requirementStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const form = cloneForm(data)
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: RequirementMaster = {
      ...requirementStore[index],
      ...form,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    requirementStore = [...requirementStore.slice(0, index), updated, ...requirementStore.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): RequirementMaster | undefined {
    const index = requirementStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: RequirementMaster = {
      ...requirementStore[index],
      status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    requirementStore = [...requirementStore.slice(0, index), updated, ...requirementStore.slice(index + 1)]
    return updated
  },

  remove(id: string): boolean {
    const next = requirementStore.filter((row) => row.id !== id)
    if (next.length === requirementStore.length) return false
    requirementStore = next
    return true
  },
}
