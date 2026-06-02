import { SEED_ADMIN_PORTAL_USERS } from '@/shared/data/mockAdminPortalUsers'
import type {
  AdminPortalUser,
  AdminPortalUserActivityLog,
  AdminPortalUserBasicFormData,
  AdminPortalUserFormData,
  AdminPortalUserListFilters,
} from '@/shared/types/adminPortalUser'
import type { AdminUserPermissions } from '@/shared/types/adminPermission'
import type { MasterRecordStatus } from '@/shared/types/masterCommon'
import { createEmptyPermissions, superAdminFullPermissions } from '@/shared/utils/adminPermissionEngine'
import { getMasterActor } from '@/shared/utils/masterActor'

function nowIso() {
  return new Date().toISOString()
}

function generateUserId(): string {
  return `user-${Math.floor(10000 + Math.random() * 90000)}`
}

function generateLogId(): string {
  return `log-${Math.floor(100000 + Math.random() * 900000)}`
}

function clonePermissions(permissions: AdminPortalUser['permissions']) {
  return JSON.parse(JSON.stringify(permissions)) as AdminPortalUser['permissions']
}

let userStore: AdminPortalUser[] = JSON.parse(JSON.stringify(SEED_ADMIN_PORTAL_USERS)) as AdminPortalUser[]

function appendLog(
  user: AdminPortalUser,
  log: Omit<AdminPortalUserActivityLog, 'id'>,
): AdminPortalUserActivityLog {
  const entry: AdminPortalUserActivityLog = { ...log, id: generateLogId() }
  user.activityLogs = [entry, ...user.activityLogs]
  return entry
}

