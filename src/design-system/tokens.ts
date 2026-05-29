import chroma from 'chroma-js';
import { publicLightColors } from '@/shared/theme/publicBrand';

// ─── Brand color ─────────────────────────────────────────────────────────────
// Locked to publicBrand; use publicBrand.ts as the source of truth for product UI.
export const BRAND_COLOR = publicLightColors.greenBright;

// ─── Color scale generation ───────────────────────────────────────────────────
type ColorScale = {
  50: string;  100: string; 200: string; 300: string; 400: string;
  500: string; 600: string; 700: string; 800: string; 900: string;
  950: string;
};

const SHADE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/**
 * Generates an 11-stop perceptual color scale in Lab space.
 * The base color is pinned exactly at the 500 stop.
 */
export function generateScale(baseColor: string): ColorScale {
  const light = chroma.mix(baseColor, '#ffffff', 0.95, 'lab').hex();
  const dark  = chroma.mix(baseColor, '#000000', 0.80, 'lab').hex();

  // base sits at domain position 0.5 → maps to index 5 of 11
  const raw = chroma
    .scale([light, baseColor, dark])
    .mode('lab')
    .domain([0, 0.5, 1])
    .colors(11);

  const scale = Object.fromEntries(
    SHADE_STOPS.map((stop, i) => [stop, raw[i]])
  ) as ColorScale;

  // Pin the exact brand hex at 500 (no Lab rounding drift)
  scale[500] = chroma(baseColor).hex();
  return scale;
}

/**
 * Neutral scale: desaturate the brand hue so greys still
 * feel on-brand without being chromatic.
 */
export function generateNeutralScale(baseColor: string): ColorScale {
  const neutral = chroma(baseColor).desaturate(3).hex();
  return generateScale(neutral);
}

// ─── Color scales ─────────────────────────────────────────────────────────────
const primaryScale  = generateScale(BRAND_COLOR);
const neutralScale  = generateNeutralScale(BRAND_COLOR);
const errorScale    = generateScale('#EF4444');
const successScale  = generateScale(BRAND_COLOR);
const warningScale  = generateScale('#F59E0B');
const infoScale     = generateScale('#3B82F6');

// ─── Responsive density (10 tiers = FOUNDATION_BREAKPOINT_MIN_WIDTHS order) ───

/** MUI `spacing(n)` multipliers per viewport tier */
export const RESPONSIVE_SPACING = {
  xs: [2, 2, 2, 2, 1, 1, 1, 1, 1, 1],
  sm: [4, 4, 4, 4, 3, 3, 3, 3, 2, 2],
  md: [8, 8, 8, 8, 7, 6, 6, 6, 6, 6],
  lg: [12, 12, 12, 12, 10, 10, 10, 10, 10, 10],
  xl: [16, 16, 16, 14, 12, 12, 12, 12, 12, 12],
  xxl: [20, 20, 20, 16, 14, 14, 14, 14, 14, 14],
} as const

/** Body / UI font sizes in px per viewport tier */
export const RESPONSIVE_FONT_SIZE = {
  xs: [11, 11, 11, 11, 10, 10, 10, 10, 9, 9],
  sm: [12, 12, 12, 12, 11, 11, 11, 11, 10, 10],
  base: [13, 13, 13, 13, 12, 12, 12, 12, 11, 11],
  lg: [14, 14, 14, 14, 13, 13, 13, 13, 12, 12],
  xl: [15, 15, 15, 15, 14, 13, 13, 13, 13, 12],
} as const

/** [vertical px, horizontal px] per tier — horizontal must be 2 × vertical */
export const RESPONSIVE_BUTTON_PADDING = {
  small: [
    [4, 8],
    [4, 8],
    [4, 8],
    [4, 8],
    [4, 8],
    [4, 8],
    [4, 8],
    [4, 8],
    [4, 8],
    [4, 8],
  ],
  medium: [
    [6, 12],
    [6, 12],
    [6, 12],
    [8, 16],
    [8, 16],
    [6, 12],
    [6, 12],
    [6, 12],
    [6, 12],
    [6, 12],
  ],
  large: [
    [8, 16],
    [8, 16],
    [8, 16],
    [10, 20],
    [10, 20],
    [8, 16],
    [8, 16],
    [8, 16],
    [8, 16],
    [8, 16],
  ],
} as const

/** Outlined input min-heights in px (matches FORM_CONTROL.heightMd) */
export const RESPONSIVE_INPUT_HEIGHT = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40] as const

/** Card inner padding in px */
export const RESPONSIVE_CARD_PADDING = [12, 12, 12, 10, 8, 8, 8, 8, 8, 8] as const

/** Subtle radii (px) — not breakpoint-dependent */
export const RESPONSIVE_BORDER_RADIUS = {
  xs: '2px',
  sm: '3px',
  md: '4px',
  lg: '6px',
} as const

/** Micro-elevation (not breakpoint-dependent) */
export const RESPONSIVE_SHADOWS = {
  xs: '0 1px 1px rgba(0,0,0,0.03)',
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 2px 4px rgba(0,0,0,0.06)',
  lg: '0 4px 8px rgba(0,0,0,0.08)',
} as const

// ─── Tokens ───────────────────────────────────────────────────────────────────
export const tokens = {
  color: {
    primary: primaryScale,
    neutral: neutralScale,
    error:   errorScale,
    success: successScale,
    warning: warningScale,
    info:    infoScale,
    white:   '#ffffff',
    black:   '#000000',
  },

  spacing: {
    0:  '0px',
    1:  '3px',
    2:  '6px',
    3:  '10px',
    4:  '14px',
    5:  '18px',
    6:  '20px',
    8:  '28px',
    10: '36px',
    12: '42px',
    16: '56px',
  },

  fontSize: {
    xs:   '11px',
    sm:   '13px',
    base: '14px',
    lg:   '15px',
    xl:   '17px',
    '2xl': '21px',
    '3xl': '27px',
    '4xl': '32px',
  },

  fontWeight: {
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },

  lineHeight: {
    tight:   1.25,
    normal:  1.5,
    relaxed: 1.75,
  },

  borderRadius: {
    none: '0px',
    xs:   RESPONSIVE_BORDER_RADIUS.xs,
    sm:   RESPONSIVE_BORDER_RADIUS.sm,
    md:   RESPONSIVE_BORDER_RADIUS.md,
    lg:   RESPONSIVE_BORDER_RADIUS.lg,
    xl:   RESPONSIVE_BORDER_RADIUS.lg,
    '2xl': RESPONSIVE_BORDER_RADIUS.lg,
    full: '9999px',
  },

  shadow: {
    none: 'none',
    xs:   RESPONSIVE_SHADOWS.xs,
    sm:   RESPONSIVE_SHADOWS.sm,
    md:   RESPONSIVE_SHADOWS.md,
    lg:   RESPONSIVE_SHADOWS.lg,
    xl:   RESPONSIVE_SHADOWS.lg,
  },

  zIndex: {
    base:     0,
    raised:   1,
    dropdown: 1000,
    sticky:   1100,
    modal:    1300,
    toast:    1400,
    tooltip:  1500,
  },

  transition: {
    fast:   '100ms ease',
    normal: '200ms ease',
    slow:   '300ms ease',
  },
} as const;

export type Tokens = typeof tokens;

// ─── Design system constants ──────────────────────────────────────────────────

export const BORDER_RADIUS = {
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const

export const BORDER_WIDTH = {
  thin: '1px',
  medium: '2px',
  thick: '3px',
} as const

export const SHADOWS = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const
