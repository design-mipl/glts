/**
 * Foundation 10-step min-width breakpoints (px).
 * xs starts at 320: `theme.breakpoints.up('xs')` is false below 320px; base styles still apply 0–319.
 */

export const BREAKPOINT_MOBILE_SMALL = 320
export const BREAKPOINT_MOBILE_MEDIUM = 375
export const BREAKPOINT_MOBILE_LARGE = 428
export const BREAKPOINT_TABLET_PORTRAIT = 600
export const BREAKPOINT_TABLET_LANDSCAPE = 900
export const BREAKPOINT_DESKTOP_SMALL = 1024
export const BREAKPOINT_DESKTOP_MEDIUM = 1280
export const BREAKPOINT_DESKTOP_LARGE = 1536
export const BREAKPOINT_DESKTOP_XL = 1920
export const BREAKPOINT_DESKTOP_4K = 2560

/** Ordered min-widths; index i matches RESPONSIVE_* array index i */
export const FOUNDATION_BREAKPOINT_MIN_WIDTHS = [
  BREAKPOINT_MOBILE_SMALL,
  BREAKPOINT_MOBILE_MEDIUM,
  BREAKPOINT_MOBILE_LARGE,
  BREAKPOINT_TABLET_PORTRAIT,
  BREAKPOINT_TABLET_LANDSCAPE,
  BREAKPOINT_DESKTOP_SMALL,
  BREAKPOINT_DESKTOP_MEDIUM,
  BREAKPOINT_DESKTOP_LARGE,
  BREAKPOINT_DESKTOP_XL,
  BREAKPOINT_DESKTOP_4K,
] as const

/** MUI / theme breakpoint keys in the same order as min widths */
export const FOUNDATION_BREAKPOINT_KEYS = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'desktop',
  'desktopMd',
  'desktopLg',
  'desktopXl',
  'desktopUhd',
] as const

export type FoundationBreakpointKey = (typeof FOUNDATION_BREAKPOINT_KEYS)[number]

/** Values passed to `createTheme({ breakpoints: { values } })` */
export const FOUNDATION_BREAKPOINT_VALUES = {
  xs: BREAKPOINT_MOBILE_SMALL,
  sm: BREAKPOINT_MOBILE_MEDIUM,
  md: BREAKPOINT_MOBILE_LARGE,
  lg: BREAKPOINT_TABLET_PORTRAIT,
  xl: BREAKPOINT_TABLET_LANDSCAPE,
  desktop: BREAKPOINT_DESKTOP_SMALL,
  desktopMd: BREAKPOINT_DESKTOP_MEDIUM,
  desktopLg: BREAKPOINT_DESKTOP_LARGE,
  desktopXl: BREAKPOINT_DESKTOP_XL,
  desktopUhd: BREAKPOINT_DESKTOP_4K,
} as const

/** Active bucket index for a viewport width (0 = smallest tier) */
export function getFoundationBreakpointIndex(width: number): number {
  let idx = 0
  for (let i = FOUNDATION_BREAKPOINT_MIN_WIDTHS.length - 1; i >= 0; i--) {
    if (width >= FOUNDATION_BREAKPOINT_MIN_WIDTHS[i]) {
      idx = i
      break
    }
  }
  return idx
}
