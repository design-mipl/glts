import type { OrderEnquiry, OrderEnquiryStatus } from '@/shared/types/orderEnquiry'
import { ORDER_ENQUIRY_SERVICE_LABEL } from '@/shared/services/orderEnquiryService'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import {
  orderEnquirySourceLabel,
  orderEnquiryStatusLabel,
} from '../config/orderEnquiryStatusConfig'

export function formatOrderEnquiryDate(iso: string | undefined): string {
  if (!iso?.trim()) return '—'
  return formatMasterDate(iso)
}

export type OrderEnquiryListingTab = 'all' | 'new' | 'website' | 'in_review' | 'converted'

export function filterOrderEnquiryRowsByTab(rows: OrderEnquiry[], tab: OrderEnquiryListingTab): OrderEnquiry[] {
  switch (tab) {
    case 'all':
      return rows
    case 'new':
      return rows.filter((row) => row.status === 'new')
    case 'website':
      return rows.filter((row) => row.source === 'website')
    case 'in_review':
      return rows.filter((row) => row.status === 'in_review' || row.status === 'qualified')
    case 'converted':
      return rows.filter((row) => row.status === 'converted')
    default:
      return rows
  }
}

export function getOrderEnquiryCellValue(record: OrderEnquiry, key: string): string {
  switch (key) {
    case 'enquiryNumber':
      return record.enquiryNumber
    case 'companyOrCustomerName':
      return record.customer.companyOrCustomerName
    case 'contactPerson':
      return record.customer.contactPersonName
    case 'service':
      return ORDER_ENQUIRY_SERVICE_LABEL[record.service]
    case 'source':
      return orderEnquirySourceLabel[record.source]
    case 'status':
      return orderEnquiryStatusLabel[record.status]
    case 'enquiryDate':
      return formatOrderEnquiryDate(record.enquiryDate)
    default:
      return String((record as unknown as Record<string, unknown>)[key] ?? '')
  }
}

export function matchesOrderEnquirySearch(record: OrderEnquiry, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return [
    record.enquiryNumber,
    record.customer.companyOrCustomerName,
    record.customer.contactPersonName,
    record.customer.emailAddress,
    record.customer.contactNumber,
    ORDER_ENQUIRY_SERVICE_LABEL[record.service],
    orderEnquirySourceLabel[record.source],
    orderEnquiryStatusLabel[record.status],
  ].some((value) => value.toLowerCase().includes(normalized))
}

export function mapOrderEnquiryRowsToGridItems(rows: OrderEnquiry[]) {
  return rows.map((row) => ({
    id: row.id,
    title: row.customer.companyOrCustomerName,
    subtitle: `${row.enquiryNumber} • ${row.customer.contactPersonName}`,
    meta: `${ORDER_ENQUIRY_SERVICE_LABEL[row.service]} • ${orderEnquirySourceLabel[row.source]}`,
    status: orderEnquiryStatusLabel[row.status],
    statusColor: getGridStatusColor(row.status),
  }))
}

function getGridStatusColor(status: OrderEnquiryStatus): 'success' | 'warning' | 'info' | 'default' {
  if (status === 'converted') return 'success'
  if (status === 'in_review' || status === 'qualified') return 'info'
  if (status === 'spam' || status === 'closed') return 'default'
  return 'warning'
}

export interface OrderEnquiryListingEmptyState {
  emptyTitle: string
  emptyDescription: string
  emptyAction?: { label: string; onClick: () => void }
}

export function getOrderEnquiryEmptyState(
  tab: OrderEnquiryListingTab,
  onCreate: () => void,
): OrderEnquiryListingEmptyState {
  switch (tab) {
    case 'website':
      return {
        emptyTitle: 'No website enquiries',
        emptyDescription: 'Extra services submissions from the public website will appear here.',
      }
    case 'converted':
      return {
        emptyTitle: 'No converted enquiries',
        emptyDescription: 'Enquiries converted to orders will appear in this tab.',
      }
    case 'in_review':
      return {
        emptyTitle: 'Nothing in review',
        emptyDescription: 'Qualify or assign website and admin enquiries to move them forward.',
      }
    case 'new':
      return {
        emptyTitle: 'No new enquiries',
        emptyDescription: 'Create an order enquiry or wait for website submissions.',
        emptyAction: { label: 'Create enquiry', onClick: onCreate },
      }
    default:
      return {
        emptyTitle: 'No order enquiries yet',
        emptyDescription: 'Capture extra service requests from the website or create one manually.',
        emptyAction: { label: 'Create enquiry', onClick: onCreate },
      }
  }
}

export function downloadOrderEnquiryCsv(rows: OrderEnquiry[]) {
  const header = ['Enquiry', 'Company', 'Contact', 'Service', 'Source', 'Status', 'Date']
  const lines = rows.map((row) =>
    [
      row.enquiryNumber,
      row.customer.companyOrCustomerName,
      row.customer.contactPersonName,
      ORDER_ENQUIRY_SERVICE_LABEL[row.service],
      orderEnquirySourceLabel[row.source],
      orderEnquiryStatusLabel[row.status],
      formatOrderEnquiryDate(row.enquiryDate),
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  )
  const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `order-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
