import {
  GLTS_BATCH_IDS,
  MARINE_GLTS_ARRANGED_DEMO_APPLICATION_ID,
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
import {
  emptyInsuranceWorkflow,
  emptyTravelTicketWorkflow,
  isSimpleDocumentRequirement,
  seedSimpleDocumentWorkflowFields,
  type DocumentHandlingMode,
  type InsuranceWorkflow,
  type TravelTicketWorkflow,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'

const VERIFICATION_STORAGE_KEY = 'glts:application-verification'

export type VerificationDocumentScope = 'traveler' | 'global'

export interface VerificationDocumentOverride {
  scope: VerificationDocumentScope
  travelerRowId?: string
  documentId: string
  status: ApplicantDocumentStatus
  comment?: string
  /**
   * When false, rejection is admin-only (e.g. QC during Submission Pending).
   * Customer portal is notified only after Verification Pending confirms it.
   * Defaults to true for backward compatibility.
   */
  customerVisible?: boolean
  /** Admin-uploaded replacement file name for non-workflow documents. */
  uploadedFileName?: string
  /** Physical original received by GLTS operations. */
  originalDocumentReceived?: boolean
  updatedAt: string
}

export interface VerificationDocumentWorkflowPatch {
  scope: VerificationDocumentScope
  travelerRowId?: string
  documentId: string
  handlingMode?: DocumentHandlingMode
  travelTicket?: Partial<TravelTicketWorkflow>
  insurance?: Partial<InsuranceWorkflow>
  status?: ApplicantDocumentStatus
  uploadedFileName?: string
  updatedAt: string
}

export interface ApplicationVerificationRecord {
  applicationId: string
  operationalStatus?: ApplicationOperationalStatus
  draftSavedAt?: string
  submittedAt?: string
  documentOverrides: VerificationDocumentOverride[]
  documentWorkflowPatches?: VerificationDocumentWorkflowPatch[]
  /** Per-traveler original document collection intake keyed by upload queue row id. */
  originalDocumentCollections?: Record<string, OriginalDocumentCollectionState>
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
      {
        scope: 'traveler',
        travelerRowId: `${applicationId}-q1`,
        documentId: 'travel-ticket',
        status: 'missing',
        comment: 'Upload confirmed flight itinerary with applicant name matching the passport.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId: `${applicationId}-q1`,
        documentId: 'insurance',
        status: 'needs_review',
        comment: 'Insurance must cover the full stay period and Schengen minimum coverage.',
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
        scope: 'traveler',
        travelerRowId: 'q1',
        documentId: 'travel-ticket',
        status: 'missing',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId: 'q1',
        documentId: 'insurance',
        status: 'missing',
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
        customerVisible: true,
        comment: 'Upload the last 3 months of bank statements with account holder name matching the passport.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId: `${applicationId}-q1`,
        documentId: 'travel-ticket',
        status: 'needs_review',
        comment: 'Flight reservation must show entry and exit dates aligned with the visa application.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId: `${applicationId}-q1`,
        documentId: 'insurance',
        status: 'missing',
        comment: 'Upload travel medical insurance meeting Schengen coverage requirements.',
        updatedAt,
      },
    ]
  }

  // Marine Verification Pending — Marco Silva: both Ops + Document team rejected cards.
  if (applicationId === 'GLTS-APP-2026-881') {
    const travelerRowId = `${applicationId}-q1`
    return [
      {
        scope: 'traveler',
        travelerRowId,
        documentId: 'itinerary',
        status: 'rejected',
        customerVisible: true,
        comment: 'Itinerary must cover the full stay in France with day-by-day addresses matching the invitation letter.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId,
        documentId: 'bank',
        status: 'rejected',
        customerVisible: true,
        comment: 'Bank statement must show the last 90 days and account holder name matching the passport.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId,
        documentId: 'photo',
        status: 'rejected',
        customerVisible: false,
        comment: 'Photo background is not plain white. Documents team flagged during Submission Pending — Ops to confirm or upload replacement.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId,
        documentId: 'travel-ticket',
        status: 'rejected',
        customerVisible: false,
        comment: 'Flight reservation name does not match passport. Internal only until Ops rejects again or uploads a replacement.',
        updatedAt,
      },
    ]
  }

  // Marine Verification Pending — Jonas Berg: Document Rejected queue with Document team handoff.
  if (applicationId === 'GLTS-APP-2026-887') {
    const travelerRowId = `${applicationId}-q1`
    return [
      {
        scope: 'traveler',
        travelerRowId,
        documentId: 'bank',
        status: 'rejected',
        customerVisible: false,
        comment: 'Statement period does not cover travel dates. Flagged by Documents team in Submission Pending.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId,
        documentId: 'insurance',
        status: 'rejected',
        customerVisible: false,
        comment: 'Insurance certificate missing Schengen minimum coverage amount. Internal — upload or reject again for customer.',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId,
        documentId: 'passport',
        status: 'rejected',
        customerVisible: true,
        comment: 'Passport bio page is cropped. Re-upload a full clear scan — visible in the customer portal.',
        updatedAt,
      },
    ]
  }

  return undefined
}

