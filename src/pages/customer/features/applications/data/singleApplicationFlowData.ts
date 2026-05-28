import type { PortalVisaOption } from '@/shared/services/visaService'
import type { Country } from '@/shared/types/visa'
import {
  ACCOUNT_MAPPED_COUNTRY_IDS,
  countryMasterToPortalCountry,
  getChecklistItemsForOffering,
  getDocumentWorkspaceItems,
  getRequirementPreviewCards,
  getVisaOfferings,
  listCountryMasters,
  listPortalCountries,
} from '@/shared/services/countryMasterService'

export type {
  DocumentVerificationStatus,
  DocumentWorkspaceItem,
  RequirementPreviewCard,
} from '@/shared/types/countryMaster'

export { ACCOUNT_MAPPED_COUNTRY_IDS }

export const RECENTLY_USED_COUNTRY_IDS = ['14', '2', '13'] as const

/** @deprecated Use CountryVisaOffering from country master — kept for gradual migration. */
export interface VisaPurposeOption {
  id: string
  visaType: string
  visaTypeLabel: string
  purpose: string
  purposeLabel: string
  processingTimeline: string
  entryType: string
  requirementSummary: string
}

export interface RequirementDocumentRow {
  id: string
  name: string
  mandatory: boolean
  remarks?: string
  hasSample?: boolean
}

export function getAccountMappedCountries(): Country[] {
  return listPortalCountries({ accountMappedOnly: true })
}

export function getRecentlyUsedCountries(): Country[] {
  const map = new Map(getAccountMappedCountries().map(c => [c.id, c]))
  return RECENTLY_USED_COUNTRY_IDS.map(id => map.get(id)).filter((c): c is Country => Boolean(c))
}

export function getTrendingAccountCountries(): Country[] {
  const allowed = new Set<string>(ACCOUNT_MAPPED_COUNTRY_IDS)
  return listCountryMasters({ accountMappedOnly: true })
    .filter(c => c.trending && allowed.has(c.id))
    .map(countryMasterToPortalCountry)
}

export function getVisaPurposeOptions(countryId: string): VisaPurposeOption[] {
  return getVisaOfferings(countryId).map(o => ({
    id: o.id,
    visaType: o.visaTypeId,
    visaTypeLabel: o.visaTypeLabel,
    purpose: o.purposeId,
    purposeLabel: o.purposeLabel,
    processingTimeline: o.processingTimeline,
    entryType: o.entryType,
    requirementSummary: o.requirementSummary,
  }))
}

export {
  getRequirementPreviewCards,
  getDocumentWorkspaceItems,
  getChecklistItemsForOffering,
}

export function getPopularVisaTypesForCountry(country: Country): string {
  return getVisaOfferings(country.id)
    .slice(0, 2)
    .map(o => o.visaTypeLabel)
    .join(' · ')
}

export function toLegacyVisaOption(opt: VisaPurposeOption): PortalVisaOption {
  return { id: opt.visaType, label: opt.visaTypeLabel, sub: opt.purposeLabel }
}
