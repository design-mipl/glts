import type { ApplicationFlowPolicy } from '../context/ApplicationFlowPolicyContext'
import type { ApplicationFlowState } from '../hooks/useApplicationFlowState'
import { offeringRequiresJurisdictionSelection } from '@/shared/services/countryMasterService'

export const APPLICATION_FLOW_STEPS = [
  'country',
  'visa',
  'requirements',
  'upload',
  'details',
  'submit',
] as const

export type ApplicationFlowStep = (typeof APPLICATION_FLOW_STEPS)[number]

export const APPLICATION_FLOW_STEP_LABELS: Record<ApplicationFlowStep, string> = {
  country: 'Country',
  visa: 'Visa',
  requirements: 'Requirements',
  upload: 'Documents',
  details: 'Details',
  submit: 'Submit',
}

export function canAdvanceFromStep(
  step: ApplicationFlowStep,
  state: ApplicationFlowState,
  policy: ApplicationFlowPolicy,
): boolean {
  if (policy === 'admin') {
    return step !== 'submit'
  }

  switch (step) {
    case 'country':
      return Boolean(state.countryId)
    case 'visa':
      return Boolean(state.visaOfferingId)
    case 'requirements':
      return Boolean(
        state.visaOfferingId &&
          state.travelDate &&
          (!offeringRequiresJurisdictionSelection(state.countryId, state.visaOfferingId) ||
            ((state.issuedPassportState || state.issuedPassportLocationId) &&
              state.jurisdictionId &&
              state.jurisdiction)),
      )
    case 'upload':
      return state.uploadQueueRows.length > 0
    case 'details':
      return true
    case 'submit':
      return false
    default:
      return false
  }
}
