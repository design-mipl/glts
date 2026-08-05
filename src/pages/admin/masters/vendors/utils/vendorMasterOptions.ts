import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'

export function getVendorServiceCountryOptions() {
  return countryMasterAdminService
    .list({ status: 'active' })
    .map((country) => ({ value: country.name, label: country.name }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function getVendorVisaTypeOptions(serviceCountry: string) {
  if (!serviceCountry.trim()) return []

  const country = countryMasterAdminService
    .list({ status: 'active' })
    .find((entry) => entry.name === serviceCountry)

  if (!country) return []

  const visaTypes = new Set<string>()
  country.segments
    .filter((segment) => segment.enabled)
    .forEach((segment) => {
      segment.visaTypes
        .filter((visaType) => visaType.status === 'active')
        .forEach((visaType) => visaTypes.add(visaType.name))
    })

  return [...visaTypes].sort((a, b) => a.localeCompare(b)).map((name) => ({ value: name, label: name }))
}
