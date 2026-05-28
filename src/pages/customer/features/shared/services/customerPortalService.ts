import { mockApplications, timelineStages, type CustomerApplication } from '../../../data/mockData'
import { dashboardKpis, mockNotifications, pendingActions } from '../../dashboard/data/dashboardData'
import { mockApplicants, mockCorrections, mockDocuments, mockGlobalDocumentUploads } from '../../applications/data/applicationDetailData'
import {
  defaultChecklist,
  GLTS_BATCH_IDS,
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
import { BOOKER_PERMISSION_LABELS, mockBookers, type BookerRecord } from '../../bookers/data/bookerData'
import { mockBillingAgreementData } from '../../profile/data/billingAgreement.mock'
import { mockCompanyProfileData } from '../../profile/data/companyProfile.mock'
import {
  mockBookerPersonalAccountData,
  mockPersonalAccountData,
} from '../../profile/data/personalAccount.mock'
import { mockVisaRules } from '../../profile/data/profileData'
import { loadSession } from '@/shared/auth/session'
import type { ApplicationDetailViewModel, FlowDraftLikeState } from '../../applications/types/applicationDetail.types'

const CUSTOMER_DRAFTS_STORAGE_KEY = 'glts:customer-application-drafts'
const APPLICATION_FLOW_STORAGE_KEY = 'glts:application-flow'

interface SaveDraftPayload {
  applicationId: string
  countryName: string
  countryFlag?: string
  visaTypeLabel: string
  travelDate?: string
  rows: UploadQueueRow[]
}

export const customerPortalService = {
  getDashboard() {
    return {
      kpis: dashboardKpis,
      pendingActions,
      notifications: mockNotifications,
      applications: mockApplications,
    }
  },

  getApplications(): CustomerApplication[] {
    return mockApplications
  },

  getSingleApplications(): SingleApplicationRow[] {
    return [...getSavedDraftRows(), ...mockSingleApplications]
  },

  getBulkBatches(): BulkBatchRow[] {
    return mockBulkBatches
  },

  getApplicationListingRows() {
    return { singles: this.getSingleApplications(), bulks: mockBulkBatches }
  },

  getApplicationListingKpis() {
    const metrics = computeListingKpis(this.getSingleApplications(), mockBulkBatches)
    return metrics
  },

  getApplicationDetail(applicationId?: string): ApplicationDetailViewModel {
    const resolvedId = normalizeApplicationId(applicationId) ?? applicationId
    const flowState = getSavedFlowState()
    const single = resolvedId ? this.getSingleApplications().find(row => row.id === resolvedId) : undefined
    const bulk = resolvedId ? this.getBulkBatches().find(row => row.id === resolvedId) : undefined

    if (single) {
      return buildSingleDetail(single, resolvedId, flowState)
    }

    if (bulk) {
      return buildBulkDetail(bulk, resolvedId, flowState)
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

  getBookers(): BookerRecord[] {
    return mockBookers
  },

  getBookerDetail(bookerId?: string) {
    const booker = mockBookers.find(row => row.id === bookerId) ?? null
    const assignedApps = mockApplications.slice(0, booker ? Math.min(booker.apps, mockApplications.length) : 0)
    return { booker, assignedApps, permissionLabels: BOOKER_PERMISSION_LABELS }
  },

  getAccountWorkspace() {
    const session = loadSession()
    const personal =
      session?.userRole === 'booker' ? mockBookerPersonalAccountData : mockPersonalAccountData
    return {
      company: mockCompanyProfileData,
      billing: mockBillingAgreementData,
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
        creditTerms: billing.agreement.creditTerms,
        sla: billing.agreement.slaSummary,
        invoiceRules: billing.invoiceRules,
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
      processingStage: 'Intake',
      operationalStatus: 'Draft',
      status: 'Draft',
      statusTone: 'draft',
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

function bulkBatchToCustomerApplication(bulk: BulkBatchRow): CustomerApplication {
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
  }
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
  }
  const draftRows = pickFlowRows(flowState, row.id)
  const uploadQueueRows = draftRows.length > 0 ? draftRows : [singleRowToUploadQueue(row)]
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
    timeline: timelineStages,
    selectedQueueHintId: uploadQueueRows[0]?.id ?? null,
    source: 'single',
  }
}

function buildBulkDetail(
  row: BulkBatchRow,
  resolvedId: string | undefined,
  flowState: FlowDraftLikeState | null,
): ApplicationDetailViewModel {
  const application = bulkBatchToCustomerApplication(row)
  const draftRows = pickFlowRows(flowState, row.id)
  const uploadQueueRows = draftRows.length > 0 ? draftRows : bulkRowToUploadQueue(row)
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
    timeline: timelineStages,
    selectedQueueHintId: uploadQueueRows[0]?.id ?? null,
    source: 'bulk',
  }
}

function singleRowToUploadQueue(row: SingleApplicationRow): UploadQueueRow {
  const documents = checklistToApplicantDocuments(defaultChecklist(row.country))
  const documentsComplete = documents.filter(doc => doc.status === 'verified' || doc.status === 'uploaded').length
  const documentsTotal = documents.length
  return {
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
}

function bulkRowToUploadQueue(row: BulkBatchRow): UploadQueueRow[] {
  if (row.id === GLTS_BATCH_IDS.schengenCrew) {
    return mockUploadQueue.map((queueRow, index) => {
      const documents = checklistToApplicantDocuments(defaultChecklist(row.country), index)
      return {
        ...queueRow,
        gltsApplicationId: row.id,
        sequenceNo: index + 1,
        documents,
        documentsComplete: documents.filter(doc => doc.status === 'verified' || doc.status === 'uploaded').length,
        documentsTotal: documents.length,
      }
    })
  }

  const cap = Math.min(Math.max(row.totalApplicants, 2), 6)
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
  const draftRows = pickFlowRows(flowState, application.id)
  if (draftRows.length > 0) {
    return draftRows
  }
  return mockApplicants.map((applicant, index) => ({
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
    status: applicant.status.toLowerCase().includes('pending') ? 'needs_review' : 'verified',
    fields: [],
    documents: checklistToApplicantDocuments(defaultChecklist(application.country), index),
    documentsComplete: 3,
    documentsTotal: 5,
  }))
}

function checklistToApplicantDocuments(
  checklist: ReturnType<typeof defaultChecklist>,
  offset = 0,
): ApplicantDocumentItem[] {
  return checklist.map((item, index) => {
    const rotated = (index + offset) % 3
    const status =
      item.status === 'uploaded'
        ? 'verified'
        : item.status === 'pending'
          ? 'needs_review'
          : rotated === 0
            ? 'missing'
            : rotated === 1
              ? 'uploaded'
              : 'needs_review'
    return {
      documentId: item.id,
      name: item.label,
      required: item.required,
      status,
      fields: [],
    }
  })
}

function toDocumentRows(documents: ApplicantDocumentItem[]) {
  return documents.map(doc => ({
    name: doc.name,
    tone:
      doc.status === 'verified' || doc.status === 'uploaded'
        ? ('success' as const)
        : doc.status === 'needs_review'
          ? ('warning' as const)
          : ('neutral' as const),
  }))
}

function pickFlowRows(flowState: FlowDraftLikeState | null, id: string): UploadQueueRow[] {
  if (!flowState) return []
  if (flowState.gltsApplicationId !== id && flowState.gltsBatchId !== id) return []
  return Array.isArray(flowState.uploadQueueRows) ? flowState.uploadQueueRows : []
}

function getSavedFlowState(): FlowDraftLikeState | null {
  try {
    const raw = sessionStorage.getItem(APPLICATION_FLOW_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<FlowDraftLikeState>
    if (!parsed || typeof parsed !== 'object') return null
    return {
      gltsApplicationId: typeof parsed.gltsApplicationId === 'string' ? parsed.gltsApplicationId : '',
      gltsBatchId: typeof parsed.gltsBatchId === 'string' ? parsed.gltsBatchId : '',
      countryName: typeof parsed.countryName === 'string' ? parsed.countryName : '',
      countryFlag: typeof parsed.countryFlag === 'string' ? parsed.countryFlag : '',
      visaTypeLabel: typeof parsed.visaTypeLabel === 'string' ? parsed.visaTypeLabel : '',
      purposeLabel: typeof parsed.purposeLabel === 'string' ? parsed.purposeLabel : '',
      travelDate: typeof parsed.travelDate === 'string' ? parsed.travelDate : '',
      globalDocumentUploads:
        parsed.globalDocumentUploads && typeof parsed.globalDocumentUploads === 'object'
          ? parsed.globalDocumentUploads
          : {},
      uploadQueueRows: Array.isArray(parsed.uploadQueueRows) ? parsed.uploadQueueRows : [],
    }
  } catch {
    return null
  }
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
