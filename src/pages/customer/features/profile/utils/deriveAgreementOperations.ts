import type { CommercialVisaPricingRule } from '@/shared/types/quotation'
import type { CountryVisaCoverage, PricingGroup } from '../types/accountWorkspace'

const SKIP_COUNTRY = new Set(['all', 'additional services', 'miscellaneous'])
const SKIP_VISA = new Set(['all', '—', '-'])

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

/** Country + visa coverage from admin agreement / quotation commercial pricing rules. */
export function deriveCountryVisaCoverageFromCommercialRules(
  rules: CommercialVisaPricingRule[],
): CountryVisaCoverage[] {
  const byCountry = new Map<string, Set<string>>()

  for (const rule of rules) {
    let country: string | null = null
    if (rule.scope === 'country' && rule.country?.trim()) {
      country = rule.country.trim()
    } else if (rule.scope === 'country_group' && rule.countryGroupName?.trim()) {
      country = rule.countryGroupName.trim()
    } else if (rule.scope === 'rest_of_countries_online') {
      country = 'Rest of the countries online'
    } else if (rule.scope === 'rest_of_countries_offline') {
      country = 'Rest of the countries offline'
    }
    if (!country || SKIP_COUNTRY.has(country.toLowerCase())) continue

    const visa = rule.visaType?.trim()
    if (!visa || SKIP_VISA.has(visa.toLowerCase())) continue

    const set = byCountry.get(country) ?? new Set<string>()
    set.add(visa)
    byCountry.set(country, set)
  }

  return [...byCountry.entries()]
    .map(([country, visas]) => ({
      country,
      visaTypes: [...visas].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.country.localeCompare(b.country))
}
