import { useCallback, useMemo, useState } from 'react'
import { INITIAL_SUPPORT_TICKETS } from '../data/mockSupportTickets'
import type {
  SupportCommunicationChannel,
  SupportTicket,
  SupportTicketDraft,
  SupportTicketPriority,
  SupportTicketStatus,
} from '../types/supportTicket'

let ticketCounter = INITIAL_SUPPORT_TICKETS.length + 1

function createTicketNumber() {
  const num = String(ticketCounter++).padStart(4, '0')
  return `GLTS-TKT-2026-${num}`
}

function createId() {
  return `tkt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const EMPTY_DRAFT: SupportTicketDraft = {
  category: '',
  subCategory: '',
  relatedApplication: '',
  relatedInvoice: '',
  priority: 'medium',
  subject: '',
  description: '',
  communicationChannel: 'email',
  attachmentNames: [],
}

export function useSupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS)
  const [draft, setDraft] = useState<SupportTicketDraft>(EMPTY_DRAFT)

  const updateDraft = useCallback((patch: Partial<SupportTicketDraft>) => {
    setDraft(prev => ({ ...prev, ...patch }))
  }, [])

  const resetDraft = useCallback(() => {
    setDraft(EMPTY_DRAFT)
  }, [])

  const saveDraft = useCallback(() => {
    return draft
  }, [draft])

  const submitTicket = useCallback((form: SupportTicketDraft): SupportTicket => {
    const now = new Date().toISOString()
    const ticket: SupportTicket = {
      ...form,
      id: createId(),
      ticketNumber: createTicketNumber(),
      status: 'open',
      createdAt: now,
      updatedAt: now,
      conversation: [
        { type: 'system', id: createId(), event: 'Ticket Created', timestamp: now },
        {
          type: 'message',
          id: createId(),
          sender: 'customer',
          authorName: 'You',
          body: form.description.replace(/<[^>]+>/g, ' ').trim() || form.subject,
          timestamp: now,
          attachments: form.attachmentNames.map((name, i) => ({
            id: `att-${i}`,
            name,
            size: '—',
          })),
        },
      ],
    }
    setTickets(prev => [ticket, ...prev])
    setDraft(EMPTY_DRAFT)
    return ticket
  }, [])

  const getTicket = useCallback(
    (id: string) => tickets.find(t => t.id === id),
    [tickets],
  )

  const addReply = useCallback((ticketId: string, message: string, attachmentNames: string[] = []) => {
    const now = new Date().toISOString()
    setTickets(prev =>
      prev.map(ticket => {
        if (ticket.id !== ticketId) return ticket
        const nextStatus: SupportTicketStatus =
          ticket.status === 'waiting_for_customer' ? 'in_progress' : ticket.status
        return {
          ...ticket,
          status: nextStatus,
          updatedAt: now,
          awaitingCustomerConfirmation: false,
          conversation: [
            ...ticket.conversation,
            {
              type: 'message' as const,
              id: createId(),
              sender: 'customer' as const,
              authorName: 'You',
              body: message,
              timestamp: now,
              attachments: attachmentNames.map((name, i) => ({
                id: `att-reply-${i}`,
                name,
                size: '—',
              })),
            },
          ],
        }
      }),
    )
  }, [])

  const closeTicketWithFeedback = useCallback(
    (ticketId: string, rating: number, feedback: string) => {
      const now = new Date().toISOString()
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: 'closed',
                awaitingCustomerConfirmation: false,
                rating,
                feedback,
                updatedAt: now,
                conversation: [
                  ...ticket.conversation,
                  { type: 'system', id: createId(), event: 'Ticket Closed', timestamp: now },
                ],
              }
            : ticket,
        ),
      )
    },
    [],
  )

  const reopenTicket = useCallback((ticketId: string) => {
    const now = new Date().toISOString()
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'reopened',
              awaitingCustomerConfirmation: false,
              updatedAt: now,
              conversation: [
                ...ticket.conversation,
                { type: 'system', id: createId(), event: 'Ticket Reopened', timestamp: now },
              ],
            }
          : ticket,
      ),
    )
  }, [])

  const ticketsSorted = useMemo(
    () => [...tickets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [tickets],
  )

  return {
    tickets: ticketsSorted,
    draft,
    updateDraft,
    resetDraft,
    saveDraft,
    submitTicket,
    getTicket,
    addReply,
    closeTicketWithFeedback,
    reopenTicket,
  }
}

export type SupportTicketsApi = ReturnType<typeof useSupportTickets>

export function createDefaultDraftPriority(): SupportTicketPriority {
  return 'medium'
}

export function createDefaultDraftChannel(): SupportCommunicationChannel {
  return 'email'
}
