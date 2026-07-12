import type { EnquiryCustomerInfo, EnquiryRecord, EnquiryStatus } from '@/shared/types/enquiry'
import { getVisaRequirementItems } from '@/shared/utils/enquiryVisaRequirementUtils'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import {
  formatEnquiryCustomerType,
  formatEnquiryInquirySource,
} from '../config/enquiryFormConfig'
import { enquiryStatusLabel } from '../config/enquiryStatusConfig'

/** Listing display values derived from form-aligned visa requirement items. */
export function getEnquiryVisaListingFields(record: EnquiryRecord) {
  const items = getVisaRequirementItems(record.visaRequirement)
  const countries = items.map((item) => item.country.trim()).filter(Boolean)
  const visaTypes = items.map((item) => item.visaType.trim()).filter(Boolean)
  const purposes = items.map((item) => item.purposeOfVisit.trim()).filter(Boolean)
  const first = items[0]
  const firstSummary = first
    ? [first.country.trim(), first.visaType.trim()].filter(Boolean).join(' · ')
    : ''
  const firstPurpose = first?.purposeOfVisit.trim() ?? ''
  const remainingCount = Math.max(items.length - 1, 0)

  return {
    items,
    count: items.length,
    firstSummary: firstSummary || '—',
    firstPurpose,
    remainingCount,
    /** Compact listing label, e.g. "Canada · Tourist (+9 more)" */
    compactSummary:
      items.length === 0
        ? '—'
        : remainingCount > 0
          ? `${firstSummary || 'Requirement'} (+${remainingCount} more)`
          : firstSummary || '—',
    countriesText: countries.length ? countries.join(', ') : '—',
    visaTypesText: visaTypes.length ? visaTypes.join(', ') : '—',
    purposesText: purposes.length ? purposes.join('; ') : '—',
    countriesSearch: countries.join(' '),
    visaTypesSearch: visaTypes.join(' '),
    purposesSearch: purposes.join(' '),
  }
}

export function formatEnquiryDate(iso: string | undefined): string {
  if (!iso?.trim()) return '—'
  return formatMasterDate(iso)
}

export type EnquiryListingTab = 'all' | 'new' | 'active' | 'converted' | 'non_converted' | 'closed'

const ACTIVE_STATUSES: EnquiryStatus[] = [
  'under_discussion',
  'requirement_gathering',
  'pending_customer_response',
  'internal_review',
  'quotation_in_progress',
  'on_hold',
]

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
    case 'non_converted':
      return rows.filter((row) => row.status === 'rejected')
    case 'closed':
      return rows.filter((row) => row.status === 'closed')
    default:
      return rows
  }
}

export function applyEnquiryAdvancedFilters(
  records: EnquiryRecord[],
  filters: EnquiryListingFilterState,
): EnquiryRecord[] {
  return records.filter((record) => {
    const visa = getEnquiryVisaListingFields(record)
    if (filters.country && !visa.items.some((item) => item.country === filters.country)) {
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
    if (
      filters.visaType &&
      !visa.visaTypesSearch.toLowerCase().includes(filters.visaType.toLowerCase())
    ) {
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

/** Phone, landline, and email for stacked contact column and grid subtitle */
export function getEnquiryContactDetails(
  customer: Pick<EnquiryCustomerInfo, 'contactNumber' | 'alternateContactNumber' | 'emailAddress'>,
): { phone: string; landline: string; email: string } {
  return {
    phone: customer.contactNumber?.trim() ?? '',
    landline: customer.alternateContactNumber?.trim() ?? '',
    email: customer.emailAddress?.trim() ?? '',
  }
}

export function formatEnquiryContactSecondary(
  customer: Pick<EnquiryCustomerInfo, 'contactNumber' | 'alternateContactNumber' | 'emailAddress'>,
): string {
  const { phone, landline, email } = getEnquiryContactDetails(customer)
  return [phone, landline, email].filter(Boolean).join(' · ')
}

export function getEnquiryCellValue(record: EnquiryRecord, key: string): string {
  const visa = getEnquiryVisaListingFields(record)
  switch (key) {
    case 'companyOrCustomerName':
      return record.customer.companyOrCustomerName
    case 'contactPerson':
      return record.customer.contactPersonName
    case 'customerType':
      return formatEnquiryCustomerType(record.customer.customerType)
    case 'inquirySource':
      return formatEnquiryInquirySource(record.salesDetails.inquirySource)
    case 'countryRequirement':
      return visa.compactSummary
    case 'visaType':
      return visa.visaTypesText
    case 'purposeOfVisit':
      return visa.purposesText
    case 'countryRequirements':
      return visa.compactSummary
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

  const visa = getEnquiryVisaListingFields(record)
  const contact = getEnquiryContactDetails(record.customer)

  return [
    record.id,
    record.customer.companyOrCustomerName,
    record.customer.contactPersonName,
    contact.phone,
    contact.landline,
    contact.email,
    record.customer.companyAddress ?? '',
    formatEnquiryInquirySource(record.salesDetails.inquirySource),
    visa.countriesSearch,
    visa.visaTypesSearch,
    visa.purposesSearch,
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
    const visa = getEnquiryVisaListingFields(record)
    for (const country of visa.items.map((item) => item.country.trim()).filter(Boolean)) {
      countries.add(country)
    }
    for (const visaType of visa.items.map((item) => item.visaType.trim()).filter(Boolean)) {
      visaTypes.add(visaType)
    }
    statuses.add(record.status)
    priorities.add(record.salesDetails.priorityLevel)
    if (record.assignment.assignedTeam) teams.add(record.assignment.assignedTeam)
    if (record.assignment.assignedUser) users.add(record.assignment.assignedUser)
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
  return rows.map((row) => {
    const visa = getEnquiryVisaListingFields(row)
    return {
      id: row.id,
      title: row.customer.companyOrCustomerName,
      subtitle: `${row.customer.contactPersonName} • ${formatEnquiryContactSecondary(row.customer)}`,
      meta: visa.compactSummary === '—' ? 'No country requirements' : visa.compactSummary,
      status: enquiryStatusLabel[row.status],
      statusColor: getGridStatusColor(row.status),
    }
  })
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
        emptyDescription: 'Closed enquiries appear in this view.',
      }
    case 'non_converted':
      return {
        emptyTitle: 'No non converted enquiries',
        emptyDescription: 'Enquiries that were not converted appear in this view.',
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
    'Mobile',
    'Landline',
    'Email',
    'Enquiry Source',
    'Country',
    'Visa Type',
    'Purpose of Visit',
    'Status',
  ]
  const lines = rows.map((row) => {
    const visa = getEnquiryVisaListingFields(row)
    const contact = getEnquiryContactDetails(row.customer)
    return [
      row.id,
      formatEnquiryDate(row.enquiryDate),
      row.customer.companyOrCustomerName,
      row.customer.customerType,
      row.customer.contactPersonName,
      contact.phone,
      contact.landline,
      contact.email,
      formatEnquiryInquirySource(row.salesDetails.inquirySource),
      visa.countriesText === '—' ? '' : visa.countriesText,
      visa.visaTypesText === '—' ? '' : visa.visaTypesText,
      visa.purposesText === '—' ? '' : visa.purposesText,
      enquiryStatusLabel[row.status],
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(',')
  })
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
