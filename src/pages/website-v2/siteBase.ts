import { WEBSITE_V2_BASE } from '@/shared/website/websiteVariantPaths'

export { WEBSITE_V2_BASE }

/**
 * Build an absolute path on the main public website (website-v2 at root).
 * Pass `/`, `/countries`, `/apply/new?x=1`, etc.
 * Leave portal routes (`/sign-in`, `/retail`, …) absolute — do not wrap those with `w2()`.
 */
export function w2(path: string = '/'): string {
  if (!path || path === '/') return WEBSITE_V2_BASE || '/'

  const [pathname, query = ''] = path.split('?')
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const suffix = query ? `?${query}` : ''
  return `${WEBSITE_V2_BASE}${normalized}${suffix}`
}
