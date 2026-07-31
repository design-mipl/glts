/**
 * Application pipeline stages for Dashboard Next.
 * IDs and labels mirror Application Management listing tabs
 * (`marineApplicationListingTabs` queue tabs — exclude `all`).
 */
export const APPLICATION_PIPELINE_STAGE_IDS = [
  'draft',
  'verification_pending',
  'online_submission_pending',
  'pending_payment',
  'vfs_submission_pending',
  'collection_pending',
  'collected',
  'dispatched',
] as const

export type ApplicationPipelineStageId = (typeof APPLICATION_PIPELINE_STAGE_IDS)[number]

export const APPLICATION_PIPELINE_STAGE_LABELS: Record<ApplicationPipelineStageId, string> = {
  draft: 'Draft',
  verification_pending: 'Verification Pending',
  online_submission_pending: 'Submission Pending',
  pending_payment: 'Pending Payment',
  vfs_submission_pending: 'Embassy/VFS Submission Pending',
  collection_pending: 'Collection Pending',
  collected: 'Collected',
  dispatched: 'Dispatched',
}

/** Live Application Management module base (marine today). */
export const APPLICATION_MANAGEMENT_LIST_BASE = '/admin/application-management/marine'

/** Stage click → Application Management listing tab deep-link. */
export function applicationPipelineStageHref(
  stageId: ApplicationPipelineStageId | string,
  basePath: string = APPLICATION_MANAGEMENT_LIST_BASE,
): string {
  return `${basePath}?tab=${encodeURIComponent(stageId)}`
}
