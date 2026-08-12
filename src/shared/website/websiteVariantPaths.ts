/** Alternate public website (Website 2 / Site B) mounts under this prefix. */
export const WEBSITE_V2_BASE = '/v2'

export function isWebsiteV2Path(pathname: string): boolean {
  return pathname === WEBSITE_V2_BASE || pathname.startsWith(`${WEBSITE_V2_BASE}/`)
}

/**
 * Map the current public-site path to the equivalent page on the other site (A ↔ B).
 * Preserves query string when provided.
 */
export function getAlternateWebsitePath(pathname: string, search = ''): string {
  let nextPath: string

  if (isWebsiteV2Path(pathname)) {
    nextPath =
      pathname === WEBSITE_V2_BASE || pathname === `${WEBSITE_V2_BASE}/`
        ? '/'
        : pathname.slice(WEBSITE_V2_BASE.length) || '/'
  } else {
    nextPath = pathname === '/' ? WEBSITE_V2_BASE : `${WEBSITE_V2_BASE}${pathname}`
  }

  return `${nextPath}${search}`
}
