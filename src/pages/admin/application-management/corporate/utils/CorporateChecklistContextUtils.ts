import type { CustomerApplication } from '@/pages/customer/data/mockData'
import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  resolveOfferingIdsByLabels,
  resolveOfferingJurisdictionId,
} from '@/shared/services/countryMasterService'

export interface CorporateChecklistContext {
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
}

type CorporateListingRow = Pick<SingleApplicationRow | BulkBatchRow, 'country' | 'visaType' | 'jurisdiction'>

function resolveOfferingIds(
  country?: string,
  visaType?: string,
): Pick<CorporateChecklistContext, 'countryId' | 'visaOfferingId'> {
  if (!country?.trim() || !visaType?.trim()) return {}
  return resolveOfferingIdsByLabels(country, visaType, 'corporate') ?? {}
}

export function resolveCorporateChecklistContext(input: {
  application?: CustomerApplication | null
  listingRow?: CorporateListingRow | null
}): CorporateChecklistContext {
  const country = input.application?.country?.trim() || input.listingRow?.country?.trim()
  const visaType = input.application?.visaType?.trim() || input.listingRow?.visaType?.trim()
  const jurisdictionLabel =
    input.application?.jurisdiction?.trim() || input.listingRow?.jurisdiction?.trim()

  const { countryId, visaOfferingId } = resolveOfferingIds(country, visaType)
  if (!countryId || !visaOfferingId) return {}

  const jurisdictionId = resolveOfferingJurisdictionId(countryId, visaOfferingId, {
    jurisdictionLabel,
  })

  return { countryId, visaOfferingId, jurisdictionId }
}
