import {
  mockBulkBatches,
  mockSingleApplications,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'

export type MarineApplicationRow = SingleApplicationRow | BulkBatchRow

export function isCustomerSubmitted(row: MarineApplicationRow): boolean {
  return row.operationalStatus !== 'Draft' && Boolean(row.submissionDate?.trim())
}

function isMarineSegment(row: MarineApplicationRow): boolean {
  return row.customerSegment === 'marine'
}

function filterMarineSubmitted(rows: MarineApplicationRow[]): MarineApplicationRow[] {
  return rows.filter(row => isCustomerSubmitted(row) && isMarineSegment(row))
}

export const marineApplicationAdminService = {
  listSubmittedMarineApplications(): { singles: SingleApplicationRow[]; bulks: BulkBatchRow[] } {
    const singles = filterMarineSubmitted(mockSingleApplications) as SingleApplicationRow[]
    const bulks = filterMarineSubmitted(mockBulkBatches) as BulkBatchRow[]
    return { singles, bulks }
  },

  listAllSubmittedBySegment(segment: ApplicationCustomerSegment): {
    singles: SingleApplicationRow[]
    bulks: BulkBatchRow[]
  } {
    const singles = mockSingleApplications.filter(
      row => isCustomerSubmitted(row) && row.customerSegment === segment,
    )
    const bulks = mockBulkBatches.filter(
      row => isCustomerSubmitted(row) && row.customerSegment === segment,
    )
    return { singles, bulks }
  },

  getDetail(applicationId?: string): ApplicationDetailViewModel {
    return customerPortalService.getApplicationDetail(applicationId)
  },
}
