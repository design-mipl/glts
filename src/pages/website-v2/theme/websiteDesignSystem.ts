import type { CSSProperties } from 'react'
import { FOUNDATION_BREAKPOINT_VALUES } from '@/design-system/breakpoints'
import { publicFonts, publicLightColors, publicShadows } from '@/shared/theme/publicBrandPrimitives'

const containerTokens = { max: 1280, heroMax: 1760, gutterMobile: 24, gutterTablet: 32, gutterDesktop: 48 } as const
const radiusTokens = { small: 8, medium: 12, large: 20, card: 22, pill: 999 } as const
const controlTokens = { height: 44, buttonHeight: 44, iconButtonSize: 44, labelGap: 8, iconGap: 8 } as const
const buttonSizeTokens = {
  website: { minHeight: controlTokens.buttonHeight, radius: radiusTokens.medium, fontSize: 14, fontWeight: 600, paddingX: 12 },
  product: { radius: 10, fontSize: 13, fontWeight: 600 },
  marketing: { radius: 10, fontSize: 16, fontWeight: 700, padding: '10px 20px' },
} as const
const fieldSizeTokens = {
  website: { minHeight: controlTokens.height, radius: radiusTokens.medium },
  productSmall: { minHeight: 34 },
  productStandard: { minHeight: 40 },
} as const

/**
 * Authoritative semantic tokens for the public website.
 * `publicBrandPrimitives` remains the shared palette/font foundation for portals and auth.
 * Keep public layout, type, spacing, and component-role decisions here.
 */
