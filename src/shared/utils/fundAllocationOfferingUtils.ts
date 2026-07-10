import {
  getCountryMasterById,
  resolveOfferingIdsByLabels,
} from '@/shared/services/countryMasterService'

export interface FundAllocationOfferingContext {
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
}

export function resolveFundAllocationOfferingContext(
  country: string,
  visaType: string,
  jurisdiction: string,
): FundAllocationOfferingContext {
  const offeringIds = resolveOfferingIdsByLabels(country, visaType)
  if (!offeringIds) return {}

  const jurisdictionId = resolveJurisdictionIdByLabel(
    offeringIds.countryId,
    offeringIds.visaOfferingId,
    jurisdiction,
  )

  return {
    countryId: offeringIds.countryId,
    visaOfferingId: offeringIds.visaOfferingId,
    jurisdictionId,
  }
}

function resolveJurisdictionIdByLabel(
  countryId: string,
  offeringId: string,
  jurisdictionLabel: string,
): string | undefined {
  if (!jurisdictionLabel?.trim() || jurisdictionLabel === '—') return undefined

  const countryMaster = getCountryMasterById(countryId)
  if (!countryMaster) return undefined

  const normalized = jurisdictionLabel.trim().toLowerCase()
  for (const segment of countryMaster.segments) {
    const visaType = segment.visaTypes.find(entry => entry.id === offeringId)
    const jurisdiction = visaType?.jurisdictions?.find(
      entry => entry.name.trim().toLowerCase() === normalized,
    )
    if (jurisdiction) return jurisdiction.id
  }

  return undefined
}
