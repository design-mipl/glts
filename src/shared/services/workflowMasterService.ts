import { SEED_WORKFLOW_MASTERS } from '@/shared/data/mockWorkflowMasters'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import type {
  WorkflowMaster,
  WorkflowMasterFormData,
  WorkflowMasterListFilters,
  WorkflowStatusStep,
  WorkflowStatusStepFormData,
} from '@/shared/types/workflowMaster'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateWorkflowId(): string {
  return `workflow-${Math.floor(1000 + Math.random() * 9000)}`
}

function normalizeSteps(steps: WorkflowStatusStepFormData[]): WorkflowStatusStep[] {
  return steps.map((step, index) => ({
    statusId: step.statusId,
    remarks: step.remarks.trim(),
    sequence: index + 1,
  }))
}

function hasDuplicateStatusIds(steps: WorkflowStatusStepFormData[]): boolean {
  const ids = steps.map((step) => step.statusId)
  return new Set(ids).size !== ids.length
}

let workflowStore: WorkflowMaster[] = [...SEED_WORKFLOW_MASTERS]

export type WorkflowMasterSaveError = 'duplicate_name' | 'empty_steps' | 'duplicate_status'

export const workflowMasterService = {
  list(filters: WorkflowMasterListFilters = {}): WorkflowMaster[] {
    const { status = 'all' } = filters
    let rows = [...workflowStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): WorkflowMaster | undefined {
    return workflowStore.find((row) => row.id === id)
  },

  getByName(name: string, excludeId?: string): WorkflowMaster | undefined {
    const normalized = name.trim().toLowerCase()
    return workflowStore.find(
      (row) =>
        row.name.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  create(data: WorkflowMasterFormData): WorkflowMaster | { error: WorkflowMasterSaveError } {
    if (this.getByName(data.name)) {
      return { error: 'duplicate_name' }
    }
    if (data.steps.length === 0) {
      return { error: 'empty_steps' }
    }
    if (hasDuplicateStatusIds(data.steps)) {
      return { error: 'duplicate_status' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: WorkflowMaster = {
      id: generateWorkflowId(),
      name: data.name.trim(),
      description: data.description.trim(),
      status: data.status,
      steps: normalizeSteps(data.steps),
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    workflowStore = [record, ...workflowStore]
    return record
  },

  update(
    id: string,
    data: WorkflowMasterFormData,
  ): WorkflowMaster | { error: WorkflowMasterSaveError } | undefined {
    const index = workflowStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    if (this.getByName(data.name, id)) {
      return { error: 'duplicate_name' }
    }
    if (data.steps.length === 0) {
      return { error: 'empty_steps' }
    }
    if (hasDuplicateStatusIds(data.steps)) {
      return { error: 'duplicate_status' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: WorkflowMaster = {
      ...workflowStore[index],
      name: data.name.trim(),
      description: data.description.trim(),
      status: data.status,
      steps: normalizeSteps(data.steps),
      updatedBy: actor,
      updatedAt: timestamp,
    }
    workflowStore = [
      ...workflowStore.slice(0, index),
      updated,
      ...workflowStore.slice(index + 1),
    ]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): WorkflowMaster | undefined {
    const index = workflowStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: WorkflowMaster = {
      ...workflowStore[index],
      status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    workflowStore = [
      ...workflowStore.slice(0, index),
      updated,
      ...workflowStore.slice(index + 1),
    ]
    return updated
  },
}
