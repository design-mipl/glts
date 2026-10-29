/** Shared spacing around the page-specific hero backgrounds. */
export const serviceHeroSectionSx = {
  position: 'relative' as const,
  overflow: 'hidden' as const,
  boxSizing: 'border-box' as const,
  minHeight: { desktop: 720 },
  display: 'flex' as const,
  alignItems: 'stretch' as const,
  pt: { xs: '72px', md: '80px', lg: '88px', desktopMd: '96px' },
  pb: { xs: '56px', md: '64px', lg: '72px', desktopMd: '48px' },
}
