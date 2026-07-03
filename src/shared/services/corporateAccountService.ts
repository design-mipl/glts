import {
  getMockCorporateAccounts,
  setMockCorporateAccountsStore,
} from '@/shared/data/mockCorporateAccounts'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import type {
  CorporateAccount,
  CorporateAccountActivity,
  CorporateAccountFormData,
  CorporateAccountListFilters,
  CorporateAdminUser,
} from '@/shared/types/corporateAccount'
import { entityMasterService } from '@/shared/services/entityMasterService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import {
  accountTypeFromWorkflow,
  isSelectableCorporateWorkflowType,
  workflowConfigFromType,
} from '@/shared/utils/corporateAccountWorkflow'

const ADMIN_ACTOR = 'Admin User'

function nowIso() {
  return new Date().toISOString()
}

function getStore(): CorporateAccount[] {
  return getMockCorporateAccounts()
}

function persist(rows: CorporateAccount[]) {
  setMockCorporateAccountsStore(rows)
}

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function generateAccountId(): string {
  return `CA-${Math.floor(100 + Math.random() * 900)}`
}

function generateAdminId(): string {
  return `adm-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function generateActivityId(): string {
  return `ca-act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function normalizeAdmin(admin: CorporateAdminUser): CorporateAdminUser {
  return { ...admin, accessStatus: admin.accessStatus ?? 'active' }
}

function resolveEntityIds(entityIds: string[]): string[] {
  return entityIds.filter((id) => entityMasterService.getById(id))
}

function resolveVesselIds(vesselIds: string[]): string[] {
  return vesselIds.filter((id) => vesselMasterService.getById(id))
}

function sanitizeAccountLinks(account: CorporateAccount): CorporateAccount {
  return {
    ...account,
    entityIds: resolveEntityIds(account.entityIds),
    vesselIds: resolveVesselIds(account.vesselIds),
  }
}

function normalizeAccount(account: CorporateAccount): CorporateAccount {
  const linked = sanitizeAccountLinks(account)
  return {
    ...linked,
    superAdmin: linked.superAdmin ? normalizeAdmin(linked.superAdmin) : undefined,
    admins: linked.admins.map(normalizeAdmin),
  }
}

function updateAdminInAccount(
  account: CorporateAccount,
  adminId: string,
  patch: Partial<CorporateAdminUser>,
): CorporateAccount {
  if (account.superAdmin?.id === adminId) {
    return { ...account, superAdmin: { ...account.superAdmin, ...patch } }
  }
  return {
    ...account,
    admins: account.admins.map((admin) => (admin.id === adminId ? { ...admin, ...patch } : admin)),
  }
}

function makeActivity(action: string, detail: string): CorporateAccountActivity {
  return {
    id: generateActivityId(),
    timestamp: nowIso(),
    actor: ADMIN_ACTOR,
    action,
    detail,
  }
}

function formToAccount(data: CorporateAccountFormData): Omit<CorporateAccount, 'id' | 'createdAt' | 'updatedAt' | 'activities'> {
  const superAdmin: CorporateAdminUser | undefined = data.superAdmin.fullName.trim()
    ? { ...data.superAdmin, id: generateAdminId(), accessStatus: 'active' }
    : undefined
  return {
    companyId: data.companyId,
    companyName: data.companyName,
    agreementId: data.agreementId,
    workflowType: data.workflowType,
    accountType: data.accountType,
    branch: data.branch,
    portalStatus: data.portalActivation.portalStatus,
    workflowConfig: data.workflowConfig,
    superAdmin,
    admins: data.admins.map((a) => ({ ...a, id: generateAdminId(), accessStatus: 'active' as const })),
    assignedTeamId: data.assignedTeamId || undefined,
    assignedUserIds: [...data.assignedUserIds],
    teamLeaderTeamId: data.teamLeaderTeamId || undefined,
    teamLeaderUserIds: [...data.teamLeaderUserIds],
    entityIds: resolveEntityIds(data.entityIds),
    vesselIds: resolveVesselIds(data.vesselIds),
    portalActivation: data.portalActivation,
  }
}

export const corporateAccountService = {
  list(filters: CorporateAccountListFilters = {}): CorporateAccount[] {
    const { status = 'all', workflowType, accountType, branch, query } = filters
    const q = normalizeQuery(query)
    let rows = [...getStore()]

    if (status !== 'all') rows = rows.filter((r) => r.portalStatus === status)
    if (workflowType) rows = rows.filter((r) => r.workflowType === workflowType)
    if (accountType) rows = rows.filter((r) => r.accountType === accountType)
    if (branch) rows = rows.filter((r) => r.branch === branch)

    if (q) {
      rows = rows.filter(
        (r) =>
          r.companyName.toLowerCase().includes(q) ||
          r.companyId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      )
    }

    return rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(normalizeAccount)
  },

  getById(id: string): CorporateAccount | undefined {
    const account = getStore().find((r) => r.id === id)
    return account ? normalizeAccount(account) : undefined
  },

  getByAgreementId(agreementId: string): CorporateAccount | undefined {
    return getStore().find((r) => r.agreementId === agreementId)
  },

  accountToFormData(account: CorporateAccount): CorporateAccountFormData {
    const assignedUserIds = [...(account.assignedUserIds ?? [])]
    const assignedTeamId =
      account.assignedTeamId ??
      (assignedUserIds.length > 0
        ? adminPortalUserService.getById(assignedUserIds[0])?.teamId ?? ''
        : '')
    const teamLeaderUserIds = [...(account.teamLeaderUserIds ?? [])]
    const teamLeaderTeamId =
      account.teamLeaderTeamId ??
      (teamLeaderUserIds.length > 0
        ? adminPortalUserService.getById(teamLeaderUserIds[0])?.teamId ?? ''
        : '')

    return {
      agreementId: account.agreementId,
      companyId: account.companyId,
      companyName: account.companyName,
      workflowType: account.workflowType,
      accountType: account.accountType,
      branch: account.branch,
      workflowConfig: { ...account.workflowConfig },
      superAdmin: account.superAdmin
        ? {
            fullName: account.superAdmin.fullName,
            phoneNumber: account.superAdmin.phoneNumber,
            emailAddress: account.superAdmin.emailAddress,
            role: account.superAdmin.role,
            temporaryPassword: account.superAdmin.temporaryPassword,
          }
        : { fullName: '', phoneNumber: '', emailAddress: '', role: 'super_admin' },
      admins: account.admins.map((a) => ({
        fullName: a.fullName,
        phoneNumber: a.phoneNumber,
        emailAddress: a.emailAddress,
        role: a.role,
        temporaryPassword: a.temporaryPassword,
      })),
      assignedTeamId,
      assignedUserIds,
      teamLeaderTeamId,
      teamLeaderUserIds,
      entityIds: [...account.entityIds],
      vesselIds: [...account.vesselIds],
      portalActivation: { ...account.portalActivation },
    }
  },

  hydrateFromAgreement(agreementId: string): CorporateAccountFormData | undefined {
    const agreement = commercialAgreementService.getById(agreementId)
    if (!agreement) return undefined
    const inheritedWorkflowType = isSelectableCorporateWorkflowType(agreement.workflowType)
      ? agreement.workflowType
      : ''
    return {
      agreementId: agreement.id,
      companyId: agreement.companyId,
      companyName: agreement.companyName,
      workflowType: inheritedWorkflowType,
      accountType: inheritedWorkflowType ? accountTypeFromWorkflow(inheritedWorkflowType) : 'corporate',
      branch: '',
      workflowConfig: inheritedWorkflowType
        ? workflowConfigFromType(inheritedWorkflowType)
        : {
            marineWorkflowEnabled: false,
            bulkUploadEnabled: false,
            retailWorkflowEnabled: false,
            corporateWorkflowEnabled: false,
          },
      superAdmin: { fullName: '', phoneNumber: '', emailAddress: '', role: 'super_admin' },
      admins: [],
      assignedTeamId: '',
      assignedUserIds: [],
      teamLeaderTeamId: '',
      teamLeaderUserIds: [],
      entityIds: [],
      vesselIds: [],
      portalActivation: {
        portalStatus: 'draft',
        loginAccess: true,
        applicationCreationAccess: true,
        bulkUploadAccess: false,
        invoiceVisibility: true,
        trackingVisibility: true,
      },
    }
  },

  saveDraft(existingId: string | undefined, data: CorporateAccountFormData): CorporateAccount {
    const store = getStore()
    const ts = nowIso()

    if (existingId) {
      const idx = store.findIndex((r) => r.id === existingId)
      if (idx >= 0) {
        const existing = store[idx]
        const payload = formToAccount(data)
        const updated: CorporateAccount = {
          ...existing,
          ...payload,
          superAdmin: payload.superAdmin
            ? { ...payload.superAdmin, id: existing.superAdmin?.id ?? payload.superAdmin.id }
            : undefined,
          admins: data.admins.map((a, i) => ({
            ...a,
            id: existing.admins[i]?.id ?? generateAdminId(),
          })),
          portalStatus: 'draft',
          updatedAt: ts,
          activities: [makeActivity('Draft saved', 'Corporate account draft updated'), ...existing.activities],
        }
        const next = [...store]
        next[idx] = updated
        persist(next)
        return updated
      }
    }

    const payload = formToAccount(data)
    const record: CorporateAccount = {
      id: generateAccountId(),
      ...payload,
      portalStatus: 'draft',
      createdAt: ts,
      updatedAt: ts,
      activities: [makeActivity('Created', `Corporate account draft for ${data.companyName}`)],
    }
    persist([record, ...store])
    return record
  },

  activate(id: string, data: CorporateAccountFormData): { ok: true; record: CorporateAccount } | { ok: false; issues: string[] } {
    const validation = validateForActivation(data)
    if (!validation.ok) return { ok: false, issues: validation.issues }

    const draft = this.saveDraft(id, {
      ...data,
      portalActivation: { ...data.portalActivation, portalStatus: 'active' },
    })
    const store = getStore()
    const idx = store.findIndex((r) => r.id === draft.id)
    const updated: CorporateAccount = {
      ...store[idx],
      portalStatus: 'active',
      portalActivation: { ...data.portalActivation, portalStatus: 'active' },
      activatedAt: nowIso(),
      updatedAt: nowIso(),
      activities: [makeActivity('Activated', 'Corporate account activated'), ...store[idx].activities],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    if (data.agreementId) {
      commercialAgreementService.activateFromCorporateAccount(data.agreementId)
    }
    return { ok: true, record: updated }
  },

  deactivate(id: string): CorporateAccount | undefined {
    const store = getStore()
    const idx = store.findIndex((r) => r.id === id)
    if (idx < 0) return undefined
    const updated: CorporateAccount = {
      ...store[idx],
      portalStatus: 'inactive',
      portalActivation: { ...store[idx].portalActivation, portalStatus: 'inactive' },
      updatedAt: nowIso(),
      activities: [makeActivity('Deactivated', 'Corporate account deactivated'), ...store[idx].activities],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  sendLoginEmail(accountId: string, adminId: string): ReturnType<typeof formatCredentialEmailPayload> | undefined {
    const account = this.getById(accountId)
    if (!account) return undefined
    const allAdmins = [account.superAdmin, ...account.admins].filter(Boolean) as CorporateAdminUser[]
    const admin = allAdmins.find((a) => a.id === adminId)
    if (!admin) return undefined

    const password = admin.temporaryPassword ?? generateTemporaryPassword()
    const store = getStore()
    const idx = store.findIndex((r) => r.id === accountId)
    if (idx >= 0) {
      const updatedAdmins = store[idx].admins.map((a) =>
        a.id === adminId ? { ...a, temporaryPassword: password, credentialsSentAt: nowIso() } : a,
      )
      const updatedSuper =
        store[idx].superAdmin?.id === adminId
          ? { ...store[idx].superAdmin!, temporaryPassword: password, credentialsSentAt: nowIso() }
          : store[idx].superAdmin
      const next = [...store]
      next[idx] = {
        ...store[idx],
        superAdmin: updatedSuper,
        admins: updatedAdmins,
        updatedAt: nowIso(),
        activities: [makeActivity('Credentials sent', `Login email sent to ${admin.emailAddress}`), ...store[idx].activities],
      }
      persist(next)
    }
    return formatCredentialEmailPayload(admin.emailAddress, password)
  },

  resendCredentials(accountId: string, adminId: string) {
    return this.sendLoginEmail(accountId, adminId)
  },

  resetPassword(accountId: string, adminId: string) {
    return this.changeAdminPassword(accountId, adminId)
  },

  changeAdminPassword(
    accountId: string,
    adminId: string,
    password?: string,
  ): ReturnType<typeof formatCredentialEmailPayload> | undefined {
    const account = this.getById(accountId)
    if (!account) return undefined
    const allAdmins = [account.superAdmin, ...account.admins].filter(Boolean) as CorporateAdminUser[]
    const admin = allAdmins.find((a) => a.id === adminId)
    if (!admin) return undefined

    const nextPassword = password?.trim() || generateTemporaryPassword()
    const store = getStore()
    const idx = store.findIndex((r) => r.id === accountId)
    if (idx < 0) return undefined

    const updatedAccount = updateAdminInAccount(store[idx], adminId, {
      temporaryPassword: nextPassword,
      credentialsSentAt: nowIso(),
    })
    const next = [...store]
    next[idx] = {
      ...updatedAccount,
      updatedAt: nowIso(),
      activities: [
        makeActivity('Password updated', `Password reset for ${admin.emailAddress}`),
        ...store[idx].activities,
      ],
    }
    persist(next)
    return formatCredentialEmailPayload(admin.emailAddress, nextPassword)
  },

  setAdminAccessStatus(
    accountId: string,
    adminId: string,
    accessStatus: CorporateAdminUser['accessStatus'],
  ): CorporateAccount | undefined {
    const account = this.getById(accountId)
    if (!account) return undefined
    const allAdmins = [account.superAdmin, ...account.admins].filter(Boolean) as CorporateAdminUser[]
    const admin = allAdmins.find((a) => a.id === adminId)
    if (!admin) return undefined

    const store = getStore()
    const idx = store.findIndex((r) => r.id === accountId)
    if (idx < 0) return undefined

    const updatedAccount = updateAdminInAccount(store[idx], adminId, { accessStatus })
    const next = [...store]
    next[idx] = {
      ...updatedAccount,
      updatedAt: nowIso(),
      activities: [
        makeActivity(
          accessStatus === 'active' ? 'User activated' : 'User deactivated',
          `${admin.fullName} (${admin.emailAddress}) portal access ${accessStatus === 'active' ? 'enabled' : 'disabled'}`,
        ),
        ...store[idx].activities,
      ],
    }
    persist(next)
    return normalizeAccount(next[idx])
  },

  addEntityId(accountId: string, entityId: string): void {
    const store = getStore()
    const idx = store.findIndex((r) => r.id === accountId)
    if (idx < 0) return
    const entityIds = store[idx].entityIds.includes(entityId)
      ? store[idx].entityIds
      : [...store[idx].entityIds, entityId]
    const next = [...store]
    next[idx] = { ...store[idx], entityIds, updatedAt: nowIso() }
    persist(next)
  },

  addVesselId(accountId: string, vesselId: string): void {
    const store = getStore()
    const idx = store.findIndex((r) => r.id === accountId)
    if (idx < 0) return
    const vesselIds = store[idx].vesselIds.includes(vesselId)
      ? store[idx].vesselIds
      : [...store[idx].vesselIds, vesselId]
    const next = [...store]
    next[idx] = { ...store[idx], vesselIds, updatedAt: nowIso() }
    persist(next)
  },

  getCounts(account: CorporateAccount) {
    const entityIds = resolveEntityIds(account.entityIds)
    const vesselIds = resolveVesselIds(account.vesselIds)
    return {
      totalAdmins: account.admins.length + (account.superAdmin ? 1 : 0),
      totalEntities: entityIds.length,
      totalVessels: vesselIds.length,
    }
  },
}
