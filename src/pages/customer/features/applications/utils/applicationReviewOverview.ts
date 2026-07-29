import type { ApplicationFlowState } from '../hooks/useApplicationFlowState'

export interface ApplicationReviewOverview {
  countryName: string
  countryFlag: string
  visaTypeLabel: string
  purposeLabel?: string
  travelDate: string
  issuedPassportLocationLabel?: string
  placeOfResidenceLabel?: string
  jurisdiction?: string
  companyName?: string
  gltsApplicationId?: string
  gltsBatchId?: string
}

/** Map admin verify overview (or any compatible shape) into queue-table summary popover data. */
export function toApplicationReviewOverview(source: {
  countryName: string
  countryFlag: string
  visaTypeLabel: string
  purposeLabel?: string
  travelDate: string
  issuedPassportLocationLabel?: string
  placeOfResidenceLabel?: string
  jurisdiction?: string
  companyName?: string
  gltsApplicationId?: string
  gltsBatchId?: string
}): ApplicationReviewOverview {
  return {
    countryName: source.countryName,
    countryFlag: source.countryFlag,
    visaTypeLabel: source.visaTypeLabel,
    purposeLabel: source.purposeLabel,
    travelDate: source.travelDate,
    issuedPassportLocationLabel: source.issuedPassportLocationLabel,
    placeOfResidenceLabel: source.placeOfResidenceLabel,
    jurisdiction: source.jurisdiction,
    companyName: source.companyName,
    gltsApplicationId: source.gltsApplicationId,
    gltsBatchId: source.gltsBatchId,
  }
}

export function buildApplicationReviewOverviewFromFlowState(
  state: ApplicationFlowState,
  overrides?: Partial<Pick<ApplicationReviewOverview, 'gltsApplicationId' | 'gltsBatchId'>>,
): ApplicationReviewOverview {
  return {
    countryName: state.countryName,
    countryFlag: state.countryFlag,
    visaTypeLabel: state.visaTypeLabel,
    purposeLabel: state.purposeLabel,
    travelDate: state.travelDate,
    issuedPassportLocationLabel:
      state.issuedPassportState || state.issuedPassportLocationId || undefined,
    placeOfResidenceLabel: state.placeOfResidence || undefined,
    jurisdiction: state.jurisdiction,
    companyName: state.companyName || undefined,
    gltsApplicationId: (overrides?.gltsApplicationId ?? state.gltsApplicationId) || undefined,
    gltsBatchId: (overrides?.gltsBatchId ?? state.gltsBatchId) || undefined,
  }
}
