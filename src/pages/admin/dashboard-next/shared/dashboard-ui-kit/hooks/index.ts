import { useEffect, useMemo, useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { UI_KIT_BREAKPOINTS } from '../tokens'

export function useUiKitBreakpoint() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isLaptop = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  return useMemo(
    () => ({
      isMobile,
      isTablet,
      isLaptop,
      isDesktop,
      columns: isMobile ? 1 : isTablet ? 1 : isLaptop ? 2 : 3,
      breakpoints: UI_KIT_BREAKPOINTS,
    }),
    [isDesktop, isLaptop, isMobile, isTablet],
  )
}

/** Respect `prefers-reduced-motion`. */
export function useUiKitReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}

/** Simple animated number for hero metrics. Disabled when reduced motion. */
export function useUiKitAnimatedNumber(
  value: number,
  options?: { durationMs?: number; enabled?: boolean },
): number {
  const reduced = useUiKitReducedMotion()
  const enabled = options?.enabled !== false && !reduced
  const durationMs = options?.durationMs ?? 600
  const [display, setDisplay] = useState(enabled ? 0 : value)

  useEffect(() => {
    if (!enabled) {
      setDisplay(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const from = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - (1 - t) ** 3
      setDisplay(from + (value - from) * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [durationMs, enabled, value])

  return display
}
