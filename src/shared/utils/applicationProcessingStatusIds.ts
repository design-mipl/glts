/** Shared Status Master ids used by processing timeline transitions. */
export const PROCESSING_STATUS_IDS = {
  allDocumentsReceived: 'status-all-documents-received',
  documentsUnderReview: 'status-documents-under-review',
  awaitingOnlineApproval: 'status-awaiting-online-approval',
  awaitingOnlineApprovalRejected: 'status-awaiting-online-approval-rejected',
  underEmbassyReview: 'status-under-embassy-consulate-review',
  visaStatus: 'status-visa-status',
  visaStatusApproved: 'status-visa-status-approved',
  visaStatusRefused: 'status-visa-status-refused',
  onHold: 'status-on-hold',
  passportCollected: 'status-passport-collected',
  dispatch: 'status-dispatch',
  delivered: 'status-delivered',
} as const

export const REJECT_WORKFLOW_ID = 'workflow-approval-rejected'

export const TERMINAL_PROCESSING_STATUS_IDS = new Set<string>([
  PROCESSING_STATUS_IDS.delivered,
])

export function isOnHoldStatus(statusId: string | undefined): boolean {
  return statusId === PROCESSING_STATUS_IDS.onHold
}

export function isRejectEligibleStatus(statusId: string | undefined): boolean {
  if (!statusId) return false
  return (
    statusId === PROCESSING_STATUS_IDS.awaitingOnlineApproval ||
    statusId === PROCESSING_STATUS_IDS.underEmbassyReview ||
    statusId === PROCESSING_STATUS_IDS.visaStatus ||
    statusId === PROCESSING_STATUS_IDS.visaStatusApproved
  )
}

export function mapProcessingStatusToOperational(
  statusId: string,
  statusName: string,
): string | undefined {
  if (statusId === PROCESSING_STATUS_IDS.onHold) return 'On Hold'
  if (
    statusId === PROCESSING_STATUS_IDS.visaStatusRefused ||
    statusId === PROCESSING_STATUS_IDS.awaitingOnlineApprovalRejected
  ) {
    return 'Rejected'
  }
  if (statusId === PROCESSING_STATUS_IDS.delivered) return 'Completed'
  if (statusId === PROCESSING_STATUS_IDS.passportCollected) return 'Passport Ready'
  if (statusId === PROCESSING_STATUS_IDS.dispatch) return 'Passport Ready'
  if (
    statusId === PROCESSING_STATUS_IDS.underEmbassyReview ||
    statusId === PROCESSING_STATUS_IDS.visaStatus ||
    statusId === PROCESSING_STATUS_IDS.visaStatusApproved
  ) {
    return 'Under Review'
  }
  if (statusName.toLowerCase().includes('appointment')) return 'Appointment Booked'
  if (
    statusId.includes('submission') ||
    statusId.includes('documents-under-review') ||
    statusId.includes('all-documents-received')
  ) {
    return 'Submitted'
  }
  return undefined
}
