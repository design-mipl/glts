import { enquiryStatusLabel } from '../config/enquiryStatusConfig'
import type { EnquiryRecord } from '@/shared/types/enquiry'

export interface EnquiryListingFilterState {
  country: string
  status: string
  priority: string
}

export const EMPTY_ENQUIRY_LISTING_FILTERS: EnquiryListingFilterState = {
  country: '',
  status: '',
  priority: '',
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
    return true
  })
}

export function getEnquiryCellValue(record: EnquiryRecord, key: string): string {
  switch (key) {
    case 'companyOrCustomerName':
      return record.customer.companyOrCustomerName
    case 'contactPerson':
      return record.customer.contactPersonName
    case 'customerType':
      return record.customer.customerType
    case 'countryRequirement':
      return record.visaRequirement.countries.join(', ')
    case 'visaType':
      return record.visaRequirement.visaType
    case 'numberOfApplicants':
      return String(record.visaRequirement.numberOfApplicants)
    case 'marineRequirement':
      return record.visaRequirement.marineRequirement ? 'Yes' : 'No'
    case 'assignedTeam':
      return record.assignment.assignedTeam ?? '--'
    case 'assignedUser':
      return record.assignment.assignedUser ?? '--'
    case 'priority':
      return record.salesDetails.priorityLevel
    case 'nextFollowupDate':
      return record.nextFollowupDate ? new Date(record.nextFollowupDate).toLocaleDateString() : '--'
    case 'status':
      return enquiryStatusLabel[record.status]
    case 'lastActivity':
      return new Date(record.lastActivity).toLocaleString()
    case 'createdBy':
      return record.createdBy
    case 'enquiryDate':
      return record.enquiryDate ? new Date(record.enquiryDate).toLocaleDateString() : ''
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
    record.customer.emailAddress,
    record.visaRequirement.visaType,
    record.visaRequirement.countries.join(' '),
    record.assignment.assignedTeam ?? '',
    record.assignment.assignedUser ?? '',
    enquiryStatusLabel[record.status],
  ].some((value) => value.toLowerCase().includes(normalized))
}

export function getEnquiryFilterOptions(records: EnquiryRecord[]) {
  const countries = new Set<string>()
  const statuses = new Set<string>()
  const priorities = new Set<string>()

  for (const record of records) {
    for (const country of record.visaRequirement.countries) {
      countries.add(country)
    }
    statuses.add(record.status)
    priorities.add(record.salesDetails.priorityLevel)
  }

  return {
    countries: Array.from(countries).sort((a, b) => a.localeCompare(b)),
    statuses: Array.from(statuses).sort((a, b) => a.localeCompare(b)),
    priorities: Array.from(priorities).sort((a, b) => a.localeCompare(b)),
  }
}
