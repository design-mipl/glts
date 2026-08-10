/**
 * Ops work-queue display labels — single source for KPI strip, Queue mix,
 * Work tab, and workload charts. Keep in sync across Operations surfaces.
 */
export const OPS_QUEUE_DISPLAY_LABELS = {
  verification: 'Pending Docs QC',
  recheck: 'Review Re-uploads',
  payment: 'Pending payment',
  arrange: 'Arrange Ticket/Insurance',
  submission: 'Ready for Submission',
  collection: 'Collect / dispatch',
  /** Physical originals send plan — awaiting GLTS receipt (not embassy collect/dispatch). */
  physicalOriginals: 'Ready for Collection',
  /** KPI rollup of submission + collection */
  submissionCollection: 'Submission / collection',
  correctionWatch: 'Corrections pending',
} as const

export const OPS_QUEUE_MIX_DESCRIPTION =
  'Pending Docs QC · Review Re-uploads · Pending payment · Arrange · Ready for Submission · Ready for Collection'
