import { mockApplications, timelineStages, type CustomerApplication } from '../../../data/mockData'
import { dashboardKpis, mockNotifications, pendingActions } from '../../dashboard/data/dashboardData'
import { buildMarineDashboardApplications } from '../../dashboard/utils/marineDashboardUtils'
import { mockApplicants, mockCorrections, mockDocuments, mockGlobalDocumentUploads } from '../../applications/data/applicationDetailData'
import {
  applySingleApplicationDemoSeed,
  defaultChecklist,
  GLTS_BATCH_IDS,
  MARINE_GLTS_ARRANGED_DEMO_APPLICATION_ID,
  mockBulkBatches,
  mockSingleApplications,
  mockUploadQueue,
  type ApplicantDocumentItem,
  type BulkBatchRow,
  type SingleApplicationRow,
  type UploadQueueRow,
} from '../../applications/data/applicationFlowData'
import { normalizeApplicationId } from '../../../data/portalIds'
import type { ApplicationStatus } from '@/shared/types/application'
import { computeListingKpis } from '../../applications/utils/applicationListingUtils'
import {
  canViewApplication,
  filterApplicationsBySession,
  getSessionCreatorMeta,
} from '../../applications/utils/applicationAccessUtils'
import { mergeVerificationIntoDetail } from '@/shared/services/applicationVerificationService'
import {
  buildApplicationProcessingTimeline,
  deriveProcessingStageDates,
  mapProcessingTimelineToCustomerTracking,
} from '@/shared/utils/applicationProcessingTimeline'
import { isApplicantDocumentSatisfied } from '@/shared/utils/applicantDocumentWorkflowUtils'
import { readApplicationFlowDraftFromSession } from '../../applications/utils/applicationFlowDraftStorage'
import {
  checklistToApplicantDocuments,
  normalizeUploadQueueRows,
  type ApplicantDocumentChecklistContext,
} from '../../applications/utils/uploadQueueDocuments'
import { emptyOriginalDocumentCollectionState } from '@/shared/utils/originalDocumentCollectionUtils'
import { customerFinanceService } from '@/shared/services/customerFinanceService'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import { entityMasterService } from '@/shared/services/entityMasterService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { BookerUser } from '@/shared/types/bookerUser'
import type { EntityMaster } from '@/shared/types/entityMaster'
import type { VesselMaster } from '@/shared/types/vesselMaster'
import { mockBillingAgreementData } from '../../profile/data/billingAgreement.mock'
import { enrichBillingAgreementFromCommercialAgreement } from '../../profile/utils/resolveFinanceContactPersons'
import { mockCompanyProfileData } from '../../profile/data/companyProfile.mock'
import {
  mockBookerPersonalAccountData,
  mockPersonalAccountData,
} from '../../profile/data/personalAccount.mock'
import { mockVisaRules } from '../../profile/data/profileData'
import { loadSession } from '@/shared/auth/session'
import type { CustomerType } from '@/shared/auth/session'
import { mapApplicationBillingTermsSummary } from '@/shared/utils/mapApplicationBillingTermsSummary'
import type { ApplicationBillingTermsViewModel } from '@/shared/utils/mapApplicationBillingTermsSummary'
import { resolveCustomerPortalAgreement, resolvePortalAgreementId } from '@/shared/utils/resolveCustomerPortalAgreement'
import type { ApplicationCustomerSegment } from '../../applications/types/applicationListing.types'
import type { ApplicationDetailViewModel, FlowDraftLikeState } from '../../applications/types/applicationDetail.types'

const GLTS_MAR_1025_APPLICATION_ID = 'GLTS-MAR-1025'

const CUSTOMER_DRAFTS_STORAGE_KEY = 'glts:customer-application-drafts'

function mapSessionToApplicationSegment(customerType?: CustomerType): ApplicationCustomerSegment {
  if (customerType === 'marine') return 'marine'
  if (customerType === 'b2b_agent') return 'b2bAgents'
  if (customerType === 'corporate') return 'corporate'
  return 'retail'
}

interface SaveDraftPayload {
  applicationId: string
  countryName: string
  countryFlag?: string
  visaTypeLabel: string
  travelDate?: string
  rows: UploadQueueRow[]
}

interface GetApplicationDetailOptions {
  ignoreAccessControl?: boolean
}

