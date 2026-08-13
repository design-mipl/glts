import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { ApplicationOperationalStatus } from '@/pages/customer/features/applications/types/applicationListing.types'
import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { statusToneFromOperational } from '@/pages/customer/features/applications/components/listing/applicationStatus'

/** Queue tabs shared by Marine / Corporate / B2B application listings. */
export type ApplicationManagementQueueTab =
  | 'draft'
  | 'verification_pending'
  | 'online_submission_pending'
  | 'pending_payment'
  | 'vfs_submission_pending'
  | 'collection_pending'
  | 'collected'
  | 'dispatched'

export const APPLICATION_QUEUE_STATUSES = {
  verificationPending: 'Verification Pending',
  opsCorrection: 'Ops · Correction Required',
  opsMissing: 'Ops · Document Missing',
  docsCorrection: 'Docs · Correction Required',
  docsMissing: 'Docs · Document Missing / Blocked',
  submissionPending: 'Submission Pending',
  formPending: 'Form Pending',
  pendingPayment: 'Pending Payment',
  embassyVfsPending: 'Embassy/VFS Submission Pending',
} as const

export type ApplicationQueueStatusLabel =
  (typeof APPLICATION_QUEUE_STATUSES)[keyof typeof APPLICATION_QUEUE_STATUSES]

const VERIFICATION_PENDING_STATUSES = new Set<string>([
  'Submitted',
  'Under Review',
  'Verification Pending',
  'Document Rejected',
  'Pending Documents',
  'Correction Required',
  APPLICATION_QUEUE_STATUSES.opsCorrection,
  APPLICATION_QUEUE_STATUSES.opsMissing,
  APPLICATION_QUEUE_STATUSES.docsCorrection,
  APPLICATION_QUEUE_STATUSES.docsMissing,
])

const POST_VERIFY_DUAL_QUEUE_STATUSES = new Set<string>([
  APPLICATION_QUEUE_STATUSES.submissionPending,
  APPLICATION_QUEUE_STATUSES.formPending,
  APPLICATION_QUEUE_STATUSES.pendingPayment,
  /** Legacy: ready for docs after verify */
  'Submitted',
])

export type OpsVerificationOutcome = 'ready' | 'correction' | 'missing'
export type DocsQcOutcome = 'ready' | 'correction' | 'blocked'

export function statusFromOpsVerificationOutcome(
  outcome: OpsVerificationOutcome,
): ApplicationOperationalStatus {
  if (outcome === 'correction') return APPLICATION_QUEUE_STATUSES.opsCorrection
  if (outcome === 'missing') return APPLICATION_QUEUE_STATUSES.opsMissing
  return APPLICATION_QUEUE_STATUSES.submissionPending
}

export function statusFromDocsQcOutcome(outcome: DocsQcOutcome): ApplicationOperationalStatus {
  if (outcome === 'correction') return APPLICATION_QUEUE_STATUSES.docsCorrection
  if (outcome === 'blocked') return APPLICATION_QUEUE_STATUSES.docsMissing
  return APPLICATION_QUEUE_STATUSES.formPending
}

export function isDocsBounceStatus(status: string): boolean {
  return (
    status === APPLICATION_QUEUE_STATUSES.docsCorrection ||
    status === APPLICATION_QUEUE_STATUSES.docsMissing
  )
}

export function isOpsBounceStatus(status: string): boolean {
  return (
    status === APPLICATION_QUEUE_STATUSES.opsCorrection ||
    status === APPLICATION_QUEUE_STATUSES.opsMissing ||
    status === 'Correction Required' ||
    status === 'Document Rejected'
  )
}

export function isVerificationPendingStatus(status: string): boolean {
  return VERIFICATION_PENDING_STATUSES.has(status)
}

function isEmbassyVfsPendingRow(row: ApplicationListingRow): boolean {
  if (row.operationalStatus === APPLICATION_QUEUE_STATUSES.embassyVfsPending) return true
  if (row.operationalStatus === 'Appointment Booked') return true
  if (row.processingStage === 'Appointment booked') return true
  return false
}

function isPostVerifyDualQueueRow(row: ApplicationListingRow): boolean {
  if (isEmbassyVfsPendingRow(row)) return false
  if (isDocsBounceStatus(row.operationalStatus) || isOpsBounceStatus(row.operationalStatus)) {
    return false
  }
  if (POST_VERIFY_DUAL_QUEUE_STATUSES.has(row.operationalStatus)) return true
  if (row.processingStage === 'Payment pending') return true
  if (row.processingStage === 'Submitted') return true
  return false
}

/**
 * Primary queue for workspace mode / SLA (single answer).
 * Listing filters use {@link isApplicationInManagementQueueTab} for dual membership.
 */