function getDemoWorkflowPatches(applicationId: string): VerificationDocumentWorkflowPatch[] | undefined {
  const updatedAt = new Date().toISOString()

  if (applicationId === GLTS_BATCH_IDS.schengenCrew) {
    return [
      {
        scope: 'traveler',
        travelerRowId: 'q1',
        documentId: 'travel-ticket',
        handlingMode: 'arrange_by_glts',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId: 'q1',
        documentId: 'insurance',
        handlingMode: 'arrange_by_glts',
        updatedAt,
      },
    ]
  }

  if (applicationId === MARINE_GLTS_ARRANGED_DEMO_APPLICATION_ID) {
    return [
      {
        scope: 'traveler',
        travelerRowId: `${MARINE_GLTS_ARRANGED_DEMO_APPLICATION_ID}-q1`,
        documentId: 'travel-ticket',
        handlingMode: 'arrange_by_glts',
        updatedAt,
      },
      {
        scope: 'traveler',
        travelerRowId: `${MARINE_GLTS_ARRANGED_DEMO_APPLICATION_ID}-q1`,
        documentId: 'insurance',
        handlingMode: 'arrange_by_glts',
        updatedAt,
      },
    ]
  }

  return undefined
}

function travelerPatchMatchesRow(
  row: UploadQueueRow,
  patch: { scope: VerificationDocumentScope; travelerRowId?: string },
): boolean {
  if (patch.scope !== 'traveler') return false
  const travelerKey = patch.travelerRowId
  if (!travelerKey) return false
  return (
    travelerKey === row.id ||
    travelerKey === row.gltsApplicantId ||
    (Boolean(row.gltsApplicationId) &&
      travelerKey === `${row.gltsApplicationId}-q${row.sequenceNo}`)
  )
}

function overrideMatchesRow(row: UploadQueueRow, override: VerificationDocumentOverride): boolean {
  return travelerPatchMatchesRow(row, override)
}

/** Prefer the newest override when duplicates exist for the same document. */
function pickLatestOverride(
  overrides: VerificationDocumentOverride[],
): VerificationDocumentOverride | undefined {
  if (overrides.length === 0) return undefined
  return [...overrides].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))[0]
}

function resolveUploadQueueRows(applicationId: string): UploadQueueRow[] {
  const detail = customerPortalService.getApplicationDetail(applicationId, {
    ignoreAccessControl: true,
  })
  return detail.uploadQueueRows ?? []
}

