import type { Country } from '@/shared/types/visa'

export interface ExploreFilters {
  visaDelivery: string
  visaType: string
  documents: string
  holidays: string
}

export const exploreFilterDefs = [
  {
    key: 'visaDelivery' as const,
    label: 'VISA DELIVERY',
    options: ['Any Time', 'Under 24 hours', 'Under 1 week'],
  },
  {
    key: 'visaType' as const,
    label: 'TYPE',
    options: ['All Visa Types', 'e-Visa', 'Sticker', 'Visa on arrival'],
  },
  {
    key: 'documents' as const,
    label: 'DOCUMENTS',
    options: ['Any Documents', 'Passport only', 'Photo + Passport'],
  },
  {
    key: 'holidays' as const,
    label: 'HOLIDAYS',
    options: ['Select Dates', 'Next 30 days', 'Next 90 days'],
  },
] as const

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
