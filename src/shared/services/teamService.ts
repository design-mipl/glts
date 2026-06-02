import { SEED_TEAMS } from '@/shared/data/mockTeams'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import type { SelectOption } from '@/shared/types/taxMaster'
import type { TeamMaster, TeamMasterFormData, TeamMasterListFilters } from '@/shared/types/teamMaster'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateTeamId(): string {
  return `team-${Math.floor(1000 + Math.random() * 9000)}`
}

let teamStore: TeamMaster[] = [...SEED_TEAMS]

export const teamService = {
  list(filters: TeamMasterListFilters = {}): TeamMaster[] {
    const { status = 'all' } = filters
    let rows = [...teamStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): TeamMaster | undefined {
    return teamStore.find((row) => row.id === id)
  },

  getByName(name: string, excludeId?: string): TeamMaster | undefined {
    const normalized = name.trim().toLowerCase()
    return teamStore.find(
      (row) =>
        row.name.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  listActiveOptions(): SelectOption[] {
    return teamStore
      .filter((row) => row.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((row) => ({ value: row.id, label: row.name }))
  },

  countUsers(teamId: string): number {
    return adminPortalUserService.listByTeamId(teamId).length
  },

  create(data: TeamMasterFormData): TeamMaster | { error: 'duplicate_name' } {
    if (this.getByName(data.name)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: TeamMaster = {
      id: generateTeamId(),
      name: data.name.trim(),
      description: data.description.trim(),
      status: data.status,
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    teamStore = [record, ...teamStore]
    return record
  },

  update(id: string, data: TeamMasterFormData): TeamMaster | { error: 'duplicate_name' } | undefined {
    const index = teamStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    if (this.getByName(data.name, id)) {
      return { error: 'duplicate_name' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: TeamMaster = {
      ...teamStore[index],
      name: data.name.trim(),
      description: data.description.trim(),
      status: data.status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    teamStore = [...teamStore.slice(0, index), updated, ...teamStore.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: MasterRecordStatus): TeamMaster | undefined {
    const index = teamStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: TeamMaster = {
      ...teamStore[index],
      status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    teamStore = [...teamStore.slice(0, index), updated, ...teamStore.slice(index + 1)]
    return updated
  },
}