export const websiteDesignSystem = {
  color: {
    brand: publicLightColors.green,
    brandHover: publicLightColors.greenDark,
    teal: publicLightColors.teal,
    navy: publicLightColors.navy,
    onBrand: publicLightColors.navy,
    white: publicLightColors.white,
    canvas: publicLightColors.surface,
    surface: '#FFFFFF',
    surfaceMuted: publicLightColors.surfaceAlt,
    text: publicLightColors.text,
    textSecondary: publicLightColors.textSecondary,
    textMuted: publicLightColors.textSecondary,
    border: publicLightColors.border,
    borderStrong: '#CBD5E1',
    success: '#26723D',
    successSurface: '#EAF6E8',
    warning: '#9A5B00',
    warningSurface: '#FFF5DF',
    error: '#B42318',
    errorSurface: '#FEF0EE',
    focus: '#0C6C79',
  },
  /** Semantic aliases retain the established palette while giving each role one purpose. */
  semanticColor: {
    brand: { green: publicLightColors.green, teal: publicLightColors.teal, navy: publicLightColors.navy },
    text: { primary: publicLightColors.text, secondary: publicLightColors.textSecondary, muted: publicLightColors.textSecondary, inverse: publicLightColors.white },
    surface: { white: publicLightColors.white, subtle: publicLightColors.surface, elevated: publicLightColors.white, dark: publicLightColors.navy },
    border: { subtle: publicLightColors.surfaceAlt, default: publicLightColors.border, strong: '#CBD5E1' },
    interactive: {
      primaryDefault: publicLightColors.green,
      primaryHover: publicLightColors.greenDark,
      primaryPressed: '#428238',
      primaryDisabled: '#CBD5E1',
      focusRing: publicLightColors.teal,
    },
    status: { success: '#26723D', warning: '#9A5B00', error: '#B42318', information: publicLightColors.teal },
  },
  font: publicFonts.body,
  fonts: { display: publicFonts.display, heading: publicFonts.heading, body: publicFonts.body, ui: publicFonts.body },
  type: {
    /** H1 is the primary page title; display is the larger editorial/hero variant. */
    display: { size: 64, tablet: 50, mobile: 40, weight: 700, lineHeight: 1.08, tracking: '-0.04em' },
    /** Section titles use H2. */
    h1: { size: 60, tablet: 50, mobile: 40, weight: 700, lineHeight: 1.08, tracking: '-0.035em' },
    h2: { size: 44, tablet: 38, mobile: 32, weight: 700, lineHeight: 1.12, tracking: '-0.03em' },
    h3: { size: 30, tablet: 27, mobile: 25, weight: 600, lineHeight: 1.2, tracking: '-0.02em' },
    h4: { size: 23, tablet: 21, mobile: 20, weight: 600, lineHeight: 1.2, tracking: '-0.01em' },
    bodyLarge: { size: 18, tablet: 18, mobile: 18, weight: 400, lineHeight: 1.6, tracking: '0' },
    body: { size: 16, tablet: 16, mobile: 16, weight: 400, lineHeight: 1.6, tracking: '0' },
    bodySmall: { size: 14, tablet: 14, mobile: 14, weight: 400, lineHeight: 1.55, tracking: '0' },
    caption: { size: 12, tablet: 12, mobile: 12, weight: 500, lineHeight: 1.45, tracking: '0' },
    eyebrow: { size: 12, tablet: 12, mobile: 12, weight: 700, lineHeight: 1.4, tracking: '0.1em' },
    button: { size: 14, tablet: 14, mobile: 14, weight: 600, lineHeight: 1.25, tracking: '0' },
  },
  typeLayout: {
    headingToParagraph: 16,
    sectionHeadingMax: 720,
    paragraphMax: 640,
    lightText: { heading: publicLightColors.navy, body: publicLightColors.text, secondary: publicLightColors.textSecondary },
    darkText: { heading: publicLightColors.white, body: publicLightColors.white, secondary: '#CBD5E1' },
  },
  space: [0, 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120] as const,
  /** `max` is the standard reading/card shell; `heroMax` is for immersive, full-width sections. */
  container: containerTokens,
  /** Legacy MUI spacing-unit aliases remain for existing consumers; new code should use `section`. */
  layoutCompatibility: {
    sectionMajor: { xs: 10, md: 17.5, lg: 20 },
    sectionMedium: { xs: 9, md: 12, lg: 15 },
    cardPadding: { xs: 3, md: 4 },
    navHeight: 72,
  },
  /** Legacy publicTypography helper values retained for existing page consumers. */
  compatibility: {
    publicTypography: {
      hero: { xs: '42px', sm: '56px', md: '64px', lg: '72px' },
      h2: { xs: '32px', md: '40px', lg: '48px' },
      h3: { xs: '22px', md: '24px' },
      body: { xs: '16px', md: '17px', lg: '18px' },
      bodyLg: { xs: '17px', md: '18px', lg: '20px' },
      caption: '13px',
      overline: '12px',
    },
  },
  grid: { mobile: 4, tablet: 8, desktop: 12, gapMobile: 16, gapTablet: 24, gapDesktop: 32 },
  section: {
    compact: { mobile: 40, tablet: 52, desktop: 64, contentMax: containerTokens.max, headingGap: 16, descriptionGap: 20, contentGap: 40 },
    regular: { mobile: 56, tablet: 72, desktop: 96, contentMax: containerTokens.max, headingGap: 16, descriptionGap: 20, contentGap: 48 },
    feature: { mobile: 64, tablet: 88, desktop: 120, contentMax: containerTokens.max, headingGap: 16, descriptionGap: 20, contentGap: 48 },
    dark: { mobile: 64, tablet: 80, desktop: 112, contentMax: containerTokens.max, headingGap: 16, descriptionGap: 20, contentGap: 48 },
    hero: { mobile: 80, tablet: 96, desktop: 120, contentMax: containerTokens.heroMax, headingGap: 16, descriptionGap: 32, contentGap: 48 },
  },
  sectionHierarchy: ['Eyebrow', 'Heading', 'Supporting copy', 'Main content', 'CTA if needed'] as const,
  radius: radiusTokens,
  shadow: {
    subtle: publicShadows.card,
    elevated: publicShadows.cardHover,
    float: publicShadows.float,
    nav: publicShadows.nav,
  },
  /** Public controls use explicit sizes; product/admin form tokens remain in formControl.ts. */
  control: controlTokens,
  /** Website buttons use 44px controls; marketing changes type/padding; product keeps 10px radius. */
  component: {
    text: {
      /** Component text roles preserve the active theme's existing metrics. */
      h5: { size: 18, weight: 600, lineHeight: 1.3 },
      h6: { size: 16, weight: 600, lineHeight: 1.35 },
      overline: { size: 12, weight: 600, letterSpacing: '0.08em' },
      cardTitle: { size: 18, mobile: 16, weight: 700, lineHeight: 1.3 },
    },
    button: buttonSizeTokens,
    field: fieldSizeTokens,
  },
  icon: { small: 16, standard: 20, large: 24, strokeWidth: 2, container: 44 },
  /** Exact min-widths behind the active MUI keys. `tablet/laptop/desktop` are semantic aliases. */
  breakpoint: {
    ...FOUNDATION_BREAKPOINT_VALUES,
    mobile: 0,
    mobileSmall: FOUNDATION_BREAKPOINT_VALUES.xs,
    mobileMedium: FOUNDATION_BREAKPOINT_VALUES.sm,
    mobileLarge: FOUNDATION_BREAKPOINT_VALUES.md,
    tablet: FOUNDATION_BREAKPOINT_VALUES.lg,
    tabletLandscape: FOUNDATION_BREAKPOINT_VALUES.xl,
    laptop: FOUNDATION_BREAKPOINT_VALUES.desktop,
    desktop: FOUNDATION_BREAKPOINT_VALUES.desktopMd,
  },
  image: {
    hero: '16 / 7', destination: '4 / 5', service: '16 / 10', editorial: '4 / 3', avatar: '1 / 1',
  },
} as const

