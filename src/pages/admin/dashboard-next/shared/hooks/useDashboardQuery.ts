import { useCallback, useEffect, useState } from 'react'
import type { DashboardQueryState } from '../types'

export interface UseDashboardQueryOptions<T> {
  load: () => Promise<T>
  /** When true, skip the initial load. */
  skip?: boolean
}

/**
 * Generic async loader for dashboard pages. Widgets stay presentational;
 * pages/hooks own business data via this pattern.
 */
export function useDashboardQuery<T>({
  load,
  skip = false,
}: UseDashboardQueryOptions<T>): DashboardQueryState<T> & { retry: () => void } {
  const [state, setState] = useState<DashboardQueryState<T>>({
    status: skip ? 'idle' : 'loading',
    data: null,
    error: null,
  })

  const run = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }))
    try {
      const data = await load()
      setState({ status: 'success', data, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard'
      setState({ status: 'error', data: null, error: message })
    }
  }, [load])

  useEffect(() => {
    if (skip) return
    void run()
  }, [run, skip])

  return {
    ...state,
    retry: run,
  }
}