export const customerPortalService = {
  getDashboard() {
    const session = loadSession()
    const visibleSingles = filterApplicationsBySession([...mockSingleApplications], session)
    const visibleBulks = filterApplicationsBySession(mockBulkBatches, session)
    const isMarinePortal = session?.customerType === 'marine'

    if (isMarinePortal) {
      return {
        isMarinePortal: true,
        kpis: dashboardKpis,
        pendingActions,
        notifications: mockNotifications,
        applications: buildMarineDashboardApplications(visibleSingles, visibleBulks),
      }
    }

    const visibleIds = new Set([...visibleSingles, ...visibleBulks].map(r => r.id))
    return {
      isMarinePortal: false,
      kpis: dashboardKpis,
      pendingActions,
      notifications: mockNotifications,
      applications: mockApplications.filter(app => visibleIds.has(app.id)),
    }
  },

  getApplications(): CustomerApplication[] {
    const session = loadSession()
    const visibleIds = new Set(
      filterApplicationsBySession([...mockSingleApplications, ...mockBulkBatches], session).map(r => r.id),
    )
    return mockApplications.filter(app => visibleIds.has(app.id))
  },

  getSingleApplications(): SingleApplicationRow[] {
    const session = loadSession()
    return filterApplicationsBySession([...getSavedDraftRows(), ...mockSingleApplications], session)
  },

  getBulkBatches(): BulkBatchRow[] {
    const session = loadSession()
    return filterApplicationsBySession(mockBulkBatches, session)
  },

  getApplicationListingRows() {
    return { singles: this.getSingleApplications(), bulks: this.getBulkBatches() }
  },

  getApplicationListingKpis() {
    const metrics = computeListingKpis(this.getSingleApplications(), this.getBulkBatches())
    return metrics
  },

  listCustomerInvoices() {
    return customerFinanceService.listSessionInvoices()
  },

  getApplicationDetail(
    applicationId?: string,
    options?: GetApplicationDetailOptions,
  ): ApplicationDetailViewModel {
    const ignoreAccessControl = options?.ignoreAccessControl === true
    const resolvedId = normalizeApplicationId(applicationId) ?? applicationId
    const session = loadSession()
    const flowState = getSavedFlowState()
    const visibleSingles = this.getSingleApplications()
    const visibleBulks = this.getBulkBatches()
    const single = resolvedId ? visibleSingles.find(row => row.id === resolvedId) : undefined
    const bulk = resolvedId ? visibleBulks.find(row => row.id === resolvedId) : undefined

    if (single) {
      const detail = buildSingleDetail(single, resolvedId, flowState)
      return resolvedId ? mergeVerificationIntoDetail(detail, resolvedId) : detail
    }

    if (bulk) {
      const detail = buildBulkDetail(bulk, resolvedId, flowState)
      return resolvedId ? mergeVerificationIntoDetail(detail, resolvedId) : detail
    }

    const allSingles = [...getSavedDraftRows(), ...mockSingleApplications]
    const allBulks = mockBulkBatches
    const restrictedSingle = resolvedId ? allSingles.find(row => row.id === resolvedId) : undefined
    const restrictedBulk = resolvedId ? allBulks.find(row => row.id === resolvedId) : undefined
    const restricted = restrictedSingle ?? restrictedBulk
    if (restricted && ignoreAccessControl) {
      const detail = restricted.recordType === 'bulk'
        ? buildBulkDetail(restricted as BulkBatchRow, resolvedId, flowState)
        : buildSingleDetail(restricted as SingleApplicationRow, resolvedId, flowState)
      return resolvedId ? mergeVerificationIntoDetail(detail, resolvedId) : detail
    }

    if (restricted && !canViewApplication(restricted, session)) {
      return {
        resolvedId,
        application: null,
        isBulkBatch: false,
        operationalStatus: undefined,
        uploadQueueRows: [],
        documents: [],
        globalDocumentUploads: {},
        corrections: [],
        timeline: timelineStages,
        selectedQueueHintId: null,
        source: 'missing',
      }
    }

    const application = resolvedId ? mockApplications.find(app => app.id === resolvedId) ?? null : null
    if (application) {
      return {
        resolvedId,
        application,
        isBulkBatch: false,
        operationalStatus: application.statusLabel,
        uploadQueueRows: buildLegacyRows(application, flowState),
        documents: mockDocuments,
        globalDocumentUploads: mockGlobalDocumentUploads,
        corrections: mockCorrections,
        timeline: timelineStages,
        selectedQueueHintId: null,
        source: 'legacy',
      }
    }

    return {
      resolvedId,
      application: null,
      isBulkBatch: false,
      operationalStatus: undefined,
      uploadQueueRows: [],
      documents: [],
      globalDocumentUploads: {},
      corrections: [],
      timeline: timelineStages,
      selectedQueueHintId: null,
      source: 'missing',
    }
  },

  getTracking(applicationId?: string) {
    const detail = this.getApplicationDetail(applicationId)
    return {
      ...detail,
      application: detail.application ?? mockApplications[0],
    }
  },

  getBookers(): BookerUser[] {
    return bookerManagementService.listForSession()
  },

  getBookerDetail(bookerId?: string) {
    const booker = bookerId ? bookerManagementService.getById(bookerId) ?? null : null
    const session = loadSession()
    const assignedApps = booker
      ? filterApplicationsBySession(mockSingleApplications, session).slice(
          0,
          Math.min(booker.applicationCount, mockApplications.length),
        )
      : []
    return { booker, assignedApps }
  },

  getEntities(): EntityMaster[] {
    return entityMasterService.list()
  },

  getEntityDetail(entityId?: string) {
    const entity = entityId ? entityMasterService.getById(entityId) ?? null : null
    return { entity }
  },

  getVessels(): VesselMaster[] {
    return vesselMasterService.list()
  },

  getVesselDetail(vesselId?: string) {
    const vessel = vesselId ? vesselMasterService.getById(vesselId) ?? null : null
    return { vessel }
  },

  getApplicationBillingTermsSummary(): ApplicationBillingTermsViewModel | null {
    const session = loadSession()
    const agreement = resolveCustomerPortalAgreement(session)
    if (!agreement) return null
    return mapApplicationBillingTermsSummary(agreement)
  },

  getAccountWorkspace() {
    const session = loadSession()
    const personal =
      session?.userRole === 'booker' ? mockBookerPersonalAccountData : mockPersonalAccountData
    const agreementId = resolvePortalAgreementId(session)
    const billing = enrichBillingAgreementFromCommercialAgreement(mockBillingAgreementData, agreementId)
    return {
      company: {
        ...mockCompanyProfileData,
        operations: billing.supportedOperations,
      },
      billing,
      personal,
    }
  },

  /** @deprecated Use getAccountWorkspace */
  getProfile() {
    const { company, billing } = this.getAccountWorkspace()
    return {
      company: {
        companyName: company.overview.companyName,
        companyType: company.overview.companyType,
        customerType: company.overview.customerCategory,
        gltsTeam: company.operational.gltsTeam,
        agreementStatus: billing.agreement.status === 'active' ? 'Active' : billing.agreement.status,
        contactPerson: company.operational.supportContact.name,
        industry: company.overview.industryType,
        gstNumber: company.billing.gstNumber,
        panNumber: company.billing.panNumber,
        address: company.billing.billingAddress,
        billingEmail: company.billing.billingEmail,
        billingPhone: company.billing.billingPhone,
        operationalSpoc: `${company.operational.escalationContact.name} · ${company.operational.escalationContact.email}`,
      },
      agreement: {
        creditTerms:
          billing.billingConfig.billingType === 'credit'
            ? billing.billingConfig.credit.creditPeriod
            : billing.billingConfig.billingType === 'mixed'
              ? billing.billingConfig.mixed.creditLimit
              : billing.billingConfig.advance.advanceRule,
        sla: `${billing.agreement.workflowType} workflow`,
        invoiceRules: billing.financeContacts.invoiceSubmissionEmail,
      },
      visaRules: mockVisaRules,
    }
  },

  getCrewUpload() {
    return {
      batchId: GLTS_BATCH_IDS.schengenCrew,
      rows: mockUploadQueue as UploadQueueRow[],
    }
  },

  getUploadQueue(): UploadQueueRow[] {
    return mockUploadQueue
  },

  submitApplication(
    mode: 'single' | 'bulk',
    refs?: { applicationId?: string; batchId?: string },
  ) {
    if (mode === 'single') {
      return refs?.applicationId || 'GLTS-APP-2026-847'
    }
    return refs?.batchId || refs?.applicationId || GLTS_BATCH_IDS.schengenCrew
  },

  saveApplicationDraft(payload: SaveDraftPayload): string {
    const now = new Date().toISOString().slice(0, 10)
    const readyRows = payload.rows.filter(r => r.status !== 'processing')
    const primary = readyRows[0]
    const fallbackName = readyRows.length > 1 ? `${readyRows.length} travelers` : 'Applicant pending'

    const session = loadSession()
    const creator = getSessionCreatorMeta(session)
    const draftRow: SingleApplicationRow = {
      id: payload.applicationId,
      recordType: 'single',
      applicantName:
        primary && primary.travelerName !== '—' ? primary.travelerName : fallbackName,
      passportNumber:
        primary && primary.passportNo !== '—' ? primary.passportNo : '—',
      country: payload.countryName || '—',
      countryFlag: payload.countryFlag,
      visaType: payload.visaTypeLabel || '—',
      travelDate: payload.travelDate || '—',
      submissionDate: '',
      createdAt: now,
      lastUpdated: now,
      processingStage: 'Ready for submission',
      operationalStatus: 'Draft',
      status: 'Draft',
      statusTone: 'draft',
      createdByEmail: creator.createdByEmail,
      createdByRole: creator.createdByRole,
      customerSegment: mapSessionToApplicationSegment(session?.customerType),
    }

    const existing = getSavedDraftRows().filter(row => row.id !== draftRow.id)
    writeSavedDraftRows([draftRow, ...existing])
    return draftRow.id
  },
}

