export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'critical'

export type SupportTicketStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'waiting_for_customer'
  | 'resolved'
  | 'reopened'
  | 'closed'

export type SupportCommunicationChannel = 'email' | 'phone' | 'whatsapp'

export type SupportPortal = 'business' | 'retail'

export interface SupportTicketAttachment {
  id: string
  name: string
  size: string
}

export interface SupportCustomerMessage {
  type: 'message'
  id: string
  sender: 'customer' | 'support'
  authorName: string
  body: string
  timestamp: string
  attachments?: SupportTicketAttachment[]
}

export interface SupportSystemEvent {
  type: 'system'
  id: string
  event: string
  timestamp: string
}

export type SupportConversationEntry = SupportCustomerMessage | SupportSystemEvent

export interface SupportTicketDraft {
  category: string
  subCategory: string
  relatedApplication: string
  relatedInvoice: string
  priority: SupportTicketPriority
  subject: string
  description: string
  communicationChannel: SupportCommunicationChannel
  attachmentNames: string[]
}

export interface SupportTicketCustomerContext {
  customerId: string
  customerName: string
  customerEmail: string
  portal: SupportPortal
  companyName?: string
}

export interface SupportTicket extends SupportTicketDraft, SupportTicketCustomerContext {
  id: string
  ticketNumber: string
  status: SupportTicketStatus
  assignedExecutive?: string
  createdAt: string
  updatedAt: string
  conversation: SupportConversationEntry[]
  awaitingCustomerConfirmation?: boolean
  rating?: number
  feedback?: string
  internalNotes?: string
}

export interface SupportTicketListFilters {
  status?: SupportTicketStatus | 'all'
  priority?: SupportTicketPriority | 'all'
  category?: string | 'all'
  assignee?: string | 'all'
  portal?: SupportPortal | 'all'
  query?: string
  /** Restrict to tickets needing ops attention */
  queue?: 'all' | 'active' | 'awaiting_reply' | 'resolved_queue'
}

export interface SupportTicketListingAggregates {
  total: number
  open: number
  inProgress: number
  waitingForCustomer: number
  critical: number
  resolved: number
}

export interface SupportTicketReplyInput {
  message: string
  attachmentNames?: string[]
  sender: 'customer' | 'support'
  authorName: string
}
