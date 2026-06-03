import type { CountryVisaCoverage, PricingGroup } from '../types/accountWorkspace'

const SKIP_COUNTRY = new Set(['all'])
const SKIP_VISA = new Set(['all'])

export function uniqueCountriesFromPricing(pricingGroups: PricingGroup[]): string[] {
  const set = new Set<string>()
  for (const group of pricingGroups) {
    if (!SKIP_COUNTRY.has(group.title.toLowerCase())) {
      set.add(group.title)
    }
    for (const row of group.rows) {
      if (row.country && !SKIP_COUNTRY.has(row.country.toLowerCase())) {
        set.add(row.country)
      }
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

export function uniqueVisaTypesFromPricing(pricingGroups: PricingGroup[]): string[] {
  const set = new Set<string>()
  for (const group of pricingGroups) {
    for (const row of group.rows) {
      if (row.visaType && !SKIP_VISA.has(row.visaType.toLowerCase())) {
        set.add(row.visaType)
      }
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

export function deriveCountryVisaCoverageFromPricing(
  pricingGroups: PricingGroup[],
): CountryVisaCoverage[] {
  return pricingGroups
    .filter(group => !SKIP_COUNTRY.has(group.title.toLowerCase()))
    .map(group => {
      const visaTypes = new Set<string>()
      for (const row of group.rows) {
        if (row.visaType && !SKIP_VISA.has(row.visaType.toLowerCase())) {
          visaTypes.add(row.visaType)
        }
      }
      return {
        country: group.title,
        visaTypes: [...visaTypes].sort((a, b) => a.localeCompare(b)),
      }
    })
    .filter(entry => entry.visaTypes.length > 0)
    .sort((a, b) => a.country.localeCompare(b.country))
}
