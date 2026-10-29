import type { ApplicationDetailViewModel } from '../types/applicationDetail.types'
import type { ApplicationCustomerSegment } from '../types/applicationListing.types'
import type { UploadQueueRow } from '../data/applicationFlowData'
import { buildVerifyApplicantSummaryFields as buildMarineVerifyFields } from '@/pages/admin/application-management/marine/utils/verifyApplicantSummaryFields'
import { buildVerifyApplicantSummaryFields as buildCorporateVerifyFields } from '@/pages/admin/application-management/corporate/utils/verifyApplicantSummaryFields'
import { buildVerifyApplicantSummaryFields as buildB2bVerifyFields } from '@/pages/admin/application-management/b2b-agents/utils/verifyApplicantSummaryFields'
import { buildVerifyApplicantSummaryFields as buildRetailVerifyFields } from '@/pages/admin/application-management/retail/utils/verifyApplicantSummaryFields'
import type { VerifySummaryField } from '@/pages/admin/application-management/marine/utils/verifyApplicantSummaryFields'
import { isMarineApplicationSegment, usesDesignationLabel } from '@/shared/utils/applicationSegmentListingPolicy'

export type { VerifySummaryField }

export function resolveVerifyApplicantSecondaryTitle(
  segment: ApplicationCustomerSegment,
): string {
  if (isMarineApplicationSegment(segment)) return 'Employment / marine details'
  if (usesDesignationLabel(segment)) return 'Employment / billing details'
  return 'Additional details'
}

export function resolveVerifyApplicantSummaryFields(
  customerSegment: ApplicationCustomerSegment,
  row: UploadQueueRow,
  detail: ApplicationDetailViewModel,
  applicationId: string,
  documentsLabel: string,
): { primary: VerifySummaryField[]; secondary: VerifySummaryField[] } {
  switch (customerSegment) {
    case 'corporate':
      return buildCorporateVerifyFields(row, detail, applicationId, documentsLabel)
    case 'b2bAgents':
      return buildB2bVerifyFields(row, detail, applicationId, documentsLabel)
    case 'retail':
      return buildRetailVerifyFields(row, detail, applicationId, documentsLabel)
    case 'marine':
    default:
      return buildMarineVerifyFields(row, detail, applicationId, documentsLabel)
  }
}
