import { SEED_ADMIN_USERS } from '@/shared/data/mockAdminUsers'
import { GLTS_ADMIN_IDS } from '@/pages/customer/data/portalIds'
import { getCustomerActor } from '@/pages/customer/features/shared/utils/customerActor'
import type {
  AdminUser,
  AdminUserFormData,
  AdminUserListFilters,
} from '@/shared/types/adminUser'
import type { ManagedUserActivity, ManagedUserDeleteResult, ManagedUserStatus } from '@/shared/types/managedUser'

function nowIso() {
  return new Date().toISOString()
}

function generateAdminId(): string {
  const suffix = Math.floor(100 + Math.random() * 900)
  return `GLTS-ADM-${suffix}`
}

function generateActivityId(): string {
  return `adm-act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function makeActivity(action: string, detail: string): ManagedUserActivity {
  return {
    id: generateActivityId(),
    timestamp: nowIso(),
    actor: getCustomerActor(),
    action,
    detail,
  }
}

const ADMIN_IN_USE_IDS = new Set<string>([GLTS_ADMIN_IDS.sneha])

let adminStore: AdminUser[] = [...SEED_ADMIN_USERS]

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function formToAdmin(data: AdminUserFormData) {
  return {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    mobile: data.mobile.trim(),
    location: data.location.trim(),
    designation: data.designation.trim(),
    department: data.department.trim(),
    role: 'admin' as const,
    status: data.status,
    notes: data.notes.trim(),
  }
}

export const adminManagementService = {
  list(filters: AdminUserListFilters = {}): AdminUser[] {
    const { status = 'all', location = 'all', query } = filters
    const q = normalizeQuery(query)
    let rows = [...adminStore]

    if (status !== 'all') {
      rows = rows.filter(row => row.status === status)
    }

    if (location !== 'all') {
      rows = rows.filter(row => row.location === location)
    }

    if (q) {
      rows = rows.filter(
        row =>
          row.fullName.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q) ||
          row.mobile.includes(q),
      )
    }

    return rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  getById(id: string): AdminUser | undefined {
    return adminStore.find(row => row.id === id)
  },

  getByEmail(email: string): AdminUser | undefined {
    const normalized = email.trim().toLowerCase()
    return adminStore.find(row => row.email === normalized)
  },

  isEmailTaken(email: string, excludeId?: string): boolean {
    const normalized = email.trim().toLowerCase()
    return adminStore.some(row => row.email === normalized && row.id !== excludeId)
  },

  create(data: AdminUserFormData): AdminUser {
    const timestamp = nowIso()
    const inviteDetail = data.sendInviteEmail
      ? `${data.fullName.trim()} invited via email.`
      : `${data.fullName.trim()} added without invite email.`
    const record: AdminUser = {
      id: generateAdminId(),
      ...formToAdmin(data),
      lastLogin: undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
      activities: [makeActivity('Admin created', inviteDetail)],
      loginActivity: [],
      applicationActivity: [],
    }
    adminStore = [record, ...adminStore]
    return record
  },

  update(id: string, data: AdminUserFormData): AdminUser | undefined {
    const index = adminStore.findIndex(row => row.id === id)
    if (index < 0) return undefined

    const updated: AdminUser = {
      ...adminStore[index],
      ...formToAdmin(data),
      updatedAt: nowIso(),
      activities: [
        makeActivity('Admin updated', `${data.fullName.trim()} details were updated.`),
        ...adminStore[index].activities,
      ],
    }
    adminStore = [...adminStore.slice(0, index), updated, ...adminStore.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: ManagedUserStatus): AdminUser | undefined {
    const existing = adminStore.find(row => row.id === id)
    if (!existing) return undefined
    const label = status === 'active' ? 'activated' : 'inactivated'
    const index = adminStore.findIndex(row => row.id === id)
    const updated: AdminUser = {
      ...existing,
      status,
      updatedAt: nowIso(),
      activities: [
        makeActivity(`Admin ${label}`, `Status changed to ${status}.`),
        ...existing.activities,
      ],
    }
    adminStore = [...adminStore.slice(0, index), updated, ...adminStore.slice(index + 1)]
    return updated
  },

  resendInvite(id: string): AdminUser | undefined {
    const existing = adminStore.find(row => row.id === id)
    if (!existing) return undefined
    const index = adminStore.findIndex(row => row.id === id)
    const updated: AdminUser = {
      ...existing,
      updatedAt: nowIso(),
      activities: [
        makeActivity('Invite resent', `Password reset / invite email sent to ${existing.email}.`),
        ...existing.activities,
      ],
    }
    adminStore = [...adminStore.slice(0, index), updated, ...adminStore.slice(index + 1)]
    return updated
  },

  remove(id: string): ManagedUserDeleteResult {
    const existing = adminStore.find(row => row.id === id)
    if (!existing) return { ok: false, reason: 'not_found' }
    if (this.isAdminInUse(id)) return { ok: false, reason: 'in_use' }
    adminStore = adminStore.filter(row => row.id !== id)
    return { ok: true }
  },

  isAdminInUse(id: string): boolean {
    return ADMIN_IN_USE_IDS.has(id)
  },

  getLocationOptions(): string[] {
    const fromData = new Set(adminStore.map(row => row.location).filter(Boolean))
    return Array.from(fromData).sort()
  },
}
