import {
  DEFAULT_EMBASSY_VFS_FEE_RATE_CARD,
  SEED_EMBASSY_VFS_FEE_RATE_CARDS,
} from '@/shared/data/mockEmbassyVfsFeeMasters'
import type {
  EmbassyVfsFeeRateCard,
  EmbassyVfsFeeRateCardListFilters,
  EmbassyVfsFeeServiceRate,
} from '@/shared/types/embassyVfsFeeMaster'

let rateCardStore: EmbassyVfsFeeRateCard[] = SEED_EMBASSY_VFS_FEE_RATE_CARDS.map(card => ({
  ...card,
  services: card.services.map(service => ({ ...service })),
}))

/** Normalizes country / visa labels for resilient master lookups. */
export function normalizeEmbassyVfsFeeLookupKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s*[·•\-–]\s*/g, ' ')
    .replace(/\s+/g, ' ')
}

function isActiveDefaultCard(card: EmbassyVfsFeeRateCard): boolean {
  return card.id === DEFAULT_EMBASSY_VFS_FEE_RATE_CARD.id
}

function findRateCard(country: string, visaType: string): EmbassyVfsFeeRateCard | undefined {
  const countryKey = normalizeEmbassyVfsFeeLookupKey(country)
  const visaKey = normalizeEmbassyVfsFeeLookupKey(visaType)
  if (!countryKey && !visaKey) return undefined

  return rateCardStore.find(card => {
    if (card.status !== 'active' || isActiveDefaultCard(card)) return false
    return (
      normalizeEmbassyVfsFeeLookupKey(card.country) === countryKey &&
      normalizeEmbassyVfsFeeLookupKey(card.visaType) === visaKey
    )
  })
}

function resolveRateCard(country: string, visaType: string): EmbassyVfsFeeRateCard {
  const exact = findRateCard(country, visaType)
  if (exact) return exact

  const defaultCard =
    rateCardStore.find(card => card.id === DEFAULT_EMBASSY_VFS_FEE_RATE_CARD.id) ??
    DEFAULT_EMBASSY_VFS_FEE_RATE_CARD

  return defaultCard
}

export const embassyVfsFeeMasterService = {
  list(filters: EmbassyVfsFeeRateCardListFilters = {}): EmbassyVfsFeeRateCard[] {
    const { status = 'all', country, visaType } = filters
    let rows = rateCardStore.map(card => ({
      ...card,
      services: card.services.map(service => ({ ...service })),
    }))

    if (status !== 'all') {
      rows = rows.filter(card => card.status === status)
    }
    if (country?.trim()) {
      const key = normalizeEmbassyVfsFeeLookupKey(country)
      rows = rows.filter(card => normalizeEmbassyVfsFeeLookupKey(card.country) === key)
    }
    if (visaType?.trim()) {
      const key = normalizeEmbassyVfsFeeLookupKey(visaType)
      rows = rows.filter(card => normalizeEmbassyVfsFeeLookupKey(card.visaType) === key)
    }

    return rows
  },

  getById(id: string): EmbassyVfsFeeRateCard | undefined {
    const card = rateCardStore.find(row => row.id === id)
    if (!card) return undefined
    return {
      ...card,
      services: card.services.map(service => ({ ...service })),
    }
  },

  /** Active service catalogue for a country + visa type (falls back to default master card). */
  listActiveServices(country: string, visaType: string): EmbassyVfsFeeServiceRate[] {
    const card = resolveRateCard(country, visaType)
    return card.services.filter(service => service.enabled)
  },

  resolveRateCardForApplication(country: string, visaType: string): EmbassyVfsFeeRateCard {
    const card = resolveRateCard(country, visaType)
    return {
      ...card,
      services: card.services.filter(service => service.enabled),
    }
  },

  resetToSeed() {
    rateCardStore = SEED_EMBASSY_VFS_FEE_RATE_CARDS.map(card => ({
      ...card,
      services: card.services.map(service => ({ ...service })),
    }))
  },
}
