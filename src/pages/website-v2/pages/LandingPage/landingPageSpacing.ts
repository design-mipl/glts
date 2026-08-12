/** Public sticky header height — keep in sync with `PublicHeader` NAV_HEIGHT. */
export const PUBLIC_NAV_HEIGHT_PX = 72

/** Hero height — content-focused layout with floating trust metrics overlap. */
export const landingHeroMinHeight = `calc(90dvh - ${PUBLIC_NAV_HEIGHT_PX}px)`

/** Negative margin reserved when a floating hero card overlaps into the next section. */
export const landingTrustFloatOverlap = {
  xs: 4,
  md: 6,
} as const

/**
 * Vertical section rhythm (MUI spacing × 8px).
 * Mobile 56px · Tablet 72px · Desktop 88px — within
 * 48–64 / 64–80 / 80–100 targets for inter-section breathing room.
 */
export const landingSectionPy = {
  xs: 7,
  md: 9,
  lg: 11,
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

/**
 * Shared Final CTA band height — used by Landing, Marine, Corporate,
 * Retail, Services, and About so every page CTA matches visually.
 * `minHeight` only (no maxHeight) so text↔button gaps never get clipped.
 */
export const finalCtaSectionHeight = {
  xs: 320,
  sm: 340,
  md: 360,
  lg: 380,
} as const

/** Vertical padding inside the Final CTA band (above / below content). */
export const finalCtaSectionPy = {
  xs: 4,
  md: 5,
} as const

/**
 * Stack spacing between heading → description → buttons (and trust row).
 * Keep this even when the band has breathing room above/below.
 */
export const finalCtaContentSpacing = 3.5

/** Consistent gap between Final CTA and footer. */
export const finalCtaSectionMb = {
  xs: 4,
  md: 5,
} as const

/** Shared section shell — height floor, padding, and flex centering. */
export const finalCtaSectionSx = {
  position: 'relative' as const,
  overflow: 'hidden' as const,
  minHeight: finalCtaSectionHeight,
  boxSizing: 'border-box' as const,
  display: 'flex' as const,
  alignItems: 'center' as const,
  py: finalCtaSectionPy,
  mb: finalCtaSectionMb,
}

/** Content padding below the overlaid nav inside the immersive homepage hero. */
export const landingPageHeroContentPt = {
  xs: 5,
  md: 7,
  lg: 8,
} as const

/** Immersive homepage hero — cinematic full-bleed banner. */
export const landingPageHeroMinHeight = {
  xs: `calc(100dvh - ${PUBLIC_NAV_HEIGHT_PX}px)`,
  md: 580,
  lg: 640,
} as const

/** Minimum hero section height on tablet/desktop for consistent page rhythm. */
export const publicHeroSectionMinHeight = {
  xs: 'auto',
  md: 460,
  lg: 480,
} as const
