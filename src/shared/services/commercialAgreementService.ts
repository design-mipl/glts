import {
  getMockCommercialAgreements,
  setMockCommercialAgreementsStore,
} from '@/shared/data/mockCommercialAgreements'
import { companyMasterService } from '@/shared/services/companyMasterService'
import { getMockCorporateAccounts } from '@/shared/data/mockCorporateAccounts'
import { quotationReferenceService } from '@/shared/services/quotationReferenceService'
import { quotationService } from '@/shared/services/quotationService'
import type {
  AgreementActivity,
  CommercialAgreement,
  CommercialAgreementFormData,
  CommercialAgreementListFilters,
} from '@/shared/types/commercialAgreement'
import {
  buildDefaultAgreementDocuments,
  createEmptyAgreementFormData,
  normalizeLegacyAgreement,
  validateForApproval,
} from '@/shared/utils/commercialAgreementValidation'
import {
  syncFinanceContactsFromSources,
} from '@/shared/utils/agreementFinanceContacts'

const ADMIN_ACTOR = 'Admin User'

function nowIso() {
  return new Date().toISOString()
}

function getStore(): CommercialAgreement[] {
  return getMockCommercialAgreements().map(normalizeLegacyAgreement)
}

function persist(rows: CommercialAgreement[]) {
  setMockCommercialAgreementsStore(rows)
}

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function generateAgreementId(): string {
  const year = new Date().getFullYear()
  const suffix = Math.floor(100 + Math.random() * 900)
  return `AGR-${year}-${suffix}`
}

function generateInternalId(): string {
  return `AGR-${Math.floor(100 + Math.random() * 900)}`
}