export function resolveApplicationManagementPrimaryQueue(
  row: ApplicationListingRow,
): ApplicationManagementQueueTab | null {
  if (row.operationalStatus === 'Draft') return 'draft'

  if (row.operationalStatus === 'Completed' || row.processingStage === 'Delivered') {
    return 'dispatched'
  }

  if (row.processingStage === 'Dispatch' || row.operationalStatus === 'Passport Ready') {
    return 'collected'
  }

  if (row.processingStage === 'Embassy processing') {
    return 'collection_pending'
  }

  if (isEmbassyVfsPendingRow(row)) {
    return 'vfs_submission_pending'
  }

  if (isPostVerifyDualQueueRow(row)) {
    if (row.paymentComplete) return 'online_submission_pending'
    if (row.processingStage === 'Payment pending') return 'pending_payment'
    return 'online_submission_pending'
  }

  if (isVerificationPendingStatus(row.operationalStatus) && row.operationalStatus !== 'Submitted') {
    return 'verification_pending'
  }

  if (row.processingStage === 'Ready for submission') {
    return 'verification_pending'
  }

  return null
}

/** True when the row belongs on a listing tab (supports dual queue). */
export function isApplicationInManagementQueueTab(
  row: ApplicationListingRow,
  tab: ApplicationManagementQueueTab,
): boolean {
  if (row.operationalStatus === 'Draft') {
    return tab === 'draft'
  }

  if (row.operationalStatus === 'Completed' || row.processingStage === 'Delivered') {
    return tab === 'dispatched'
  }

  if (row.processingStage === 'Dispatch' || row.operationalStatus === 'Passport Ready') {
    return tab === 'collected'
  }

  if (row.processingStage === 'Embassy processing') {
    return tab === 'collection_pending'
  }

  if (isEmbassyVfsPendingRow(row)) {
    return tab === 'vfs_submission_pending'
  }

  if (isPostVerifyDualQueueRow(row)) {
    if (tab === 'online_submission_pending') return true
    if (tab === 'pending_payment') return !row.paymentComplete
    return false
  }

  if (
    (isVerificationPendingStatus(row.operationalStatus) && row.operationalStatus !== 'Submitted') ||
    row.processingStage === 'Ready for submission'
  ) {
    return tab === 'verification_pending'
  }

  return false
}

export function syncApplicationListingQueueState(
  applicationId: string,
  patch: {
    operationalStatus: ApplicationOperationalStatus
    processingStage?: string
    paymentComplete?: boolean
  },
): void {
  const lastUpdated = new Date().toISOString().slice(0, 10)
  const tone = statusToneFromOperational(patch.operationalStatus)

  const single = mockSingleApplications.find((r) => r.id === applicationId)
  if (single) {
    single.operationalStatus = patch.operationalStatus
    single.status = patch.operationalStatus
    single.statusTone = tone
    single.lastUpdated = lastUpdated
    if (patch.processingStage !== undefined) {
      single.processingStage = patch.processingStage
    }
    if (patch.paymentComplete !== undefined) {
      single.paymentComplete = patch.paymentComplete
    }
    return
  }

  const bulk = mockBulkBatches.find((r) => r.id === applicationId)
  if (bulk) {
    bulk.operationalStatus = patch.operationalStatus
    bulk.status = patch.operationalStatus
    bulk.statusTone = tone === 'draft' ? 'processing' : tone
    bulk.lastUpdated = lastUpdated
    if (patch.processingStage !== undefined) {
      bulk.processingStage = patch.processingStage
    }
    if (patch.paymentComplete !== undefined) {
      bulk.paymentComplete = patch.paymentComplete
    }
    if (
      patch.operationalStatus === 'Correction Required' ||
      patch.operationalStatus === 'Document Rejected' ||
      isDocsBounceStatus(patch.operationalStatus) ||
      isOpsBounceStatus(patch.operationalStatus)
    ) {
      bulk.pendingCorrections = Math.max(bulk.pendingCorrections, 1)
    }
  }
}

export function applyOpsVerificationOutcomeToListing(
  applicationId: string,
  outcome: OpsVerificationOutcome,
): ApplicationOperationalStatus {
  const status = statusFromOpsVerificationOutcome(outcome)
  syncApplicationListingQueueState(applicationId, {
    operationalStatus: status,
    paymentComplete: outcome === 'ready' ? false : undefined,
  })
  return status
}

export function applyDocsQcOutcomeToListing(
  applicationId: string,
  outcome: DocsQcOutcome,
): ApplicationOperationalStatus {
  const status = statusFromDocsQcOutcome(outcome)
  syncApplicationListingQueueState(applicationId, {
    operationalStatus: status,
  })
  return status
}

export function applyFormCompletelySubmittedToListing(applicationId: string): void {
  syncApplicationListingQueueState(applicationId, {
    operationalStatus: APPLICATION_QUEUE_STATUSES.embassyVfsPending,
    processingStage: 'Appointment booked',
  })
}

export function applyPaymentCompleteToListing(applicationId: string, complete: boolean): void {
  const row =
    mockSingleApplications.find((r) => r.id === applicationId) ??
    mockBulkBatches.find((r) => r.id === applicationId)
  if (!row) return

  row.paymentComplete = complete
  row.lastUpdated = new Date().toISOString().slice(0, 10)
}
