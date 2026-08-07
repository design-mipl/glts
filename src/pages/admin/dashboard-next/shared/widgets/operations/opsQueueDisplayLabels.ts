/**
 * Ops work-queue display labels — single source for KPI strip, Queue mix,
 * Work tab, and workload charts. Keep in sync across Operations surfaces.
 */
export const OPS_QUEUE_DISPLAY_LABELS = {
  verification: 'Verification pending',
  recheck: 'Re-uploads ready',
  payment: 'Pending payment',
  arrange: 'Arrange Ticket/Insurance',
  submission: 'Ready to submit',
  collection: 'Collect / dispatch',
  /** Physical originals send plan — awaiting GLTS receipt (not embassy collect/dispatch). */
  physicalOriginals: 'Physical documents',
  /** KPI rollup of submission + collection */
  submissionCollection: 'Submission / collection',
  correctionWatch: 'Waiting on customer',
} as const

export const OPS_QUEUE_MIX_DESCRIPTION =
  'Verification pending · Re-uploads ready · Pending payment · Arrange · Submission / collection · Physical documents'
