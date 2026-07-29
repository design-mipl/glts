import { SEED_DEPARTMENTS } from '@/shared/data/mockDepartments'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import type { SelectOption } from '@/shared/types/taxMaster'
import type {
  DepartmentMaster,
  DepartmentMasterFormData,
  DepartmentMasterListFilters,
} from '@/shared/types/departmentMaster'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateDepartmentId(): string {
  return `dept-${Math.floor(1000 + Math.random() * 9000)}`
}

let departmentStore: DepartmentMaster[] = [...SEED_DEPARTMENTS]

export const departmentService = {
  list(filters: DepartmentMasterListFilters = {}): DepartmentMaster[] {
    const { status = 'all' } = filters
    let rows = [...departmentStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): DepartmentMaster | undefined {
    return departmentStore.find((row) => row.id === id)
  },

  getByName(name: string, excludeId?: string): DepartmentMaster | undefined {
    const normalized = name.trim().toLowerCase()
    return departmentStore.find(
      (row) =>
        row.name.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  listActiveOptions(): SelectOption[] {
    return departmentStore
      .filter((row) => row.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((row) => ({ value: row.id, label: row.name }))
  },

  countUsers(departmentId: string): number {
    return adminPortalUserService.listByDepartmentId(departmentId).length
  },

  create(data: DepartmentMasterFormData): DepartmentMaster | { error: 'duplicate_name' } {
    if (this.getByName(data.name)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: DepartmentMaster = {
      id: generateDepartmentId(),
      name: data.name.trim(),
      description: data.description.trim(),
      status: data.status,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    departmentStore = [record, ...departmentStore]
    return record
  },

  update(
    id: string,
    data: DepartmentMasterFormData,
  ): DepartmentMaster | { error: 'duplicate_name' } | undefined {
    const index = departmentStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    if (this.getByName(data.name, id)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: DepartmentMaster = {
      ...departmentStore[index],
      name: data.name.trim(),
      description: data.description.trim(),
      status: data.status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    departmentStore = [
      ...departmentStore.slice(0, index),
      updated,
      ...departmentStore.slice(index + 1),
    ]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): DepartmentMaster | undefined {
    const index = departmentStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: DepartmentMaster = {
      ...departmentStore[index],
      status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    departmentStore = [
      ...departmentStore.slice(0, index),
      updated,
      ...departmentStore.slice(index + 1),
    ]
    return updated
  },
}