function resolveTravelerRow(
  applicationId: string,
  travelerRowId: string,
): UploadQueueRow | undefined {
  const rows = resolveUploadQueueRows(applicationId)
  return rows.find(
    row =>
      row.id === travelerRowId ||
      row.gltsApplicantId === travelerRowId ||
      (Boolean(row.gltsApplicationId) &&
        `${row.gltsApplicationId}-q${row.sequenceNo}` === travelerRowId),
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

function overrideSeedKey(override: VerificationDocumentOverride): string {
  return override.scope === 'traveler'
    ? `traveler:${override.travelerRowId ?? ''}:${override.documentId}`
    : `global:${override.documentId}`
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

  if (demoSeeds.length === 0) return enriched

  if (overrides.length === 0) return demoSeeds

  // Keep user overrides, and backfill any demo seed docs that are not persisted yet
  // (so Verification Pending demos still show Ops + Document team cards).
  const existingKeys = new Set(enriched.map(overrideSeedKey))
  const missingSeeds = demoSeeds.filter(seed => !existingKeys.has(overrideSeedKey(seed)))
  return missingSeeds.length > 0 ? [...enriched, ...missingSeeds] : enriched
}

function demoSeedsOperationalStatus(
  seeds: VerificationDocumentOverride[],
): ApplicationOperationalStatus {
  const hasInternalRejection = seeds.some(
    o =>
      (o.status === 'rejected' || o.status === 'needs_review') && o.customerVisible === false,
  )
  return hasInternalRejection ? 'Document Rejected' : 'Correction Required'
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
        documentWorkflowPatches: getDemoWorkflowPatches(applicationId) ?? [],
        operationalStatus: demoSeedsOperationalStatus(demoSeeds),
      }
    }
    return {
      applicationId,
      documentOverrides: [],
      documentWorkflowPatches: [],
    }
  }

  const documentOverrides = enrichPersistedOverrides(applicationId, persisted.documentOverrides)

  if (documentOverrides.length === 0 && demoSeeds) {
    return {
      ...persisted,
      documentOverrides: demoSeeds,
      documentWorkflowPatches:
        persisted.documentWorkflowPatches?.length
          ? persisted.documentWorkflowPatches
          : (getDemoWorkflowPatches(applicationId) ?? []),
      operationalStatus: persisted.operationalStatus ?? 'Correction Required',
    }
  }

  const workflowPatches =
    persisted.documentWorkflowPatches?.length
      ? persisted.documentWorkflowPatches
      : (getDemoWorkflowPatches(applicationId) ?? [])

  return {
    ...persisted,
    documentOverrides,
    documentWorkflowPatches: workflowPatches,
  }
}

function applyWorkflowPatchToDocument(
  doc: ApplicantDocumentItem,
  patch: VerificationDocumentWorkflowPatch,
): ApplicantDocumentItem {
  if (doc.documentId !== patch.documentId) {
    return doc
  }

  let next: ApplicantDocumentItem = { ...doc }
  if (patch.uploadedFileName?.trim()) {
    next.uploadedFileName = patch.uploadedFileName.trim()
  }
  if (isSimpleDocumentRequirement(doc.documentId)) {
    if (patch.handlingMode) {
      next.handlingMode = patch.handlingMode
    }
    if (patch.travelTicket && doc.documentId === 'travel-ticket') {
      next.travelTicket = {
        ...(doc.travelTicket ?? emptyTravelTicketWorkflow()),
        ...patch.travelTicket,
      }
    }
    if (patch.insurance && doc.documentId === 'insurance') {
      next.insurance = {
        ...(doc.insurance ?? emptyInsuranceWorkflow()),
        ...patch.insurance,
      }
    }
    next = seedSimpleDocumentWorkflowFields(next)
  }
  if (patch.status) {
    next.status = patch.status
  }
  return next
}

function isCustomerVisibleOverride(override: VerificationDocumentOverride): boolean {
  if (override.status !== 'rejected' && override.status !== 'needs_review') {
    return true
  }
  return override.customerVisible !== false
}

