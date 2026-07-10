import {
  INDIAN_CITIES_BY_STATE,
  INDIAN_STATE_SELECT_OPTIONS,
  isIndianAddressCountry,
} from '@/shared/data/indianAddressLocations'

export interface AddressSelectOption {
  value: string
  label: string
  countryName: string
}

/** Registered-address countries (company HQ), separate from visa destination Country Master. */
export const COMPANY_ADDRESS_COUNTRY_OPTIONS: AddressSelectOption[] = [
  { value: 'India', label: 'India', countryName: 'India' },
]

export function getCompanyAddressCountryOptions(): AddressSelectOption[] {
  return COMPANY_ADDRESS_COUNTRY_OPTIONS
}

export function getCompanyStateOptions(countryName: string): AddressSelectOption[] {
  if (!isIndianAddressCountry(countryName)) return []
  return INDIAN_STATE_SELECT_OPTIONS
}

export function getCompanyCityOptions(countryName: string, state: string): AddressSelectOption[] {
  if (!isIndianAddressCountry(countryName) || !state.trim()) return []
  const cities = INDIAN_CITIES_BY_STATE[state] ?? []
  return cities.map((city) => ({ value: city, label: city }))
}
