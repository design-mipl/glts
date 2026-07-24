import {
  getMockSupportTickets,
  setMockSupportTicketsStore,
} from '@/shared/data/mockSupportTickets'
import {
  DEFAULT_PORTAL_CUSTOMER_CONTEXT,
  SUPPORT_ASSIGNEE_OPTIONS,
  SUPPORT_CATEGORY_LABELS,
  SUPPORT_PRIORITY_OPTIONS,
} from '@/shared/data/supportTicketOptions'
import {
  SUPPORT_TICKET_PRIORITY_LABELS,
  SUPPORT_TICKET_STATUS_LABELS,
  supportTicketStatusFlow,
} from '@/shared/config/supportTicketStatus'
import type {
  SupportTicket,
  SupportTicketCustomerContext,
  SupportTicketDraft,
  SupportTicketListFilters,
  SupportTicketListingAggregates,
  SupportTicketPriority,
  SupportTicketReplyInput,
  SupportTicketStatus,
} from '@/shared/types/supportTicket'

const ADMIN_ACTOR = 'Support Admin'

function nowIso() {
  return new Date().toISOString()
}

function createId(prefix = 'tkt') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function getStore(): SupportTicket[] {
  return getMockSupportTickets()
}

function persist(rows: SupportTicket[]) {
  setMockSupportTicketsStore(rows)
}

function normalizeQuery(query?: string) {
  return query?.trim().toLowerCase() ?? ''
}

