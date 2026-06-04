import type { NavigateFunction, To } from 'react-router-dom'

export interface BreadcrumbHrefItem {
  href?: string
}

/** Nearest ancestor crumb with a route (used for the back affordance). */
export function getPreviousCrumbHref(items: BreadcrumbHrefItem[]): string | undefined {
  if (items.length < 2) return undefined
  for (let i = items.length - 2; i >= 0; i -= 1) {
    const href = items[i]?.href?.trim()
    if (href) return href
  }
  return undefined
}

/**
 * Resolves an app href into a router `to` value for non-absolute targets.
 * Prefer absolute `href` values in breadcrumbs; this helper is for relative paths only.
 */
export function resolveNavigationTo(href: string, pathname: string): To {
  const target = href.trim()
  if (!target.startsWith('/')) return target

  const targetParts = target.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  let common = 0
  while (
    common < targetParts.length &&
    common < pathParts.length &&
    targetParts[common] === pathParts[common]
  ) {
    common += 1
  }

  const up = pathParts.length - common
  const down = targetParts.slice(common)

  if (up === 0 && down.length === 0) return '.'

  const segments = [...Array.from({ length: up }, () => '..'), ...down]
  return segments.join('/') || '.'
}

function normalizePathname(path: string): string {
  if (!path) return '/'
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

/**
 * Navigates to an absolute app path. Falls back to a hard navigation when React Router
 * does not leave a child route (observed under `/admin/*` and `/retail/*` splat parents).
 */
export function navigateToAppPath(
  navigate: NavigateFunction,
  href: string,
  options?: { replace?: boolean; state?: unknown },
): void {
  const target = normalizePathname(href.trim())
  if (!target.startsWith('/')) {
    navigate(href, options)
    return
  }

  navigate(target, options)

  requestAnimationFrame(() => {
    const current = normalizePathname(window.location.pathname)
    if (current === target) return
    if (current.startsWith(`${target}/`)) {
      window.location.assign(target)
    }
  })
}
