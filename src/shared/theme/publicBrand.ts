import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { buttonPaddingCss } from '@/design-system/formControl'

export type PublicBrandMode = 'light' | 'dark'

/** RGB components for primary brand green (`#73C064`) — use in `rgba(${brandPrimaryGreenRgb}, α)`. */
export const brandPrimaryGreenRgb = '115, 192, 100' as const

export interface PublicBrandColors {
  navy: string
  navyMid: string
  navyLight: string
  green: string
  greenBright: string
  greenDark: string
  greenMuted: string
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

/** Brand tokens for public site + product portals (logo-aligned navy + green). */
export const publicLightColors: PublicBrandColors = {
  navy: '#001F3F',
  navyMid: '#0A2540',
  navyLight: '#123B5C',
  green: '#73C064',
  greenBright: '#73C064',
  greenDark: '#5A9A4E',
  greenMuted: 'rgba(115, 192, 100, 0.12)',
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
  green: '#73C064',
  greenBright: '#8FD67F',
  greenDark: '#5A9A4E',
  greenMuted: 'rgba(115, 192, 100, 0.14)',
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

export function getPublicBrandColors(mode: PublicBrandMode): PublicBrandColors {
  return mode === 'dark' ? publicDarkColors : publicLightColors
}

export function usePublicBrandColors(): PublicBrandColors {
  const theme = useTheme()
  return getPublicBrandColors(theme.palette.mode)
}

export const publicFonts = {
  heading: '"Roboto", system-ui, sans-serif',
  body: '"Roboto", system-ui, sans-serif',
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

/** Product / portal button radius — matches design-system `BUTTON.borderRadius` (10px). */
export const PRODUCT_BUTTON_BORDER_RADIUS = '10px'

/** Outlined secondary actions in wizards, drawers, and forms. */
export function getOutlinedButtonSx(): SxProps<Theme> {
  return {
    textTransform: 'none',
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: PRODUCT_BUTTON_BORDER_RADIUS,
  }
}

/** Merge product button tokens for MUI `sx` prop (avoids spread type errors). */
export function mergeButtonSx(...parts: SxProps<Theme>[]): SxProps<Theme> {
  return parts as SxProps<Theme>
}

/** Shared primary CTA button styles for the active brand mode. */
export function getPrimaryButtonSx(colors: PublicBrandColors): SxProps<Theme> {
  return {
    backgroundColor: colors.greenBright,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: PRODUCT_BUTTON_BORDER_RADIUS,
    fontSize: '13px',
    boxShadow: `0 4px 14px ${colors.greenBright}4D`,
    color: colors.onBrandFilled,
    '&:hover': {
      backgroundColor: colors.greenDark,
      color: colors.onBrandFilled,
    },
  }
}

/** Marketing / hero CTAs — larger type, same corner radius as product buttons. */
export function getMarketingPrimaryButtonSx(colors: PublicBrandColors): SxProps<Theme> {
  return {
    ...getPrimaryButtonSx(colors),
    fontSize: '16px',
    fontWeight: 700,
    padding: buttonPaddingCss('lg'),
  }
}
