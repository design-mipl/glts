import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const storageKey = (workspaceId: string) => `glts:dashboard-next:tab:${workspaceId}`

/**
 * Sticky tab state with deep-link (`?tab=`) + localStorage memory.
 * Shared across all Dashboard Next workspaces.
 */
export function useWorkspaceTabState(workspaceId: string, defaultTab: string) {
  const [searchParams, setSearchParams] = useSearchParams()

  const initial = useMemo(() => {
    const fromUrl = searchParams.get('tab')
    if (fromUrl) return fromUrl
    try {
      return localStorage.getItem(storageKey(workspaceId)) ?? defaultTab
    } catch {
      return defaultTab
    }
  }, [defaultTab, searchParams, workspaceId])

  const [activeTab, setActiveTabState] = useState(initial)

  useEffect(() => {
    const fromUrl = searchParams.get('tab')
    if (fromUrl && fromUrl !== activeTab) {
      setActiveTabState(fromUrl)
    }
  }, [activeTab, searchParams])

  const setActiveTab = useCallback(
    (tabId: string) => {
      setActiveTabState(tabId)
      try {
        localStorage.setItem(storageKey(workspaceId), tabId)
      } catch {
        /* ignore */
      }
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('tab', tabId)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams, workspaceId],
  )

  return { activeTab, setActiveTab }
}
