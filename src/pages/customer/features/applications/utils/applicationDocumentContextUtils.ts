import { resolveOfferingIdsByLabels } from '@/shared/services/countryMasterService'
import type { BusinessSegment } from '@/shared/types/countryMaster'
import { customerSegmentToBusinessSegment } from '../context/ApplicationFlowPolicyContext'
import type { FlowDraftLikeState } from '../types/applicationDetail.types'
import type { ApplicationCustomerSegment } from '../types/applicationListing.types'
import type { ApplicantDocumentChecklistContext } from './uploadQueueDocuments'

export function resolveDocumentChecklistContext(input: {
  country?: string
  visaType?: string
  customerSegment?: ApplicationCustomerSegment
  flowState?: FlowDraftLikeState | null
}): Omit<ApplicantDocumentChecklistContext, 'seedIndex' | 'passportFields'> {
  const flowState = input.flowState
  const countryLabel = flowState?.countryName?.trim() || input.country?.trim() || ''
  const visaTypeLabel = flowState?.visaTypeLabel?.trim() || input.visaType?.trim() || ''
  const segment: BusinessSegment | undefined = input.customerSegment
    ? customerSegmentToBusinessSegment(input.customerSegment)
    : undefined

  let countryId = flowState?.countryId
  let visaOfferingId = flowState?.visaOfferingId
  const jurisdictionId = flowState?.jurisdictionId

  if ((!countryId || !visaOfferingId) && countryLabel && visaTypeLabel) {
    const resolved = resolveOfferingIdsByLabels(countryLabel, visaTypeLabel, segment)
    if (resolved) {
      countryId = countryId || resolved.countryId
      visaOfferingId = visaOfferingId || resolved.visaOfferingId
    }
  }

  return {
    countryLabel,
    countryId,
    visaOfferingId,
    jurisdictionId,
    visaTypeLabel,
    segment,
  }
}