function generateActivityId(): string {
  return `agr-act-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function makeActivity(action: string, detail: string): AgreementActivity {
  return {
    id: generateActivityId(),
    timestamp: nowIso(),
    actor: ADMIN_ACTOR,
    action,
    detail,
  }
}

function resolveCompany(data: CommercialAgreementFormData): { companyId: string; companyName: string } {
  if (data.customerSourceMode === 'existing' && data.existingCompanyId) {
    const company = companyMasterService.getById(data.existingCompanyId)
    if (company) return { companyId: company.id, companyName: company.companyName }
  }
  if (data.customerSourceMode === 'quotation' && data.referenceQuotationId) {
    const quotation = quotationReferenceService.getById(data.referenceQuotationId)
    if (quotation?.companyId) {
      const company = companyMasterService.getById(quotation.companyId)
      if (company) return { companyId: company.id, companyName: company.companyName }
    }
  }
  const created = companyMasterService.create(data.company)
  return { companyId: created.id, companyName: created.companyName }
}

function formToAgreement(
  data: CommercialAgreementFormData,
  companyId: string,
  companyName: string,
): Omit<CommercialAgreement, 'id' | 'agreementId' | 'createdAt' | 'updatedAt' | 'activities'> {
  const synced = syncFinanceContactsFromSources(data)
  return {
    companyId,
    companyName,
    customerSourceMode: synced.customerSourceMode,
    referenceQuotationId: synced.referenceQuotationId || undefined,
    parentCompanyId: synced.parentCompanyId || undefined,
    agreementType: synced.agreementType,
    workflowType: synced.workflowType,
    billingType: synced.billingType,
    status: 'draft',
    startDate: synced.startDate,
    endDate: synced.endDate,
    entities: synced.entities,
    pricingMatrix: synced.pricingMatrix,
    miscellaneousCosts: synced.miscellaneousCosts,
    billingConfig: synced.billingConfig,
    financeContacts: synced.financeContacts,
    financeContactPersons: synced.financeContactPersons,
    selectedFinanceContactIds: synced.selectedFinanceContactIds,
    documents: synced.documents,
  }
}

function matchesExtendedSearch(record: CommercialAgreement, q: string): boolean {
  const company = companyMasterService.getById(record.companyId)
  const gstMatch = company?.gstNumber.toLowerCase().includes(q)
  const contactMatch = company?.contactPersonName.toLowerCase().includes(q)
  const entityMatch = record.entities.some(
    (e) =>
      e.entityName.toLowerCase().includes(q) ||
      e.contactPerson.toLowerCase().includes(q) ||
      e.gstNumber.toLowerCase().includes(q),
  )
  return (
    record.agreementId.toLowerCase().includes(q) ||
    record.companyName.toLowerCase().includes(q) ||
    record.id.toLowerCase().includes(q) ||
    Boolean(gstMatch) ||
    Boolean(contactMatch) ||
    entityMatch
  )
}

export const commercialAgreementService = {
  list(filters: CommercialAgreementListFilters = {}): CommercialAgreement[] {
    const {
      status = 'all',
      agreementType = 'all',
      workflowType = 'all',
      billingType = 'all',
      companyId,
      entityName,
      dateFrom,
      dateTo,
      query,
    } = filters
    const q = normalizeQuery(query)
    let rows = [...getStore()]

    if (status !== 'all') rows = rows.filter((r) => r.status === status)
    if (agreementType !== 'all') rows = rows.filter((r) => r.agreementType === agreementType)
    if (workflowType !== 'all') rows = rows.filter((r) => r.workflowType === workflowType)
    if (billingType !== 'all') rows = rows.filter((r) => r.billingType === billingType)
    if (companyId) rows = rows.filter((r) => r.companyId === companyId)

    if (entityName) {
      const entityQ = entityName.trim().toLowerCase()
      rows = rows.filter((r) =>
        r.entities.some((e) => e.entityName.toLowerCase().includes(entityQ)),
      )
    }

    if (dateFrom) {
      rows = rows.filter((r) => r.updatedAt.slice(0, 10) >= dateFrom)
    }
    if (dateTo) {
      rows = rows.filter((r) => r.updatedAt.slice(0, 10) <= dateTo)
    }

    if (q) {
      rows = rows.filter((r) => matchesExtendedSearch(r, q))
    }

    return rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  getById(id: string): CommercialAgreement | undefined {
    const record = getStore().find((r) => r.id === id)
    return record ? normalizeLegacyAgreement(record) : undefined
  },

  agreementToFormData(agreement: CommercialAgreement): CommercialAgreementFormData {
    const normalized = normalizeLegacyAgreement(agreement)
    const company = companyMasterService.getById(normalized.companyId)
    const base: CommercialAgreementFormData = {
      customerSourceMode: normalized.customerSourceMode,
      referenceQuotationId: normalized.referenceQuotationId ?? '',
      existingCompanyId: normalized.companyId,
      parentCompanyId: normalized.parentCompanyId ?? '',
      company: company
        ? {
            companyName: company.companyName,
            companyType: company.companyType,
            industryType: company.industryType,
            contactPersonName: company.contactPersonName,
            contactNumber: company.contactNumber,
            emailAddress: company.emailAddress,
            companyAddress: company.companyAddress,
            billingEntityName: company.billingEntityName,
            billingAddress: company.billingAddress,
            gstNumber: company.gstNumber,
            panNumber: company.panNumber,
          }
        : createEmptyAgreementFormData().company,
      agreementType: normalized.agreementType,
      workflowType: normalized.workflowType,
      billingType: normalized.billingType,
      startDate: normalized.startDate,
      endDate: normalized.endDate,
      entities: [...normalized.entities],
      pricingMatrix: [...normalized.pricingMatrix],
      miscellaneousCosts: [...normalized.miscellaneousCosts],
      billingConfig: { ...normalized.billingConfig },
      financeContacts: { ...normalized.financeContacts },
      financeContactPersons: normalized.financeContactPersons
        ? [...normalized.financeContactPersons]
        : [],
      selectedFinanceContactIds: normalized.selectedFinanceContactIds
        ? [...normalized.selectedFinanceContactIds]
        : [],
      documents: [...normalized.documents],
    }
    return syncFinanceContactsFromSources(base)
  },

  hydrateFromQuotation(quotationId: string): Partial<CommercialAgreementFormData> | undefined {
    return quotationService.hydrateAgreementFromQuotation(quotationId)
  },

  hydrateFromExistingCustomer(companyId: string): Partial<CommercialAgreementFormData> | undefined {
    const company = companyMasterService.getById(companyId)
    if (!company) return undefined
    return {
      customerSourceMode: 'existing',
      existingCompanyId: companyId,
      company: {
        companyName: company.companyName,
        companyType: company.companyType,
        industryType: company.industryType,
        contactPersonName: company.contactPersonName,
        contactNumber: company.contactNumber,
        emailAddress: company.emailAddress,
        companyAddress: company.companyAddress,
        billingEntityName: company.billingEntityName,
        billingAddress: company.billingAddress,
        gstNumber: company.gstNumber,
        panNumber: company.panNumber,
      },
    }
  },

  saveDraft(existingId: string | undefined, data: CommercialAgreementFormData): CommercialAgreement {
    const store = getStore()
    const ts = nowIso()

    if (existingId) {
      const idx = store.findIndex((r) => r.id === existingId)
      if (idx >= 0) {
        const existing = store[idx]
        const { companyId, companyName } =
          data.customerSourceMode === 'existing' && data.existingCompanyId
            ? {
                companyId: data.existingCompanyId,
                companyName:
                  companyMasterService.getById(data.existingCompanyId)?.companyName ?? existing.companyName,
              }
            : resolveCompany(data)
        const updated: CommercialAgreement = {
          ...existing,
          ...formToAgreement(data, companyId, companyName),
          status: existing.status === 'submitted' ? 'submitted' : 'draft',
          updatedAt: ts,
          activities: [makeActivity('Draft saved', 'Agreement draft updated'), ...existing.activities],
        }
        const next = [...store]
        next[idx] = updated
        persist(next)
        return updated
      }
    }

    const { companyId, companyName } = resolveCompany(data)
    const record: CommercialAgreement = {
      id: generateInternalId(),
      agreementId: generateAgreementId(),
      ...formToAgreement(data, companyId, companyName),
      createdAt: ts,
      updatedAt: ts,
      activities: [makeActivity('Created', `Agreement draft created for ${companyName}`)],
    }
    persist([record, ...store])
    return record
  },

  submit(id: string, data: CommercialAgreementFormData): CommercialAgreement {
    const draft = this.saveDraft(id, data)
    const store = getStore()
    const idx = store.findIndex((r) => r.id === draft.id)
    if (idx < 0) return draft
    const updated: CommercialAgreement = {
      ...store[idx],
      status: 'submitted',
      submittedAt: nowIso(),
      updatedAt: nowIso(),
      activities: [makeActivity('Submitted', 'Agreement submitted for approval'), ...store[idx].activities],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  approve(id: string): { ok: true; record: CommercialAgreement } | { ok: false; issues: string[] } {
    const record = this.getById(id)
    if (!record) return { ok: false, issues: ['Agreement not found'] }
    const validation = validateForApproval(record, (r) => this.agreementToFormData(r))
    if (!validation.ok) return { ok: false, issues: validation.issues }

    const store = getStore()
    const idx = store.findIndex((r) => r.id === id)
    const updated: CommercialAgreement = {
      ...record,
      status: 'approved',
      approvedAt: nowIso(),
      updatedAt: nowIso(),
      activities: [makeActivity('Approved', 'Agreement approved'), ...record.activities],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return { ok: true, record: updated }
  },

  reject(id: string, reason: string): CommercialAgreement | undefined {
    const store = getStore()
    const idx = store.findIndex((r) => r.id === id)
    if (idx < 0) return undefined
    const updated: CommercialAgreement = {
      ...store[idx],
      status: 'rejected',
      rejectedAt: nowIso(),
      rejectionReason: reason,
      updatedAt: nowIso(),
      activities: [makeActivity('Rejected', reason || 'Agreement rejected'), ...store[idx].activities],
    }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  updateDocumentStatus(
    agreementId: string,
    documentKey: string,
    status: CommercialAgreement['documents'][0]['status'],
    fileName?: string,
  ): CommercialAgreement | undefined {
    const store = getStore()
    const idx = store.findIndex((r) => r.id === agreementId)
    if (idx < 0) return undefined
    const agreement = store[idx]
    const documents = agreement.documents.map((d) =>
      d.documentKey === documentKey
        ? { ...d, status, fileName: fileName ?? d.fileName, uploadedAt: status === 'uploaded' ? nowIso() : d.uploadedAt }
        : d,
    )
    const updated = { ...agreement, documents, updatedAt: nowIso() }
    const next = [...store]
    next[idx] = updated
    persist(next)
    return updated
  },

  syncDocumentsForAgreementType(
    data: CommercialAgreementFormData,
    agreementType: CommercialAgreementFormData['agreementType'],
  ): CommercialAgreementFormData {
    const existing = data.documents
    const defaults = buildDefaultAgreementDocuments(agreementType)
    const merged = defaults.map((d) => {
      const prev = existing.find((e) => e.documentKey === d.documentKey)
      return prev ? { ...d, status: prev.status, fileName: prev.fileName, uploadedAt: prev.uploadedAt } : d
    })
    return { ...data, agreementType, documents: merged }
  },

  listApprovedForOnboarding(options?: { excludeCorporateAccountId?: string }): CommercialAgreement[] {
    const activeAccountAgreementIds = new Set(
      getMockCorporateAccounts()
        .filter(
          (a) =>
            (a.portalStatus === 'active' || a.portalStatus === 'draft') &&
            a.id !== options?.excludeCorporateAccountId,
        )
        .map((a) => a.agreementId),
    )
    return this.list({ status: 'approved' }).filter((a) => !activeAccountAgreementIds.has(a.id))
  },

  validateForApproval,
}
