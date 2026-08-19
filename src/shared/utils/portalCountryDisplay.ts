import type { BusinessSegment, CountryMaster, CountryProcessingRules, CountryVisaType } from '@/shared/types/countryMaster'
import type { VisaCategory } from '@/shared/types/visa'

const SUBMISSION_MODE_LABELS: Record<CountryProcessingRules['submissionMode'], string> = {
  embassy_direct: 'Embassy',
  vfs: 'VFS',
  e_visa_portal: 'E-Visa',
  agent_channel: 'Agent submission',
  agent_submission: 'Agent submission',
}

export interface PortalCountryDisplayOptions {
  segment?: BusinessSegment
}

function resolveSegmentRules(
  master: CountryMaster,
  segment?: BusinessSegment,
): CountryProcessingRules | undefined {
  if (segment) {
    return master.segments.find((e) => e.segment === segment && e.enabled)?.processingRules
  }
  return master.segments.find((e) => e.enabled)?.processingRules
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

/** Explicit visa-type list price; ignores seeded consulate-rate rows when pricing is unset. */
function visaTypeListPrice(visaType: CountryVisaType): number {
  return visaType.pricing != null && visaType.pricing > 0 ? visaType.pricing : 0
}

function lowestSegmentListPrice(master: CountryMaster, segment: BusinessSegment): number {
  const priced = activeVisaTypesForSegment(master, segment)
    .map(visaTypeListPrice)
    .filter((price) => price > 0)
  if (priced.length > 0) return Math.min(...priced)

  const offerings = master.visaOfferings.filter(
    (offering) => offering.active && offering.segment === segment && offering.approxCost != null && offering.approxCost > 0,
  )
  if (offerings.length > 0) {
    return Math.min(...offerings.map((offering) => offering.approxCost as number))
  }

  return 0
}

/** Card headline label derived from segment submissionMode (E-Visa, VFS, Embassy, …). */
export function resolvePortalProcessingLabel(
  master: CountryMaster,
  options: PortalCountryDisplayOptions = {},
): string {
  const rules = resolveSegmentRules(master, options.segment)
  if (rules) return SUBMISSION_MODE_LABELS[rules.submissionMode] ?? rules.submissionMode
  return 'Embassy'
}

/** Validity line on destination cards — segment visa type when scoped, else country label. */
export function resolvePortalValidityLabel(
  master: CountryMaster,
  options: PortalCountryDisplayOptions = {},
): string {
  const visaType = primaryVisaType(master, options.segment)
  if (options.segment) {
    return visaType?.validity?.trim() || master.validity?.trim() || 'As per embassy'
  }

  const configured = master.validity?.trim()
  if (configured) return configured
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

/** Map segment submissionMode to legacy visa category filters where needed. */
export function resolvePortalVisaCategory(
  master: CountryMaster,
  options: PortalCountryDisplayOptions = {},
): VisaCategory {
  const rules = resolveSegmentRules(master, options.segment)
  if (rules?.submissionMode === 'e_visa_portal') return 'e-Visa'
  return 'Sticker'
}

export function resolvePortalProcessingTime(
  master: CountryMaster,
  options: PortalCountryDisplayOptions = {},
): string {
  const visaType = primaryVisaType(master, options.segment)
  if (options.segment) {
    return visaType?.processingTime?.trim() || master.processingTime?.trim() || 'TBD'
  }

  if (master.processingTime?.trim()) return master.processingTime.trim()
  return visaType?.processingTime?.trim() || 'TBD'
}

export function resolvePortalStartingPrice(
  master: CountryMaster,
  options: PortalCountryDisplayOptions = {},
): number {
  if (options.segment) {
    const segmentPrice = lowestSegmentListPrice(master, options.segment)
    return segmentPrice > 0 ? segmentPrice : master.price
  }

  if (master.price > 0) return master.price

  const offerings = master.visaOfferings.filter((offering) => offering.active)
  const priced = offerings.find((offering) => offering.approxCost != null && offering.approxCost > 0)
  return priced?.approxCost ?? master.price
}
