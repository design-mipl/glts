import type { CustomerType } from '@/shared/auth/session'

/** Segment-owned portal config (nav + marine-only routes). */
export interface CustomerSegmentPortalConfig {
  customerType: CustomerType
  /** Show vessel master under Masters (marine only). */
  showVesselMaster: boolean
  /** Show crew upload route + nav affordances (marine only). */
  showCrewUpload: boolean
}
