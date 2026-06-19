import { PROCESSING_TYPE_LABELS } from '@/shared/constants/countryProcessing'
import type { BusinessSegment, CountryMaster, CountryVisaType } from '@/shared/types/countryMaster'
import type { VisaCategory } from '@/shared/types/visa'

export interface PortalCountryDisplayOptions {
  segment?: BusinessSegment
}

function activeVisaTypesForSegment(
  master: CountryMaster,
  segment: BusinessSegment,
): CountryVisaType[] {
  const segmentConfig = master.segments.find((entry) => entry.segment === segment)
  if (!segmentConfig?.enabled) return []
  return segmentConfig.visaTypes.filter((visaType) => visaType.status === 'active')
}

export function countryHasActiveSegment(master: CountryMaster, segment: BusinessSegment): boolean {
  return activeVisaTypesForSegment(master, segment).length > 0
}

export function countryHasBookableConfiguration(
  master: CountryMaster,
  segment?: BusinessSegment,
): boolean {
  if (segment) return countryHasActiveSegment(master, segment)
  return master.segments.some(
    (entry) => entry.enabled && entry.visaTypes.some((visaType) => visaType.status === 'active'),
  )
}

function primaryVisaType(
  master: CountryMaster,
  segment?: BusinessSegment,
): CountryVisaType | undefined {
  if (segment) {
    return activeVisaTypesForSegment(master, segment)[0]
  }

  for (const entry of master.segments) {
    if (!entry.enabled) continue
    const active = entry.visaTypes.find((visaType) => visaType.status === 'active')
    if (active) return active
  }

  return undefined
}

/** Card headline label — admin processing type (E-Visa, VFS, Embassy, …). */
export function resolvePortalProcessingLabel(master: CountryMaster): string {
  return PROCESSING_TYPE_LABELS[master.processingType] ?? master.processingType
}

/** Validity line on destination cards — admin validity label with visa-type fallback. */
export function resolvePortalValidityLabel(
  master: CountryMaster,
  options: PortalCountryDisplayOptions = {},
): string {
  const configured = master.validity?.trim()
  if (configured) return configured

  const visaType = primaryVisaType(master, options.segment)
  return visaType?.validity?.trim() || 'As per embassy'
}

/** Express / fast badge — admin fast minutes with processing-time heuristic fallback. */
export function resolvePortalFastMinutes(master: CountryMaster): number | undefined {
  if (master.fastMinutes != null) return master.fastMinutes

  const expressDays = master.segments
    .filter((entry) => entry.enabled)
    .map((entry) => entry.processingRules.expressProcessingDays)
    .find(Boolean)

  if (expressDays && /\d+\s*min/i.test(expressDays)) {
    const match = expressDays.match(/(\d+)\s*min/i)
    if (match) return Number(match[1])
  }

  return undefined
}

/** Map admin processing type to legacy visa category filters where needed. */
export function resolvePortalVisaCategory(master: CountryMaster): VisaCategory {
  switch (master.processingType) {
    case 'e_visa':
      return 'e-Visa'
    case 'hybrid':
      return 'No Visa Required'
    default:
      return 'Sticker'
  }
}

export function resolvePortalProcessingTime(
  master: CountryMaster,
  options: PortalCountryDisplayOptions = {},
): string {
  if (master.processingTime?.trim()) return master.processingTime.trim()

  const visaType = primaryVisaType(master, options.segment)
  return visaType?.processingTime?.trim() || 'TBD'
}

export function resolvePortalStartingPrice(
  master: CountryMaster,
  options: PortalCountryDisplayOptions = {},
): number {
  if (master.price > 0) return master.price

  const segment = options.segment
  const offerings = master.visaOfferings.filter((offering) => offering.active)
  const scoped = segment
    ? offerings.filter((offering) => offering.segment === segment)
    : offerings

  const priced = scoped.find((offering) => offering.approxCost != null && offering.approxCost > 0)
  return priced?.approxCost ?? master.price
}
