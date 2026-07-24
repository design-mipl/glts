import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { DrilldownPayload, DrilldownSurface } from '../types'

export interface DrilldownContextValue {
  active: DrilldownPayload | null
  history: DrilldownPayload[]
  openDrilldown: (payload: DrilldownPayload) => void
  pushDrilldown: (payload: DrilldownPayload) => void
  closeDrilldown: () => void
  popDrilldown: () => void
}

const DrilldownContext = createContext<DrilldownContextValue | null>(null)

export interface DrilldownProviderProps {
  children: ReactNode
  defaultSurface?: DrilldownSurface
}

export function DrilldownProvider({
  children,
  defaultSurface = 'drawer',
}: DrilldownProviderProps) {
  const [active, setActive] = useState<DrilldownPayload | null>(null)
  const [history, setHistory] = useState<DrilldownPayload[]>([])

  const openDrilldown = useCallback(
    (payload: DrilldownPayload) => {
      setHistory([])
      setActive({ ...payload, surface: payload.surface ?? defaultSurface })
    },
    [defaultSurface],
  )

  const pushDrilldown = useCallback(
    (payload: DrilldownPayload) => {
      setHistory((prev) => (active ? [...prev, active] : prev))
      setActive({
        ...payload,
        surface: payload.surface ?? defaultSurface,
        trail: [
          ...(active?.trail ?? []),
          ...(active ? [{ id: active.id, label: active.title }] : []),
        ],
      })
    },
    [active, defaultSurface],
  )

  const closeDrilldown = useCallback(() => {
    setActive(null)
    setHistory([])
  }, [])

  const popDrilldown = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) {
        setActive(null)
        return prev
      }
      const nextHistory = prev.slice(0, -1)
      setActive(prev[prev.length - 1] ?? null)
      return nextHistory
    })
  }, [])

  const value = useMemo(
    () => ({
      active,
      history,
      openDrilldown,
      pushDrilldown,
      closeDrilldown,
      popDrilldown,
    }),
    [active, closeDrilldown, history, openDrilldown, popDrilldown, pushDrilldown],
  )

  return <DrilldownContext.Provider value={value}>{children}</DrilldownContext.Provider>
}

export function useDrilldown(): DrilldownContextValue {
  const ctx = useContext(DrilldownContext)
  if (!ctx) {
    throw new Error('useDrilldown must be used within DrilldownProvider')
  }
  return ctx
}

export function useDrilldownOptional(): DrilldownContextValue | null {
  return useContext(DrilldownContext)
}

/** Convenience helper for KPI / chart / ranking click handlers. */
export function createDrilldownHandler(
  open: DrilldownContextValue['openDrilldown'],
  base: Omit<DrilldownPayload, 'id' | 'title'> & { id: string; title: string },
) {
  return () => open(base)
}
