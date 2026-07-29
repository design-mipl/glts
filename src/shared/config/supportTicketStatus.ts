import type { SupportTicketStatus, SupportTicketPriority } from '@/shared/types/supportTicket'

export const SUPPORT_TICKET_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  open: 'Open',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  waiting_for_customer: 'Waiting for Customer',
  resolved: 'Resolved',
  reopened: 'Reopened',
  closed: 'Closed',
}

export const SUPPORT_TICKET_PRIORITY_LABELS: Record<SupportTicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export const SUPPORT_TICKET_STATUS_COLOR: Record<
  SupportTicketStatus,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  open: 'info',
  assigned: 'info',
  in_progress: 'info',
  waiting_for_customer: 'warning',
  resolved: 'success',
  reopened: 'warning',
  closed: 'neutral',
}

export const SUPPORT_TICKET_PRIORITY_COLOR: Record<
  SupportTicketPriority,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  critical: 'error',
}

export const supportTicketStatusFlow: Record<SupportTicketStatus, SupportTicketStatus[]> = {
  open: ['assigned', 'in_progress', 'closed'],
  assigned: ['in_progress', 'waiting_for_customer', 'resolved'],
  in_progress: ['waiting_for_customer', 'resolved', 'assigned'],
  waiting_for_customer: ['in_progress', 'resolved', 'closed'],
  resolved: ['closed', 'reopened'],
  reopened: ['assigned', 'in_progress', 'waiting_for_customer', 'resolved'],
  closed: ['reopened'],
}
