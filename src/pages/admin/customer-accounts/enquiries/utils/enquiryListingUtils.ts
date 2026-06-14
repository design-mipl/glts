import type { EnquiryCustomerInfo, EnquiryRecord, EnquiryStatus } from '@/shared/types/enquiry'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import {
  formatEnquiryInquirySource,
  formatEnquiryProcessingType,
} from '../config/enquiryFormConfig'
import { enquiryStatusLabel } from '../config/enquiryStatusConfig'

export function formatEnquiryDate(iso: string | undefined): string {
  if (!iso?.trim()) return '—'
  return formatMasterDate(iso)
}

export type EnquiryListingTab = 'all' | 'new' | 'active' | 'converted' | 'closed'

const ACTIVE_STATUSES: EnquiryStatus[] = [
  'under_discussion',
  'requirement_gathering',
  'pending_customer_response',
  'internal_review',
  'quotation_in_progress',
  'on_hold',
]

const CLOSED_STATUSES: EnquiryStatus[] = ['closed', 'rejected']

export interface EnquiryListingFilterState {
  country: string
  status: string
  priority: string
  dateFrom: string
  dateTo: string
  customerType: string
  visaType: string
  assignedTeam: string
  assignedUser: string
  marineRequirement: string
  source: string
}

export const EMPTY_ENQUIRY_LISTING_FILTERS: EnquiryListingFilterState = {
  country: '',
  status: '',
  priority: '',
  dateFrom: '',
  dateTo: '',
  customerType: '',
  visaType: '',
  assignedTeam: '',
  assignedUser: '',
  marineRequirement: '',
  source: '',
}

export function filterEnquiryRowsByTab(rows: EnquiryRecord[], tab: EnquiryListingTab): EnquiryRecord[] {
  switch (tab) {
    case 'new':
      return rows.filter((row) => row.status === 'new')
    case 'active':
      return rows.filter((row) => ACTIVE_STATUSES.includes(row.status))
    case 'converted':
      return rows.filter((row) => row.status === 'converted')
    case 'closed':
      return rows.filter((row) => CLOSED_STATUSES.includes(row.status))
    default:
      return rows
  }
}

export function applyEnquiryAdvancedFilters(
  records: EnquiryRecord[],
  filters: EnquiryListingFilterState,
): EnquiryRecord[] {
  return records.filter((record) => {
    if (filters.country && !record.visaRequirement.countries.includes(filters.country)) {
      return false
    }
    if (filters.status && record.status !== filters.status) {
      return false
    }
    if (filters.priority && record.salesDetails.priorityLevel !== filters.priority) {
      return false
    }
    if (filters.customerType && record.customer.customerType !== filters.customerType) {
      return false
    }
    if (filters.visaType && !record.visaRequirement.visaType.toLowerCase().includes(filters.visaType.toLowerCase())) {
      return false
    }
    if (filters.assignedTeam && (record.assignment.assignedTeam ?? '') !== filters.assignedTeam) {
      return false
    }
    if (filters.assignedUser && (record.assignment.assignedUser ?? '') !== filters.assignedUser) {
      return false
    }
    if (filters.source && record.salesDetails.inquirySource !== filters.source) {
      return false
    }
    if (filters.marineRequirement === 'true' && !record.visaRequirement.marineRequirement) {
      return false
    }
    if (filters.marineRequirement === 'false' && record.visaRequirement.marineRequirement) {
      return false
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime()
      const enquiryTime = new Date(record.enquiryDate).getTime()
      if (enquiryTime < from) return false
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo).getTime()
      const enquiryTime = new Date(record.enquiryDate).getTime()
      if (enquiryTime > to) return false
    }
    return true
  })
}

export function hasActiveEnquiryFilters(filters: EnquiryListingFilterState): boolean {
  return Object.values(filters).some((value) => Boolean(value))
}

/** Phone and email line for stacked contact column and grid subtitle */
export function formatEnquiryContactSecondary(
  customer: Pick<EnquiryCustomerInfo, 'contactNumber' | 'emailAddress'>,
): string {
  const phone = customer.contactNumber?.trim() ?? ''
  const email = customer.emailAddress?.trim() ?? ''
  if (phone && email) return `${phone} · ${email}`
  return phone || email
}

export function getEnquiryCellValue(record: EnquiryRecord, key: string): string {
  switch (key) {
    case 'companyOrCustomerName':
      return record.customer.companyOrCustomerName
    case 'contactPerson':
      return record.customer.contactPersonName
    case 'customerType':
      return record.customer.customerType
    case 'inquirySource':
      return formatEnquiryInquirySource(record.salesDetails.inquirySource)
    case 'countryRequirement':
      return record.visaRequirement.countries.join(', ')
    case 'visaType':
      return record.visaRequirement.visaType
    case 'status':
      return enquiryStatusLabel[record.status]
    case 'enquiryDate':
      return formatEnquiryDate(record.enquiryDate)
    case 'id':
      return record.id
    default:
      return String((record as unknown as Record<string, unknown>)[key] ?? '')
  }
}

