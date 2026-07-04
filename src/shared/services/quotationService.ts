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
import { enquiryService } from '@/shared/services/enquiryService'
import { buildQuotationFormDataFromEnquiry } from '@/shared/utils/quotationFormMapping'
import { computePricingTotals } from '@/shared/utils/quotationCalculations'
import { resolveQuotationGstRateId } from '@/shared/utils/quotationGstUtils'
import {
  getCurrentVersion,
  getLatestVersion,
  getVersionById,
  validateForConvert,
  validateForShare,
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

function createPricingVersionSnapshot(
  versionNumber: number,
  pricingMatrix: AgreementPricingRow[],
  gstPercentage: number,
  actor: string,
): QuotationRecord['pricingVersions'][0] {
  return {
    id: id('qver'),
    versionLabel: `V${versionNumber}`,
    versionNumber,
    pricingMatrix: cloneMatrix(pricingMatrix),
    totals: computePricingTotals(pricingMatrix, gstPercentage),
    createdBy: actor,
    createdAt: nowIso(),
  }
}


function formToRecord(
  data: QuotationFormData,
  actor: string,
  existing?: QuotationRecord,
): QuotationRecord {
  const timestamp = nowIso()
  const version = createPricingVersionSnapshot(1, data.pricingMatrix, data.gstPercentage, actor)
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
    gstRateId: data.gstRateId,
    gstPercentage: data.gstPercentage,
    attachments: existing?.attachments ?? [],
    activities: existing?.activities ?? [makeActivity('Created', 'Quotation created', actor)],
    sharedStatus: existing?.sharedStatus ?? 'not_shared',
    sharedAt: existing?.sharedAt,
    sharedBy: existing?.sharedBy,
    currentVersionId: existing?.currentVersionId ?? version.id,
    pricingVersions: existing?.pricingVersions ?? [version],
    convertedAgreementId: existing?.convertedAgreementId,
    convertedFromVersionId: existing?.convertedFromVersionId,
    createdAt: existing?.createdAt ?? timestamp,
    createdBy: existing?.createdBy ?? actor,
    updatedAt: timestamp,
  }
}

function recordToReference(record: QuotationRecord): QuotationReference | undefined {
  const version = getLatestVersion(record)
  if (!version || version.pricingMatrix.length === 0) return undefined
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
      countryId: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      billingEntityName: record.customer.companyName,
      billingAddress: record.customer.companyAddress,
      gstNumber: '',
      panNumber: '',
    },
    pricingMatrix: cloneMatrix(version.pricingMatrix),
  }
}

export const quotationService = {
  list(filters: QuotationListingFilters = {}): QuotationRecord[] {
    const {
      sourceType = 'all',
      workflowType = 'all',
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
    if (data.sourceType === 'enquiry' && data.enquiryId) {
      record.activities.unshift(
        makeActivity('Created from enquiry', `Linked to enquiry ${data.enquiryId}`, actor),
      )
    }
    const store = getStore()
    store.unshift(record)
    persist(store)
    return record
  },

  createFromEnquiry(enquiry: EnquiryRecord, actor: string): QuotationRecord {
    const data = buildQuotationFormDataFromEnquiry(enquiry)
    const record = formToRecord(data, actor)
    record.activities.unshift(makeActivity('Created from enquiry', `Converted from ${enquiry.id}`, actor))
    const store = getStore()
    store.unshift(record)
    persist(store)
    return record
  },

  updateQuotation(
    quotationId: string,
    patch: Partial<Pick<QuotationRecord, 'customer' | 'quotationDate' | 'validTill' | 'notes' | 'gstRateId' | 'gstPercentage' | 'workflowType'>>,
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
    version.pricingMatrix = pricingMatrix
    version.totals = computePricingTotals(pricingMatrix, record.gstPercentage)
    record.updatedAt = nowIso()
    record.activities.unshift(makeActivity('Pricing updated', `${version.versionLabel} pricing matrix updated`, actor))
    persist(store)
    return { ok: true, record }
  },

  saveForm(quotationId: string | undefined, data: QuotationFormData, actor: string): QuotationRecord {
    if (!quotationId) {
      const record = this.createDirect(data, actor)
      if (data.sourceType === 'enquiry' && data.enquiryId) {
        void enquiryService.markQuotationLinked(data.enquiryId, record.id, actor, 'draft')
      }
      return record
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
    record.gstRateId = data.gstRateId
    record.gstPercentage = data.gstPercentage
    record.updatedAt = nowIso()
    const version = getCurrentVersion(record)
    if (version) {
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
    const newVersion = createPricingVersionSnapshot(nextNumber, source.pricingMatrix, record.gstPercentage, actor)
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

  share(quotationId: string, actor: string, _payload: QuotationSharePayload) {
    const record = this.getById(quotationId)
    if (!record) return { ok: false, issues: ['Quotation not found'] }
    const validation = validateForShare(record)
    if (!validation.ok) return { ok: false, issues: validation.issues }
    const store = getStore()
    const target = store.find((r) => r.id === quotationId)!
    target.sharedStatus = 'shared'
    target.sharedAt = nowIso()
    target.sharedBy = actor
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

  markConverted(quotationId: string, versionId: string, agreementId?: string) {
    const store = getStore()
    const record = store.find((r) => r.id === quotationId)
    if (!record) return { ok: false, issues: ['Quotation not found'] }
    const validation = validateForConvert(record, versionId)
    if (!validation.ok) return { ok: false, issues: validation.issues }
    const version = getVersionById(record, versionId)
    record.convertedAgreementId = agreementId ?? 'pending'
    record.convertedFromVersionId = version?.id
    record.updatedAt = nowIso()
    record.activities.unshift(
      makeActivity('Converted', `Converted ${version?.versionLabel ?? 'pricing version'} to agreement`, 'System'),
    )
    persist(store)
    return { ok: true, record }
  },

  getConvertibleSelectOptions() {
    return this.list()
      .filter((r) => {
        const version = getLatestVersion(r)
        return version && version.pricingMatrix.length > 0 && !r.convertedAgreementId
      })
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

  hydrateAgreementFromQuotation(
    quotationId: string,
    versionId?: string,
  ): Partial<CommercialAgreementFormData> | undefined {
    const record = this.getById(quotationId)
    if (!record) return undefined
    const version = versionId ? getVersionById(record, versionId) : getLatestVersion(record)
    if (!version || version.pricingMatrix.length === 0) return undefined
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
        countryId: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        billingEntityName: record.customer.companyName,
        billingAddress: record.customer.companyAddress,
        gstNumber: '',
        panNumber: '',
      },
      workflowType: record.workflowType,
      billingType: 'credit',
      pricingMatrix: cloneMatrix(version.pricingMatrix),
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
      gstRateId: resolveQuotationGstRateId(record),
      gstPercentage: record.gstPercentage,
      pricingMatrix: version ? [...version.pricingMatrix] : [],
    }
  },
}