function createTicketNumber(): string {
  const year = new Date().getFullYear()
  const nums = getStore()
    .map((t) => {
      const match = t.ticketNumber.match(/(\d+)$/)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter((n) => !Number.isNaN(n))
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
  return `GLTS-TKT-${year}-${String(next).padStart(4, '0')}`
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').trim()
}

function sortByUpdatedDesc(rows: SupportTicket[]) {
  return [...rows].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

/** Tickets where support should act next (comms queue). */
function isCommsQueueTicket(ticket: SupportTicket) {
  return (
    ticket.status === 'open' ||
    ticket.status === 'assigned' ||
    ticket.status === 'in_progress' ||
    ticket.status === 'reopened' ||
    (ticket.status === 'resolved' && Boolean(ticket.awaitingCustomerConfirmation))
  )
}

function updateTicket(
  id: string,
  updater: (ticket: SupportTicket) => SupportTicket,
): SupportTicket | undefined {
  const store = getStore()
  const index = store.findIndex((t) => t.id === id)
  if (index < 0) return undefined
  const next = updater(store[index])
  const copy = [...store]
  copy[index] = next
  persist(copy)
  return next
}

export const supportTicketService = {
  list(filters: SupportTicketListFilters = {}): SupportTicket[] {
    const {
      status = 'all',
      priority = 'all',
      category = 'all',
      assignee = 'all',
      portal = 'all',
      query,
      queue = 'all',
    } = filters
    const q = normalizeQuery(query)
    let rows = sortByUpdatedDesc(getStore())

    if (status !== 'all') rows = rows.filter((r) => r.status === status)
    if (priority !== 'all') rows = rows.filter((r) => r.priority === priority)
    if (category !== 'all') rows = rows.filter((r) => r.category === category)
    if (assignee !== 'all') {
      if (assignee === 'unassigned') {
        rows = rows.filter((r) => !r.assignedExecutive)
      } else {
        rows = rows.filter((r) => r.assignedExecutive === assignee)
      }
    }
    if (portal !== 'all') rows = rows.filter((r) => r.portal === portal)
    if (queue === 'active') {
      rows = rows.filter((r) => !['resolved', 'closed'].includes(r.status))
    } else if (queue === 'awaiting_reply') {
      rows = rows.filter(isCommsQueueTicket)
    } else if (queue === 'resolved_queue') {
      rows = rows.filter((r) => r.status === 'resolved' || r.status === 'closed')
    }

    if (q) {
      rows = rows.filter((r) => {
        const haystack = [
          r.ticketNumber,
          r.subject,
          r.customerName,
          r.customerEmail,
          r.companyName ?? '',
          r.category,
          r.subCategory,
          r.assignedExecutive ?? '',
          SUPPORT_CATEGORY_LABELS[r.category] ?? '',
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
    }

    return rows
  },

  /** Customer portal view — currently all tickets for the demo customer identity. */
  listForCustomer(customerId?: string): SupportTicket[] {
    const id = customerId ?? DEFAULT_PORTAL_CUSTOMER_CONTEXT.customerId
    return sortByUpdatedDesc(getStore().filter((t) => t.customerId === id))
  },

  getById(id: string): SupportTicket | undefined {
    return getStore().find((t) => t.id === id)
  },

  getListingAggregates(rows?: SupportTicket[]): SupportTicketListingAggregates {
    const source = rows ?? getStore()
    return {
      total: source.length,
      open: source.filter((t) => t.status === 'open' || t.status === 'reopened').length,
      inProgress: source.filter((t) => t.status === 'assigned' || t.status === 'in_progress').length,
      waitingForCustomer: source.filter((t) => t.status === 'waiting_for_customer').length,
      critical: source.filter((t) => t.priority === 'critical' && t.status !== 'closed').length,
      resolved: source.filter((t) => t.status === 'resolved' || t.status === 'closed').length,
    }
  },

  create(
    draft: SupportTicketDraft,
    customer: SupportTicketCustomerContext = DEFAULT_PORTAL_CUSTOMER_CONTEXT,
  ): SupportTicket {
    const now = nowIso()
    const ticket: SupportTicket = {
      ...draft,
      ...customer,
      id: createId('tkt'),
      ticketNumber: createTicketNumber(),
      status: 'open',
      createdAt: now,
      updatedAt: now,
      conversation: [
        { type: 'system', id: createId('ev'), event: 'Ticket Created', timestamp: now },
        {
          type: 'message',
          id: createId('msg'),
          sender: 'customer',
          authorName: customer.customerName,
          body: stripHtml(draft.description) || draft.subject,
          timestamp: now,
          attachments: draft.attachmentNames.map((name, i) => ({
            id: `att-${i}`,
            name,
            size: '—',
          })),
        },
      ],
    }
    persist([ticket, ...getStore()])
    return ticket
  },

  addReply(id: string, input: SupportTicketReplyInput): SupportTicket | undefined {
    const now = nowIso()
    return updateTicket(id, (ticket) => {
      let nextStatus = ticket.status
      if (input.sender === 'customer' && ticket.status === 'waiting_for_customer') {
        nextStatus = 'in_progress'
      } else if (input.sender === 'support' && (ticket.status === 'open' || ticket.status === 'assigned')) {
        nextStatus = 'in_progress'
      }

      const events =
        nextStatus !== ticket.status
          ? [
              {
                type: 'system' as const,
                id: createId('ev'),
                event: `Status Updated — ${SUPPORT_TICKET_STATUS_LABELS[nextStatus]}`,
                timestamp: now,
              },
            ]
          : []

      return {
        ...ticket,
        status: nextStatus,
        updatedAt: now,
        awaitingCustomerConfirmation: input.sender === 'customer' ? false : ticket.awaitingCustomerConfirmation,
        conversation: [
          ...ticket.conversation,
          {
            type: 'message' as const,
            id: createId('msg'),
            sender: input.sender,
            authorName: input.authorName,
            body: input.message,
            timestamp: now,
            attachments: (input.attachmentNames ?? []).map((name, i) => ({
              id: `att-reply-${i}`,
              name,
              size: '—',
            })),
          },
          ...events,
        ],
      }
    })
  },

  assign(id: string, executiveName: string, actor = ADMIN_ACTOR): SupportTicket | undefined {
    const now = nowIso()
    return updateTicket(id, (ticket) => {
      const nextStatus: SupportTicketStatus =
        ticket.status === 'open' || ticket.status === 'reopened' ? 'assigned' : ticket.status
      return {
        ...ticket,
        assignedExecutive: executiveName,
        status: nextStatus,
        updatedAt: now,
        conversation: [
          ...ticket.conversation,
          {
            type: 'system',
            id: createId('ev'),
            event: `Assigned to ${executiveName} by ${actor}`,
            timestamp: now,
          },
          ...(nextStatus !== ticket.status
            ? [
                {
                  type: 'system' as const,
                  id: createId('ev'),
                  event: `Status Updated — ${SUPPORT_TICKET_STATUS_LABELS[nextStatus]}`,
                  timestamp: now,
                },
              ]
            : []),
        ],
      }
    })
  },

  updateStatus(id: string, status: SupportTicketStatus, actor = ADMIN_ACTOR): SupportTicket | undefined {
    const now = nowIso()
    return updateTicket(id, (ticket) => ({
      ...ticket,
      status,
      updatedAt: now,
      awaitingCustomerConfirmation: status === 'resolved' ? true : ticket.awaitingCustomerConfirmation,
      conversation: [
        ...ticket.conversation,
        {
          type: 'system',
          id: createId('ev'),
          event: `Status Updated — ${SUPPORT_TICKET_STATUS_LABELS[status]} (${actor})`,
          timestamp: now,
        },
      ],
    }))
  },

  updatePriority(id: string, priority: SupportTicketPriority, actor = ADMIN_ACTOR): SupportTicket | undefined {
    const now = nowIso()
    return updateTicket(id, (ticket) => ({
      ...ticket,
      priority,
      updatedAt: now,
      conversation: [
        ...ticket.conversation,
        {
          type: 'system',
          id: createId('ev'),
          event: `Priority Updated — ${SUPPORT_TICKET_PRIORITY_LABELS[priority]} (${actor})`,
          timestamp: now,
        },
      ],
    }))
  },

  resolve(id: string, message?: string, actor = ADMIN_ACTOR): SupportTicket | undefined {
    const now = nowIso()
    return updateTicket(id, (ticket) => {
      const conversation = [...ticket.conversation]
      if (message?.trim()) {
        conversation.push({
          type: 'message',
          id: createId('msg'),
          sender: 'support',
          authorName: actor,
          body: message.trim(),
          timestamp: now,
        })
      }
      conversation.push({
        type: 'system',
        id: createId('ev'),
        event: `Status Updated — Resolved (${actor})`,
        timestamp: now,
      })
      return {
        ...ticket,
        status: 'resolved',
        awaitingCustomerConfirmation: true,
        updatedAt: now,
        conversation,
      }
    })
  },

  setWaitingForCustomer(id: string, message: string, actor = ADMIN_ACTOR): SupportTicket | undefined {
    const now = nowIso()
    return updateTicket(id, (ticket) => ({
      ...ticket,
      status: 'waiting_for_customer',
      updatedAt: now,
      conversation: [
        ...ticket.conversation,
        {
          type: 'message',
          id: createId('msg'),
          sender: 'support',
          authorName: actor,
          body: message,
          timestamp: now,
        },
        {
          type: 'system',
          id: createId('ev'),
          event: 'Waiting for Customer',
          timestamp: now,
        },
      ],
    }))
  },

  closeWithFeedback(id: string, rating: number, feedback: string): SupportTicket | undefined {
    const now = nowIso()
    return updateTicket(id, (ticket) => ({
      ...ticket,
      status: 'closed',
      awaitingCustomerConfirmation: false,
      rating,
      feedback,
      updatedAt: now,
      conversation: [
        ...ticket.conversation,
        { type: 'system', id: createId('ev'), event: 'Ticket Closed', timestamp: now },
      ],
    }))
  },

  reopen(id: string): SupportTicket | undefined {
    const now = nowIso()
    return updateTicket(id, (ticket) => ({
      ...ticket,
      status: 'reopened',
      awaitingCustomerConfirmation: false,
      updatedAt: now,
      conversation: [
        ...ticket.conversation,
        { type: 'system', id: createId('ev'), event: 'Ticket Reopened', timestamp: now },
      ],
    }))
  },

  addInternalNote(id: string, note: string, actor = ADMIN_ACTOR): SupportTicket | undefined {
    const now = nowIso()
    return updateTicket(id, (ticket) => ({
      ...ticket,
      internalNotes: [ticket.internalNotes, `${now.slice(0, 16)} — ${actor}: ${note}`]
        .filter(Boolean)
        .join('\n'),
      updatedAt: now,
    }))
  },

  getAllowedStatusTransitions(current: SupportTicketStatus): SupportTicketStatus[] {
    return supportTicketStatusFlow[current] ?? []
  },

  getStatusOptions() {
    return Object.entries(SUPPORT_TICKET_STATUS_LABELS).map(([value, label]) => ({
      value: value as SupportTicketStatus,
      label,
    }))
  },

  getPriorityOptions() {
    return SUPPORT_PRIORITY_OPTIONS
  },

  getAssigneeOptions() {
    return SUPPORT_ASSIGNEE_OPTIONS
  },

  getCategoryLabel(categoryId: string) {
    return SUPPORT_CATEGORY_LABELS[categoryId] ?? categoryId
  },
}
