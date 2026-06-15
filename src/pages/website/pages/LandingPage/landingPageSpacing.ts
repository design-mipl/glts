/** Public sticky header height — keep in sync with `PublicHeader` NAV_HEIGHT. */
export const PUBLIC_NAV_HEIGHT_PX = 72

/** Hero fills viewport below the navbar. */
export const landingHeroMinHeight = `calc(100dvh - ${PUBLIC_NAV_HEIGHT_PX}px)`

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
