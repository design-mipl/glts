import type { EnquiryPriority, EnquiryStatus } from '@/shared/types/enquiry'

export const enquiryStatusLabel: Record<EnquiryStatus, string> = {
  new: 'New',
  under_discussion: 'Under Discussion',
  requirement_gathering: 'Requirement Gathering',
  pending_customer_response: 'Pending Customer Response',
  internal_review: 'Internal Review',
  quotation_in_progress: 'Quotation In Progress',
  converted: 'Converted',
  on_hold: 'On Hold',
  closed: 'Closed',
  rejected: 'Rejected',
}

export const enquiryStatusColor: Record<
  EnquiryStatus,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  new: 'neutral',
  under_discussion: 'info',
  requirement_gathering: 'info',
  pending_customer_response: 'warning',
  internal_review: 'info',
  quotation_in_progress: 'warning',
  converted: 'success',
  on_hold: 'warning',
  closed: 'neutral',
  rejected: 'error',
}

export const enquiryPriorityLabel: Record<EnquiryPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export const enquiryPriorityColor: Record<
  EnquiryPriority,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  critical: 'error',
}
