import { useCallback, useMemo, useState } from 'react'
import { DEFAULT_PORTAL_CUSTOMER_CONTEXT } from '@/shared/data/supportTicketOptions'
import { supportTicketService } from '@/shared/services/supportTicketService'
import type {
  SupportCommunicationChannel,
  SupportTicket,
  SupportTicketDraft,
  SupportTicketPriority,
} from '@/shared/types/supportTicket'

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
  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    supportTicketService.listForCustomer(DEFAULT_PORTAL_CUSTOMER_CONTEXT.customerId),
  )
  const [draft, setDraft] = useState<SupportTicketDraft>(EMPTY_DRAFT)

  const refresh = useCallback(() => {
    setTickets(supportTicketService.listForCustomer(DEFAULT_PORTAL_CUSTOMER_CONTEXT.customerId))
  }, [])

  const updateDraft = useCallback((patch: Partial<SupportTicketDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const resetDraft = useCallback(() => {
    setDraft(EMPTY_DRAFT)
  }, [])

  const saveDraft = useCallback(() => {
    return draft
  }, [draft])

  const submitTicket = useCallback(
    (form: SupportTicketDraft): SupportTicket => {
      const ticket = supportTicketService.create(form, DEFAULT_PORTAL_CUSTOMER_CONTEXT)
      setDraft(EMPTY_DRAFT)
      refresh()
      return ticket
    },
    [refresh],
  )

  const getTicket = useCallback(
    (id: string) => tickets.find((t) => t.id === id) ?? supportTicketService.getById(id),
    [tickets],
  )

  const addReply = useCallback(
    (ticketId: string, message: string, attachmentNames: string[] = []) => {
      supportTicketService.addReply(ticketId, {
        message,
        attachmentNames,
        sender: 'customer',
        authorName: DEFAULT_PORTAL_CUSTOMER_CONTEXT.customerName,
      })
      refresh()
    },
    [refresh],
  )

  const closeTicketWithFeedback = useCallback(
    (ticketId: string, rating: number, feedback: string) => {
      supportTicketService.closeWithFeedback(ticketId, rating, feedback)
      refresh()
    },
    [refresh],
  )

  const reopenTicket = useCallback(
    (ticketId: string) => {
      supportTicketService.reopen(ticketId)
      refresh()
    },
    [refresh],
  )

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
    refresh,
  }
}

export type SupportTicketsApi = ReturnType<typeof useSupportTickets>

export function createDefaultDraftPriority(): SupportTicketPriority {
  return 'medium'
}

export function createDefaultDraftChannel(): SupportCommunicationChannel {
  return 'email'
}
