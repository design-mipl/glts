import type { CountryGroupMaster } from '@/shared/types/countryGroupMaster'

/** Seeded groups for commercial quotation scope. Country IDs match visaService catalog. */
export const SEED_COUNTRY_GROUPS: CountryGroupMaster[] = [
  {
    id: 'cg-schengen',
    name: 'Schengen Countries',
    countryIds: ['14', '17', '18'],
    status: 'active',
  },
  {
    id: 'cg-asia-key',
    name: 'Key Asia Destinations',
    countryIds: ['2', '6', '13'],
    status: 'active',
  },
  {
    id: 'cg-apac',
    name: 'Asia Pacific',
    countryIds: ['15', '16', '20', '21'],
    status: 'active',
  },
]
