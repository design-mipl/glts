import { createContext, useContext } from 'react'
import { siteTokensFor, type SiteTone, type SiteToneTokens } from '@/pages/website/theme/siteTheme'

export type { SiteTone, SiteToneTokens }

/**
 * The band a section is currently sitting in.
 *
 * Sections read their colours from here rather than from `site.*` directly, so the same
 * section can be moved between a light band and an ink band without being rewritten —
 * which is the point of the landing page's band grouping being editable.
 *
 * Lives outside `SiteSection.tsx` so that file exports components only (fast refresh).
 */
export const SiteToneContext = createContext<SiteTone>('surface')

/** Tokens resolved for the enclosing band. Call this instead of importing `site` colours. */
export function useSiteTone(): SiteToneTokens {
  return siteTokensFor(useContext(SiteToneContext))
}
