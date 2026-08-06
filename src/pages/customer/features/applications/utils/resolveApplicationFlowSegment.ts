import { loadSession } from '@/shared/auth/session'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import type { BusinessSegment } from '@/shared/types/countryMaster'
import { resolveCustomerPortalAgreement } from '@/shared/utils/resolveCustomerPortalAgreement'
import type { ApplicationCustomerSegment } from '../types/applicationListing.types'
import {
  type ApplicationFlowPolicy,
  customerSegmentToBusinessSegment,
} from '../context/ApplicationFlowPolicyContext'

function workflowTypeToSegment(workflowType: AgreementWorkflowType): BusinessSegment {
  switch (workflowType) {
    case 'marine':
      return 'marine'
    case 'corporate':
      return 'corporate'
    case 'b2b_agent':
      return 'b2bAgents'
    case 'retail':
      return 'retail'
    case 'mixed':
    default:
      return 'marine'
  }
}

/**
 * Business segment for visa offerings and card display in application create flows.
 * Admin flows use the module's customerSegment (Country Master segment).
 * Customer portal defaults to marine; agreement workflow overrides when approved.
 */
export function resolveApplicationFlowSegment(
  policy: ApplicationFlowPolicy,
  adminCustomerSegment: ApplicationCustomerSegment = 'marine',
): BusinessSegment {
  if (policy === 'admin') return customerSegmentToBusinessSegment(adminCustomerSegment)
  if (policy === 'website') return 'retail'

  const session = loadSession()
  const agreement = resolveCustomerPortalAgreement(session)
  if (agreement?.workflowType) {
    return workflowTypeToSegment(agreement.workflowType)
  }

  switch (session?.customerType) {
    case 'corporate':
      return 'corporate'
    case 'b2b_agent':
      return 'b2bAgents'
    case 'marine':
    default:
      return 'marine'
  }
}
