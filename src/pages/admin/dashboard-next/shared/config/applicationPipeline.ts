/** Visa application workflow stages for ApplicationPipeline and related widgets. */
export const APPLICATION_PIPELINE_STAGE_IDS = [
  'draft',
  'awaiting-documents',
  'verification',
  'qc',
  'appointment',
  'submission',
  'embassy',
  'collection',
  'dispatch',
  'delivered',
] as const

export type ApplicationPipelineStageId = (typeof APPLICATION_PIPELINE_STAGE_IDS)[number]

export const APPLICATION_PIPELINE_STAGE_LABELS: Record<ApplicationPipelineStageId, string> = {
  draft: 'Draft',
  'awaiting-documents': 'Awaiting Documents',
  verification: 'Verification',
  qc: 'QC',
  appointment: 'Appointment',
  submission: 'Submission',
  embassy: 'Embassy',
  collection: 'Collection',
  dispatch: 'Dispatch',
  delivered: 'Delivered',
}
