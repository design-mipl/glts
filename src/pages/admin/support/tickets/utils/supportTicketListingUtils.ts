import { supportTicketService } from '@/shared/services/supportTicketService'
import type { SupportTicket } from '@/shared/types/supportTicket'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { supportTicketStatusLabel } from '../config/supportTicketStatusConfig'

export type SupportTicketListingTab = 'all' | 'open' | 'active' | 'waiting' | 'resolved' | 'closed'

export function formatSupportTicketDate(iso: string | undefined): string {
  if (!iso?.trim()) return '—'
  return formatMasterDate(iso)
}

export function getSupportTicketCellValue(row: SupportTicket, key: string): string {
  switch (key) {
    case 'ticketNumber':
      return row.ticketNumber
    case 'subject':
      return row.subject
    case 'customer':
      return row.customerName
    case 'company':
      return row.companyName ?? ''
    case 'category':
      return supportTicketService.getCategoryLabel(row.category)
    case 'priority':
      return row.priority
    case 'status':
      return supportTicketStatusLabel[row.status]
    case 'assignee':
      return row.assignedExecutive ?? 'Unassigned'
    case 'portal':
      return row.portal
    case 'updatedAt':
      return row.updatedAt
    case 'createdAt':
      return row.createdAt
    default:
      return ''
  }
}

export function matchesSupportTicketSearch(row: SupportTicket, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    row.ticketNumber,
    row.subject,
    row.customerName,
    row.customerEmail,
    row.companyName ?? '',
    row.subCategory,
    supportTicketService.getCategoryLabel(row.category),
    row.assignedExecutive ?? '',
    supportTicketStatusLabel[row.status],
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export function filterSupportTicketRowsByTab(
  rows: SupportTicket[],
  tab: SupportTicketListingTab,
): SupportTicket[] {
  switch (tab) {
    case 'open':
      return rows.filter((r) => r.status === 'open' || r.status === 'reopened')
    case 'active':
      return rows.filter((r) => r.status === 'assigned' || r.status === 'in_progress')
    case 'waiting':
      return rows.filter((r) => r.status === 'waiting_for_customer')
    case 'resolved':
      return rows.filter((r) => r.status === 'resolved')
    case 'closed':
      return rows.filter((r) => r.status === 'closed')
    case 'all':
    default:
      return rows
  }
}

export function getSupportTicketEmptyState(
  tab: SupportTicketListingTab,
): { emptyTitle: string; emptyDescription: string } {
  switch (tab) {
    case 'open':
      return {
        emptyTitle: 'No open tickets',
        emptyDescription: 'New customer tickets will appear here for assignment.',
      }
    case 'active':
      return {
        emptyTitle: 'No active tickets',
        emptyDescription: 'Assigned and in-progress tickets will show in this view.',
      }
    case 'waiting':
      return {
        emptyTitle: 'Nothing waiting on customers',
        emptyDescription: 'Tickets marked waiting for customer will appear here.',
      }
    case 'resolved':
      return {
        emptyTitle: 'No resolved tickets',
        emptyDescription: 'Tickets awaiting customer confirmation appear here.',
      }
    case 'closed':
      return {
        emptyTitle: 'No closed tickets',
        emptyDescription: 'Fully closed tickets will appear in this view.',
      }
    default:
      return {
        emptyTitle: 'No support tickets',
        emptyDescription: 'Tickets raised from the customer portal will appear here.',
      }
  }
}

function getGridStatusColor(
  status: SupportTicket['status'],
): 'success' | 'warning' | 'info' | 'default' {
  switch (status) {
    case 'resolved':
      return 'success'
    case 'waiting_for_customer':
    case 'reopened':
      return 'warning'
    case 'closed':
      return 'default'
    default:
      return 'info'
  }
}

export function mapSupportTicketRowsToGridItems(rows: SupportTicket[]) {
  return rows.map((row) => ({
    id: row.id,
    title: row.ticketNumber,
    subtitle: `${row.subject} • ${row.customerName}`,
    meta: supportTicketService.getCategoryLabel(row.category),
    status: supportTicketStatusLabel[row.status],
    statusColor: getGridStatusColor(row.status),
  }))
}

export function downloadSupportTicketCsv(rows: SupportTicket[]) {
  const headers = [
    'Ticket Number',
    'Subject',
    'Customer',
    'Email',
    'Company',
    'Portal',
    'Category',
    'Subcategory',
    'Priority',
    'Status',
    'Assignee',
    'Created',
    'Updated',
  ]
  const lines = rows.map((row) =>
    [
      row.ticketNumber,
      row.subject,
      row.customerName,
      row.customerEmail,
      row.companyName ?? '',
      row.portal,
      supportTicketService.getCategoryLabel(row.category),
      row.subCategory,
      row.priority,
      supportTicketStatusLabel[row.status],
      row.assignedExecutive ?? '',
      row.createdAt,
      row.updatedAt,
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `support-tickets-${new Date().toISOString().slice(0, 10)}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
}
