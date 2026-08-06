import type { CustomerApplication } from '@/pages/customer/data/mockData'
import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  resolveOfferingIdsByLabels,
  resolveOfferingJurisdictionId,
} from '@/shared/services/countryMasterService'

export interface B2bChecklistContext {
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
}

type B2bListingRow = Pick<SingleApplicationRow | BulkBatchRow, 'country' | 'visaType' | 'jurisdiction'>

function resolveOfferingIds(
  country?: string,
  visaType?: string,
): Pick<B2bChecklistContext, 'countryId' | 'visaOfferingId'> {
  if (!country?.trim() || !visaType?.trim()) return {}
  return resolveOfferingIdsByLabels(country, visaType, 'b2bAgents') ?? {}
}

export function resolveB2bChecklistContext(input: {
  application?: CustomerApplication | null
  listingRow?: B2bListingRow | null
}): B2bChecklistContext {
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
