import { WEBSITE_LEGACY_BASE } from '@/shared/website/websiteVariantPaths'

export { WEBSITE_LEGACY_BASE }

/**
 * Build an absolute legacy-site path. Pass `/`, `/countries`, `/apply/new?x=1`, etc.
 * Leave portal routes (`/sign-in`, `/retail`, …) absolute — do not wrap those with `w1()`.
 */
export function w1(path: string = '/'): string {
  if (!path || path === '/') return WEBSITE_LEGACY_BASE

  const [pathname, query = ''] = path.split('?')
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const suffix = query ? `?${query}` : ''
  return `${WEBSITE_LEGACY_BASE}${normalized}${suffix}`
}
