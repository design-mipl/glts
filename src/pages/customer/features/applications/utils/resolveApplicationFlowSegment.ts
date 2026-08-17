import type { BusinessSegment } from '@/shared/types/countryMaster'
import type { ApplicationCustomerSegment } from '../types/applicationListing.types'
import {
  type ApplicationFlowPolicy,
  customerSegmentToBusinessSegment,
} from '../context/ApplicationFlowPolicyContext'

/**
 * Business segment for visa offerings, documents, and card display in application create flows.
 * Admin flows use the module's customerSegment. Customer portals use the portal's segment.
 * Website apply uses retail Country Master config.
 */
export function resolveApplicationFlowSegment(
  policy: ApplicationFlowPolicy,
  portalCustomerSegment: ApplicationCustomerSegment = 'retail',
): BusinessSegment {
  if (policy === 'admin') return customerSegmentToBusinessSegment(portalCustomerSegment)
  if (policy === 'website') return 'retail'
  return customerSegmentToBusinessSegment(portalCustomerSegment)
}