function mapOperationalToApplicationStatus(label: string): ApplicationStatus {
  const normalized = label.toLowerCase()
  if (normalized.includes('draft')) return 'draft'
  if (normalized.includes('reject')) return 'rejected'
  if (normalized.includes('complete') || normalized.includes('passport ready')) return 'approved'
  if (normalized.includes('document') || normalized.includes('correction')) return 'pending_documents'
  if (normalized.includes('submit')) return 'submitted'
  return 'in_review'
}

function bulkBatchToCustomerApplication(
  bulk: BulkBatchRow,
  flowState: FlowDraftLikeState | null = null,
): CustomerApplication {
  return {
    id: bulk.id,
    country: bulk.country,
    countryFlag: bulk.countryFlag,
    visaType: bulk.visaType,
    applicantCount: bulk.totalApplicants,
    status: mapOperationalToApplicationStatus(bulk.operationalStatus),
    statusLabel: bulk.operationalStatus,
    travelDate: bulk.travelDate,
    updatedAt: bulk.lastUpdated,
    progress: Math.round((bulk.verifiedApplicants / Math.max(bulk.totalApplicants, 1)) * 100),
    eta: bulk.pendingCorrections > 0 ? `${bulk.pendingCorrections} corrections` : '—',
    jurisdiction: bulk.jurisdiction ?? flowState?.jurisdiction,
  }
}

