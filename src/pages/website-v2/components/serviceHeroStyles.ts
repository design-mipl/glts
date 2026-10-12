/** Shared spacing around the page-specific hero backgrounds. */
export const serviceHeroSectionSx = {
  position: 'relative' as const,
  overflow: 'hidden' as const,
  boxSizing: 'border-box' as const,
  minHeight: { desktop: 720 },
  display: 'flex' as const,
  alignItems: 'center' as const,
  pt: { xs: '92px', md: '100px', lg: '108px' },
  pb: { xs: '60px', md: '70px', lg: '80px' },
}
