import { getAllCountries, getRegions } from '@/shared/services/visaService'
import { jurisdictionMasterService } from '@/shared/services/jurisdictionMasterService'
import type { CountryVisaJurisdiction } from '@/shared/types/countryMaster'
import type { SelectOption } from '@/shared/types/taxMaster'

export function resolveJurisdictionMasterId(jurisdiction: Pick<CountryVisaJurisdiction, 'jurisdictionMasterId' | 'name'>): string {
  if (jurisdiction.jurisdictionMasterId) return jurisdiction.jurisdictionMasterId
  return jurisdictionMasterService.getByName(jurisdiction.name)?.id ?? ''
}

export function buildJurisdictionMasterSelectOptions(options: {
  excludeIds?: string[]
  currentId?: string
} = {}): SelectOption[] {
  const exclude = new Set(options.excludeIds ?? [])
  const currentId = options.currentId

  return jurisdictionMasterService
    .list({ status: 'all' })
    .filter((row) => row.status === 'active' || row.id === currentId)
    .filter((row) => !exclude.has(row.id) || row.id === currentId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((row) => ({ value: row.id, label: row.name }))
}

export function buildCountryRegionSelectOptions(current?: string) {
  const options = getRegions()
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((region) => ({ value: region, label: region }))

  if (current && !options.some((o) => o.value === current)) {
    options.unshift({ value: current, label: current })
  }

  return options
}

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
