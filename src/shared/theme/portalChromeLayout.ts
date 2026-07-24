import type { Theme } from '@mui/material/styles'

/** Matches design-system AppShell / Topbar chrome. */
export const PORTAL_TOPBAR_HEIGHT = 52

/** Matches design-system AppShell expanded sidebar width. */
export const PORTAL_SIDEBAR_WIDTH = 240

/** Matches design-system AppShell collapsed sidebar width. */
export const PORTAL_SIDEBAR_COLLAPSED_WIDTH = 64

/** Breakpoint key for mobile nav drawer — aligns with Admin AppShell (`desktop` / 1024px). */
export const PORTAL_MOBILE_NAV_BREAKPOINT = 'desktop' as const

/** Main content padding inside portal shells (admin AppShell + customer CustomerShell). */
export function getPortalMainPaddingSx(theme: Theme) {
  return {
    p: theme.spacing(4),
    [theme.breakpoints.up('lg')]: { p: theme.spacing(3.5) },
    [theme.breakpoints.up('desktop')]: { p: theme.spacing(3) },
  }
}

/** Page H1 — aligned with theme typography.h2 (20px). */
export const PORTAL_RECORD_PAGE_TITLE_VARIANT = 'h2' as const

export const PORTAL_RECORD_PAGE_TITLE_SX = {
  lineHeight: 1.2,
  m: 0,
} as const
