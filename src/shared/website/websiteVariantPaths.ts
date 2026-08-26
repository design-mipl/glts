/** Main public website (website-v2) mounts at the site root. */
export const WEBSITE_V2_BASE = ''

/** Legacy public website (former Site A / `pages/website`) mounts under this prefix. */
export const WEBSITE_LEGACY_BASE = '/v1'

export function isWebsiteLegacyPath(pathname: string): boolean {
  return pathname === WEBSITE_LEGACY_BASE || pathname.startsWith(`${WEBSITE_LEGACY_BASE}/`)
}

/** True when on the main public site (website-v2 at `/`), not the legacy `/v1` site. */
export function isWebsiteV2Path(pathname: string): boolean {
  return !isWebsiteLegacyPath(pathname)
}

/**
 * Map the current public-site path to the equivalent page on the other site (A ↔ B).
 * A = legacy (`/v1`), B = main (root). Preserves query string when provided.
 */
export function getAlternateWebsitePath(pathname: string, search = ''): string {
  let nextPath: string

  if (isWebsiteLegacyPath(pathname)) {
    nextPath =
      pathname === WEBSITE_LEGACY_BASE || pathname === `${WEBSITE_LEGACY_BASE}/`
        ? '/'
        : pathname.slice(WEBSITE_LEGACY_BASE.length) || '/'
  } else {
    nextPath = pathname === '/' ? WEBSITE_LEGACY_BASE : `${WEBSITE_LEGACY_BASE}${pathname}`
  }

  return `${nextPath}${search}`
}
