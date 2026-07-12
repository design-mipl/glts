import type { Location, NavigateFunction, NavigateOptions, To } from 'react-router-dom'

export const LISTING_RETURN_STATE_KEY = 'fromListing' as const

export type ListingReturnState = {
  [LISTING_RETURN_STATE_KEY]?: string
}

/** Builds a listing href, omitting `?tab=` when the tab is the default. */
export function buildListingHref(
  basePath: string,
  tab: string | null | undefined,
  defaultTab?: string,
  paramKey = 'tab',
): string {
  const path = basePath.trim() || '/'
  if (!tab || (defaultTab != null && tab === defaultTab)) return path
  const params = new URLSearchParams()
  params.set(paramKey, tab)
  return `${path}?${params.toString()}`
}

/** Current listing location including search (for return-from-detail). */
export function getCurrentListingHref(location: Pick<Location, 'pathname' | 'search'>): string {
  return `${location.pathname}${location.search}`
}

/** Resolves breadcrumb/back target from navigation state, else the listing base path. */
export function getListingReturnHref(
  location: Pick<Location, 'state'>,
  fallbackPath: string,
): string {
  const state = location.state as ListingReturnState | null | undefined
  const fromListing = state?.[LISTING_RETURN_STATE_KEY]?.trim()
  if (fromListing?.startsWith('/')) return fromListing
  return fallbackPath
}

/** Merges `fromListing` into navigate state without dropping existing keys. */
export function withListingReturnState<T extends Record<string, unknown>>(
  fromListing: string,
  state?: T,
): T & ListingReturnState {
  return { ...(state as T), [LISTING_RETURN_STATE_KEY]: fromListing }
}

/** Navigate to a child route while remembering the listing URL (including active tab). */
export function navigateFromListing(
  navigate: NavigateFunction,
  to: To,
  fromListing: string,
  options?: NavigateOptions,
): void {
  const existing =
    options?.state && typeof options.state === 'object' && options.state !== null
      ? (options.state as Record<string, unknown>)
      : undefined
  navigate(to, {
    ...options,
    state: withListingReturnState(fromListing, existing),
  })
}
