import { getMockQuotations, setMockQuotationsStore } from '@/shared/data/mockQuotations'
import type { AgreementPricingRow, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import type {
  QuotationAttachment,
  QuotationFormData,
  QuotationListingFilters,
  QuotationRecord,
  QuotationSharePayload,
} from '@/shared/types/quotation'
import type { QuotationReference } from '@/shared/types/quotationReference'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import { computePricingTotals } from '@/shared/utils/quotationCalculations'
import {
  getCurrentVersion,
  getLatestApprovedVersion,
  validateForConvert,
  validateForShare,
  validateForSubmit,
} from '@/shared/utils/quotationValidation'

function nowIso() {
  return new Date().toISOString()
}

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function getStore(): QuotationRecord[] {
  return getMockQuotations()
}

function persist(rows: QuotationRecord[]) {
  setMockQuotationsStore(rows)
}

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function generateQuotationNo(): string {
  const year = new Date().getFullYear()
  const suffix = Math.floor(100 + Math.random() * 900)
  return `QUO-${year}-${suffix}`
}

function generateInternalId(): string {
  return `QT-${Math.floor(100 + Math.random() * 900)}`
}

function makeActivity(action: string, detail: string, actor: string) {
  return {
    id: id('qact'),
    timestamp: nowIso(),
    actor,
    action,
    detail,
  }
}

function cloneMatrix(matrix: AgreementPricingRow[]): AgreementPricingRow[] {
  return matrix.map((row) => ({ ...row, id: `pr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }))
}

function createDraftVersion(
  versionNumber: number,
  pricingMatrix: AgreementPricingRow[],
  gstPercentage: number,
  actor: string,
): QuotationRecord['pricingVersions'][0] {
  return {
    id: id('qver'),
    versionLabel: `V${versionNumber}`,
    versionNumber,
    status: 'draft',
    pricingMatrix: cloneMatrix(pricingMatrix),
    totals: computePricingTotals(pricingMatrix, gstPercentage),
    createdBy: actor,
    createdAt: nowIso(),
    approvalHistory: [],
  }
}

function mapEnquiryWorkflow(customerType: EnquiryRecord['customer']['customerType']): QuotationRecord['workflowType'] {
  if (customerType === 'marine') return 'marine'
  if (customerType === 'corporate') return 'corporate'
  return 'retail'
}

function formToRecord(
  data: QuotationFormData,
  actor: string,
  existing?: QuotationRecord,
): QuotationRecord {
  const timestamp = nowIso()
  const version = createDraftVersion(1, data.pricingMatrix, data.gstPercentage, actor)
  return {
    id: existing?.id ?? generateInternalId(),
    quotationNo: existing?.quotationNo ?? generateQuotationNo(),
    sourceType: data.sourceType,
    enquiryId: data.enquiryId,
    workflowType: data.workflowType,
    customer: { ...data.customer },
    quotationDate: data.quotationDate,
    validTill: data.validTill,
    notes: data.notes,
    gstPercentage: data.gstPercentage,
    attachments: existing?.attachments ?? [],
    activities: existing?.activities ?? [makeActivity('Created', 'Quotation created', actor)],
    sharedStatus: existing?.sharedStatus ?? 'not_shared',
    sharedAt: existing?.sharedAt,
    sharedBy: existing?.sharedBy,
    currentVersionId: existing?.currentVersionId ?? version.id,
    pricingVersions: existing?.pricingVersions ?? [version],
    convertedAgreementId: existing?.convertedAgreementId,
    createdAt: existing?.createdAt ?? timestamp,
    createdBy: existing?.createdBy ?? actor,
    updatedAt: timestamp,
  }
}

function recordToReference(record: QuotationRecord): QuotationReference | undefined {
  const approved = getLatestApprovedVersion(record)
  if (!approved) return undefined
  return {
    id: record.id,
    quotationId: record.quotationNo,
    companyName: record.customer.companyName,
    gstNumber: '',
    workflowType: record.workflowType,
    billingType: 'credit',
    contactPersonName: record.customer.contactPersonName,
    createdAt: record.createdAt,
    company: {
      companyName: record.customer.companyName,
      companyType: 'private_limited',
      industryType: '',
      contactPersonName: record.customer.contactPersonName,
      contactNumber: record.customer.contactNumber,
      emailAddress: record.customer.emailAddress,
      companyAddress: record.customer.companyAddress,
      billingEntityName: record.customer.companyName,
      billingAddress: record.customer.companyAddress,
      gstNumber: '',
      panNumber: '',
    },
    pricingMatrix: cloneMatrix(approved.pricingMatrix),
  }
}

export const quotationService = {
  list(filters: QuotationListingFilters = {}): QuotationRecord[] {
    const {
      sourceType = 'all',
      workflowType = 'all',
      approvalStatus = 'all',
      sharedStatus = 'all',
      dateFrom,
      dateTo,
      query,
    } = filters
    const q = normalizeQuery(query)
    let rows = [...getStore()]

    if (sourceType !== 'all') rows = rows.filter((r) => r.sourceType === sourceType)
    if (workflowType !== 'all') rows = rows.filter((r) => r.workflowType === workflowType)
    if (sharedStatus !== 'all') rows = rows.filter((r) => r.sharedStatus === sharedStatus)
    if (approvalStatus !== 'all') {
      rows = rows.filter((r) => getCurrentVersion(r)?.status === approvalStatus)
    }
    if (dateFrom) rows = rows.filter((r) => r.createdAt.slice(0, 10) >= dateFrom)
    if (dateTo) rows = rows.filter((r) => r.createdAt.slice(0, 10) <= dateTo)
    if (q) {
      rows = rows.filter(
        (r) =>
          r.quotationNo.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.customer.companyName.toLowerCase().includes(q),
      )
    }
    return rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  getById(id: string): QuotationRecord | undefined {
    return getStore().find((r) => r.id === id)
  },

  createDirect(data: QuotationFormData, actor: string): QuotationRecord {
    const record = formToRecord(data, actor)
    const store = getStore()
    store.unshift(record)
    persist(store)
    return record
  },

  createFromEnquiry(enquiry: EnquiryRecord, actor: string): QuotationRecord {
    const data: QuotationFormData = {
      sourceType: 'enquiry',
      enquiryId: enquiry.id,
      workflowType: mapEnquiryWorkflow(enquiry.customer.customerType),
      customer: {
        companyName: enquiry.customer.companyOrCustomerName,
        contactPersonName: enquiry.customer.contactPersonName,
        contactNumber: enquiry.customer.contactNumber,
        emailAddress: enquiry.customer.emailAddress,
        companyAddress: enquiry.customer.companyAddress ?? '',
      },
      quotationDate: nowIso().slice(0, 10),
      validTill: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      notes: enquiry.notes.initialDiscussionNotes ?? '',
      gstPercentage: 18,
      pricingMatrix: [],
    }
    const record = formToRecord(data, actor)
    record.activities.unshift(makeActivity('Created from enquiry', `Converted from ${enquiry.id}`, actor))
    const store = getStore()
    store.unshift(record)
    persist(store)
    return record
  },

  updateQuotation(
    quotationId: string,
    patch: Partial<Pick<QuotationRecord, 'customer' | 'quotationDate' | 'validTill' | 'notes' | 'gstPercentage' | 'workflowType'>>,
    actor: string,
  ): { ok: boolean; record?: QuotationRecord; issues?: string[] } {
    const store = getStore()
    const index = store.findIndex((r) => r.id === quotationId)
    if (index < 0) return { ok: false, issues: ['Quotation not found'] }
    const record = store[index]!
    Object.assign(record, patch, { updatedAt: nowIso() })
    if (patch.gstPercentage !== undefined) {
      record.pricingVersions = record.pricingVersions.map((v) => ({
        ...v,
        totals: computePricingTotals(v.pricingMatrix, record.gstPercentage),
      }))
    }
    record.activities.unshift(makeActivity('Updated', 'Quotation details updated', actor))
    persist(store)
    return { ok: true, record }
  },

  updateCurrentVersionPricing(
    quotationId: string,
    pricingMatrix: AgreementPricingRow[],
    actor: string,
  ): { ok: boolean; record?: QuotationRecord; issues?: string[] } {
    const store = getStore()
    const index = store.findIndex((r) => r.id === quotationId)
    if (index < 0) return { ok: false, issues: ['Quotation not found'] }
    const record = store[index]!
    const version = getCurrentVersion(record)
    if (!version) return { ok: false, issues: ['Current version not found'] }
    if (version.status !== 'draft') {
      return { ok: false, issues: ['Create a new pricing version to edit approved or submitted pricing'] }
    }
    version.pricingMatrix = pricingMatrix
    version.totals = computePricingTotals(pricingMatrix, record.gstPercentage)
    record.updatedAt = nowIso()
    record.activities.unshift(makeActivity('Pricing updated', `${version.versionLabel} pricing matrix updated`, actor))
    persist(store)
    return { ok: true, record }
  },

  saveForm(quotationId: string | undefined, data: QuotationFormData, actor: string): QuotationRecord {
    if (!quotationId) {
      return this.createDirect(data, actor)
    }
    const store = getStore()
    const index = store.findIndex((r) => r.id === quotationId)
    if (index < 0) return this.createDirect(data, actor)
    const record = store[index]!
    record.workflowType = data.workflowType
    record.customer = { ...data.customer }
    record.quotationDate = data.quotationDate
    record.validTill = data.validTill
    record.notes = data.notes
    record.gstPercentage = data.gstPercentage
    record.updatedAt = nowIso()
    const version = getCurrentVersion(record)
    if (version?.status === 'draft') {
      version.pricingMatrix = data.pricingMatrix
      version.totals = computePricingTotals(data.pricingMatrix, data.gstPercentage)
    }
    record.activities.unshift(makeActivity('Saved', 'Quotation draft saved', actor))
    persist(store)
    return record
  },

  duplicatePricingVersion(quotationId: string, versionId: string, actor: string) {
    const store = getStore()
    const index = store.findIndex((r) => r.id === quotationId)
    if (index < 0) return { ok: false, issues: ['Quotation not found'] }
    const record = store[index]!
    const source = record.pricingVersions.find((v) => v.id === versionId)
    if (!source) return { ok: false, issues: ['Version not found'] }
    const nextNumber = Math.max(...record.pricingVersions.map((v) => v.versionNumber)) + 1
    const newVersion = createDraftVersion(nextNumber, source.pricingMatrix, record.gstPercentage, actor)
    record.pricingVersions.push(newVersion)
    record.currentVersionId = newVersion.id
    record.updatedAt = nowIso()
    record.activities.unshift(
      makeActivity('New version', `Created ${newVersion.versionLabel} from ${source.versionLabel}`, actor),
    )
    persist(store)
    return { ok: true, record, versionId: newVersion.id }
  },

  createPricingVersion(quotationId: string, actor: string, duplicateFromVersionId?: string) {
    if (duplicateFromVersionId) {
      return this.duplicatePricingVersion(quotationId, duplicateFromVersionId, actor)
    }
    const store = getStore()
    const record = store.find((r) => r.id === quotationId)
    if (!record) return { ok: false, issues: ['Quotation not found'] }
    const current = getCurrentVersion(record)
    return this.duplicatePricingVersion(quotationId, current?.id ?? record.pricingVersions[0]!.id, actor)
  },

  submitForApproval(quotationId: string, actor: string) {
    const validation = validateForSubmit(this.getById(quotationId)!)
    if (!validation.ok) return { ok: false, issues: validation.issues }
    const store = getStore()
    const record = store.find((r) => r.id === quotationId)
    if (!record) return { ok: false, issues: ['Quotation not found'] }
    const version = getCurrentVersion(record)!
    version.status = 'submitted'
    version.approvalHistory.push({ status: 'submitted', actor, timestamp: nowIso() })
    record.updatedAt = nowIso()
    record.activities.unshift(makeActivity('Submitted', `${version.versionLabel} submitted for approval`, actor))
    persist(store)
    return { ok: true, record }
  },

  approve(quotationId: string, actor: string, remarks?: string) {
    const store = getStore()
    const record = store.find((r) => r.id === quotationId)
    if (!record) return { ok: false, issues: ['Quotation not found'] }
    const version = getCurrentVersion(record)
    if (!version || version.status !== 'submitted') {
      return { ok: false, issues: ['Only submitted versions can be approved'] }
    }
    version.status = 'approved'
    version.approvalHistory.push({ status: 'approved', actor, timestamp: nowIso(), remarks })
    record.updatedAt = nowIso()
    record.activities.unshift(makeActivity('Approved', `${version.versionLabel} approved`, actor))
    persist(store)
    return { ok: true, record }
  },

  reject(quotationId: string, actor: string, remarks?: string) {
    const store = getStore()
    const record = store.find((r) => r.id === quotationId)
    if (!record) return { ok: false, issues: ['Quotation not found'] }
    const version = getCurrentVersion(record)
    if (!version || version.status !== 'submitted') {
      return { ok: false, issues: ['Only submitted versions can be rejected'] }
    }
    version.status = 'rejected'
    version.approvalHistory.push({ status: 'rejected', actor, timestamp: nowIso(), remarks })
    record.updatedAt = nowIso()
    record.activities.unshift(makeActivity('Rejected', `${version.versionLabel} rejected`, actor))
    persist(store)
    return { ok: true, record }
  },

  share(quotationId: string, actor: string, _payload: QuotationSharePayload) {
    const record = this.getById(quotationId)
    if (!record) return { ok: false, issues: ['Quotation not found'] }
    const validation = validateForShare(record)
    if (!validation.ok) return { ok: false, issues: validation.issues }
    const store = getStore()
    const target = store.find((r) => r.id === quotationId)!
    const version = getCurrentVersion(target)!
    target.sharedStatus = 'shared'
    target.sharedAt = nowIso()
    target.sharedBy = actor
    version.approvalHistory.push({ status: 'shared', actor, timestamp: nowIso() })
    target.updatedAt = nowIso()
    target.activities.unshift(makeActivity('Shared', 'Quotation shared with customer', actor))
    persist(store)
    return { ok: true, record: target }
  },

  addAttachment(quotationId: string, fileName: string, actor: string): QuotationAttachment | undefined {
    const store = getStore()
    const record = store.find((r) => r.id === quotationId)
    if (!record) return undefined
    const attachment: QuotationAttachment = {
      id: id('qatt'),
      fileName,
      fileType: fileName.split('.').pop() ?? 'file',
      fileSizeKb: Math.floor(50 + Math.random() * 500),
      uploadedAt: nowIso(),
      uploadedBy: actor,
    }
    record.attachments.push(attachment)
    record.updatedAt = nowIso()
    record.activities.unshift(makeActivity('Document uploaded', fileName, actor))
    persist(store)
    return attachment
  },

  removeAttachment(quotationId: string, attachmentId: string, actor: string) {
    const store = getStore()
    const record = store.find((r) => r.id === quotationId)
    if (!record) return { ok: false }
    record.attachments = record.attachments.filter((a) => a.id !== attachmentId)
    record.updatedAt = nowIso()
    record.activities.unshift(makeActivity('Document removed', attachmentId, actor))
    persist(store)
    return { ok: true, record }
  },

  markConverted(quotationId: string, agreementId?: string) {
    const store = getStore()
    const record = store.find((r) => r.id === quotationId)
    if (!record) return { ok: false, issues: ['Quotation not found'] }
    const validation = validateForConvert(record)
    if (!validation.ok) return { ok: false, issues: validation.issues }
    record.convertedAgreementId = agreementId ?? 'pending'
    record.updatedAt = nowIso()
    persist(store)
    return { ok: true, record }
  },

  getApprovedSelectOptions() {
    return this.list()
      .filter((r) => getLatestApprovedVersion(r))
      .map((r) => ({
        value: r.id,
        label: r.customer.companyName,
        gstNumber: '',
        quotationId: r.quotationNo,
      }))
  },

  toReference(id: string): QuotationReference | undefined {
    const record = this.getById(id)
    if (!record) return undefined
    return recordToReference(record)
  },

  listReferences(): QuotationReference[] {
    return this.list()
      .map((r) => recordToReference(r))
      .filter((r): r is QuotationReference => Boolean(r))
  },

  hydrateAgreementFromQuotation(quotationId: string): Partial<CommercialAgreementFormData> | undefined {
    const record = this.getById(quotationId)
    if (!record) return undefined
    const approved = getLatestApprovedVersion(record)
    if (!approved) return undefined
    return {
      customerSourceMode: 'quotation',
      referenceQuotationId: quotationId,
      company: {
        companyName: record.customer.companyName,
        companyType: 'private_limited',
        industryType: '',
        contactPersonName: record.customer.contactPersonName,
        contactNumber: record.customer.contactNumber,
        emailAddress: record.customer.emailAddress,
        companyAddress: record.customer.companyAddress,
        billingEntityName: record.customer.companyName,
        billingAddress: record.customer.companyAddress,
        gstNumber: '',
        panNumber: '',
      },
      workflowType: record.workflowType,
      billingType: 'credit',
      pricingMatrix: cloneMatrix(approved.pricingMatrix),
      billingConfig: {
        creditBillingEnabled: true,
        billingCycle: 'monthly',
        creditPeriodDays: 30,
        creditLimit: 0,
        gracePeriodDays: 0,
        advanceType: 'full',
        advancePercentage: 100,
        fixedAdvanceAmount: 0,
        processingBlockRule: 'before_submission',
        serviceWiseBillingRules: [],
        gstApplicable: true,
        gstPercentage: record.gstPercentage,
        tdsApplicable: false,
        tdsPercentage: 0,
      },
    }
  },

  recordToFormData(record: QuotationRecord): QuotationFormData {
    const version = getCurrentVersion(record)
    return {
      sourceType: record.sourceType,
      enquiryId: record.enquiryId,
      workflowType: record.workflowType,
      customer: { ...record.customer },
      quotationDate: record.quotationDate,
      validTill: record.validTill,
      notes: record.notes,
      gstPercentage: record.gstPercentage,
      pricingMatrix: version ? [...version.pricingMatrix] : [],
    }
  },
}
