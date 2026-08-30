/**
 * Retail apply-flow design tokens — extracted from
 * `public/GLTS Retail Visa Prototype (Light, Standalone).html`.
 *
 * Scoped to public-website retail apply (not global publicBrand).
 * Prototype accent green is #0FA968 (not logo #73C064).
 */

/** RGB for prototype accent green — use in `rgba(${retailGreenRgb}, α)`. */
export const retailGreenRgb = '15, 169, 104' as const

export const retailFlowColors = {
  /** Page canvas */
  canvas: '#F4F6F8',
  /** Primary text / ink */
  ink: '#12151A',
  /** Secondary body */
  muted: '#525B66',
  /** Tertiary / idle phase */
  subtle: '#727B86',
  /** Placeholder / soft secondary */
  faint: '#A0A8B2',
  /** Soft description */
  soft: '#8A93A0',
  /** Accent green */
  green: '#0FA968',
  /** Glow companion */
  greenGlow: 'rgba(94, 242, 166, 0.7)',
  white: '#FFFFFF',
  /** Disabled CTA */
  disabled: '#B7BEC7',
  /** Warning chip text */
  warningInk: '#92600E',

  border: 'rgba(15, 23, 42, 0.1)',
  borderSoft: 'rgba(15, 23, 42, 0.06)',
  borderMid: 'rgba(15, 23, 42, 0.16)',
  borderFooter: 'rgba(15, 23, 42, 0.09)',

  optionBorder: 'rgba(15, 23, 42, 0.1)',
  optionBorderSelected: `rgba(${retailGreenRgb}, 0.5)`,
  optionBg: '#FFFFFF',
  optionBgSelected: `rgba(${retailGreenRgb}, 0.06)`,

  greenMuted: `rgba(${retailGreenRgb}, 0.08)`,
  greenMutedStrong: `rgba(${retailGreenRgb}, 0.12)`,
  greenBorder: `rgba(${retailGreenRgb}, 0.4)`,
  greenBorderSoft: `rgba(${retailGreenRgb}, 0.25)`,
  greenBorderHairline: `rgba(${retailGreenRgb}, 0.15)`,
  greenTint: `rgba(${retailGreenRgb}, 0.1)`,
  selection: `rgba(${retailGreenRgb}, 0.25)`,
} as const

export const retailFlowFonts = {
  body: `'Inter', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  mono: `'JetBrains Mono', ui-monospace, monospace`,
} as const

export const retailFlowLayout = {
  /** Flow card max width (prototype 640; slightly wider for multi-traveller grids). */
  shellMaxWidth: 720,
  /** Outer page max width including side panel. */
  pageMaxWidth: 1180,
  pagePaddingX: 20,
  pagePaddingY: 42,
  cardRadius: '12px',
  panelRadius: '10px',
  controlRadius: '8px',
  checkRadius: '4px',
  iconRadius: '7px',
  phaseTrackRadius: '8px',
  phasePillRadius: '6px',
  chipRadius: '4px',
  contentPadding: '28px',
  footerPaddingX: '28px',
  footerPaddingY: '16px',
  phaseNavPaddingX: '24px',
  optionPaddingY: '14px',
  optionPaddingX: '16px',
  optionGap: '10px',
  gridSizePx: 48,
} as const

export const retailFlowShadows = {
  /** Floating flow card on canvas. */
  shell: `0 0 0 1px rgba(${retailGreenRgb}, 0.03), 0 20px 60px rgba(0, 0, 0, 0.18)`,
  /** Elevated white/light surface — apply-flow cards, panels, steppers. */
  elevated: '0 1px 2px rgba(15,27,43,0.04), 0 8px 24px -4px rgba(15,27,43,0.10)',
  /** Logo gem glow. */
  gem: `0 0 8px ${retailFlowColors.greenGlow}`,
  scan: `0 0 12px ${retailFlowColors.green}`,
} as const

/** Soft border + elevated shadow for white/light cards (global apply-flow treatment). */
export function getElevatedCardSx(borderColor = 'rgba(15, 23, 42, 0.06)') {
  return {
    border: `1px solid ${borderColor}`,
    boxShadow: retailFlowShadows.elevated,
  } as const
}

export const retailFlowType = {
  stepTitle: {
    fontSize: 21,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1.25,
  },
  stepHelper: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
  },
  optionLabel: {
    fontSize: 14.5,
    fontWeight: 600,
  },
  optionMeta: {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.6,
  },
  phase: {
    fontFamily: retailFlowFonts.mono,
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: '0.3px',
  },
  sectionLabel: {
    fontFamily: retailFlowFonts.mono,
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: '0.6px',
  },
  eyebrow: {
    fontFamily: retailFlowFonts.mono,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '2px',
  },
  brandMark: {
    fontFamily: retailFlowFonts.mono,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  cta: {
    fontSize: 14.5,
    fontWeight: 700,
  },
  back: {
    fontSize: 13.5,
    fontWeight: 700,
  },
  chip: {
    fontFamily: retailFlowFonts.mono,
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
} as const

/** Canvas background — soft green radials + 48px graph paper. */
export const retailFlowCanvasBackground = {
  bgcolor: retailFlowColors.canvas,
  backgroundImage: [
    `radial-gradient(circle at 20% 0%, rgba(${retailGreenRgb}, 0.06), transparent 45%)`,
    `radial-gradient(circle at 100% 30%, rgba(${retailGreenRgb}, 0.04), transparent 40%)`,
    `repeating-linear-gradient(0deg, rgba(15, 23, 42, 0.035) 0 1px, transparent 1px ${retailFlowLayout.gridSizePx}px)`,
    `repeating-linear-gradient(90deg, rgba(15, 23, 42, 0.035) 0 1px, transparent 1px ${retailFlowLayout.gridSizePx}px)`,
  ].join(', '),
} as const

/** Soft brand wash for traveller / sponsor / docs cards — green top-right, navy bottom-left. */
export const retailProfileCardGradient = [
  'radial-gradient(ellipse 90% 70% at 100% 0%, rgba(115, 192, 100, 0.14), transparent 58%)',
  'radial-gradient(ellipse 90% 70% at 0% 100%, rgba(0, 31, 63, 0.07), transparent 58%)',
].join(', ')

/** Strong ease-out for entrances/interactions — starts fast, feels responsive. */
export const retailFlowEaseOut = 'cubic-bezier(0.23, 1, 0.32, 1)'
/** Strong ease-in-out for on-screen movement (sliding highlights, morphing). */
export const retailFlowEaseInOut = 'cubic-bezier(0.77, 0, 0.175, 1)'

export const retailFlowMotion = {
  fade: 'gltsFade 0.28s ease',
  keyframes: {
    gltsFade: {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  },
} as const

/**
 * Press feedback for any clickable surface (buttons, cards, toggles).
 * Spread onto an `sx` prop — layers on top of existing styles.
 */
export function getPressableSx(scale = 0.97) {
  return {
    transition: `transform 160ms ${retailFlowEaseOut}`,
    '&:active': { transform: `scale(${scale})` },
  } as const
}

/** Per-item stagger delay for list/grid entrances — keep short (30-80ms). */
export function getStaggerDelayMs(index: number, stepMs = 45, maxMs = 320) {
  return Math.min(index * stepMs, maxMs)
}
