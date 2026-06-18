import type { Country } from '@/shared/types/visa'
import { getAllCountries } from '@/shared/services/visaService'

const DISPLAY_NAME_ALIASES: Record<string, string> = {
  'United Kingdom': 'UK',
  'United States': 'USA',
  'United States of America': 'USA',
  UAE: 'United Arab Emirates',
}

export function resolveDestinationCountries(
  displayNames: readonly string[],
  heroOverridesByCode?: Record<string, string>,
): Country[] {
  const all = getAllCountries()
  const byName = new Map(all.map((country) => [country.name.toLowerCase(), country]))

  return displayNames
    .map((displayName) => {
      const canonical = DISPLAY_NAME_ALIASES[displayName] ?? displayName
      const country =
        byName.get(canonical.toLowerCase()) ??
        all.find((item) => item.name.toLowerCase() === displayName.toLowerCase())

      if (!country) return null

      const override = heroOverridesByCode?.[country.code.toUpperCase()]
      return override ? { ...country, heroPhotoId: override } : country
    })
    .filter((country): country is Country => country !== null)
}
