import type { ApplicationFlowState } from '../hooks/useApplicationFlowState'
import { splitLegacyPoReference } from './applicationReferenceUtils'

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
  vesselName?: string
  /** @deprecated Legacy combined reference — prefer poCidNo / compassNo */
  poReference?: string
  poCidNo?: string
  compassNo?: string
  joiningPort?: string
  entityName?: string
  department?: string
  costCode?: string
  note1?: string
  note2?: string
  gltsApplicationId?: string
  gltsBatchId?: string
  consultantName?: string
  consultantTeamName?: string
  priority?: string
  isVip?: boolean
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
  vesselName?: string
  poReference?: string
  poCidNo?: string
  compassNo?: string
  joiningPort?: string
  entityName?: string
  department?: string
  costCode?: string
  note1?: string
  note2?: string
  gltsApplicationId?: string
  gltsBatchId?: string
  consultantName?: string
  consultantTeamName?: string
  priority?: string
  isVip?: boolean
}): ApplicationReviewOverview {
  const legacy = splitLegacyPoReference(source.poReference)
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
    vesselName: source.vesselName,
    poReference: source.poReference,
    poCidNo: source.poCidNo?.trim() || legacy.poCidNo || undefined,
    compassNo: source.compassNo?.trim() || legacy.compassNo || undefined,
    joiningPort: source.joiningPort?.trim() || undefined,
    entityName: source.entityName,
    department: source.department?.trim() || undefined,
    costCode: source.costCode?.trim() || undefined,
    note1: source.note1?.trim() || undefined,
    note2: source.note2?.trim() || undefined,
    gltsApplicationId: source.gltsApplicationId,
    gltsBatchId: source.gltsBatchId,
    consultantName: source.consultantName?.trim() || undefined,
    consultantTeamName: source.consultantTeamName?.trim() || undefined,
    priority: source.priority?.trim() || undefined,
    isVip: source.isVip,
  }
}

export function buildApplicationReviewOverviewFromFlowState(
  state: ApplicationFlowState,
  overrides?: Partial<Pick<ApplicationReviewOverview, 'gltsApplicationId' | 'gltsBatchId'>>,
): ApplicationReviewOverview {
  const legacy = splitLegacyPoReference(state.referencePo)
  const poCidNo = state.poCidNo.trim() || legacy.poCidNo
  const compassNo = state.compassNo.trim() || legacy.compassNo

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
    vesselName: state.vesselName || undefined,
    poReference: poCidNo || state.referencePo || undefined,
    poCidNo: poCidNo || undefined,
    compassNo: compassNo || undefined,
    joiningPort: state.joiningPort.trim() || undefined,
    entityName: state.entityName || undefined,
    department: state.department.trim() || undefined,
    costCode: state.costCode.trim() || undefined,
    note1: state.note1.trim() || undefined,
    note2: state.note2.trim() || undefined,
    gltsApplicationId: (overrides?.gltsApplicationId ?? state.gltsApplicationId) || undefined,
    gltsBatchId: (overrides?.gltsBatchId ?? state.gltsBatchId) || undefined,
  }
}
