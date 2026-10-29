import { useEffect, useState } from 'react'
import { publicLightColors } from '@/shared/theme/publicBrandPrimitives'
import './GLTSLoader.css'

const LOADER_BG = '#F7FAF7'
const BRAND_GREEN = publicLightColors.green
const CX = 100
const CY = 100
const PATH_RADIUS = 62
const DOT_COUNT = 44
/** Delay before painting the loader so sub-threshold loads never flash. */
const DEFAULT_APPEAR_DELAY_MS = 140

type TrailDot = {
  cx: number
  cy: number
  r: number
  opacity: number
}

/**
 * Dots sit behind the airplane along the circle (counter-clockwise from the
 * plane when it flies clockwise). Size and opacity fade with distance.
 */
const TRAIL_DOTS: TrailDot[] = Array.from({ length: DOT_COUNT }, (_, index) => {
  const t = (index + 1) / (DOT_COUNT + 1)
  // Plane sits at top (−90°). Clockwise flight → trail goes toward −90° − arc.
  const angle = -Math.PI / 2 - t * Math.PI * 1.85
  const fade = Math.pow(1 - t, 1.15)
  return {
    cx: CX + PATH_RADIUS * Math.cos(angle),
    cy: CY + PATH_RADIUS * Math.sin(angle),
    r: 1.15 + fade * 2.35,
    opacity: 0.08 + fade * 0.92,
  }
})

/** Top-down commercial jet silhouette; nose points toward −Y before placement rotate. */
const AIRPLANE_PATH =
  'M0 -11.5 L2.15 -6.2 L2.15 -2.2 L11.8 3.4 L11.8 5.8 L2.15 2.6 L2.15 7.2 L4.8 11.2 L4.8 13 L0 10.8 L-4.8 13 L-4.8 11.2 L-2.15 7.2 L-2.15 2.6 L-11.8 5.8 L-11.8 3.4 L-2.15 -2.2 L-2.15 -6.2 Z'

export type GLTSLoaderVariant = 'fullscreen' | 'inline'

export interface GLTSLoaderProps {
  /** Full-viewport overlay vs in-flow page placeholder. */
  variant?: GLTSLoaderVariant
  /** Accessible name announced to assistive tech (never rendered as visible text). */
  label?: string
  /**
   * Milliseconds to wait before showing the loader. If loading ends sooner,
   * nothing is painted — content is not held back.
   */
  appearDelayMs?: number
  className?: string
}

function LoaderDecorations() {
  return (
    <>
      <svg className="glts-loader__deco glts-loader__deco--arc" viewBox="0 0 120 120" aria-hidden="true">
        <circle
          cx="0"
          cy="0"
          r="88"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="160 280"
        />
        <circle cx="18" cy="22" r="36" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.55" />
      </svg>

      <svg className="glts-loader__deco glts-loader__deco--globe" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="58" cy="58" r="36" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <ellipse cx="58" cy="58" rx="14" ry="36" fill="none" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="58" cy="58" rx="36" ry="12" fill="none" stroke="currentColor" strokeWidth="1" />
        <path
          d="M28 48c10-6 22-4 34 2 8 4 16 6 24 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.7"
        />
        <path
          d="M34 70c12-8 28-10 42-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.55"
        />
        <path
          d="M52 24c-4 14-2 28 4 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
        />
      </svg>
    </>
  )
}

function FlightPathSvg() {
  return (
    <svg
      className="glts-loader__svg"
      viewBox="0 0 200 200"
      width="200"
      height="200"
      aria-hidden="true"
      focusable="false"
    >
      {TRAIL_DOTS.map((dot, index) => (
        <circle
          key={index}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          fill={BRAND_GREEN}
          opacity={dot.opacity}
        />
      ))}

      {/*
        Plane at the top of the circle, nose pointing east so clockwise orbit
        keeps the silhouette tangent to the flight path.
      */}
      <g transform={`translate(${CX} ${CY - PATH_RADIUS}) rotate(90)`}>
        <path fill={BRAND_GREEN} d={AIRPLANE_PATH} />
      </g>
    </svg>
  )
}

/**
 * Premium GLTS brand loader: airplane orbiting a dotted circular flight path.
 * Animation is CSS-only (no JS loops / continuous re-renders).
 */
export function GLTSLoader({
  variant = 'fullscreen',
  label = 'Loading',
  appearDelayMs = DEFAULT_APPEAR_DELAY_MS,
  className,
}: GLTSLoaderProps) {
  const [visible, setVisible] = useState(appearDelayMs <= 0)

  useEffect(() => {
    if (appearDelayMs <= 0) {
      setVisible(true)
      return
    }
    setVisible(false)
    const timer = window.setTimeout(() => setVisible(true), appearDelayMs)
    return () => window.clearTimeout(timer)
  }, [appearDelayMs])

  if (!visible) {
    // Keep fullscreen chrome mounted so Suspense doesn’t flash prior paint,
    // but stay visually empty for sub-threshold loads.
    if (variant === 'fullscreen') {
      return (
        <div
          className={['glts-loader', 'glts-loader--fullscreen', className].filter(Boolean).join(' ')}
          style={{ backgroundColor: LOADER_BG, opacity: 0, pointerEvents: 'none' }}
          aria-hidden="true"
        />
      )
    }
    return null
  }

  return (
    <div
      className={['glts-loader', `glts-loader--${variant}`, className].filter(Boolean).join(' ')}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      style={{
        ['--glts-loader-green' as string]: BRAND_GREEN,
        ['--glts-loader-bg' as string]: LOADER_BG,
      }}
    >
      <div className="glts-loader__stage">
        <LoaderDecorations />
        <div className="glts-loader__orbit">{FlightPathSvg()}</div>
      </div>
    </div>
  )
}

export default GLTSLoader
