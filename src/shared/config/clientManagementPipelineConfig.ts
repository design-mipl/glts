import type { ClientManagementPipelineStatus } from '@/shared/types/clientManagementPipeline'

export type PipelineBadgeColor = 'neutral' | 'info' | 'warning' | 'success' | 'error'

export const clientManagementPipelineLabel: Record<ClientManagementPipelineStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  quotation_sent: 'Quotation Sent',
  negotiation: 'Negotiation',
  awaiting_confirmation: 'Awaiting Confirmation',
  converted: 'Converted',
  lost: 'Lost',
  on_hold: 'On Hold',
}

export const clientManagementPipelineColor: Record<ClientManagementPipelineStatus, PipelineBadgeColor> = {
  new: 'neutral',
  contacted: 'info',
  qualified: 'info',
  quotation_sent: 'warning',
  negotiation: 'warning',
  awaiting_confirmation: 'warning',
  converted: 'success',
  lost: 'error',
  on_hold: 'warning',
}

/** Forward + exit transitions. Resume from on_hold is handled separately. */
export const clientManagementPipelineFlow: Record<
  ClientManagementPipelineStatus,
  ClientManagementPipelineStatus[]
> = {
  new: ['contacted', 'qualified', 'quotation_sent', 'lost', 'on_hold'],
  contacted: ['qualified', 'lost', 'on_hold'],
  qualified: ['quotation_sent', 'negotiation', 'lost', 'on_hold'],
  quotation_sent: ['negotiation', 'awaiting_confirmation', 'lost', 'on_hold'],
  negotiation: ['awaiting_confirmation', 'quotation_sent', 'lost', 'on_hold'],
  awaiting_confirmation: ['converted', 'negotiation', 'lost', 'on_hold'],
  converted: [],
  lost: [],
  on_hold: ['contacted', 'qualified', 'quotation_sent', 'negotiation', 'awaiting_confirmation'],
}

export const PIPELINE_REASON_REQUIRED_STATUSES: ClientManagementPipelineStatus[] = ['lost', 'on_hold']

export const PIPELINE_ACTIVE_STATUSES: ClientManagementPipelineStatus[] = [
  'contacted',
  'qualified',
  'quotation_sent',
  'negotiation',
  'awaiting_confirmation',
]

export function getAllowedPipelineTransitions(
  current: ClientManagementPipelineStatus,
): ClientManagementPipelineStatus[] {
  const allowed = clientManagementPipelineFlow[current] ?? []
  return Array.from(new Set([current, ...allowed]))
}

export function canConvertLeadToQuotation(status: ClientManagementPipelineStatus): boolean {
  return status === 'new' || status === 'contacted' || status === 'qualified'
}

export function isLeadEligibleForQuotationPicker(status: ClientManagementPipelineStatus): boolean {
  return status !== 'converted' && status !== 'lost'
}

export function initialQuotationPipelineStatus(sourceType: 'enquiry' | 'direct'): ClientManagementPipelineStatus {
  return sourceType === 'enquiry' ? 'qualified' : 'new'
}

export function pipelineStatusOptions(
  includeAll = false,
): { label: string; value: string }[] {
  const options = (Object.keys(clientManagementPipelineLabel) as ClientManagementPipelineStatus[]).map(
    (value) => ({
      label: clientManagementPipelineLabel[value],
      value,
    }),
  )
  return includeAll ? [{ label: 'All', value: '' }, ...options] : options
}
