/**
 * Org-level ops queue snapshot — shared by Ops Overview and Admin Operations.
 * Not personal desk queues.
 */
export interface OpsOrgChartSlice {
  key: string
  label: string
  value: number
  color?: string
}

export interface OpsOrgAgeingBucket {
  bucket: string
  count: number
}

export interface OpsOrgSegmentWorkload {
  segment: string
  verification: number
  payment: number
  arrange: number
  submission: number
}

export interface OpsOrgQueueSnapshot {
  queueMix: OpsOrgChartSlice[]
  assigneeMix: OpsOrgChartSlice[]
  ageingBuckets: OpsOrgAgeingBucket[]
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
