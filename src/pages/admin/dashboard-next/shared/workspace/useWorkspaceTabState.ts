import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const storageKey = (workspaceId: string) => `glts:dashboard-next:tab:${workspaceId}`

/**
 * Sticky tab state with deep-link (`?tab=`) + localStorage memory.
 * Shared across all Dashboard Next workspaces.
 * When `validTabs` is provided, unknown ids (e.g. renamed tabs) fall back to `defaultTab`.
 */
export function useWorkspaceTabState(
  workspaceId: string,
  defaultTab: string,
  validTabs?: readonly string[],
) {
  const [searchParams, setSearchParams] = useSearchParams()

  const sanitize = useCallback(
    (tabId: string) => {
      if (!validTabs || validTabs.length === 0) return tabId
      return validTabs.includes(tabId) ? tabId : defaultTab
    },
    [defaultTab, validTabs],
  )

  const initial = useMemo(() => {
    const fromUrl = searchParams.get('tab')
    if (fromUrl) return sanitize(fromUrl)
    try {
      return sanitize(localStorage.getItem(storageKey(workspaceId)) ?? defaultTab)
    } catch {
      return defaultTab
    }
  }, [defaultTab, sanitize, searchParams, workspaceId])

  const [activeTab, setActiveTabState] = useState(initial)

  // Persist sanitized default when localStorage / URL still holds a renamed tab id.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey(workspaceId))
      if (stored && sanitize(stored) !== stored) {
        localStorage.setItem(storageKey(workspaceId), sanitize(stored))
      }
    } catch {
      /* ignore */
    }
  }, [sanitize, workspaceId])

  useEffect(() => {
    const fromUrl = searchParams.get('tab')
    if (!fromUrl) return
    const next = sanitize(fromUrl)
    if (next !== activeTab) {
      setActiveTabState(next)
    }
    if (next !== fromUrl) {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          params.set('tab', next)
          return params
        },
        { replace: true },
      )
      try {
        localStorage.setItem(storageKey(workspaceId), next)
      } catch {
        /* ignore */
      }
    }
  }, [activeTab, sanitize, searchParams, setSearchParams, workspaceId])

  const setActiveTab = useCallback(
    (tabId: string) => {
      const next = sanitize(tabId)
      setActiveTabState(next)
      try {
        localStorage.setItem(storageKey(workspaceId), next)
      } catch {
        /* ignore */
      }
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          params.set('tab', next)
          if (next !== 'work') params.delete('desk')
          return params
        },
        { replace: true },
      )
    },
    [sanitize, setSearchParams, workspaceId],
  )

  return { activeTab, setActiveTab }
}
