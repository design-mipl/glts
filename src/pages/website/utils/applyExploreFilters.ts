import type { Country } from '@/shared/types/visa'
import type { ExploreFilters } from '../components/ExploreFilterBar'

export const defaultExploreFilters: ExploreFilters = {
  visaDelivery: 'Any Time',
  visaType: 'All Visa Types',
  documents: 'Any Documents',
  holidays: 'Select Dates',
}

export function applyExploreFilters(countries: Country[], filters: ExploreFilters): Country[] {
  let list = [...countries]

  if (filters.visaType !== 'All Visa Types') {
    list = list.filter(c => c.visaCategory === filters.visaType)
  }

  if (filters.visaDelivery === 'Under 24 hours') {
    list = list.filter(c => c.fastMinutes && c.fastMinutes <= 1440)
  } else if (filters.visaDelivery === 'Under 1 week') {
    list = list.filter(c => !c.processingTime.includes('110'))
  }

  if (filters.documents === 'Passport only') {
    list = list.filter(c => c.documentsNeeded.length <= 1)
  } else if (filters.documents === 'Photo + Passport') {
    list = list.filter(c => c.documentsNeeded.length <= 2)
  }

  return list
}
