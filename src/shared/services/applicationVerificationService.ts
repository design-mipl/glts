import {
  GLTS_BATCH_IDS,
  mockBulkBatches,
  mockSingleApplications,
  type ApplicantDocumentItem,
  type ApplicantDocumentStatus,
  type BulkBatchRow,
  type SingleApplicationRow,
  type UploadQueueRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { GLTS_APPLICATION_IDS } from '@/pages/customer/data/portalIds'
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
  comment?: string
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

function getDemoVerificationSeeds(applicationId: string): VerificationDocumentOverride[] | undefined {
  const updatedAt = new Date().toISOString()

  if (applicationId === GLTS_APPLICATION_IDS.japan) {
    return [
      {
        scope: 'traveler',
        travelerRowId: `${applicationId}-q1`,
        documentId: 'photo',
        status: 'needs_review',
        comment: 'Resolution below 600×600. Please re-upload a clear photo on a plain white background.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId: `${applicationId}-q1`,
        documentId: 'bank',
        status: 'rejected',
        comment: 'Bank statement must show transactions for the last 90 days with a visible bank stamp.',
        updatedAt,
      },
    ]
  }

  if (applicationId === GLTS_BATCH_IDS.schengenCrew) {
    return [
      {
        scope: 'traveler',
        travelerRowId: 'q1',
        documentId: 'photo',
        status: 'needs_review',
        comment: 'Photo background is not plain white. Re-upload per Schengen photo guidelines.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId: 'q1',
        documentId: 'bank',
        status: 'needs_review',
        comment: 'Statement period does not cover the full travel dates. Upload updated statements.',
        updatedAt,
      },
      {
        scope: 'global',
        documentId: 'loi',
        status: 'needs_review',
        comment: 'LOI must be signed by an authorized signatory on company letterhead.',
        updatedAt,
      },
    ]
  }

  if (applicationId === GLTS_APPLICATION_IDS.schengen) {
    return [
      {
        scope: 'traveler',
        travelerRowId: `${applicationId}-q1`,
        documentId: 'photo',
        status: 'needs_review',
        comment: 'Applicant photo must be recent (within 6 months) with a plain light background.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId: `${applicationId}-q1`,
        documentId: 'bank',
        status: 'rejected',
        comment: 'Upload the last 3 months of bank statements with account holder name matching the passport.',
        updatedAt,
      },
    ]
  }

  return undefined
}

function overrideMatchesRow(row: UploadQueueRow, override: VerificationDocumentOverride): boolean {
  if (override.scope !== 'traveler') return false
  const travelerKey = override.travelerRowId
  if (!travelerKey) return false
  return (
    travelerKey === row.id ||
    travelerKey === row.gltsApplicantId ||
    (Boolean(row.gltsApplicationId) &&
      travelerKey === `${row.gltsApplicationId}-q${row.sequenceNo}`)
  )
}

function findDemoOverride(
  applicationId: string,
  override: VerificationDocumentOverride,
): VerificationDocumentOverride | undefined {
  const seeds = getDemoVerificationSeeds(applicationId)
  if (!seeds) return undefined

  const exact = seeds.find(
    demo =>
      demo.scope === override.scope &&
      demo.documentId === override.documentId &&
      (demo.scope === 'global' || demo.travelerRowId === override.travelerRowId),
  )
  if (exact) return exact

  if (override.scope !== 'traveler') return undefined

  return seeds.find(
    demo => demo.scope === 'traveler' && demo.documentId === override.documentId,
  )
}

function resolveOverrideComment(
  applicationId: string,
  override: VerificationDocumentOverride,
): string | undefined {
  const trimmed = override.comment?.trim()
  if (trimmed) return trimmed

  const demoComment = findDemoOverride(applicationId, override)?.comment?.trim()
  if (demoComment) return demoComment

  if (override.status === 'rejected') {
    return 'Document rejected by GLTS team. Please re-upload a corrected document.'
  }
  if (override.status === 'needs_review') {
    return 'Re-upload requested by GLTS team. Please upload an updated document.'
  }
  return undefined
}

function enrichPersistedOverrides(
  applicationId: string,
  overrides: VerificationDocumentOverride[],
): VerificationDocumentOverride[] {
  const demoSeeds = getDemoVerificationSeeds(applicationId) ?? []

  const enriched = overrides.map(override => {
    if (override.comment?.trim()) return override
    const demo = findDemoOverride(applicationId, override)
    if (demo?.comment?.trim()) {
      return { ...override, comment: demo.comment.trim() }
    }
    return override
  })

  if (overrides.length > 0 || demoSeeds.length === 0) {
    return enriched
  }

  return demoSeeds
}

function getRecord(applicationId: string): ApplicationVerificationRecord {
  const store = readStore()
  const persisted = store[applicationId]
  const demoSeeds = getDemoVerificationSeeds(applicationId)

  if (!persisted) {
    if (demoSeeds) {
      return {
        applicationId,
        documentOverrides: demoSeeds,
        operationalStatus: 'Correction Required',
      }
    }
    return {
      applicationId,
      documentOverrides: [],
    }
  }

  const documentOverrides = enrichPersistedOverrides(applicationId, persisted.documentOverrides)

  if (documentOverrides.length === 0 && demoSeeds) {
    return {
      ...persisted,
      documentOverrides: demoSeeds,
      operationalStatus: persisted.operationalStatus ?? 'Correction Required',
    }
  }

  return {
    ...persisted,
    documentOverrides,
  }
}

function saveRecord(record: ApplicationVerificationRecord) {
  const store = readStore()
  store[record.applicationId] = record
  writeStore(store)
}

function applyOverridesToRow(
  row: UploadQueueRow,
  overrides: VerificationDocumentOverride[],
  applicationId: string,
): UploadQueueRow {
  const rowOverrides = overrides.filter(
    o => o.scope === 'traveler' && overrideMatchesRow(row, o),
  )

  const documents = row.documents.map(doc => {
    const override = rowOverrides.find(o => o.documentId === doc.documentId)
    if (!override) {
      if (doc.status !== 'rejected' && doc.status !== 'needs_review') return doc
      if (doc.reviewComment?.trim()) return doc
      return {
        ...doc,
        reviewComment:
          doc.status === 'rejected'
            ? 'Document rejected by GLTS team. Please re-upload a corrected document.'
            : 'Re-upload requested by GLTS team. Please upload an updated document.',
      }
    }
    return {
      ...doc,
      status: override.status,
      reviewComment: resolveOverrideComment(applicationId, override),
    }
  })

  if (rowOverrides.length === 0) {
    const hasCommentUpdates = documents.some(
      (doc, index) => doc.reviewComment !== row.documents[index]?.reviewComment,
    )
    return hasCommentUpdates ? withDocumentProgress({ ...row, documents }) : row
  }

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
    applyOverridesToRow(row, record.documentOverrides, applicationId),
  )
  const operationalStatus =
    record.operationalStatus ??
    deriveOperationalStatusFromRows(uploadQueueRows, detail.operationalStatus)

  const commentCorrections = record.documentOverrides
    .filter(
      override =>
        override.status === 'rejected' || override.status === 'needs_review',
    )
    .map((override, index) => {
      if (override.scope === 'traveler') {
        const row = uploadQueueRows.find(r => overrideMatchesRow(r, override))
        const document = row?.documents.find(doc => doc.documentId === override.documentId)
        return {
          id: `ovr-${override.scope}-${override.travelerRowId ?? 'none'}-${override.documentId}-${index}`,
          field: row ? `${document?.name ?? override.documentId} · ${row.travelerName}` : (document?.name ?? override.documentId),
          reason: resolveOverrideComment(applicationId, override) ?? 'Re-upload requested',
          status: 'Open',
        }
      }
      const globalDoc = REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS.find(
        doc => doc.documentId === override.documentId,
      )
      return {
        id: `ovr-global-${override.documentId}-${index}`,
        field: globalDoc ? `${globalDoc.name} · Global` : `${override.documentId} · Global`,
        reason: resolveOverrideComment(applicationId, override) ?? 'Re-upload requested',
        status: 'Open',
      }
    })

  const corrections =
    commentCorrections.length > 0
      ? commentCorrections
      : operationalStatus === 'Correction Required'
        ? uploadQueueRows.flatMap(row =>
            row.documents
              .filter(d => d.status === 'rejected' || d.status === 'needs_review')
              .map((d, index) => ({
                id: `${row.id}-${d.documentId}-${index}`,
                field: `${d.name} · ${row.travelerName}`,
                reason:
                  d.reviewComment?.trim() ||
                  (d.status === 'rejected'
                    ? 'Document rejected by GLTS team. Please re-upload a corrected document.'
                    : 'Re-upload requested by GLTS team. Please upload an updated document.'),
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
    const detail = customerPortalService.getApplicationDetail(applicationId, {
      ignoreAccessControl: true,
    })
    return { ok: true as const, listingRow, detail }
  },

  getMergedDetail(applicationId: string): ApplicationDetailViewModel {
    return customerPortalService.getApplicationDetail(applicationId, {
      ignoreAccessControl: true,
    })
  },

  updateTravelerDocumentStatus(
    applicationId: string,
    travelerRowId: string,
    documentId: string,
    status: ApplicantDocumentStatus,
    comment?: string,
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
          comment: comment?.trim() ? comment.trim() : undefined,
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
    comment?: string,
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
          comment: comment?.trim() ? comment.trim() : undefined,
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
    if (override) {
      return {
        documentId: doc.documentId,
        name: doc.name,
        required: doc.required,
        status: override.status,
        reviewComment: resolveOverrideComment(applicationId, override),
      }
    }
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
