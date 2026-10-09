/**
 * Low-level public brand primitives shared by the public website and customer portals.
 * Semantic public-site roles and component scales are defined in websiteDesignSystem.ts.
 */
export type PublicBrandMode = 'light' | 'dark'

export const brandPrimaryGreenRgb = '115, 194, 101' as const

export interface PublicBrandColors {
  navy: string
  navyMid: string
  navyLight: string
  green: string
  greenBright: string
  greenDark: string
  greenMuted: string
  teal: string
  criticalMuted: string
  criticalBorder: string
  checklistMuted: string
  checklistBorder: string
  white: string
  surface: string
  surfaceAlt: string
  border: string
  borderSoft: string
  text: string
  textSecondary: string
  textMuted: string
  heroGradient: string
  /** Label on saturated filled buttons (primary, success, info, etc.) — always light. */
  onBrandFilled: string
}

/** Brand colors remain primitives; website semantic roles map them in websiteDesignSystem. */
export const publicLightColors: PublicBrandColors = {
  navy: '#001F3F',
  navyMid: '#0A2540',
  navyLight: '#123B5C',
  green: '#73C265',
  greenBright: '#73C265',
  greenDark: '#5A9A4E',
  greenMuted: 'rgba(115, 194, 101, 0.12)',
  teal: '#0C6C79',
  criticalMuted: '#FEF2F2',
  criticalBorder: '#FECACA',
  checklistMuted: '#F2F5F9',
  checklistBorder: '#E2E8F0',
  white: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceAlt: '#F1F5F9',
  border: '#E2E8F0',
  borderSoft: 'rgba(226, 232, 240, 0.8)',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  heroGradient: 'linear-gradient(165deg, #001F3F 0%, #0A2540 45%, #0d3d4a 100%)',
  onBrandFilled: '#FFFFFF',
} as const

export const publicDarkColors: PublicBrandColors = {
  navy: '#E5F4FF',
  navyMid: '#C7E1F4',
  navyLight: '#94A3B8',
  green: '#73C265',
  greenBright: '#8FD67F',
  greenDark: '#5A9A4E',
  greenMuted: 'rgba(115, 194, 101, 0.14)',
  teal: '#0C6C79',
  criticalMuted: '#2D1818',
  criticalBorder: '#5C2E2E',
  checklistMuted: '#151D2B',
  checklistBorder: '#334155',
  white: '#111827',
  surface: '#0F172A',
  surfaceAlt: '#1E293B',
  border: '#334155',
  borderSoft: 'rgba(51, 65, 85, 0.8)',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  heroGradient: 'linear-gradient(165deg, #020617 0%, #0F172A 50%, #064E3B 100%)',
  onBrandFilled: '#FFFFFF',
} as const

export const publicFonts = {
  /** Major marketing and editorial headlines only. */
  display: '"Roboto Slab", Georgia, serif',
  /** UI headings, cards, controls, navigation, and body copy. */
  heading: '"Roboto", system-ui, sans-serif',
  body: '"Roboto", system-ui, sans-serif',
} as const

export const publicShadows = {
  card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)',
  cardHover: '0 4px 8px rgba(15, 23, 42, 0.06), 0 24px 48px rgba(15, 23, 42, 0.12)',
  float: '0 32px 64px rgba(0, 31, 63, 0.28)',
  nav: '0 1px 0 rgba(15, 23, 42, 0.06)',
} as const
