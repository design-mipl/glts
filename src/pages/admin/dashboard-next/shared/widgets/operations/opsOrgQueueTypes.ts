/**
 * Org-level ops queue snapshot — shared by Ops Overview and Admin Operations.
 * Not personal desk queues.
 */
import {
  APPLICATION_PIPELINE_STAGE_IDS,
  APPLICATION_PIPELINE_STAGE_LABELS,
  type ApplicationPipelineStageId,
} from '../../config/applicationPipeline'

export interface OpsOrgChartSlice {
  key: string
  label: string
  value: number
  color?: string
}

/** Wait-time columns for Queue ageing matrix. */
export const OPS_QUEUE_AGEING_BUCKETS = ['0–4h', '4–24h', '1–3d', '3d+'] as const

export type OpsQueueAgeingBucketId = (typeof OPS_QUEUE_AGEING_BUCKETS)[number]

/**
 * Application Management listing tabs as Queue ageing rows
 * (same IDs/labels as pipeline stages — excludes "All applications").
 */
export const OPS_QUEUE_AGEING_ROWS = APPLICATION_PIPELINE_STAGE_IDS.map((id) => ({
  key: id,
  label: APPLICATION_PIPELINE_STAGE_LABELS[id],
}))

export type OpsQueueAgeingRowKey = ApplicationPipelineStageId

export interface OpsOrgAgeingQueueRow {
  key: OpsQueueAgeingRowKey | string
  label: string
  counts: Record<OpsQueueAgeingBucketId, number>
}

/** @deprecated Prefer {@link OpsOrgAgeingQueueRow} — flat totals kept for transitional callers. */
export interface OpsOrgAgeingBucket {
  bucket: string
  count: number
}

export interface OpsOrgSegmentWorkload {
  segment: string
  draft: number
  verification_pending: number
  online_submission_pending: number
  pending_payment: number
  vfs_submission_pending: number
  collection_pending: number
  collected: number
  dispatched: number
}

export function emptyOpsSegmentWorkloadCounts(): Omit<OpsOrgSegmentWorkload, 'segment'> {
  return {
    draft: 0,
    verification_pending: 0,
    online_submission_pending: 0,
    pending_payment: 0,
    vfs_submission_pending: 0,
    collection_pending: 0,
    collected: 0,
    dispatched: 0,
  }
}

export interface OpsOrgQueueSnapshot {
  queueMix: OpsOrgChartSlice[]
  assigneeMix: OpsOrgChartSlice[]
  /** Queue × wait-bucket counts for the Queue ageing table. */
  ageingByQueue: OpsOrgAgeingQueueRow[]
  workloadBySegment: OpsOrgSegmentWorkload[]
}

export interface OpsOrgAlertRow {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  href: string
  count?: number
}

export function emptyOpsQueueAgeingCounts(): Record<OpsQueueAgeingBucketId, number> {
  return {
    '0–4h': 0,
    '4–24h': 0,
    '1–3d': 0,
    '3d+': 0,
  }
}
