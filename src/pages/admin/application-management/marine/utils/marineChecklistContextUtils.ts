import type { CustomerApplication } from '@/pages/customer/data/mockData'
import type { BulkBatchRow, SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  resolveOfferingIdsByLabels,
  resolveOfferingJurisdictionId,
} from '@/shared/services/countryMasterService'

export interface MarineChecklistContext {
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
}

type MarineListingRow = Pick<SingleApplicationRow | BulkBatchRow, 'country' | 'visaType' | 'jurisdiction'>

function resolveOfferingIds(
  country?: string,
  visaType?: string,
): Pick<MarineChecklistContext, 'countryId' | 'visaOfferingId'> {
  if (!country?.trim() || !visaType?.trim()) return {}
  return resolveOfferingIdsByLabels(country, visaType) ?? {}
}

export function resolveMarineChecklistContext(input: {
  application?: CustomerApplication | null
  listingRow?: MarineListingRow | null
}): MarineChecklistContext {
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
