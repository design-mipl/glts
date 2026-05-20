import { useEffect, useState } from 'react'
import {
  FOUNDATION_BREAKPOINT_KEYS,
  type FoundationBreakpointKey,
  getFoundationBreakpointIndex,
} from '../breakpoints'

const TEN = 10 as const

export function useFoundationBreakpointIndex(): number {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  )

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return getFoundationBreakpointIndex(width)
}

export function useFoundationBreakpointKey(): FoundationBreakpointKey {
  const i = useFoundationBreakpointIndex()
  return FOUNDATION_BREAKPOINT_KEYS[i]
}

/** Ten values in breakpoint order (320 → 4K). */
export function useResponsiveValue<T>(values: readonly T[]): T {
  const idx = useFoundationBreakpointIndex()
  const len = values.length
  if (len !== TEN) {
    console.warn(`useResponsiveValue: expected ${TEN} entries, got ${len}`)
  }
  const safeIdx = Math.min(Math.max(idx, 0), Math.max(0, len - 1))
  return values[safeIdx] as T
}

/** Semantic density map (same order as foundation breakpoints). */
export type ResponsiveDensityMap<T> = {
  mobile: T
  mobileMd: T
  mobileLg: T
  tablet: T
  tabletLg: T
  desktop: T
  desktopMd: T
  desktopLg: T
  desktopXl: T
  desktopUhd: T
}

const DENSITY_KEY_ORDER: (keyof ResponsiveDensityMap<unknown>)[] = [
  'mobile',
  'mobileMd',
  'mobileLg',
  'tablet',
  'tabletLg',
  'desktop',
  'desktopMd',
  'desktopLg',
  'desktopXl',
  'desktopUhd',
]

export function useResponsiveDensityMap<T>(map: ResponsiveDensityMap<T>): T {
  const idx = useFoundationBreakpointIndex()
  const key = DENSITY_KEY_ORDER[idx] as keyof ResponsiveDensityMap<T>
  return map[key]
}
