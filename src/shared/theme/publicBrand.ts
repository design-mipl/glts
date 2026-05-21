/** Brand tokens for public site + product portals (logo-aligned navy + green) */
export const publicColors = {
  navy: '#001F3F',
  navyMid: '#0A2540',
  navyLight: '#123B5C',
  green: '#76C76B',
  greenBright: '#10B981',
  greenDark: '#059669',
  greenMuted: 'rgba(118, 199, 107, 0.12)',
  white: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceAlt: '#F1F5F9',
  border: '#E2E8F0',
  borderSoft: 'rgba(226, 232, 240, 0.8)',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  heroGradient: 'linear-gradient(165deg, #001F3F 0%, #0A2540 45%, #0d3d4a 100%)',
} as const

export const publicFonts = {
  heading: '"Plus Jakarta Sans", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
} as const

export const publicLayout = {
  containerStandard: 1280,
  containerHero: 1400,
  sectionMajor: { xs: 10, md: 17.5, lg: 20 },
  sectionMedium: { xs: 9, md: 12, lg: 15 },
  cardRadius: '22px',
  cardPadding: { xs: 3, md: 4 },
  navHeight: 80,
} as const

export const publicShadows = {
  card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)',
  cardHover: '0 4px 8px rgba(15, 23, 42, 0.06), 0 24px 48px rgba(15, 23, 42, 0.12)',
  float: '0 32px 64px rgba(0, 31, 63, 0.28)',
  nav: '0 1px 0 rgba(15, 23, 42, 0.06)',
} as const

export const publicTypography = {
  hero: { xs: '42px', sm: '56px', md: '64px', lg: '72px' },
  h2: { xs: '32px', md: '40px', lg: '48px' },
  h3: { xs: '22px', md: '24px' },
  body: { xs: '16px', md: '17px', lg: '18px' },
  bodyLg: { xs: '17px', md: '18px', lg: '20px' },
  caption: '13px',
  overline: '12px',
} as const

/** Shared primary CTA button styles */
export const primaryButtonSx = {
  backgroundColor: publicColors.greenBright,
  fontWeight: 700,
  textTransform: 'none' as const,
  borderRadius: '12px',
  fontSize: '16px',
  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
  '&:hover': { backgroundColor: publicColors.greenDark },
}
