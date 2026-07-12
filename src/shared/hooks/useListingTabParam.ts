import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Syncs a listing (or queue) tab with the URL `?tab=` query param so back
 * navigation and deep links restore the same tab.
 */
export function useListingTabParam<T extends string>(
  validTabs: readonly T[],
  defaultTab: T,
  paramKey = 'tab',
): [T, (tab: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const raw = searchParams.get(paramKey)
  const activeTab: T =
    raw != null && (validTabs as readonly string[]).includes(raw) ? (raw as T) : defaultTab

  const setActiveTab = useCallback(
    (tab: T) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (tab === defaultTab) {
            next.delete(paramKey)
          } else {
            next.set(paramKey, tab)
          }
          return next
        },
        { replace: true },
      )
    },
    [defaultTab, paramKey, setSearchParams],
  )

  return [activeTab, setActiveTab]
}
