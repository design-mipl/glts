import { APPLICATION_FLOW_STORAGE_KEY } from '../hooks/useApplicationFlowState'
import type { FlowDraftLikeState } from '../types/applicationDetail.types'

export function parseApplicationFlowDraft(parsed: unknown): FlowDraftLikeState | null {
  if (!parsed || typeof parsed !== 'object') return null
  const draft = parsed as Partial<FlowDraftLikeState>
  return {
    gltsApplicationId: typeof draft.gltsApplicationId === 'string' ? draft.gltsApplicationId : '',
    gltsBatchId: typeof draft.gltsBatchId === 'string' ? draft.gltsBatchId : '',
    countryId: typeof draft.countryId === 'string' ? draft.countryId : undefined,
    visaOfferingId: typeof draft.visaOfferingId === 'string' ? draft.visaOfferingId : undefined,
    countryName: typeof draft.countryName === 'string' ? draft.countryName : '',
    countryFlag: typeof draft.countryFlag === 'string' ? draft.countryFlag : '',
    visaTypeLabel: typeof draft.visaTypeLabel === 'string' ? draft.visaTypeLabel : '',
    purposeLabel: typeof draft.purposeLabel === 'string' ? draft.purposeLabel : '',
    travelDate: typeof draft.travelDate === 'string' ? draft.travelDate : '',
    issuedPassportState:
      typeof draft.issuedPassportState === 'string' ? draft.issuedPassportState : undefined,
    placeOfResidence:
      typeof draft.placeOfResidence === 'string' ? draft.placeOfResidence : undefined,
    jurisdiction: typeof draft.jurisdiction === 'string' ? draft.jurisdiction : undefined,
    jurisdictionId: typeof draft.jurisdictionId === 'string' ? draft.jurisdictionId : undefined,
    entityId: typeof draft.entityId === 'string' ? draft.entityId : undefined,
    entityName: typeof draft.entityName === 'string' ? draft.entityName : undefined,
    contactPerson: typeof draft.contactPerson === 'string' ? draft.contactPerson : undefined,
    location: typeof draft.location === 'string' ? draft.location : undefined,
    vesselId: typeof draft.vesselId === 'string' ? draft.vesselId : undefined,
    vesselName: typeof draft.vesselName === 'string' ? draft.vesselName : undefined,
    imoNumber: typeof draft.imoNumber === 'string' ? draft.imoNumber : undefined,
    vesselType: typeof draft.vesselType === 'string' ? draft.vesselType : undefined,
    flagCountry: typeof draft.flagCountry === 'string' ? draft.flagCountry : undefined,
    portOfRegistry: typeof draft.portOfRegistry === 'string' ? draft.portOfRegistry : undefined,
    referencePo: typeof draft.referencePo === 'string' ? draft.referencePo : undefined,
    billingAddress: typeof draft.billingAddress === 'string' ? draft.billingAddress : undefined,
    globalDocumentUploads:
      draft.globalDocumentUploads && typeof draft.globalDocumentUploads === 'object'
        ? draft.globalDocumentUploads
        : {},
    uploadQueueRows: Array.isArray(draft.uploadQueueRows) ? draft.uploadQueueRows : [],
  }
}

export function readApplicationFlowDraftFromSession(): FlowDraftLikeState | null {
  try {
    const raw = sessionStorage.getItem(APPLICATION_FLOW_STORAGE_KEY)
    if (!raw) return null
    return parseApplicationFlowDraft(JSON.parse(raw))
  } catch {
    return null
  }
}
