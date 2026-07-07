import { SEED_BOOKER_USERS } from '@/shared/data/mockBookerUsers'
import { GLTS_BOOKER_IDS } from '@/pages/customer/data/portalIds'
import { getCustomerActor } from '@/pages/customer/features/shared/utils/customerActor'
import { BUSINESS_WORKSPACE_ID, loadSession } from '@/shared/auth/session'
import { adminManagementService } from '@/shared/services/adminManagementService'
import type {
  BookerUser,
  BookerUserFormData,
  BookerUserListFilters,
} from '@/shared/types/bookerUser'
import type { ManagedUserActivity, ManagedUserDeleteResult, ManagedUserStatus } from '@/shared/types/managedUser'
import {
  formatCredentialEmailPayload,
  generateTemporaryPassword,
} from '@/shared/utils/corporateAccountValidation'

export interface BookerCreateOptions {
  corporateAccountId?: string
  companyName?: string
  createdBy?: string
  createdById?: string
}

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

function resolveBookerCompanyName(): string {
  const session = loadSession()
  const fromSession = session?.companyName?.trim()
  if (fromSession && fromSession !== BUSINESS_WORKSPACE_ID) return fromSession
  return 'Apex Marine Logistics'
}

function normalizeAdditionalEmails(emails: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of emails) {
    const normalized = raw.trim().toLowerCase()
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    result.push(normalized)
  }
  return result
}

function formToBooker(data: BookerUserFormData, companyName: string) {
  return {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    additionalEmails: normalizeAdditionalEmails(data.additionalEmails),
    companyName: companyName.trim() || resolveBookerCompanyName(),
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
    const { status = 'all', location = 'all', createdBy = 'all', query, scopedToAdminId, corporateAccountId } = filters
    const q = normalizeQuery(query)
    let rows = [...bookerStore]

    if (scopedToAdminId) {
      rows = rows.filter(row => row.createdById === scopedToAdminId)
    }

    if (corporateAccountId) {
      rows = rows.filter(row => row.corporateAccountId === corporateAccountId)
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
          row.mobile.includes(q) ||
          (row.additionalEmails ?? []).some(email => email.toLowerCase().includes(q)),
      )
    }

    return rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  getById(id: string): BookerUser | undefined {
    return bookerStore.find(row => row.id === id)
  },

  isEmailTaken(email: string, excludeId?: string): boolean {
    const normalized = email.trim().toLowerCase()
    if (!normalized) return false
    return bookerStore.some(row => {
      if (row.id === excludeId) return false
      if (row.email === normalized) return true
      return (row.additionalEmails ?? []).includes(normalized)
    })
  },

  create(data: BookerUserFormData, options: BookerCreateOptions = {}): BookerUser {
    const timestamp = nowIso()
    const creator = options.createdBy && options.createdById
      ? { createdBy: options.createdBy, createdById: options.createdById }
      : resolveCreatorIds()
    const companyName = options.companyName?.trim() || resolveBookerCompanyName()
    const inviteDetail = data.sendInviteEmail
      ? `${data.fullName.trim()} invited via email.`
      : `${data.fullName.trim()} added without invite email.`
    const record: BookerUser = {
      id: generateBookerId(),
      ...formToBooker(data, companyName),
      corporateAccountId: options.corporateAccountId,
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
      ...formToBooker(data, bookerStore[index].companyName),
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
    const payload = this.sendLoginEmail(id)
    if (!payload) return undefined
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

  sendLoginEmail(id: string): ReturnType<typeof formatCredentialEmailPayload> | undefined {
    const existing = bookerStore.find(row => row.id === id)
    if (!existing || existing.status !== 'active') return undefined

    const password = existing.temporaryPassword ?? generateTemporaryPassword()
    const index = bookerStore.findIndex(row => row.id === id)
    const timestamp = nowIso()
    const updated: BookerUser = {
      ...existing,
      temporaryPassword: password,
      credentialsSentAt: timestamp,
      updatedAt: timestamp,
      activities: [
        makeActivity('Credentials sent', `Login email sent to ${existing.email}`),
        ...existing.activities,
      ],
    }
    bookerStore = [...bookerStore.slice(0, index), updated, ...bookerStore.slice(index + 1)]
    return formatCredentialEmailPayload(existing.email, password)
  },

  changePassword(
    id: string,
    password?: string,
  ): ReturnType<typeof formatCredentialEmailPayload> | undefined {
    const existing = bookerStore.find(row => row.id === id)
    if (!existing) return undefined

    const nextPassword = password?.trim() || generateTemporaryPassword()
    const index = bookerStore.findIndex(row => row.id === id)
    const timestamp = nowIso()
    const updated: BookerUser = {
      ...existing,
      temporaryPassword: nextPassword,
      credentialsSentAt: timestamp,
      updatedAt: timestamp,
      activities: [
        makeActivity('Password updated', `Password reset for ${existing.email}`),
        ...existing.activities,
      ],
    }
    bookerStore = [...bookerStore.slice(0, index), updated, ...bookerStore.slice(index + 1)]
    return formatCredentialEmailPayload(existing.email, nextPassword)
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
