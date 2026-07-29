import type { CountryGroupMaster } from '@/shared/types/countryGroupMaster'

/** Seeded groups for commercial quotation scope. Country IDs match Country Master / visa catalog. */
export const SEED_COUNTRY_GROUPS: CountryGroupMaster[] = [
  {
    id: 'cg-schengen',
    name: 'Schengen Countries',
    countryIds: ['14', '17', '18'],
    status: 'active',
    createdBy: 'System',
    updatedBy: 'System',
    createdAt: '2025-11-01T09:00:00.000Z',
    updatedAt: '2026-01-10T14:30:00.000Z',
  },
  {
    id: 'cg-asia-key',
    name: 'Key Asia Destinations',
    countryIds: ['2', '6', '13'],
    status: 'active',
    createdBy: 'System',
    updatedBy: 'System',
    createdAt: '2025-11-15T10:15:00.000Z',
    updatedAt: '2026-02-01T11:20:00.000Z',
  },
  {
    id: 'cg-apac',
    name: 'Asia Pacific',
    countryIds: ['15', '16', '20', '21'],
    status: 'active',
    createdBy: 'System',
    updatedBy: 'System',
    createdAt: '2025-12-01T08:45:00.000Z',
    updatedAt: '2026-03-01T16:00:00.000Z',
  },
]
