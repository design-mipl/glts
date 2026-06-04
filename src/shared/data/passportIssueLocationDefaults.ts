import type { PassportIssueLocation } from '@/shared/types/countryMaster'

const BASE_CITIES = [
  { id: 'mumbai', label: 'Mumbai' },
  { id: 'delhi', label: 'Delhi' },
  { id: 'chennai', label: 'Chennai' },
  { id: 'kolkata', label: 'Kolkata' },
  { id: 'bangalore', label: 'Bangalore' },
  { id: 'hyderabad', label: 'Hyderabad' },
] as const

/** Build passport issue locations with jurisdiction scoped to destination country name. */
export function buildDefaultPassportIssueLocations(countryName: string): PassportIssueLocation[] {
  return BASE_CITIES.map(({ id, label }) => ({
    id,
    label,
    jurisdiction: `${label} — ${countryName} Consulate`,
    active: true,
  }))
}