/**
 * Section padding uses existing public behavior: base/mobile, tablet at 600px (`lg`),
 * and desktop at 1024px (`desktop`). Standard containers cap at 1280px; hero shells at 1760px.
 */
export const websiteSectionPadding = Object.fromEntries(
  (['compact', 'regular', 'feature', 'dark'] as const).map((variant) => [
    variant,
    {
      xs: `${websiteDesignSystem.section[variant].mobile}px`,
      lg: `${websiteDesignSystem.section[variant].tablet}px`,
      desktop: `${websiteDesignSystem.section[variant].desktop}px`,
    },
  ]),
) as Record<'compact' | 'regular' | 'feature' | 'dark', { xs: string; lg: string; desktop: string }>

/** CSS variables let existing MUI and future CSS components share the same source. */
export const websiteCssVariables = {
  '--glts-green': websiteDesignSystem.color.brand,
  '--glts-green-hover': websiteDesignSystem.color.brandHover,
  '--glts-green-pressed': websiteDesignSystem.semanticColor.interactive.primaryPressed,
  '--glts-primary-disabled': websiteDesignSystem.semanticColor.interactive.primaryDisabled,
  '--glts-teal': websiteDesignSystem.color.teal,
  '--glts-navy': websiteDesignSystem.color.navy,
  '--glts-on-brand': websiteDesignSystem.color.onBrand,
  '--glts-canvas': websiteDesignSystem.color.canvas,
  '--glts-surface': websiteDesignSystem.color.surface,
  '--glts-surface-muted': websiteDesignSystem.color.surfaceMuted,
  '--glts-text': websiteDesignSystem.color.text,
  '--glts-text-secondary': websiteDesignSystem.color.textSecondary,
  '--glts-text-muted': websiteDesignSystem.semanticColor.text.muted,
  '--glts-text-inverse': websiteDesignSystem.semanticColor.text.inverse,
  '--glts-border': websiteDesignSystem.color.border,
  '--glts-border-subtle': websiteDesignSystem.semanticColor.border.subtle,
  '--glts-border-strong': websiteDesignSystem.color.borderStrong,
  '--glts-focus': websiteDesignSystem.color.focus,
  '--glts-success': websiteDesignSystem.semanticColor.status.success,
  '--glts-warning': websiteDesignSystem.semanticColor.status.warning,
  '--glts-error': websiteDesignSystem.semanticColor.status.error,
  '--glts-info': websiteDesignSystem.semanticColor.status.information,
  '--glts-success-surface': websiteDesignSystem.color.successSurface,
  '--glts-warning-surface': websiteDesignSystem.color.warningSurface,
  '--glts-error-surface': websiteDesignSystem.color.errorSurface,
  '--glts-font': websiteDesignSystem.font,
  '--font-display': websiteDesignSystem.fonts.display,
  '--font-ui': websiteDesignSystem.fonts.ui,
  '--glts-container-max': `${websiteDesignSystem.container.max}px`,
  '--glts-container-hero-max': `${websiteDesignSystem.container.heroMax}px`,
  '--glts-gutter-mobile': `${websiteDesignSystem.container.gutterMobile}px`,
  '--glts-gutter-tablet': `${websiteDesignSystem.container.gutterTablet}px`,
  '--glts-gutter-desktop': `${websiteDesignSystem.container.gutterDesktop}px`,
  '--glts-radius-sm': `${websiteDesignSystem.radius.small}px`,
  '--glts-radius-md': `${websiteDesignSystem.radius.medium}px`,
  '--glts-radius-lg': `${websiteDesignSystem.radius.large}px`,
  '--glts-shadow-subtle': websiteDesignSystem.shadow.subtle,
  '--glts-shadow-elevated': websiteDesignSystem.shadow.elevated,
} as CSSProperties
