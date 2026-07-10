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

export interface SupportTicket extends SupportTicketDraft {
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
}
