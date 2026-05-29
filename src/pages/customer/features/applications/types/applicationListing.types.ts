export type ApplicationOperationalStatus =
  | 'Draft'
  | 'Pending Documents'
  | 'Under Review'
  | 'Verification Pending'
  | 'Correction Required'
  | 'Submitted'
  | 'Passport Ready'
  | 'Completed'
  | 'Rejected'

export type ApplicationRecordType = 'single' | 'bulk'

export type ApplicationCustomerSegment = 'marine' | 'corporate' | 'retail'

export type ApplicationListingTab = 'all' | 'draft' | 'submitted'

export type ApplicationTypeFilter = '' | ApplicationRecordType

export type ApplicationSortPreset = 'latest_created' | 'travel_date' | 'status' | 'last_updated'

export interface ApplicationListingFilterState {
  country: string
  visaType: string
  status: string
  processingStage: string
  applicationType: ApplicationTypeFilter
  createdBy: string
}

export const EMPTY_APPLICATION_LISTING_FILTERS: ApplicationListingFilterState = {
  country: '',
  visaType: '',
  status: '',
  processingStage: '',
  applicationType: '',
  createdBy: '',
}

/** Post-submit pipeline — excludes Draft and pre-submit Pending Documents. */
export const SUBMITTED_OPERATIONAL_STATUSES: ApplicationOperationalStatus[] = [
  'Submitted',
  'Under Review',
  'Verification Pending',
  'Correction Required',
  'Passport Ready',
  'Completed',
  'Rejected',
]

export type ApplicationListingRow = import('../data/applicationFlowData').SingleApplicationRow | import('../data/applicationFlowData').BulkBatchRow

export function isBulkRow(row: ApplicationListingRow): row is import('../data/applicationFlowData').BulkBatchRow {
  return row.recordType === 'bulk'
}

export function isSingleRow(row: ApplicationListingRow): row is import('../data/applicationFlowData').SingleApplicationRow {
  return row.recordType === 'single'
}