function documentChecklistContext(
  countryLabel: string,
  flowState: FlowDraftLikeState | null,
): Omit<ApplicantDocumentChecklistContext, 'seedIndex' | 'passportFields'> {
  return {
    countryLabel: flowState?.countryName?.trim() || countryLabel,
    countryId: flowState?.countryId,
    visaOfferingId: flowState?.visaOfferingId,
    jurisdictionId: flowState?.jurisdictionId,
  }
}

function resolveApplicationChecklistContext(
  country: string,
  visaType: string,
  flowState: FlowDraftLikeState | null,
): Omit<ApplicantDocumentChecklistContext, 'seedIndex' | 'passportFields'> {
  const base = documentChecklistContext(country, flowState)
  if (country === 'China' && visaType === 'M Type Visa') {
    return { ...base, countryId: '13', visaOfferingId: 'cn-m-type' }
  }
  if (country === 'China' && visaType === 'G Type Visa') {
    return { ...base, countryId: '13', visaOfferingId: 'cn-g-type' }
  }
  return base
}

function demoMarineOriginalCollection(documents: ApplicantDocumentItem[]) {
  const refs = documents
    .filter(doc => doc.originalDocument)
    .map(doc => ({ documentId: doc.documentId, name: doc.name }))
  if (refs.length === 0) return undefined

  const state = emptyOriginalDocumentCollectionState(refs)
  return {
    ...state,
    method: 'couriered_by_applicant' as const,
    receivedDocuments: state.receivedDocuments.map((item, index) => ({
      ...item,
      received: index < Math.min(2, refs.length),
    })),
    details: {
      ...state.details,
      couriered_by_applicant: {
        receivingOfficeId: 'office-mumbai',
        courierPartner: 'BlueDart',
        trackingNumber: 'BD7843920184',
        dispatchDate: '2026-06-10',
        expectedArrivalDate: '2026-06-12',
        remarks: 'Originals couriered from company office.',
      },
    },
  }
}

