/**
 * Country-scoped trust messaging for the public website (apply intro + country detail).
 * Only destinations listed here show registered-agent chrome / claim chips.
 */

export type CountryTrustClaimId =
  | 'accuracy'
  | 'prices'
  | 'gateway'
  | 'fastest'
  | 'ai'

export interface CountryTrustClaim {
  id: CountryTrustClaimId
  label: string
}

export interface CountryTrustProfile {
  countryId: string
  countryName: string
  countryCode: string
  /** Primary agent credential badge */
  agentBadge: 'registered_agent'
  agentBadgeLabel: string
  /** Shown under the badge cluster on intro / hero */
  subTagline: string
  claims: CountryTrustClaimId[]
}

/** Shared market claims — only rendered when the country is in the map below. */
export const COUNTRY_TRUST_CLAIMS: Record<CountryTrustClaimId, CountryTrustClaim> = {
  accuracy: { id: 'accuracy', label: 'Highest accuracy in market' },
  prices: { id: 'prices', label: 'Lowest prices in market' },
  gateway: { id: 'gateway', label: 'Gateway to 110+ countries' },
  fastest: { id: 'fastest', label: 'Fastest visa service' },
  ai: { id: 'ai', label: 'AI-powered visa processing' },
}

const REGISTERED_AGENT_SUBTAGLINE =
  "India's registered visa specialist for South Korea, China and Brazil"

const DEFAULT_CLAIMS: CountryTrustClaimId[] = [
  'accuracy',
  'prices',
  'gateway',
  'fastest',
  'ai',
]

/** South Korea (21), China (13), Brazil (26) — matches `visaService` ids. */
export const COUNTRY_TRUST_BY_ID: Record<string, CountryTrustProfile> = {
  '13': {
    countryId: '13',
    countryName: 'China',
    countryCode: 'CN',
    agentBadge: 'registered_agent',
    agentBadgeLabel: 'Registered agent',
    subTagline: REGISTERED_AGENT_SUBTAGLINE,
    claims: DEFAULT_CLAIMS,
  },
  '21': {
    countryId: '21',
    countryName: 'South Korea',
    countryCode: 'KR',
    agentBadge: 'registered_agent',
    agentBadgeLabel: 'Registered agent',
    subTagline: REGISTERED_AGENT_SUBTAGLINE,
    claims: DEFAULT_CLAIMS,
  },
  '26': {
    countryId: '26',
    countryName: 'Brazil',
    countryCode: 'BR',
    agentBadge: 'registered_agent',
    agentBadgeLabel: 'Registered agent',
    subTagline: REGISTERED_AGENT_SUBTAGLINE,
    claims: DEFAULT_CLAIMS,
  },
}

export function getCountryTrustProfile(countryId: string | undefined | null): CountryTrustProfile | undefined {
  if (!countryId) return undefined
  return COUNTRY_TRUST_BY_ID[countryId]
}

export function hasCountryTrustProfile(countryId: string | undefined | null): boolean {
  return Boolean(getCountryTrustProfile(countryId))
}

export function resolveTrustClaims(profile: CountryTrustProfile): CountryTrustClaim[] {
  return profile.claims.map((id) => COUNTRY_TRUST_CLAIMS[id])
}

/** Full-screen apply intro duration (ms). */
export const APPLY_INTRO_DURATION_MS = 2800
