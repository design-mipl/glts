/** Public sticky header height — keep in sync with `PublicHeader` NAV_HEIGHT. */
export const PUBLIC_NAV_HEIGHT_PX = 72

/** Hero height — content-focused layout with floating trust metrics overlap. */
export const landingHeroMinHeight = `calc(90dvh - ${PUBLIC_NAV_HEIGHT_PX}px)`

/** Negative margin (theme spacing units) — ~50% of trust card overlaps hero, ~50% into next section. */
export const landingTrustFloatOverlap = {
  xs: 7.5,
  md: 8.5,
} as const

export const landingSectionPy = {
  xs: 10,
  md: 15,
  lg: 20,
} as const

export const landingHeroPt = {
  xs: 6,
  md: 9,
  lg: 10,
} as const

export const landingHeroPb = {
  xs: 10,
  md: 15,
  lg: 20,
} as const

export const landingSectionHeaderMb = {
  xs: 4.5,
  md: 5.5,
  lg: 6,
} as const

/** Top offset below sticky nav — shared across landing, marine, and corporate heroes. */
export const publicHeroPaddingTop = {
  xs: `${PUBLIC_NAV_HEIGHT_PX + 24}px`,
  md: `${PUBLIC_NAV_HEIGHT_PX + 32}px`,
  lg: `${PUBLIC_NAV_HEIGHT_PX + 36}px`,
} as const

/** Bottom padding for page heroes — shared across landing, marine, and corporate. */
export const publicHeroPaddingBottom = {
  xs: 6,
  md: 8,
  lg: 9,
} as const

/** Minimum visual column height (collage, marine dashboard card, etc.). */
export const publicHeroVisualMinHeight = {
  xs: 260,
  md: 320,
  lg: 340,
} as const

/** Minimum hero section height on tablet/desktop for consistent page rhythm. */
export const publicHeroSectionMinHeight = {
  xs: 'auto',
  md: 460,
  lg: 480,
} as const
