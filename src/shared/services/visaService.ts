import type { Country } from '../types/visa'

const COUNTRIES: Country[] = [
  {
    id: '1',
    name: 'Schengen',
    code: 'EU',
    region: 'Europe',
    visaTypes: [],
    processingTime: '12-18 days',
    price: 8400,
    rating: 92,
    flags: '🇫🇷',
    trending: true,
    trendingPercent: 12,
  },
  {
    id: '2',
    name: 'Japan',
    code: 'JP',
    region: 'Asia',
    visaTypes: [],
    processingTime: '7 days',
    price: 3200,
    rating: 88,
    flags: '🇯🇵',
    trending: true,
    trendingPercent: 8,
  },
  {
    id: '3',
    name: 'UAE',
    code: 'AE',
    region: 'Middle East',
    visaTypes: [],
    processingTime: '3 days',
    price: 6900,
    rating: 96,
    flags: '🇦🇪',
    trending: true,
    trendingPercent: 6,
  },
  {
    id: '4',
    name: 'UK',
    code: 'GB',
    region: 'Europe',
    visaTypes: [],
    processingTime: '15 days',
    price: 12400,
    rating: 71,
    flags: '🇬🇧',
    trending: false,
    trendingPercent: 2,
  },
  {
    id: '5',
    name: 'USA',
    code: 'US',
    region: 'Americas',
    visaTypes: [],
    processingTime: '110 days',
    price: 14200,
    rating: 64,
    flags: '🇺🇸',
    trending: false,
    trendingPercent: 4,
  },
  {
    id: '6',
    name: 'Singapore',
    code: 'SG',
    region: 'Asia',
    visaTypes: [],
    processingTime: '4 days',
    price: 2100,
    rating: 94,
    flags: '🇸🇬',
    trending: false,
    trendingPercent: 3,
  },
  {
    id: '7',
    name: 'Turkey',
    code: 'TR',
    region: 'Europe',
    visaTypes: [],
    processingTime: '2 days',
    price: 2400,
    rating: 97,
    flags: '🇹🇷',
    trending: false,
    trendingPercent: 7,
  },
  {
    id: '8',
    name: 'Thailand',
    code: 'TH',
    region: 'Asia',
    visaTypes: [],
    processingTime: '5 days',
    price: 3400,
    rating: 93,
    flags: '🇹🇭',
    trending: false,
    trendingPercent: 3,
  },
]

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
      c.region.toLowerCase().includes(q),
  )
}

export function filterCountries(filters: {
  region?: string
  priceRange?: [number, number]
  processingTime?: string
  visaType?: string
}): Country[] {
  return COUNTRIES.filter(country => {
    if (filters.region && country.region !== filters.region) return false
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      if (country.price < min || country.price > max) return false
    }
    return true
  })
}

export function getTrendingCountries(): Country[] {
  return COUNTRIES.filter(c => c.trending).sort(
    (a, b) => b.trendingPercent - a.trendingPercent,
  )
}

export function getRegions(): string[] {
  return [...new Set(COUNTRIES.map(c => c.region))]
}
