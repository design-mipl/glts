import { SEED_COUNTRY_GROUPS } from '@/shared/data/mockCountryGroups'
import type { CountryGroupMaster } from '@/shared/types/countryGroupMaster'

let store: CountryGroupMaster[] = SEED_COUNTRY_GROUPS.map((g) => ({
  ...g,
  countryIds: [...g.countryIds],
}))

export const countryGroupMasterService = {
  list(status: 'active' | 'all' = 'active'): CountryGroupMaster[] {
    if (status === 'all') return [...store]
    return store.filter((g) => g.status === 'active')
  },

  getById(id: string): CountryGroupMaster | undefined {
    return store.find((g) => g.id === id)
  },

  listSelectOptions(): { value: string; label: string }[] {
    return this.list('active').map((g) => ({ value: g.id, label: g.name }))
  },
}
