/**
 * Dashboard UI Kit rhythm — aliases onto Design System tokens only.
 * Do not introduce new colors, type scales, or radii here.
 *
 * Phase 2.5: slightly more open executive spacing (Stripe / Fabric readability).
 */

import { tokens } from '@/design-system/tokens'
import { publicShadows } from '@/shared/theme/publicBrand'
import type { UiKitDensity, UiKitElevation } from './types'

/** Vertical story rhythm (MUI spacing multipliers). */
export const UI_KIT_SPACING = {
  page: 3.5,
  hero: 3.5,
  section: 3,
  stack: 2.25,
  cluster: 1.75,
  field: 1.5,
  inline: 1,
  tight: 0.75,
  dense: 0.5,
} as const

export const UI_KIT_BREAKPOINTS = {
  mobile: 0,
  tablet: 600,
  laptop: 900,
  desktop: 1200,
} as const

/** Grid column spans by density story. */
export const UI_KIT_GRID = {
  heroMetric: { xs: 12, sm: 6, md: 4, lg: 3 },
  executiveMetric: { xs: 12, sm: 6, md: 4, lg: 3 },
  insightCard: { xs: 12, md: 6, lg: 4 },
  half: { xs: 12, md: 6 },
  full: { xs: 12 },
  sidebar: { xs: 12, lg: 4 },
  main: { xs: 12, lg: 8 },
} as const

export function uiKitRadius(density: UiKitDensity = 'comfortable') {
  return density === 'compact' ? tokens.borderRadius.lg : tokens.borderRadius.xl
}

export function uiKitShadow(elevation: UiKitElevation = 'raised') {
  switch (elevation) {
    case 'flat':
      return tokens.shadow.none
    case 'overlay':
      return publicShadows.cardHover
    case 'raised':
    default:
      return publicShadows.card
  }
}

export function uiKitPad(density: UiKitDensity = 'comfortable') {
  return density === 'compact'
    ? { xs: 1.25, md: 1.5 }
    : { xs: 2.25, md: 2.75 }
}

export const UI_KIT_MOTION = {
  fast: tokens.transition.fast,
  normal: tokens.transition.normal,
  slow: tokens.transition.slow,
  hoverLift: 'translateY(-2px)',
} as const

export const UI_KIT_Z = {
  sticky: tokens.zIndex.sticky,
  raised: tokens.zIndex.raised,
} as const
