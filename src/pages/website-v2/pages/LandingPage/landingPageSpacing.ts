import { websiteSectionPadding } from '../../theme/websiteDesignSystem'

/** Public sticky header height — keep in sync with `PublicHeader` NAV_HEIGHT. */
export const PUBLIC_NAV_HEIGHT_PX = 72

/** Hero height — content-focused layout with floating trust metrics overlap. */
export const landingHeroMinHeight = `calc(90dvh - ${PUBLIC_NAV_HEIGHT_PX}px)`

/** Negative margin reserved when a floating hero card overlaps into the next section. */
export const landingTrustFloatOverlap = {
  xs: 4,
  md: 6,
} as const

/** Responsive public section padding from the website design system. */
export const landingSectionPy = websiteSectionPadding.regular
export const featureSectionPy = websiteSectionPadding.feature
export const compactSectionPy = websiteSectionPadding.compact
export const darkSectionPy = websiteSectionPadding.dark

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
  xs: 5,
  lg: 5.5,
  desktop: 6,
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
  xs: 'auto',
  sm: 300,
  md: 320,
  lg: 340,
} as const

/** Vertical padding inside the Final CTA band (above / below content). */
export const finalCtaSectionPy = {
  ...compactSectionPy,
} as const

/**
 * Stack spacing between heading → description → buttons (and trust row).
 * Keep this even when the band has breathing room above/below.
 */
export const finalCtaContentSpacing = 2.5
/** Adds 12px to the 20px stack gap before the CTA controls. */
export const finalCtaActionPt = 1.5

/** Consistent gap between Final CTA and footer. */
export const finalCtaSectionMb = compactSectionPy

/** Shared section shell — height floor, padding, and flex centering. */
export const finalCtaSectionSx = {
  position: 'relative' as const,
  overflow: 'hidden' as const,
  minHeight: finalCtaSectionHeight,
  boxSizing: 'border-box' as const,
  display: 'flex' as const,
  alignItems: 'center' as const,
  py: finalCtaSectionPy,
  mb: 0,
  '&:last-child': { mb: finalCtaSectionMb },
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
