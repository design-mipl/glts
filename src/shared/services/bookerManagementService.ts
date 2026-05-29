import { SEED_BOOKER_USERS } from '@/shared/data/mockBookerUsers'
import { GLTS_BOOKER_IDS } from '@/pages/customer/data/portalIds'
import { getCustomerActor } from '@/pages/customer/features/shared/utils/customerActor'
import { loadSession } from '@/shared/auth/session'
import { adminManagementService } from '@/shared/services/adminManagementService'
import type {
  BookerUser,
  BookerUserFormData,
  BookerUserListFilters,
} from '@/shared/types/bookerUser'
import type { ManagedUserActivity, ManagedUserDeleteResult, ManagedUserStatus } from '@/shared/types/managedUser'

function nowIso() {
  return new Date().toISOString()
}

function generateBookerId(): string {
  const suffix = Math.floor(100 + Math.random() * 900)
  return `GLTS-BKR-${suffix}`
}

function generateActivityId(): string {
  return `bkr-act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
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

function resolveCreatorIds(): { createdBy: string; createdById: string } {
  const session = loadSession()
  const actor = getCustomerActor()
  if (session?.userRole === 'admin' && session.email) {
    const admin = adminManagementService.getByEmail(session.email)
    if (admin) {
      return { createdBy: admin.fullName, createdById: admin.id }
    }
  }
  return { createdBy: actor, createdById: 'GLTS-SUPER-001' }
}

const BOOKER_IN_USE_IDS = new Set<string>([GLTS_BOOKER_IDS.priya])

let bookerStore: BookerUser[] = [...SEED_BOOKER_USERS]

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function formToBooker(data: BookerUserFormData) {
  return {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    mobile: data.mobile.trim(),
    location: data.location.trim(),
    designation: data.designation.trim(),
    department: data.department.trim(),
    role: 'booker' as const,
    status: data.status,
    notes: data.notes.trim(),
  }
}

export const bookerManagementService = {
  list(filters: BookerUserListFilters = {}): BookerUser[] {
    const { status = 'all', location = 'all', createdBy = 'all', query, scopedToAdminId } = filters
    const q = normalizeQuery(query)
    let rows = [...bookerStore]

    if (scopedToAdminId) {
      rows = rows.filter(row => row.createdById === scopedToAdminId)
    }

    if (status !== 'all') {
      rows = rows.filter(row => row.status === status)
    }

    if (location !== 'all') {
      rows = rows.filter(row => row.location === location)
    }

    if (createdBy !== 'all') {
      rows = rows.filter(row => row.createdBy === createdBy || row.createdById === createdBy)
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

  getById(id: string): BookerUser | undefined {
    return bookerStore.find(row => row.id === id)
  },

  isEmailTaken(email: string, excludeId?: string): boolean {
    const normalized = email.trim().toLowerCase()
    return bookerStore.some(row => row.email === normalized && row.id !== excludeId)
  },

  create(data: BookerUserFormData): BookerUser {
    const timestamp = nowIso()
    const creator = resolveCreatorIds()
    const inviteDetail = data.sendInviteEmail
      ? `${data.fullName.trim()} invited via email.`
      : `${data.fullName.trim()} added without invite email.`
    const record: BookerUser = {
      id: generateBookerId(),
      ...formToBooker(data),
      ...creator,
      lastLogin: undefined,
      applicationCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      activities: [makeActivity('Booker created', inviteDetail)],
      loginActivity: [],
      applicationActivity: [],
    }
    bookerStore = [record, ...bookerStore]
    return record
  },

  update(id: string, data: BookerUserFormData): BookerUser | undefined {
    const index = bookerStore.findIndex(row => row.id === id)
    if (index < 0) return undefined

    const updated: BookerUser = {
      ...bookerStore[index],
      ...formToBooker(data),
      updatedAt: nowIso(),
      activities: [
        makeActivity('Booker updated', `${data.fullName.trim()} details were updated.`),
        ...bookerStore[index].activities,
      ],
    }
    bookerStore = [...bookerStore.slice(0, index), updated, ...bookerStore.slice(index + 1)]
    return updated
  },

  setStatus(id: string, status: ManagedUserStatus): BookerUser | undefined {
    const existing = bookerStore.find(row => row.id === id)
    if (!existing) return undefined
    const label = status === 'active' ? 'activated' : 'inactivated'
    const index = bookerStore.findIndex(row => row.id === id)
    const updated: BookerUser = {
      ...existing,
      status,
      updatedAt: nowIso(),
      activities: [
        makeActivity(`Booker ${label}`, `Status changed to ${status}.`),
        ...existing.activities,
      ],
    }
    bookerStore = [...bookerStore.slice(0, index), updated, ...bookerStore.slice(index + 1)]
    return updated
  },

  resendInvite(id: string): BookerUser | undefined {
    const existing = bookerStore.find(row => row.id === id)
    if (!existing) return undefined
    const index = bookerStore.findIndex(row => row.id === id)
    const updated: BookerUser = {
      ...existing,
      updatedAt: nowIso(),
      activities: [
        makeActivity('Invite resent', `Password reset / invite email sent to ${existing.email}.`),
        ...existing.activities,
      ],
    }
    bookerStore = [...bookerStore.slice(0, index), updated, ...bookerStore.slice(index + 1)]
    return updated
  },

  remove(id: string): ManagedUserDeleteResult {
    const existing = bookerStore.find(row => row.id === id)
    if (!existing) return { ok: false, reason: 'not_found' }
    if (this.isBookerInUse(id)) return { ok: false, reason: 'in_use' }
    bookerStore = bookerStore.filter(row => row.id !== id)
    return { ok: true }
  },

  isBookerInUse(id: string): boolean {
    return BOOKER_IN_USE_IDS.has(id)
  },

  getLocationOptions(): string[] {
    const fromData = new Set(bookerStore.map(row => row.location).filter(Boolean))
    return Array.from(fromData).sort()
  },

  getCreatedByOptions(): string[] {
    const fromData = new Set(bookerStore.map(row => row.createdBy).filter(Boolean))
    return Array.from(fromData).sort()
  },

  listForSession(): BookerUser[] {
    const session = loadSession()
    if (session?.userRole === 'admin' && session.email) {
      const admin = adminManagementService.getByEmail(session.email)
      if (admin) {
        return this.list({ scopedToAdminId: admin.id })
      }
    }
    return this.list()
  },
}
