import { getAllCountries } from '@/shared/services/visaService'

export function buildCountryReferenceSelectOptions(current?: { name: string; code: string }) {
  const options = getAllCountries()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({ value: c.code, label: c.name }))

  if (current?.name && current.code) {
    const exists = options.some((o) => o.value === current.code)
    if (!exists) {
      options.unshift({ value: current.code, label: current.name })
    }
  }

  return options
}

export function resolveCountryReferenceByCode(code: string) {
  return getAllCountries().find((c) => c.code === code)
}
