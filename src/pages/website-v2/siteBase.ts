/** Public website-v2 owns the root mount (no `/v2` prefix). */
export const WEBSITE_V2_BASE = '/'

/**
 * Build an absolute Website v2 path. Pass `/`, `/countries`, `/apply/new?x=1`, etc.
 * Leave portal routes (`/sign-in`, `/retail`, …) absolute — do not wrap those with `w2()`.
 */
export function w2(path: string = '/'): string {
  if (!path || path === '/') return WEBSITE_V2_BASE

  const [pathname, query = ''] = path.split('?')
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const suffix = query ? `?${query}` : ''
  // Root-mounted site: path is already absolute.
  return `${normalized}${suffix}`
}