function saveRecord(record: ApplicationVerificationRecord) {
  const store = readStore()
  store[record.applicationId] = record
  writeStore(store)
}

function applyOverridesToRow(
  row: UploadQueueRow,
  overrides: VerificationDocumentOverride[],
  workflowPatches: VerificationDocumentWorkflowPatch[],
  applicationId: string,
  originalCollection?: OriginalDocumentCollectionState,
  forCustomer = false,
): UploadQueueRow {
  const rowOverrides = overrides.filter(
    o => o.scope === 'traveler' && overrideMatchesRow(row, o),
  )
  const rowWorkflowPatches = workflowPatches.filter(p => travelerPatchMatchesRow(row, p))

  const documents = row.documents.map(doc => {
    let next = doc
    const override = pickLatestOverride(rowOverrides.filter(o => o.documentId === doc.documentId))
    if (override) {
      if (forCustomer && !isCustomerVisibleOverride(override)) {
        // Internal QC rejection — keep pre-rejection document for customer portal.
      } else {
        next = {
          ...next,
          status: override.status,
          reviewComment: resolveOverrideComment(applicationId, override),
          ...(override.uploadedFileName?.trim()
            ? { uploadedFileName: override.uploadedFileName.trim() }
            : {}),
          ...(override.originalDocumentReceived !== undefined
            ? { originalDocumentReceived: override.originalDocumentReceived }
            : {}),
        }
      }
    } else if (next.status === 'rejected' || next.status === 'needs_review') {
      if (!forCustomer && !next.reviewComment?.trim()) {
        next = {
          ...next,
          reviewComment:
            next.status === 'rejected'
              ? 'Document rejected by GLTS team. Please re-upload a corrected document.'
              : 'Re-upload requested by GLTS team. Please upload an updated document.',
        }
      }
    }

    const workflowPatch = rowWorkflowPatches.find(p => p.documentId === doc.documentId)
    if (workflowPatch) {
      next = applyWorkflowPatchToDocument(next, workflowPatch)
    }

    return next
  })

  const hasDocChanges =
    rowOverrides.length > 0 ||
    rowWorkflowPatches.length > 0 ||
    documents.some((doc, index) => doc !== row.documents[index])

  let nextRow = hasDocChanges ? withDocumentProgress({ ...row, documents }) : row
  const collection = originalCollection ?? row.originalDocumentCollection
  if (collection) {
    nextRow = { ...nextRow, originalDocumentCollection: collection }
  }
  return nextRow
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

function hasCustomerVisibleRejectedOrReview(overrides: VerificationDocumentOverride[]): boolean {
  return overrides.some(
    o =>
      (o.status === 'rejected' || o.status === 'needs_review') && isCustomerVisibleOverride(o),
  )
}

function hasInternalRejectedOrReview(overrides: VerificationDocumentOverride[]): boolean {
  return overrides.some(
    o =>
      (o.status === 'rejected' || o.status === 'needs_review') && !isCustomerVisibleOverride(o),
  )
}

export function deriveOperationalStatusFromRows(
  rows: UploadQueueRow[],
  current?: ApplicationOperationalStatus | string,
  overrides: VerificationDocumentOverride[] = [],
): ApplicationOperationalStatus {
  if (hasCustomerVisibleRejectedOrReview(overrides) || (overrides.length === 0 && hasRejectedOrReview(rows))) {
    return 'Correction Required'
  }
  if (hasInternalRejectedOrReview(overrides) || hasRejectedOrReview(rows)) {
    return 'Document Rejected'
  }
  if (allRequiredVerified(rows)) return 'Verification Pending'
  if (current === 'Submitted') return 'Under Review'
  return (current as ApplicationOperationalStatus) ?? 'Under Review'
}

export interface MergeVerificationOptions {
  /** When true, hide internal (non-customerVisible) rejections from the merged detail. */
  forCustomer?: boolean
}

export function mergeVerificationIntoDetail(
  detail: ApplicationDetailViewModel,
  applicationId: string,
  options?: MergeVerificationOptions,
): ApplicationDetailViewModel {
  const forCustomer = options?.forCustomer === true
  const record = getRecord(applicationId)
  const uploadQueueRows = detail.uploadQueueRows.map(row =>
    applyOverridesToRow(
      row,
      record.documentOverrides,
      record.documentWorkflowPatches ?? [],
      applicationId,
      record.originalDocumentCollections?.[row.id],
      forCustomer,
    ),
  )
  const operationalStatus =
    record.operationalStatus ??
    deriveOperationalStatusFromRows(uploadQueueRows, detail.operationalStatus, record.documentOverrides)

  const commentCorrections = record.documentOverrides
    .filter(
      override =>
        (override.status === 'rejected' || override.status === 'needs_review') &&
        (!forCustomer || isCustomerVisibleOverride(override)),
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
      : !forCustomer && operationalStatus === 'Correction Required'
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
        : forCustomer && operationalStatus === 'Correction Required'
          ? detail.corrections
          : detail.corrections

  // Customer portal should not surface Document Rejected (internal admin queue state).
  const customerOperationalStatus =
    forCustomer && operationalStatus === 'Document Rejected'
      ? ((detail.operationalStatus as ApplicationOperationalStatus | undefined) ?? 'Under Review')
      : operationalStatus

  return {
    ...detail,
    uploadQueueRows,
    operationalStatus: forCustomer ? customerOperationalStatus : operationalStatus,
    corrections: forCustomer && operationalStatus === 'Document Rejected' ? [] : corrections,
    application: detail.application
      ? {
          ...detail.application,
          statusLabel: forCustomer ? customerOperationalStatus : operationalStatus,
        }
      : null,
  }
}

function findListingRow(applicationId: string): SingleApplicationRow | BulkBatchRow | undefined {
  return (
    mockSingleApplications.find(r => r.id === applicationId) ??
    mockBulkBatches.find(r => r.id === applicationId)
  )
}

function findTravelerDocumentOverride(
  record: ApplicationVerificationRecord,
  travelerRowId: string,
  documentId: string,
  row?: UploadQueueRow,
): VerificationDocumentOverride | undefined {
  const matches = record.documentOverrides.filter(o => {
    if (o.scope !== 'traveler' || o.documentId !== documentId) return false
    if (row) return overrideMatchesRow(row, o)
    return o.travelerRowId === travelerRowId
  })
  return pickLatestOverride(matches)
}

function removeTravelerDocumentOverrides(
  overrides: VerificationDocumentOverride[],
  travelerRowId: string,
  documentId: string,
  row?: UploadQueueRow,
): VerificationDocumentOverride[] {
  return overrides.filter(o => {
    if (o.scope !== 'traveler' || o.documentId !== documentId) return true
    if (row) return !overrideMatchesRow(row, o)
    return o.travelerRowId !== travelerRowId
  })
}

export const applicationVerificationService = {
  getWorkspace(applicationId: string) {
    const listingRow = findListingRow(applicationId)
    if (!listingRow) {
      return { ok: false as const, listingRow: undefined, detail: undefined }
    }
    const detail = customerPortalService.getApplicationDetail(applicationId, {
      ignoreAccessControl: true,
    })
    return { ok: true as const, listingRow, detail }
  },

  /**
   * Resolve canonical upload-queue row id for a passenger so ground ops and
   * application-management share the same processing-timeline cursor.
   */
  resolveTravelerRowId(
    applicationId: string,
    gltsApplicantId?: string,
    passengerSequence?: number,
  ): string | undefined {
    const rows = resolveUploadQueueRows(applicationId)
    if (rows.length === 0) return undefined
    if (gltsApplicantId) {
      const byApplicant = rows.find(row => row.gltsApplicantId === gltsApplicantId)
      if (byApplicant) return byApplicant.id
      const byKey = resolveTravelerRow(applicationId, gltsApplicantId)
      if (byKey) return byKey.id
    }
    if (passengerSequence != null) {
      const bySequence = rows.find(row => row.sequenceNo === passengerSequence)
      if (bySequence) return bySequence.id
    }
    if (rows.length === 1) return rows[0].id
    return undefined
  },

  getMergedDetail(applicationId: string): ApplicationDetailViewModel {
    return customerPortalService.getApplicationDetail(applicationId, {
      ignoreAccessControl: true,
    })
  },

  /** Visibility map for rejected docs: key `traveler:{rowId}:{docId}` or `global:{docId}`. */
  getRejectionVisibilityMap(applicationId: string): Record<string, boolean> {
    const record = getRecord(applicationId)
    const rows = resolveUploadQueueRows(applicationId)
    const map: Record<string, boolean> = {}
    for (const override of record.documentOverrides) {
      if (override.status !== 'rejected' && override.status !== 'needs_review') continue
      const visible = override.customerVisible !== false
      if (override.scope === 'global') {
        map[`global:${override.documentId}`] = visible
        continue
      }
      if (override.travelerRowId) {
        map[`traveler:${override.travelerRowId}:${override.documentId}`] = visible
      }
      const row = rows.find(r => overrideMatchesRow(r, override))
      if (row) {
        map[`traveler:${row.id}:${override.documentId}`] = visible
        if (row.gltsApplicantId) {
          map[`traveler:${row.gltsApplicantId}:${override.documentId}`] = visible
        }
      }
    }
    return map
  },

  updateTravelerDocumentStatus(
    applicationId: string,
    travelerRowId: string,
    documentId: string,
    status: ApplicantDocumentStatus,
    comment?: string,
    options?: { customerVisible?: boolean },
  ) {
    const record = getRecord(applicationId)
    const row = resolveTravelerRow(applicationId, travelerRowId)
    const canonicalTravelerRowId = row?.id ?? travelerRowId
    const existing = findTravelerDocumentOverride(record, travelerRowId, documentId, row)
    const without = removeTravelerDocumentOverrides(
      record.documentOverrides,
      travelerRowId,
      documentId,
      row,
    )
    const isRejection = status === 'rejected' || status === 'needs_review'
    const customerVisible = isRejection
      ? (options?.customerVisible ?? existing?.customerVisible ?? true)
      : true
    const next: ApplicationVerificationRecord = {
      ...record,
      documentOverrides: [
        ...without,
        {
          scope: 'traveler',
          travelerRowId: canonicalTravelerRowId,
          documentId,
          status,
          comment: comment?.trim() ? comment.trim() : undefined,
          customerVisible,
          uploadedFileName: existing?.uploadedFileName,
          originalDocumentReceived: existing?.originalDocumentReceived,
          updatedAt: new Date().toISOString(),
        },
      ],
    }
    saveRecord(next)
    return this.getWorkspace(applicationId)
  },

  updateTravelerOriginalDocumentReceived(
    applicationId: string,
    travelerRowId: string,
    documentId: string,
    received: boolean,
  ) {
    const record = getRecord(applicationId)
    const row = resolveTravelerRow(applicationId, travelerRowId)
    const canonicalTravelerRowId = row?.id ?? travelerRowId
    const existing = findTravelerDocumentOverride(record, travelerRowId, documentId, row)
    const workspace = this.getWorkspace(applicationId)
    let status: ApplicantDocumentStatus = existing?.status ?? 'uploaded'
    if (workspace.ok && workspace.detail) {
      const matchedRow =
        workspace.detail.uploadQueueRows.find(r => r.id === canonicalTravelerRowId) ?? row
      const doc = matchedRow?.documents.find(d => d.documentId === documentId)
      if (doc) status = doc.status
    }
    const without = removeTravelerDocumentOverrides(
      record.documentOverrides,
      travelerRowId,
      documentId,
      row,
    )
    const next: ApplicationVerificationRecord = {
      ...record,
      documentOverrides: [
        ...without,
        {
          scope: 'traveler',
          travelerRowId: canonicalTravelerRowId,
          documentId,
          status,
          comment: existing?.comment,
          originalDocumentReceived: received,
          updatedAt: new Date().toISOString(),
        },
      ],
    }
    saveRecord(next)
    return this.getWorkspace(applicationId)
  },

  updateTravelerOriginalCollection(
    applicationId: string,
    travelerRowId: string,
    collection: OriginalDocumentCollectionState,
  ) {
    const record = getRecord(applicationId)
    const row = resolveTravelerRow(applicationId, travelerRowId)
    const canonicalTravelerRowId = row?.id ?? travelerRowId

    // Client send plan only — do not sync selected-to-send flags into ops receipt
    // (`originalDocumentReceived` is owned by updateTravelerOriginalDocumentReceived).
    const next: ApplicationVerificationRecord = {
      ...record,
      originalDocumentCollections: {
        ...(record.originalDocumentCollections ?? {}),
        [canonicalTravelerRowId]: collection,
      },
    }

    saveRecord(next)
    return this.getWorkspace(applicationId)
  },

  updateTravelerDocumentWorkflow(
    applicationId: string,
    travelerRowId: string,
    documentId: string,
    patch: {
      handlingMode?: DocumentHandlingMode
      travelTicket?: Partial<TravelTicketWorkflow>
      insurance?: Partial<InsuranceWorkflow>
      status?: ApplicantDocumentStatus
      uploadedFileName?: string
    },
  ) {
    const record = getRecord(applicationId)
    const without = (record.documentWorkflowPatches ?? []).filter(
      p =>
        !(
          p.scope === 'traveler' &&
          p.travelerRowId === travelerRowId &&
          p.documentId === documentId
        ),
    )
    const workflowPatch: VerificationDocumentWorkflowPatch = {
      scope: 'traveler',
      travelerRowId,
      documentId,
      handlingMode: patch.handlingMode,
      travelTicket: patch.travelTicket,
      insurance: patch.insurance,
      status: patch.status,
      uploadedFileName: patch.uploadedFileName,
      updatedAt: new Date().toISOString(),
    }
    const next: ApplicationVerificationRecord = {
      ...record,
      documentWorkflowPatches: [...without, workflowPatch],
    }
    if (patch.status || patch.uploadedFileName) {
      const row = resolveTravelerRow(applicationId, travelerRowId)
      const canonicalTravelerRowId = row?.id ?? travelerRowId
      const existing = findTravelerDocumentOverride(record, travelerRowId, documentId, row)
      const statusWithout = removeTravelerDocumentOverrides(
        record.documentOverrides,
        travelerRowId,
        documentId,
        row,
      )
      next.documentOverrides = [
        ...statusWithout,
        {
          scope: 'traveler',
          travelerRowId: canonicalTravelerRowId,
          documentId,
          status: patch.status ?? existing?.status ?? 'uploaded',
          uploadedFileName: patch.uploadedFileName?.trim() || existing?.uploadedFileName,
          customerVisible: true,
          originalDocumentReceived: existing?.originalDocumentReceived,
          updatedAt: workflowPatch.updatedAt,
        },
      ]
    }
    saveRecord(next)
    return this.getWorkspace(applicationId)
  },

  updateGlobalDocumentStatus(
    applicationId: string,
    documentId: string,
    status: ApplicantDocumentStatus,
    comment?: string,
    options?: { customerVisible?: boolean },
  ) {
    const record = getRecord(applicationId)
    const existing = record.documentOverrides.find(
      o => o.scope === 'global' && o.documentId === documentId,
    )
    const without = record.documentOverrides.filter(
      o => !(o.scope === 'global' && o.documentId === documentId),
    )
    const isRejection = status === 'rejected' || status === 'needs_review'
    const customerVisible = isRejection
      ? (options?.customerVisible ?? existing?.customerVisible ?? true)
      : true
    saveRecord({
      ...record,
      documentOverrides: [
        ...without,
        {
          scope: 'global',
          documentId,
          status,
          comment: comment?.trim() ? comment.trim() : undefined,
          customerVisible,
          uploadedFileName: existing?.uploadedFileName,
          updatedAt: new Date().toISOString(),
        },
      ],
    })
    return this.getWorkspace(applicationId)
  },

  /**
   * QC / Submission Pending rejection: keep app in Verification Pending with
   * Document Rejected status. Does not notify the customer portal.
   */
  returnToVerificationPending(applicationId: string) {
    const workspace = this.getWorkspace(applicationId)
    if (!workspace.ok || !workspace.detail) return workspace

    const record = getRecord(applicationId)
    const operationalStatus = deriveOperationalStatusFromRows(
      workspace.detail.uploadQueueRows,
      'Document Rejected',
      record.documentOverrides,
    )
    const nextStatus =
      operationalStatus === 'Correction Required' ? 'Document Rejected' : operationalStatus

    saveRecord({
      ...record,
      operationalStatus: nextStatus === 'Verification Pending' ? 'Document Rejected' : nextStatus,
    })
    syncListingOperationalStatus(applicationId, 'Document Rejected', {
      processingStage: 'Ready for submission',
    })
    return this.getWorkspace(applicationId)
  },

  /**
   * Verification Pending confirmation: publish rejections to the customer portal
   * and set Correction Required.
   */
  notifyCustomerOfDocumentRejection(applicationId: string) {
    const record = getRecord(applicationId)
    const documentOverrides = record.documentOverrides.map(override => {
      if (override.status !== 'rejected' && override.status !== 'needs_review') {
        return override
      }
      return { ...override, customerVisible: true }
    })
    saveRecord({
      ...record,
      documentOverrides,
      operationalStatus: 'Correction Required',
      submittedAt: new Date().toISOString(),
    })
    syncListingOperationalStatus(applicationId, 'Correction Required', {
      processingStage: 'Ready for submission',
    })
    return this.getWorkspace(applicationId)
  },

  saveDraft(applicationId: string) {
    const workspace = this.getWorkspace(applicationId)
    if (!workspace.ok || !workspace.detail) return workspace

    const record = getRecord(applicationId)
    const operationalStatus = deriveOperationalStatusFromRows(
      workspace.detail.uploadQueueRows,
      workspace.detail.operationalStatus,
      record.documentOverrides,
    )
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

    const record = getRecord(applicationId)
    const hasRejection = record.documentOverrides.some(
      o => o.status === 'rejected' || o.status === 'needs_review',
    )

    if (hasRejection) {
      // Verification Pending submit with rejections → notify customer.
      return this.notifyCustomerOfDocumentRejection(applicationId)
    }

    const operationalStatus = deriveOperationalStatusFromRows(
      workspace.detail.uploadQueueRows,
      workspace.detail.operationalStatus,
      record.documentOverrides,
    )
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
  extras?: { processingStage?: string },
) {
  const single = mockSingleApplications.find(r => r.id === applicationId)
  if (single) {
    single.operationalStatus = operationalStatus
    single.status = operationalStatus
    if (extras?.processingStage) {
      single.processingStage = extras.processingStage
    }
    return
  }
  const bulk = mockBulkBatches.find(r => r.id === applicationId)
  if (bulk) {
    bulk.operationalStatus = operationalStatus
    bulk.status = operationalStatus
    if (extras?.processingStage) {
      bulk.processingStage = extras.processingStage
    }
    if (operationalStatus === 'Correction Required' || operationalStatus === 'Document Rejected') {
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
