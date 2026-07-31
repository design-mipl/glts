import type { MarineApplicationListingTab } from '@/pages/admin/application-management/marine/config/marineApplicationListingTabs'
import {
  APPLICATION_MANAGEMENT_LIST_BASE,
  applicationPipelineStageHref,
  type ApplicationPipelineStageId,
} from '../../shared/config/applicationPipeline'

export type OpsSegmentKey = 'retail' | 'corporate' | 'marine' | 'b2b'

/**
 * Live application-management module today is marine only.
 * Retail / corporate / B2B listings are coming-soon — never deep-link those
 * for case work or the router falls through to /admin (another dashboard).
 */
const APP_MODULE_BASE = APPLICATION_MANAGEMENT_LIST_BASE

const ASSIGNMENT_PATH: Record<OpsSegmentKey, string> = {
  retail: '/admin/assignment-priority/retail',
  corporate: '/admin/assignment-priority/corporate',
  marine: '/admin/assignment-priority/marine',
  b2b: '/admin/assignment-priority/b2b',
}

/**
 * Pipeline stage id === Application Management listing tab id.
 * Keep an explicit map so unknown/legacy ids still resolve safely.
 */
const PIPELINE_STAGE_TO_APP_TAB: Record<string, MarineApplicationListingTab> = {
  draft: 'draft',
  verification_pending: 'verification_pending',
  online_submission_pending: 'online_submission_pending',
  pending_payment: 'pending_payment',
  vfs_submission_pending: 'vfs_submission_pending',
  collection_pending: 'collection_pending',
  collected: 'collected',
  dispatched: 'dispatched',
  // Legacy dashboard stage ids (pre–AM-tab alignment)
  'awaiting-documents': 'verification_pending',
  verification: 'verification_pending',
  qc: 'verification_pending',
  appointment: 'vfs_submission_pending',
  submission: 'online_submission_pending',
  embassy: 'vfs_submission_pending',
  collection: 'collection_pending',
  dispatch: 'collected',
  delivered: 'dispatched',
}

export type OpsApplicationQueueTab = Extract<
  MarineApplicationListingTab,
  | 'verification_pending'
  | 'pending_payment'
  | 'online_submission_pending'
  | 'vfs_submission_pending'
  | 'collection_pending'
  | 'collected'
  | 'dispatched'
>

/** Application Management listing (live marine module + optional tab). */
export function opsApplicationListPath(
  _segment: OpsSegmentKey | 'all' = 'marine',
  tab?: OpsApplicationQueueTab | MarineApplicationListingTab,
): string {
  return tab ? `${APP_MODULE_BASE}?tab=${tab}` : APP_MODULE_BASE
}

/**
 * Application case workspace.
 * - verify → `/admin/application-management/marine/:id`
 * - pending payment → `/admin/application-management/marine/:id/view-form`
 */
export function opsApplicationDetailPath(
  _segment: OpsSegmentKey,
  applicationId: string,
  options?: {
    workspace?: 'verify' | 'pending_payment'
    passengerId?: string
    docId?: string
  },
): string {
  const base = `${APP_MODULE_BASE}/${applicationId}`
  if (options?.workspace === 'pending_payment') {
    return `${base}/view-form`
  }
  const params = new URLSearchParams()
  if (options?.passengerId) params.set('passenger', options.passengerId)
  if (options?.docId) params.set('doc', options.docId)
  const qs = params.toString()
  return qs ? `${base}?${qs}` : base
}

/** Assignment Priority queue for the selected segment (all four segments are live). */
export function opsAssignmentPath(segment: OpsSegmentKey, applicationId?: string): string {
  const base = ASSIGNMENT_PATH[segment]
  return applicationId ? `${base}?application=${encodeURIComponent(applicationId)}` : base
}

/** Ground Operations case handling. */
export function opsGroundCasePath(passengerId?: string): string {
  return passengerId
    ? `/admin/ground-operations/case-handling?passenger=${encodeURIComponent(passengerId)}`
    : '/admin/ground-operations/case-handling'
}

/** Ground Operations logistics. */
export function opsLogisticsPath(): string {
  return '/admin/ground-operations/logistics'
}

/** Map dashboard pipeline stage click → Application Management tab. */
export function opsPipelineStageToApplicationHref(stageId: string): string {
  const tab =
    PIPELINE_STAGE_TO_APP_TAB[stageId] ??
    (stageId as ApplicationPipelineStageId)
  return applicationPipelineStageHref(tab, APP_MODULE_BASE)
}
