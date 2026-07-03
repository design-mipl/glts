import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'

/** Application is awaiting physical VFS or embassy submission (post online submission). */
export function isApplicationVfsSubmissionPending(row: ApplicationListingRow): boolean {
  return (
    row.processingStage === 'Appointment Booked' || row.operationalStatus === 'Appointment Booked'
  )
}

export function isApplicationSubmitted(row: ApplicationListingRow): boolean {
  return row.operationalStatus !== 'Draft' && Boolean(row.submissionDate?.trim())
}