export function matchesEnquirySearch(record: EnquiryRecord, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  return [
    record.id,
    record.customer.companyOrCustomerName,
    record.customer.contactPersonName,
    record.customer.contactNumber,
    record.customer.emailAddress,
    formatEnquiryInquirySource(record.salesDetails.inquirySource),
    record.visaRequirement.visaType,
    record.visaRequirement.purposeOfVisit ?? '',
    formatEnquiryProcessingType(record.visaRequirement.processingType),
    record.visaRequirement.countries.join(' '),
    enquiryStatusLabel[record.status],
  ].some((value) => value.toLowerCase().includes(normalized))
}

export function getEnquiryFilterOptions(records: EnquiryRecord[]) {
  const countries = new Set<string>()
  const statuses = new Set<string>()
  const priorities = new Set<string>()
  const teams = new Set<string>()
  const users = new Set<string>()
  const visaTypes = new Set<string>()

  for (const record of records) {
    for (const country of record.visaRequirement.countries) {
      countries.add(country)
    }
    statuses.add(record.status)
    priorities.add(record.salesDetails.priorityLevel)
    if (record.assignment.assignedTeam) teams.add(record.assignment.assignedTeam)
    if (record.assignment.assignedUser) users.add(record.assignment.assignedUser)
    visaTypes.add(record.visaRequirement.visaType)
  }

  return {
    countries: Array.from(countries).sort((a, b) => a.localeCompare(b)),
    statuses: Array.from(statuses).sort((a, b) => a.localeCompare(b)),
    priorities: Array.from(priorities).sort((a, b) => a.localeCompare(b)),
    teams: Array.from(teams).sort((a, b) => a.localeCompare(b)),
    users: Array.from(users).sort((a, b) => a.localeCompare(b)),
    visaTypes: Array.from(visaTypes).sort((a, b) => a.localeCompare(b)),
  }
}

function getGridStatusColor(status: EnquiryRecord['status']): 'success' | 'warning' | 'info' | 'default' {
  if (status === 'converted') return 'success'
  if (status === 'on_hold' || status === 'pending_customer_response') return 'warning'
  if (status === 'closed' || status === 'rejected') return 'default'
  return 'info'
}

export function mapEnquiryRowsToGridItems(rows: EnquiryRecord[]) {
  return rows.map((row) => ({
    id: row.id,
    title: row.customer.companyOrCustomerName,
    subtitle: `${row.customer.contactPersonName} • ${formatEnquiryContactSecondary(row.customer)}`,
    meta: `${row.visaRequirement.countries.join(', ')} • ${row.visaRequirement.visaType}`,
    status: enquiryStatusLabel[row.status],
    statusColor: getGridStatusColor(row.status),
  }))
}

export interface EnquiryListingEmptyState {
  emptyTitle: string
  emptyDescription: string
  emptyAction?: { label: string; onClick: () => void }
}

export function getEnquiryEmptyState(
  tab: EnquiryListingTab,
  onCreate: () => void,
): EnquiryListingEmptyState {
  switch (tab) {
    case 'new':
      return {
        emptyTitle: 'No new enquiries',
        emptyDescription: 'New enquiries appear here when first captured from sales or the website.',
        emptyAction: { label: 'Create enquiry', onClick: onCreate },
      }
    case 'active':
      return {
        emptyTitle: 'No active enquiries',
        emptyDescription: 'Active enquiries are those in discussion, review, or quotation preparation.',
        emptyAction: { label: 'Create enquiry', onClick: onCreate },
      }
    case 'converted':
      return {
        emptyTitle: 'No converted enquiries',
        emptyDescription: 'Converted enquiries have progressed to quotation generation.',
      }
    case 'closed':
      return {
        emptyTitle: 'No closed enquiries',
        emptyDescription: 'Closed or rejected enquiries appear in this view.',
      }
    default:
      return {
        emptyTitle: 'No enquiries available',
        emptyDescription: 'Create a new enquiry to begin tracking onboarding requirements.',
        emptyAction: { label: 'Create enquiry', onClick: onCreate },
      }
  }
}

export function exportEnquiriesToCsv(rows: EnquiryRecord[]): string {
  const headers = [
    'Enquiry ID',
    'Enquiry Date',
    'Company / Customer',
    'Customer Type',
    'Contact Person',
    'Contact',
    'Email',
    'Inquiry Source',
    'Country',
    'Visa Type',
    'Status',
  ]
  const lines = rows.map((row) =>
    [
      row.id,
      formatEnquiryDate(row.enquiryDate),
      row.customer.companyOrCustomerName,
      row.customer.customerType,
      row.customer.contactPersonName,
      row.customer.contactNumber,
      row.customer.emailAddress,
      formatEnquiryInquirySource(row.salesDetails.inquirySource),
      row.visaRequirement.countries.join('; '),
      row.visaRequirement.visaType,
      enquiryStatusLabel[row.status],
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  )
  return [headers.join(','), ...lines].join('\n')
}

export function downloadEnquiryCsv(rows: EnquiryRecord[], filename = 'enquiries-export.csv') {
  const csv = exportEnquiriesToCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