function attachDemoOriginalCollections(rows: UploadQueueRow[], batchId: string): UploadQueueRow[] {
  if (batchId !== GLTS_MAR_1025_APPLICATION_ID) return rows
  return rows.map((row, index) => {
    if (row.originalDocumentCollection) return row
    const collection = index === 0 ? demoMarineOriginalCollection(row.documents) : undefined
    return collection ? { ...row, originalDocumentCollection: collection } : row
  })
}

function isApplicationSubmitted(row: SingleApplicationRow | BulkBatchRow): boolean {
  return Boolean(row.submissionDate) && row.operationalStatus !== 'Draft'
}

function attachQueueProcessingStageDates<T extends UploadQueueRow>(
  queueRow: T,
  parent: SingleApplicationRow | BulkBatchRow,
): T {
  return {
    ...queueRow,
    processingStageDates:
      queueRow.processingStageDates ??
      parent.processingStageDates ??
      deriveProcessingStageDates(parent),
  }
}

function buildDetailTimeline(
  row: SingleApplicationRow | BulkBatchRow,
  uploadQueueRows: UploadQueueRow[],
) {
  const stageDates =
    uploadQueueRows[0]?.processingStageDates ??
    row.processingStageDates ??
    deriveProcessingStageDates(row)
  const primaryRow = uploadQueueRows[0]
  const required = primaryRow?.documents.filter((doc) => doc.required) ?? []
  const docsDone =
    required.length === 0 || required.every((doc) => isApplicantDocumentSatisfied(doc))
  const allVerified = required.length > 0 && required.every((doc) => doc.status === 'verified')
  const hasRejection = required.some(
    (doc) => doc.status === 'rejected' || doc.status === 'needs_review',
  )

  const steps = buildApplicationProcessingTimeline({
    stageDates,
    docsDone,
    isSubmitted: isApplicationSubmitted(row),
    allVerified,
    hasRejection,
    countryName: row.country,
    visaTypeLabel: row.visaType,
    operationalStatus: row.operationalStatus,
    processingStage: row.processingStage,
  })

  return mapProcessingTimelineToCustomerTracking(steps)
}

function buildSingleDetail(
  row: SingleApplicationRow,
  resolvedId: string | undefined,
  flowState: FlowDraftLikeState | null,
): ApplicationDetailViewModel {
  const application: CustomerApplication = {
    id: row.id,
    country: row.country,
    countryFlag: row.countryFlag,
    visaType: row.visaType,
    applicantCount: 1,
    status: mapOperationalToApplicationStatus(row.operationalStatus),
    statusLabel: row.operationalStatus,
    travelDate: row.travelDate,
    updatedAt: row.lastUpdated,
    progress: row.operationalStatus === 'Draft' ? 22 : row.operationalStatus === 'Completed' ? 100 : 64,
    eta: row.operationalStatus === 'Completed' ? 'Completed' : row.submissionDate || 'Awaiting review',
    jurisdiction: row.jurisdiction ?? flowState?.jurisdiction,
  }
  const draftRows = pickFlowRows(flowState, row.id)
  const checklistCtx = documentChecklistContext(row.country, flowState)
  const uploadQueueRows = normalizeUploadQueueRows(
    draftRows.length > 0
      ? draftRows.map((queueRow, index) =>
          attachQueueProcessingStageDates(
            applySingleApplicationDemoSeed(row, {
              ...queueRow,
              gltsApplicationId: row.id,
              sequenceNo: queueRow.sequenceNo ?? index + 1,
            }),
            row,
          ),
        )
      : [singleRowToUploadQueue(row)],
    checklistCtx,
  )
  return {
    resolvedId,
    application,
    isBulkBatch: false,
    operationalStatus: row.operationalStatus,
    uploadQueueRows,
    documents: toDocumentRows(uploadQueueRows[0]?.documents ?? []),
    globalDocumentUploads:
      draftRows.length > 0 && flowState ? flowState.globalDocumentUploads : mockGlobalDocumentUploads,
    corrections: row.operationalStatus === 'Correction Required' ? mockCorrections : [],
    timeline: buildDetailTimeline(row, uploadQueueRows),
    selectedQueueHintId: uploadQueueRows[0]?.id ?? null,
    source: 'single',
  }
}

