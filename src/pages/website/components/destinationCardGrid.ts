/** Shared responsive grid for homepage destination card rows. */
export const destinationCardGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    sm: 'repeat(3, minmax(0, 1fr))',
    lg: 'repeat(5, minmax(0, 1fr))',
  },
  gap: { xs: 2.25, sm: 2.75, md: 3.25 },
  alignItems: 'stretch',
} as const

/**
 * Fixed widths aligned to homepage 5-column grid cell size — used for horizontal carousels
 * on solution pages so cards match homepage dimensions when scrolled.
 */
export const destinationCardCarouselItemWidth = {
  xs: 156,
  sm: 200,
  md: 224,
  lg: 236,
} as const

export const destinationCardCarouselGap = { xs: 2.25, sm: 2.75, md: 3.25 } as const
