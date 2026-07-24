/** Unified Client Management sales pipeline across Lead → Quotation → Agreement. */
export type ClientManagementPipelineStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'quotation_sent'
  | 'negotiation'
  | 'awaiting_confirmation'
  | 'converted'
  | 'lost'
  | 'on_hold'

export const CLIENT_MANAGEMENT_PIPELINE_STATUSES: ClientManagementPipelineStatus[] = [
  'new',
  'contacted',
  'qualified',
  'quotation_sent',
  'negotiation',
  'awaiting_confirmation',
  'converted',
  'lost',
  'on_hold',
]

/** Lead Management primary stages before / at qualification. */
export const LEAD_PIPELINE_STATUSES: ClientManagementPipelineStatus[] = [
  'new',
  'contacted',
  'qualified',
]

/** Quotation primary stages (includes direct-new and post-qualification). */
export const QUOTATION_PIPELINE_STATUSES: ClientManagementPipelineStatus[] = [
  'new',
  'qualified',
  'quotation_sent',
  'negotiation',
  'awaiting_confirmation',
  'converted',
]

export const PIPELINE_EXIT_STATUSES: ClientManagementPipelineStatus[] = ['lost', 'on_hold']
