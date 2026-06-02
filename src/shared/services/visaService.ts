import type { Country, VisaCategory } from '../types/visa'
import { isImageSource } from '../utils/imageSource'

/** Destination cover photos (Unsplash). IDs verified — many legacy slugs now 404. */
const IMG = (photoId: string, width = 640) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${Math.round(width * 0.7)}&q=80`

export function getCountryHeroImageUrl(country: Country, width = 640): string {
  const id = country.heroPhotoId?.trim() ?? ''
  if (!id) return ''
  if (isImageSource(id)) return id
  return IMG(id, width)
}

function country(
  partial: Omit<Country, 'visaTypes'> & { visaTypes?: Country['visaTypes'] },
): Country {
  return { visaTypes: [], ...partial }
}

const COUNTRIES: Country[] = [
  country({
    id: '2',
    name: 'Japan',
    code: 'JP',
    region: 'Asia',
    processingTime: '7 days',
    price: 3200,
    rating: 88,
    flags: '🇯🇵',
    trending: true,
    trendingPercent: 8,
    visaCategory: 'e-Visa',
    validity: '90 days',
    documentsNeeded: ['Photo', 'Passport'],
    heroPhotoId: 'photo-1540959733332-eab4deabeeaf',
    fastMinutes: 180,
    cities: 'Tokyo · Osaka · Kyoto',
  }),
  country({
    id: '4',
    name: 'UK',
    code: 'GB',
    region: 'Europe',
    processingTime: '15 days',
    price: 12400,
    rating: 71,
    flags: '🇬🇧',
    trending: false,
    trendingPercent: 2,
    visaCategory: 'Sticker',
    validity: '6 months',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1513635269975-59663e0ac1ad',
    cities: 'London · Edinburgh',
  }),
  country({
    id: '5',
    name: 'USA',
    code: 'US',
    region: 'Americas',
    processingTime: '110 days',
    price: 14200,
    rating: 64,
    flags: '🇺🇸',
    trending: false,
    trendingPercent: 4,
    visaCategory: 'Sticker',
    validity: '10 years',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1488646953014-85cb44e25828',
    cities: 'New York · San Francisco',
  }),
  country({
    id: '6',
    name: 'Singapore',
    code: 'SG',
    region: 'Asia',
    processingTime: '4 days',
    price: 2100,
    rating: 94,
    flags: '🇸🇬',
    trending: false,
    trendingPercent: 3,
    visaCategory: 'e-Visa',
    validity: '30 days',
    documentsNeeded: ['Passport'],
    heroPhotoId: 'photo-1563492065599-3520f775eeed',
    fastMinutes: 90,
    cities: 'Singapore city',
  }),
  country({
    id: '10',
    name: 'Kenya',
    code: 'KE',
    region: 'Africa',
    processingTime: '59 min',
    price: 3500,
    rating: 99,
    flags: '🇰🇪',
    trending: true,
    trendingPercent: 11,
    visaCategory: 'e-Visa',
    validity: '90 days',
    documentsNeeded: ['Photo', 'Passport'],
    heroPhotoId: 'photo-1548013146-72479768bada',
    fastMinutes: 59,
    cities: 'Nairobi · Mombasa',
  }),
  country({
    id: '13',
    name: 'China',
    code: 'CN',
    region: 'Asia',
    processingTime: '8-12 days',
    price: 5200,
    rating: 89,
    flags: '🇨🇳',
    trending: true,
    trendingPercent: 9,
    visaCategory: 'Sticker',
    validity: '30-90 days',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements', 'Invitation letter'],
    heroPhotoId: 'photo-1552832230-c0197dd311b5',
    fastMinutes: 480,
    cities: 'Beijing · Shanghai · Guangzhou',
  }),
  country({
    id: '14',
    name: 'France',
    code: 'FR',
    region: 'Europe',
    processingTime: '10-14 days',
    price: 7800,
    rating: 90,
    flags: '🇫🇷',
    trending: true,
    trendingPercent: 7,
    visaCategory: 'Sticker',
    validity: '90 days',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1502602898657-3e91760cbb34',
    fastMinutes: 420,
    cities: 'Paris · Lyon · Marseille',
  }),
  country({
    id: '15',
    name: 'Australia',
    code: 'AU',
    region: 'Asia Pacific',
    processingTime: '8-12 days',
    price: 6400,
    rating: 87,
    flags: '🇦🇺',
    trending: true,
    trendingPercent: 6,
    visaCategory: 'e-Visa',
    validity: '90 days',
    documentsNeeded: ['Photo', 'Passport', 'Financial proof'],
    heroPhotoId: 'photo-1523482580672-f109ba8cb9be',
    fastMinutes: 360,
    cities: 'Sydney · Melbourne · Perth',
  }),
  country({
    id: '16',
    name: 'Taiwan',
    code: 'TW',
    region: 'Asia',
    processingTime: '6-9 days',
    price: 4100,
    rating: 86,
    flags: '🇹🇼',
    trending: false,
    trendingPercent: 3,
    visaCategory: 'e-Visa',
    validity: '30-90 days',
    documentsNeeded: ['Photo', 'Passport', 'Travel itinerary'],
    heroPhotoId: 'photo-1528164344705-47542687000d',
    fastMinutes: 300,
    cities: 'Taipei · Kaohsiung · Taichung',
  }),
  country({
    id: '17',
    name: 'Belgium',
    code: 'BE',
    region: 'Europe',
    processingTime: '12-18 days',
    price: 8400,
    rating: 88,
    flags: '🇧🇪',
    trending: false,
    trendingPercent: 3,
    visaCategory: 'Sticker',
    validity: '90 days',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1528909514045-2fa4ac7a08ba',
    fastMinutes: 720,
    cities: 'Brussels · Antwerp · Bruges',
  }),
  country({
    id: '18',
    name: 'Netherlands',
    code: 'NL',
    region: 'Europe',
    processingTime: '12-18 days',
    price: 8400,
    rating: 90,
    flags: '🇳🇱',
    trending: true,
    trendingPercent: 6,
    visaCategory: 'Sticker',
    validity: '90 days',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1508599589929-1f3f7a8b7a2b',
    fastMinutes: 720,
    cities: 'Amsterdam · Rotterdam · The Hague',
  }),
  country({
    id: '19',
    name: 'United States of America',
    code: 'US',
    region: 'Americas',
    processingTime: '110 days',
    price: 14200,
    rating: 64,
    flags: '🇺🇸',
    trending: false,
    trendingPercent: 4,
    visaCategory: 'Sticker',
    validity: '10 years',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1488646953014-85cb44e25828',
    cities: 'New York · San Francisco',
  }),
  country({
    id: '20',
    name: 'Philippines',
    code: 'PH',
    region: 'Asia',
    processingTime: '8-12 days',
    price: 3900,
    rating: 86,
    flags: '🇵🇭',
    trending: false,
    trendingPercent: 3,
    visaCategory: 'Sticker',
    validity: '30-59 days',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1507525428034-b723cf961d3e',
    fastMinutes: 360,
    cities: 'Manila · Cebu · Boracay',
  }),
  country({
    id: '21',
    name: 'South Korea',
    code: 'KR',
    region: 'Asia',
    processingTime: '7-10 days',
    price: 4200,
    rating: 87,
    flags: '🇰🇷',
    trending: true,
    trendingPercent: 5,
    visaCategory: 'Sticker',
    validity: '90 days',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1535189043414-47a3b1b05bb5',
    fastMinutes: 420,
    cities: 'Seoul · Busan · Incheon',
  }),
  country({
    id: '22',
    name: 'Morocco',
    code: 'MA',
    region: 'Africa',
    processingTime: '10-14 days',
    price: 4600,
    rating: 84,
    flags: '🇲🇦',
    trending: false,
    trendingPercent: 2,
    visaCategory: 'Sticker',
    validity: '30-90 days',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1553530666-ba11a7da3888',
    fastMinutes: 480,
    cities: 'Casablanca · Marrakech · Rabat',
  }),
  country({
    id: '23',
    name: 'Canada',
    code: 'CA',
    region: 'Americas',
    processingTime: '40-60 days',
    price: 11800,
    rating: 82,
    flags: '🇨🇦',
    trending: false,
    trendingPercent: 2,
    visaCategory: 'Sticker',
    validity: 'Up to 10 years',
    documentsNeeded: ['Photo', 'Passport', 'Bank Statements'],
    heroPhotoId: 'photo-1509042239860-f550ce710b93',
    fastMinutes: 1440,
    cities: 'Toronto · Vancouver · Montreal',
  }),
]

/** Portal application flow — visa options vary by destination */
export interface PortalVisaOption {
  id: string
  label: string
  sub: string
}

function visaOpt(id: string, label: string, sub: string): PortalVisaOption {
  return { id, label, sub }
}

const VISA_TYPES_BY_COUNTRY: Record<string, PortalVisaOption[]> = {
  '2': [
    visaOpt('japan-tourist', 'eVisa · Tourist', 'Single entry · 90 days'),
    visaOpt('japan-business', 'eVisa · Business', 'Meetings & site visits'),
    visaOpt('japan-transit', 'Transit', 'Connection under 72h'),
  ],
  '4': [
    visaOpt('uk-standard', 'Standard Visitor', 'Tourism & short business'),
    visaOpt('uk-business', 'Business visitor', 'Meetings · no paid work'),
    visaOpt('uk-transit', 'Direct Airside Transit', 'Airport connection'),
  ],
  '5': [
    visaOpt('usa-b1b2', 'B1/B2 Visitor', 'Tourism & business meetings'),
    visaOpt('usa-b1', 'B1 Business', 'Conferences & negotiations'),
    visaOpt('usa-crew', 'C1/D Crew', 'Airline & vessel crew'),
  ],
  '6': [
    visaOpt('sg-tourist', 'Tourist · 30 days', 'Leisure travel'),
    visaOpt('sg-business', 'Business · 30 days', 'Corporate visits'),
  ],
  '10': [
    visaOpt('ke-tourist', 'eTA · Tourist', '90-day visit'),
    visaOpt('ke-business', 'eTA · Business', 'Meetings & conferences'),
  ],
  '13': [
    visaOpt('cn-tourist-l', 'Tourist (L)', 'Leisure · single / double entry'),
    visaOpt('cn-business-m', 'Business (M)', 'Trade fairs & meetings'),
    visaOpt('cn-crew', 'Crew / Marine (C)', 'Seafarer & aviation crew'),
    visaOpt('cn-transit-g', 'Transit (G)', 'Connection under 72h'),
  ],
  '14': [
    visaOpt('fr-tourist-c', 'Tourist (Type C)', 'Leisure up to 90 days'),
    visaOpt('fr-business-c', 'Business (Type C)', 'Meetings & conferences'),
    visaOpt('fr-crew', 'Crew / Marine', 'Seafarer joining support'),
  ],
  '15': [
    visaOpt('au-tourist-600', 'Visitor 600 · Tourist', 'Leisure travel'),
    visaOpt('au-business-600', 'Visitor 600 · Business', 'Business visitor stream'),
    visaOpt('au-transit-771', 'Transit 771', 'Short transit stay'),
  ],
  '16': [
    visaOpt('tw-tourist', 'Tourist Visitor', 'Leisure & family travel'),
    visaOpt('tw-business', 'Business Visitor', 'Corporate travel'),
    visaOpt('tw-crew', 'Crew / Seafarer', 'Marine crew operations'),
  ],
  '17': [
    visaOpt('be-tourist', 'Tourist', 'Leisure travel'),
    visaOpt('be-business', 'Business', 'Meetings & conferences'),
  ],
  '18': [
    visaOpt('nl-tourist', 'Tourist', 'Leisure travel'),
    visaOpt('nl-business', 'Business', 'Meetings & conferences'),
  ],
  '19': [
    visaOpt('usa-b1b2', 'B1/B2 Visitor', 'Tourism & business meetings'),
    visaOpt('usa-c1', 'Transit (C1)', 'Airport connection'),
  ],
  '20': [
    visaOpt('ph-tourist', 'Tourist', 'Leisure travel'),
    visaOpt('ph-business', 'Business', 'Meetings & conferences'),
  ],
  '21': [
    visaOpt('kr-tourist', 'Tourist', 'Leisure travel'),
    visaOpt('kr-business', 'Business', 'Meetings & conferences'),
  ],
  '22': [
    visaOpt('ma-tourist', 'Tourist', 'Leisure travel'),
    visaOpt('ma-business', 'Business', 'Meetings & conferences'),
  ],
  '23': [
    visaOpt('ca-visitor', 'Visitor', 'Tourism & short business'),
    visaOpt('ca-transit', 'Transit', 'Airport connection'),
  ],
}

export function getVisaTypesForCountry(countryId: string): PortalVisaOption[] {
  return (
    VISA_TYPES_BY_COUNTRY[countryId] ?? [
      visaOpt('tourist', 'Tourist', 'Leisure travel'),
      visaOpt('business', 'Business', 'Meetings & conferences'),
    ]
  )
}

export function getVisaTypeLabel(countryId: string, visaTypeId: string): string {
  return getVisaTypesForCountry(countryId).find(v => v.id === visaTypeId)?.label ?? visaTypeId
}

export function getAllCountries(): Country[] {
  return COUNTRIES
}

export function getCountryById(id: string): Country | undefined {
  return COUNTRIES.find(c => c.id === id)
}

export function searchCountries(query: string): Country[] {
  const q = query.toLowerCase()
  return COUNTRIES.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      c.cities.toLowerCase().includes(q),
  )
}

export function filterCountries(filters: {
  region?: string
  priceRange?: [number, number]
  processingTime?: string
  visaType?: VisaCategory | string
  entryType?: string
}): Country[] {
  return COUNTRIES.filter(country => {
    if (filters.region && filters.region !== 'All' && country.region !== filters.region)
      return false
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      if (country.price < min || country.price > max) return false
    }
    if (filters.visaType && filters.visaType !== 'All Visa Types') {
      if (country.visaCategory !== filters.visaType) return false
    }
    return true
  })
}

export function getTrendingCountries(): Country[] {
  return [...COUNTRIES]
    .filter(c => c.trending)
    .sort((a, b) => b.trendingPercent - a.trendingPercent)
}

export function getRegions(): string[] {
  return [...new Set(COUNTRIES.map(c => c.region))]
}
