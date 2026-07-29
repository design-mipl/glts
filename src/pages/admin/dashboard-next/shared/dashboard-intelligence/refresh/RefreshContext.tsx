import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Stack, Typography } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import { Badge } from '../../dashboard-ui-kit/shadcn'
import type { RefreshState } from '../types'

export interface RefreshContextValue extends RefreshState {
  refresh: () => Promise<void>
  setAutoRefreshMs: (ms: number | null) => void
  markUpdated: (at?: Date) => void
}

const RefreshContext = createContext<RefreshContextValue | null>(null)

export interface RefreshProviderProps {
  children: ReactNode
  onRefresh?: () => void | Promise<void>
  autoRefreshMs?: number | null
}

export function RefreshProvider({
  children,
  onRefresh,
  autoRefreshMs = null,
}: RefreshProviderProps) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoMs, setAutoMs] = useState<number | null>(autoRefreshMs)

  const markUpdated = useCallback((at?: Date) => {
    setLastUpdatedAt(at ?? new Date())
  }, [])

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await onRefresh?.()
      markUpdated()
    } finally {
      setIsRefreshing(false)
    }
  }, [markUpdated, onRefresh])

  useEffect(() => {
    if (!autoMs || autoMs <= 0) return
    const id = window.setInterval(() => {
      void refresh()
    }, autoMs)
    return () => window.clearInterval(id)
  }, [autoMs, refresh])

  const value = useMemo<RefreshContextValue>(
    () => ({
      lastUpdatedAt,
      isRefreshing,
      autoRefreshMs: autoMs,
      refresh,
      setAutoRefreshMs: setAutoMs,
      markUpdated,
    }),
    [autoMs, isRefreshing, lastUpdatedAt, markUpdated, refresh],
  )

  return <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>
}

export function useDashboardRefresh(): RefreshContextValue {
  const ctx = useContext(RefreshContext)
  if (!ctx) throw new Error('useDashboardRefresh must be used within RefreshProvider')
  return ctx
}

export function useDashboardRefreshOptional(): RefreshContextValue | null {
  return useContext(RefreshContext)
}

export interface RefreshIndicatorProps {
  showManualRefresh?: boolean
  /** Single-line compact chrome for dense workspace headers. */
  compact?: boolean
}

export function RefreshIndicator({
  showManualRefresh = true,
  compact = false,
}: RefreshIndicatorProps) {
  const { lastUpdatedAt, isRefreshing, refresh } = useDashboardRefresh()

  const timeLabel = lastUpdatedAt
    ? lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—'

  if (compact) {
    return (
      <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="nowrap" useFlexGap>
        <Badge variant={isRefreshing ? 'warning' : 'secondary'}>
          {isRefreshing ? '…' : 'Live'}
        </Badge>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {timeLabel}
        </Typography>
        {showManualRefresh ? (
          <Button
            label="Refresh"
            variant="text"
            size="sm"
            onClick={() => void refresh()}
            disabled={isRefreshing}
          />
        ) : null}
      </Stack>
    )
  }

  return (
    <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
      <Badge variant={isRefreshing ? 'warning' : 'secondary'}>
        {isRefreshing ? 'Refreshing…' : 'Live'}
      </Badge>
      <Typography variant="caption" color="text.secondary">
        Last updated {timeLabel}
      </Typography>
      {showManualRefresh ? (
        <Button
          label="Refresh"
          variant="text"
          size="sm"
          onClick={() => void refresh()}
          disabled={isRefreshing}
        />
      ) : null}
    </Stack>
  )
}
