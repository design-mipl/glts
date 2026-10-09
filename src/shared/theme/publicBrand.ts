import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { websiteDesignSystem as ds } from '@/pages/website-v2/theme/websiteDesignSystem'
import { publicLightColors, publicDarkColors } from './publicBrandPrimitives'
import type { PublicBrandColors, PublicBrandMode } from './publicBrandPrimitives'

export type { PublicBrandColors, PublicBrandMode } from './publicBrandPrimitives'
export { brandPrimaryGreenRgb, publicDarkColors, publicFonts, publicLightColors, publicShadows } from './publicBrandPrimitives'

export function getPublicBrandColors(mode: PublicBrandMode): PublicBrandColors {
  return mode === 'dark' ? publicDarkColors : publicLightColors
}

export function usePublicBrandColors(): PublicBrandColors {
  const theme = useTheme()
  return getPublicBrandColors(theme.palette.mode)
}

export const publicLayout = {
  containerStandard: ds.container.max,
  /** Wide premium hero / marketing shell (Airbnb / Linear-style). */
  containerHero: ds.container.heroMax,
  sectionMajor: ds.layoutCompatibility.sectionMajor,
  sectionMedium: ds.layoutCompatibility.sectionMedium,
  cardRadius: `${ds.radius.card}px`,
  cardPadding: ds.layoutCompatibility.cardPadding,
  navHeight: ds.layoutCompatibility.navHeight,
} as const

export const publicTypography = {
  hero: ds.compatibility.publicTypography.hero,
  h1: { xs: `${ds.type.h1.mobile}px`, sm: `${ds.type.h1.tablet}px`, md: `${ds.type.h1.tablet}px`, lg: `${ds.type.h1.size}px` },
  h2: ds.compatibility.publicTypography.h2,
  h3: ds.compatibility.publicTypography.h3,
  h4: { xs: `${ds.type.h4.mobile}px`, sm: `${ds.type.h4.tablet}px`, md: `${ds.type.h4.tablet}px`, lg: `${ds.type.h4.size}px` },
  body: ds.compatibility.publicTypography.body,
  bodyLg: ds.compatibility.publicTypography.bodyLg,
  caption: ds.compatibility.publicTypography.caption,
  overline: ds.compatibility.publicTypography.overline,
} as const

/** Product / portal button radius — matches design-system `BUTTON.borderRadius` (10px). */
export const PRODUCT_BUTTON_BORDER_RADIUS = `${ds.component.button.product.radius}px`

/** Outlined secondary actions in wizards, drawers, and forms. */
export function getOutlinedButtonSx(): SxProps<Theme> {
  return {
    textTransform: 'none',
    fontSize: `${ds.component.button.product.fontSize}px`,
    fontWeight: ds.component.button.product.fontWeight,
    borderRadius: `${ds.component.button.product.radius}px`,
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
    fontWeight: ds.component.button.product.fontWeight,
    textTransform: 'none',
    borderRadius: `${ds.component.button.product.radius}px`,
    fontSize: `${ds.component.button.product.fontSize}px`,
    boxShadow: `0 4px 14px ${colors.greenBright}4D`,
    color: ds.color.onBrand,
    '&:hover': {
      backgroundColor: colors.greenDark,
      color: ds.color.onBrand,
    },
  }
}

/** Marketing / hero CTAs — larger type, same corner radius as product buttons. */
export function getMarketingPrimaryButtonSx(colors: PublicBrandColors): SxProps<Theme> {
  return {
    ...getPrimaryButtonSx(colors),
    minHeight: ds.component.button.marketing.minHeight,
    fontSize: `${ds.component.button.marketing.fontSize}px`,
    fontWeight: ds.component.button.marketing.fontWeight,
    padding: ds.component.button.marketing.padding,
    boxSizing: 'border-box',
    '& .MuiButton-startIcon > svg, & .MuiButton-endIcon > svg': {
      width: `${ds.component.button.marketing.iconSize}px`,
      height: `${ds.component.button.marketing.iconSize}px`,
      flexShrink: 0,
    },
    '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 3 },
  }
}