function buildBulkDetail(
  row: BulkBatchRow,
  resolvedId: string | undefined,
  flowState: FlowDraftLikeState | null,
): ApplicationDetailViewModel {
  const application = bulkBatchToCustomerApplication(row, flowState)
  const draftRows = pickFlowRows(flowState, row.id, row)
  const checklistCtx = resolveApplicationChecklistContext(row.country, row.visaType, flowState)
  const uploadQueueRows = attachDemoOriginalCollections(
    normalizeUploadQueueRows(
      (draftRows.length > 0 ? draftRows : bulkRowToUploadQueue(row)).map((queueRow) =>
        attachQueueProcessingStageDates(queueRow, row),
      ),
      checklistCtx,
    ),
    row.id,
  )
  return {
    resolvedId,
    application,
    isBulkBatch: true,
    operationalStatus: row.operationalStatus,
    uploadQueueRows,
    documents: toDocumentRows(uploadQueueRows[0]?.documents ?? []),
    globalDocumentUploads:
      draftRows.length > 0 && flowState ? flowState.globalDocumentUploads : mockGlobalDocumentUploads,
    corrections: row.pendingCorrections > 0 ? mockCorrections : [],
    timeline: buildDetailTimeline(row, uploadQueueRows),
    selectedQueueHintId: uploadQueueRows[0]?.id ?? null,
    source: 'bulk',
  }
}

function withGltsArrangedTicketAndInsurance(documents: ApplicantDocumentItem[]): ApplicantDocumentItem[] {
  return documents.map(doc => {
    if (doc.documentId !== 'travel-ticket' && doc.documentId !== 'insurance') return doc
    return { ...doc, handlingMode: 'arrange_by_glts', status: 'missing' }
  })
}

function singleRowToUploadQueue(row: SingleApplicationRow): UploadQueueRow {
  let documents = checklistToApplicantDocuments(defaultChecklist(row.country))
  if (row.id === MARINE_GLTS_ARRANGED_DEMO_APPLICATION_ID) {
    documents = withGltsArrangedTicketAndInsurance(documents)
  }
  const documentsComplete = documents.filter(doc => isApplicantDocumentSatisfied(doc)).length
  const documentsTotal = documents.length
  const base: UploadQueueRow = {
    id: `${row.id}-q1`,
    fileName: `${row.id}.pdf`,
    gltsApplicationId: row.id,
    gltsApplicantId: `${row.id}-APL-001`,
    sequenceNo: 1,
    travelerName: row.applicantName,
    passportNo: row.passportNumber,
    expiry: '—',
    nationality: '—',
    confidence: 95,
    status:
      row.operationalStatus === 'Pending Documents' || row.operationalStatus === 'Correction Required'
        ? 'needs_review'
        : row.operationalStatus === 'Draft'
          ? 'processing'
          : 'verified',
    fields: [],
    documents,
    documentsComplete,
    documentsTotal,
  }
  return attachQueueProcessingStageDates(applySingleApplicationDemoSeed(row, base), row)
}