function permissionsEqual(
  a: AdminPortalUser['permissions'],
  b: AdminPortalUser['permissions'],
): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const adminPortalUserService = {
  list(filters: AdminPortalUserListFilters = {}): AdminPortalUser[] {
    const { status = 'all', teamId = 'all', designation = 'all' } = filters
    let rows = [...userStore]
    if (status !== 'all') {
      rows = rows.filter((row) => row.status === status)
    }
    if (teamId !== 'all') {
      rows = rows.filter((row) => row.teamId === teamId)
    }
    if (designation !== 'all') {
      rows = rows.filter((row) => row.designation === designation)
    }
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  getById(id: string): AdminPortalUser | undefined {
    const row = userStore.find((r) => r.id === id)
    return row ? (JSON.parse(JSON.stringify(row)) as AdminPortalUser) : undefined
  },

  getByEmail(email: string, excludeId?: string): AdminPortalUser | undefined {
    const normalized = email.trim().toLowerCase()
    return userStore.find(
      (row) =>
        row.email.toLowerCase() === normalized && (excludeId ? row.id !== excludeId : true),
    )
  },

  getSuperAdmin(): AdminPortalUser | undefined {
    return userStore.find((row) => row.isSuperAdmin)
  },

  listByTeamId(teamId: string): AdminPortalUser[] {
    return userStore
      .filter((row) => row.teamId === teamId)
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
  },

  listDesignations(): string[] {
    const set = new Set(userStore.map((row) => row.designation).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  },

  createBasicProfile(
    data: AdminPortalUserBasicFormData,
  ): AdminPortalUser | { error: 'duplicate_email' } {
    if (this.getByEmail(data.email)) {
      return { error: 'duplicate_email' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: AdminPortalUser = {
      id: generateUserId(),
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      employeeId: data.employeeId.trim(),
      teamId: data.teamId,
      designation: data.designation.trim(),
      roleTemplateId: data.roleTemplateId || null,
      profilePhotoUrl: data.profilePhotoUrl || null,
      status: data.status,
      lastLoginAt: null,
      isSuperAdmin: false,
      passwordSetupType: 'auto_email_invite',
      permissions: createEmptyPermissions(),
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
      activityLogs: [],
    }
    appendLog(record, {
      activity: 'User account created',
      activityType: 'user_update',
      doneBy: actor,
      timestamp,
    })
    userStore = [record, ...userStore]
    return JSON.parse(JSON.stringify(record)) as AdminPortalUser
  },

  updateBasicProfile(
    id: string,
    data: AdminPortalUserFormData,
  ): AdminPortalUser | { error: 'duplicate_email' } | undefined {
    const index = userStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const existing = userStore[index]
    if (this.getByEmail(data.email, id)) {
      return { error: 'duplicate_email' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: AdminPortalUser = {
      ...existing,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      employeeId: data.employeeId.trim(),
      teamId: data.teamId,
      designation: data.designation.trim(),
      roleTemplateId: data.roleTemplateId || null,
      profilePhotoUrl: data.profilePhotoUrl || null,
      status: data.status,
      passwordSetupType: data.passwordSetupType,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    appendLog(updated, {
      activity: 'User profile updated',
      activityType: 'user_update',
      doneBy: actor,
      timestamp,
    })
    userStore = [...userStore.slice(0, index), updated, ...userStore.slice(index + 1)]
    return JSON.parse(JSON.stringify(updated)) as AdminPortalUser
  },

  updatePermissions(
    id: string,
    permissions: AdminUserPermissions,
  ): AdminPortalUser | { error: 'super_admin_readonly' } | undefined {
    const index = userStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const existing = userStore[index]
    if (existing.isSuperAdmin) {
      return { error: 'super_admin_readonly' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const permissionsChanged = !permissionsEqual(existing.permissions, permissions)
    const updated: AdminPortalUser = {
      ...existing,
      permissions: clonePermissions(permissions),
      updatedBy: actor,
      updatedAt: timestamp,
    }
    if (permissionsChanged) {
      appendLog(updated, {
        activity: 'User permissions updated',
        activityType: 'permission_change',
        doneBy: actor,
        timestamp,
      })
    }
    userStore = [...userStore.slice(0, index), updated, ...userStore.slice(index + 1)]
    return JSON.parse(JSON.stringify(updated)) as AdminPortalUser
  },

  create(
    data: AdminPortalUserFormData,
  ): AdminPortalUser | { error: 'duplicate_email' | 'super_admin_exists' } {
    if (this.getByEmail(data.email)) {
      return { error: 'duplicate_email' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const record: AdminPortalUser = {
      id: generateUserId(),
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      employeeId: data.employeeId.trim(),
      teamId: data.teamId,
      designation: data.designation.trim(),
      roleTemplateId: data.roleTemplateId || null,
      profilePhotoUrl: data.profilePhotoUrl || null,
      status: data.status,
      lastLoginAt: null,
      isSuperAdmin: false,
      passwordSetupType: data.passwordSetupType,
      permissions: clonePermissions(data.permissions),
      createdBy: actor,
      updatedBy: actor,
      createdAt: timestamp,
      updatedAt: timestamp,
      activityLogs: [],
    }
    appendLog(record, {
      activity: 'User account created',
      activityType: 'user_update',
      doneBy: actor,
      timestamp,
    })
    userStore = [record, ...userStore]
    return JSON.parse(JSON.stringify(record)) as AdminPortalUser
  },

  update(
    id: string,
    data: AdminPortalUserFormData,
  ): AdminPortalUser | { error: 'duplicate_email' } | undefined {
    const index = userStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const existing = userStore[index]
    if (this.getByEmail(data.email, id)) {
      return { error: 'duplicate_email' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const permissionsChanged =
      !existing.isSuperAdmin && !permissionsEqual(existing.permissions, data.permissions)

    const updated: AdminPortalUser = {
      ...existing,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      employeeId: data.employeeId.trim(),
      teamId: data.teamId,
      designation: data.designation.trim(),
      roleTemplateId: data.roleTemplateId || null,
      profilePhotoUrl: data.profilePhotoUrl || null,
      status: data.status,
      passwordSetupType: data.passwordSetupType,
      permissions: existing.isSuperAdmin
        ? superAdminFullPermissions()
        : clonePermissions(data.permissions),
      updatedBy: actor,
      updatedAt: timestamp,
    }

    if (permissionsChanged) {
      appendLog(updated, {
        activity: 'User permissions updated',
        activityType: 'permission_change',
        doneBy: actor,
        timestamp,
      })
    } else {
      appendLog(updated, {
        activity: 'User profile updated',
        activityType: 'user_update',
        doneBy: actor,
        timestamp,
      })
    }

    userStore = [...userStore.slice(0, index), updated, ...userStore.slice(index + 1)]
    return JSON.parse(JSON.stringify(updated)) as AdminPortalUser
  },

  setStatus(
    id: string,
    status: MasterRecordStatus,
    options?: { confirmSuperAdmin?: boolean },
  ): AdminPortalUser | { error: 'super_admin_confirm_required' } | undefined {
    const index = userStore.findIndex((row) => row.id === id)
    if (index < 0) return undefined
    const existing = userStore[index]
    if (existing.isSuperAdmin && status === 'inactive' && !options?.confirmSuperAdmin) {
      return { error: 'super_admin_confirm_required' }
    }
    const actor = getMasterActor()
    const timestamp = nowIso()
    const updated: AdminPortalUser = {
      ...existing,
      status,
      updatedBy: actor,
      updatedAt: timestamp,
    }
    appendLog(updated, {
      activity: status === 'active' ? 'User activated' : 'User deactivated',
      activityType: 'status_change',
      doneBy: actor,
      timestamp,
    })
    userStore = [...userStore.slice(0, index), updated, ...userStore.slice(index + 1)]
    return JSON.parse(JSON.stringify(updated)) as AdminPortalUser
  },

  resetPassword(id: string): { success: true } | undefined {
    const user = userStore.find((row) => row.id === id)
    if (!user) return undefined
    const actor = getMasterActor()
    const timestamp = nowIso()
    appendLog(user, {
      activity: 'Password reset initiated',
      activityType: 'password_reset',
      doneBy: actor,
      timestamp,
    })
    return { success: true }
  },

  recordLogin(id: string): void {
    const index = userStore.findIndex((row) => row.id === id)
    if (index < 0) return
    const user = userStore[index]
    const timestamp = nowIso()
    user.lastLoginAt = timestamp
    appendLog(user, {
      activity: 'Logged in to Admin Portal',
      activityType: 'login',
      doneBy: user.fullName,
      timestamp,
    })
  },

  getEmptyPermissions() {
    return createEmptyPermissions()
  },
}

/** @deprecated Use adminPortalUserService — kept as alias during migration */
export const adminUserService = adminPortalUserService
