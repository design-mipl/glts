import type { CustomerTone } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import {
  SUPPORT_TICKET_PRIORITY_LABELS,
  SUPPORT_TICKET_STATUS_LABELS,
} from '@/shared/config/supportTicketStatus'
import type { SupportTicketPriority, SupportTicketStatus } from '@/shared/types/supportTicket'

export { SUPPORT_TICKET_STATUS_LABELS, SUPPORT_TICKET_PRIORITY_LABELS }

export function getSupportTicketStatusTone(status: SupportTicketStatus): CustomerTone {
  switch (status) {
    case 'closed':
      return 'neutral'
    case 'resolved':
      return 'success'
    case 'reopened':
    case 'waiting_for_customer':
      return 'warning'
    case 'in_progress':
    case 'assigned':
      return 'info'
    case 'open':
    default:
      return 'info'
  }
}

export function getSupportTicketPriorityTone(priority: SupportTicketPriority): CustomerTone {
  switch (priority) {
    case 'critical':
      return 'critical'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    case 'low':
    default:
      return 'neutral'
  }
}

export const SUPPORT_TICKET_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  ...Object.entries(SUPPORT_TICKET_STATUS_LABELS).map(([value, label]) => ({ value, label })),
]

export const SUPPORT_TICKET_DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]
