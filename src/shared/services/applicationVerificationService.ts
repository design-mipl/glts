import {
  mockBulkBatches,
  mockSingleApplications,
  type ApplicantDocumentItem,
  type ApplicantDocumentStatus,
  type BulkBatchRow,
  type SingleApplicationRow,
  type UploadQueueRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationOperationalStatus } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import { REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS } from '@/pages/customer/features/applications/utils/globalDocumentChecklist'
import { withDocumentProgress } from '@/pages/customer/features/applications/utils/uploadQueueDocuments'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { isCustomerSubmitted, marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'

const VERIFICATION_STORAGE_KEY = 'glts:application-verification'

export type VerificationDocumentScope = 'traveler' | 'global'

export interface VerificationDocumentOverride {
  scope: VerificationDocumentScope
  travelerRowId?: string
  documentId: string
  status: ApplicantDocumentStatus
  updatedAt: string
}

export interface ApplicationVerificationRecord {
  applicationId: string
  operationalStatus?: ApplicationOperationalStatus
  draftSavedAt?: string
  submittedAt?: string
  documentOverrides: VerificationDocumentOverride[]
}

type VerificationStore = Record<string, ApplicationVerificationRecord>

function readStore(): VerificationStore {
  try {
    const raw = localStorage.getItem(VERIFICATION_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as VerificationStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: VerificationStore) {
  try {
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore storage failures in mock mode
  }
}

function getRecord(applicationId: string): ApplicationVerificationRecord {
  const store = readStore()
  return (
    store[applicationId] ?? {
      applicationId,
      documentOverrides: [],
    }
  )
}

function saveRecord(record: ApplicationVerificationRecord) {
  const store = readStore()
  store[record.applicationId] = record
  writeStore(store)
}

function applyOverridesToRow(
  row: UploadQueueRow,
  overrides: VerificationDocumentOverride[],
): UploadQueueRow {
  const rowOverrides = overrides.filter(
    o => o.scope === 'traveler' && o.travelerRowId === row.id,
  )
  if (rowOverrides.length === 0) return row

  const documents = row.documents.map(doc => {
    const override = rowOverrides.find(o => o.documentId === doc.documentId)
    return override ? { ...doc, status: override.status } : doc
  })
  return withDocumentProgress({ ...row, documents })
}

function allRequiredVerified(rows: UploadQueueRow[]): boolean {
  return rows.every(row => {
    const required = row.documents.filter(d => d.required)
    if (required.length === 0) return true
    return required.every(d => d.status === 'verified')
  })
}

function hasRejectedOrReview(rows: UploadQueueRow[]): boolean {
  return rows.some(row =>
    row.documents.some(d => d.status === 'rejected' || d.status === 'needs_review'),
  )
}

export function deriveOperationalStatusFromRows(
  rows: UploadQueueRow[],
  current?: ApplicationOperationalStatus | string,
): ApplicationOperationalStatus {
  if (hasRejectedOrReview(rows)) return 'Correction Required'
  if (allRequiredVerified(rows)) return 'Verification Pending'
  if (current === 'Submitted') return 'Under Review'
  return (current as ApplicationOperationalStatus) ?? 'Under Review'
}

export function mergeVerificationIntoDetail(
  detail: ApplicationDetailViewModel,
  applicationId: string,
): ApplicationDetailViewModel {
  const record = getRecord(applicationId)
  const uploadQueueRows = detail.uploadQueueRows.map(row =>
    applyOverridesToRow(row, record.documentOverrides),
  )
  const operationalStatus =
    record.operationalStatus ??
    deriveOperationalStatusFromRows(uploadQueueRows, detail.operationalStatus)

  const corrections =
    operationalStatus === 'Correction Required'
      ? uploadQueueRows.flatMap(row =>
          row.documents
            .filter(d => d.status === 'rejected' || d.status === 'needs_review')
            .map((d, index) => ({
              id: `${row.id}-${d.documentId}-${index}`,
              field: d.name,
              reason: d.status === 'rejected' ? 'Document rejected by GLTS team' : 'Re-upload requested',
              status: 'Open',
            })),
        )
      : detail.corrections

  return {
    ...detail,
    uploadQueueRows,
    operationalStatus,
    corrections,
    application: detail.application
      ? { ...detail.application, statusLabel: operationalStatus }
      : null,
  }
}

function findListingRow(applicationId: string): SingleApplicationRow | BulkBatchRow | undefined {
  const { singles, bulks } = marineApplicationAdminService.listSubmittedMarineApplications()
  return singles.find(r => r.id === applicationId) ?? bulks.find(r => r.id === applicationId)
}

export const applicationVerificationService = {
  getWorkspace(applicationId: string) {
    const listingRow = findListingRow(applicationId)
    if (!listingRow || !isCustomerSubmitted(listingRow)) {
      return { ok: false as const, listingRow: undefined, detail: undefined }
    }
    const detail = customerPortalService.getApplicationDetail(applicationId)
    return { ok: true as const, listingRow, detail }
  },

  getMergedDetail(applicationId: string): ApplicationDetailViewModel {
    return customerPortalService.getApplicationDetail(applicationId)
  },

  updateTravelerDocumentStatus(
    applicationId: string,
    travelerRowId: string,
    documentId: string,
    status: ApplicantDocumentStatus,
  ) {
    const record = getRecord(applicationId)
    const without = record.documentOverrides.filter(
      o =>
        !(
          o.scope === 'traveler' &&
          o.travelerRowId === travelerRowId &&
          o.documentId === documentId
        ),
    )
    const next: ApplicationVerificationRecord = {
      ...record,
      documentOverrides: [
        ...without,
        {
          scope: 'traveler',
          travelerRowId,
          documentId,
          status,
          updatedAt: new Date().toISOString(),
        },
      ],
    }
    saveRecord(next)
    return this.getWorkspace(applicationId)
  },

  updateGlobalDocumentStatus(
    applicationId: string,
    documentId: string,
    status: ApplicantDocumentStatus,
  ) {
    const record = getRecord(applicationId)
    const without = record.documentOverrides.filter(
      o => !(o.scope === 'global' && o.documentId === documentId),
    )
    saveRecord({
      ...record,
      documentOverrides: [
        ...without,
        {
          scope: 'global',
          documentId,
          status,
          updatedAt: new Date().toISOString(),
        },
      ],
    })
    return this.getWorkspace(applicationId)
  },

  saveDraft(applicationId: string) {
    const workspace = this.getWorkspace(applicationId)
    if (!workspace.ok || !workspace.detail) return workspace

    const operationalStatus = deriveOperationalStatusFromRows(
      workspace.detail.uploadQueueRows,
      workspace.detail.operationalStatus,
    )
    const record = getRecord(applicationId)
    saveRecord({
      ...record,
      operationalStatus,
      draftSavedAt: new Date().toISOString(),
    })
    return this.getWorkspace(applicationId)
  },

  submitVerification(applicationId: string) {
    const workspace = this.getWorkspace(applicationId)
    if (!workspace.ok || !workspace.detail) return workspace

    const operationalStatus = deriveOperationalStatusFromRows(
      workspace.detail.uploadQueueRows,
      workspace.detail.operationalStatus,
    )
    const record = getRecord(applicationId)
    saveRecord({
      ...record,
      operationalStatus,
      submittedAt: new Date().toISOString(),
    })
    syncListingOperationalStatus(applicationId, operationalStatus)
    return this.getWorkspace(applicationId)
  },
}

function syncListingOperationalStatus(
  applicationId: string,
  operationalStatus: ApplicationOperationalStatus,
) {
  const single = mockSingleApplications.find(r => r.id === applicationId)
  if (single) {
    single.operationalStatus = operationalStatus
    single.status = operationalStatus
    return
  }
  const bulk = mockBulkBatches.find(r => r.id === applicationId)
  if (bulk) {
    bulk.operationalStatus = operationalStatus
    bulk.status = operationalStatus
    if (operationalStatus === 'Correction Required') {
      bulk.pendingCorrections = Math.max(bulk.pendingCorrections, 1)
    }
  }
}

export function adminDocumentBadgeStatus(
  status: ApplicantDocumentStatus,
): 'uploaded' | 'missing' | 'verified' | 'rejected' {
  if (status === 'verified') return 'verified'
  if (status === 'rejected') return 'rejected'
  if (status === 'uploaded') return 'uploaded'
  if (status === 'needs_review') return 'uploaded'
  return 'missing'
}

export function buildGlobalDocumentsForVerification(
  applicationId: string,
  globalUploads: Record<string, { fileName: string; uploadedAt: string }>,
): ApplicantDocumentItem[] {
  const record = getRecord(applicationId)
  return REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS.map(doc => {
    const uploaded = globalUploads[doc.documentId]
    let status: ApplicantDocumentStatus = uploaded ? 'uploaded' : 'missing'
    const override = record.documentOverrides.find(
      o => o.scope === 'global' && o.documentId === doc.documentId,
    )
    if (override) status = override.status
    return {
      documentId: doc.documentId,
      name: doc.name,
      required: doc.required,
      status,
    }
  })
}

export function patchDocumentInRows(
  rows: UploadQueueRow[],
  travelerRowId: string,
  documentId: string,
  status: ApplicantDocumentStatus,
): UploadQueueRow[] {
  return rows.map(row => {
    if (row.id !== travelerRowId) return row
    const documents: ApplicantDocumentItem[] = row.documents.map(doc =>
      doc.documentId === documentId ? { ...doc, status } : doc,
    )
    return withDocumentProgress({ ...row, documents })
  })
}