function bulkRowToUploadQueue(row: BulkBatchRow): UploadQueueRow[] {
  if (row.id === GLTS_BATCH_IDS.schengenCrew) {
    return mockUploadQueue.map((queueRow, index) => {
      let documents = checklistToApplicantDocuments(defaultChecklist(row.country), index)
      if (index === 0) {
        documents = withGltsArrangedTicketAndInsurance(documents)
      }
      return {
        ...queueRow,
        gltsApplicationId: row.id,
        sequenceNo: index + 1,
        documents,
        documentsComplete: documents.filter(doc => isApplicantDocumentSatisfied(doc)).length,
        documentsTotal: documents.length,
      }
    })
  }

  if (row.id === GLTS_MAR_1025_APPLICATION_ID) {
    return mockUploadQueue
      .filter(queueRow => queueRow.gltsApplicationId === GLTS_MAR_1025_APPLICATION_ID)
      .map((queueRow, index) => ({
        ...queueRow,
        sequenceNo: index + 1,
      }))
  }

  const cap = Math.max(row.totalApplicants, 1)
  return Array.from({ length: cap }).map((_, index) => {
    const sequenceNo = index + 1
    const docs = checklistToApplicantDocuments(defaultChecklist(row.country), index)
    const complete = Math.min(docs.length, Math.max(0, docs.length - (index % 3)))
    return {
      id: `${row.id}-q${sequenceNo}`,
      fileName: `${row.id}-${sequenceNo}.pdf`,
      gltsApplicationId: row.id,
      gltsApplicantId: `${row.id}-APL-${String(sequenceNo).padStart(3, '0')}`,
      sequenceNo,
      travelerName: `Traveler ${sequenceNo}`,
      passportNo: `P${row.id.slice(-3)}${String(sequenceNo).padStart(4, '0')}`,
      expiry: index % 2 === 0 ? '18 Dec 2030' : '27 Apr 2031',
      nationality: row.country.slice(0, 3).toUpperCase(),
      confidence: 92 - (index % 5),
      status: index >= row.processed ? 'processing' : index < row.verifiedApplicants ? 'verified' : 'needs_review',
      fields: [],
      documents: docs,
      documentsComplete: complete,
      documentsTotal: docs.length,
    }
  })
}

function buildLegacyRows(application: CustomerApplication, flowState: FlowDraftLikeState | null): UploadQueueRow[] {
  const checklistCtx = documentChecklistContext(application.country, flowState)
  const draftRows = pickFlowRows(flowState, application.id)
  if (draftRows.length > 0) {
    return normalizeUploadQueueRows(draftRows, checklistCtx)
  }
  const legacyRows = mockApplicants.map((applicant, index) => ({
    id: `${application.id}-legacy-${index + 1}`,
    fileName: `${applicant.id}.pdf`,
    gltsApplicationId: application.id,
    gltsApplicantId: applicant.id,
    sequenceNo: index + 1,
    travelerName: applicant.name,
    passportNo: applicant.passport,
    expiry: index % 2 === 0 ? '17 Nov 2031' : '08 Jun 2032',
    nationality: application.country.slice(0, 3).toUpperCase(),
    confidence: 95,
    status: (applicant.status.toLowerCase().includes('pending')
      ? 'needs_review'
      : 'verified') as UploadQueueRow['status'],
    fields: [],
    documents: [] as ApplicantDocumentItem[],
    documentsComplete: 0,
    documentsTotal: 0,
  }))
  return normalizeUploadQueueRows(legacyRows, checklistCtx)
}

function toDocumentRows(documents: ApplicantDocumentItem[]) {
  return documents.map(doc => ({
    name: doc.name,
    tone: isApplicantDocumentSatisfied(doc)
      ? ('success' as const)
      : doc.status === 'needs_review' || doc.status === 'rejected'
        ? ('warning' as const)
        : ('neutral' as const),
  }))
}

function pickFlowRows(
  flowState: FlowDraftLikeState | null,
  id: string,
  batch?: BulkBatchRow,
): UploadQueueRow[] {
  if (!flowState) return []
  if (flowState.gltsApplicationId !== id && flowState.gltsBatchId !== id) return []
  const draftRows = Array.isArray(flowState.uploadQueueRows) ? flowState.uploadQueueRows : []
  if (draftRows.length === 0) return []

  // Submitted bulk batches: ignore stale session drafts that only captured part of the batch
  // (e.g. admin create flow left in sessionStorage while reviewing a demo bulk batch).
  if (batch?.submissionDate?.trim() && draftRows.length < batch.totalApplicants) {
    return []
  }

  return draftRows
}

function getSavedFlowState(): FlowDraftLikeState | null {
  return readApplicationFlowDraftFromSession()
}

function getSavedDraftRows(): SingleApplicationRow[] {
  try {
    const raw = sessionStorage.getItem(CUSTOMER_DRAFTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SingleApplicationRow[]) : []
  } catch {
    return []
  }
}

function writeSavedDraftRows(rows: SingleApplicationRow[]) {
  try {
    sessionStorage.setItem(CUSTOMER_DRAFTS_STORAGE_KEY, JSON.stringify(rows))
  } catch {
    // ignore storage failures in mock service mode
  }
}
