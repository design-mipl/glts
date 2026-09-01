/**
 * Apply-flow accent system — public website retail visa application only.
 *
 * Scope: this file is owned by `src/pages/website/`. It deliberately does NOT modify
 * `@/shared/theme/publicBrand`, which is also consumed by admin, customer, and auth.
 *
 * Direction (supersedes the earlier "gold appears once per card" rule for the apply flow —
 * see docs/GLTS-V2-Screen-Inventory.md): the retail application is the "Greenlight Visa
 * Solutions" sub-brand, so **gold is the primary interactive accent** here — CTAs, active and
 * selected states, focus rings, progress. Green demotes to a purely semantic signal
 * (verified / complete / passed). Teal remains the discovery-page accent and is not used here.
 *
 * Contrast discipline — the reason this file exists rather than a find-and-replace:
 * `#FEC107` on white is ~1.6:1 and is never legible as text or as a thin icon stroke.
 *   - `accent` is a **fill**; text on it is `onAccent` (ink) at ~11:1.
 *   - `accentInk` is the darkened gold used when gold must be *text* on a light surface (~5.6:1).
 *   - On dark navy, `accent` may be used as text directly (~9:1).
 */

/** RGB components for accent gold (`#FEC107`) — for `rgba(${accentGoldRgb}, α)`. */
export const accentGoldRgb = '254, 193, 7' as const

/** RGB components for semantic success green (`#0FA968`). */
export const successGreenRgb = '15, 169, 104' as const

export const applyFlow = {
  /** Primary interactive accent. A FILL — never text on light, never a 1px icon stroke. */
  accent: '#FEC107',
  /** Hover / pressed state of an accent fill. */
  accentStrong: '#E5AC00',
  /** Gold as *text* or as an icon stroke on a light surface. ~5.6:1 on white. */
  accentInk: '#8A6500',
  /** Label on an accent fill. ~11:1 on `accent`. */
  onAccent: '#12151A',
  /** Selected-row / active-tint background. */
  accentSoft: `rgba(${accentGoldRgb}, 0.13)`,
  /** Border of a selected control. */
  accentBorder: `rgba(${accentGoldRgb}, 0.55)`,
  /** Focus ring — 3px outer glow on an accent border. */
  accentRing: `rgba(${accentGoldRgb}, 0.32)`,
  /** Unfilled portion of a progress track. */
  accentTrack: 'rgba(15, 23, 42, 0.08)',

  /** Semantic only: verified, complete, passed. Never a CTA, never a selection state. */
  success: '#0FA968',
  successSoft: `rgba(${successGreenRgb}, 0.10)`,
  successBorder: `rgba(${successGreenRgb}, 0.38)`,

  /** Attention / needs-fixing. */
  warning: '#B45309',
  warningSoft: 'rgba(180, 83, 9, 0.10)',
  critical: '#B42318',
  criticalSoft: 'rgba(180, 35, 24, 0.08)',

  /** Structural navy — spine, headers, inverted surfaces. */
  navy: '#001F3F',
  navyMid: '#0A2540',

  ink: '#12151A',
  inkMuted: '#525B66',
  /**
   * Quietest tone still allowed to carry text. ~4.65:1 on white.
   * Was `#8A93A0` (3.11:1) — that failed on every eyebrow and footer caption.
   * Anything lighter than this is decoration only, never a label.
   */
  inkFaint: '#6B7480',
  /** Non-text only — disabled fills, empty track segments. Never a label. */
  inkDisabled: '#B7BEC7',

  surface: '#FFFFFF',
  canvas: '#EDF0F4',
  hairline: 'rgba(15, 23, 42, 0.09)',
  hairlineSoft: 'rgba(15, 23, 42, 0.055)',
  hairlineStrong: 'rgba(15, 23, 42, 0.16)',

  /**
   * Rail — the navigation column inside the flow panel. Deep navy rather than a tint,
   * so the panel reads as one instrument with two zones instead of two stacked cards.
   * Gold on this ground is ~9:1, which is where the accent finally gets to be loud.
   */
  railBg: '#08182B',
  railBgTop: '#0C2138',
  railLine: 'rgba(255, 255, 255, 0.09)',
  /** Borders of interactive nodes — needs 3:1 as a UI component boundary. */
  railLineStrong: 'rgba(255, 255, 255, 0.32)',
  /** Active label. ~15.8:1 on `railBg`. */
  railText: 'rgba(255, 255, 255, 0.94)',
  /** Completed labels / secondary context. ~8:1. */
  railTextMuted: 'rgba(255, 255, 255, 0.68)',
  /**
   * Upcoming labels and eyebrows. ~5.4:1 — deliberately NOT lower.
   * De-emphasis here comes from font weight and the gold node, never from dropping text
   * below the 4.5:1 floor; an earlier pass used 0.26 alpha (2.32:1) and was unreadable.
   */
  railTextFaint: 'rgba(255, 255, 255, 0.52)',
} as const

/**
 * Type roles. Roboto Slab / Roboto / Roboto Mono are the three faces actually loaded in
 * `index.html` — the previous `Inter` + `JetBrains Mono` tokens were silently falling back
 * to system fonts. This applies the pairing locked in the V2 spec.
 */
export const applyFont = {
  /** Step titles and headline figures. Slab reads as "official travel document", not SaaS. */
  display: '"Roboto Slab", Georgia, serif',
  body: '"Roboto", system-ui, sans-serif',
  /** Step counters, phase labels, prices, dates, reference codes. Always `tabular-nums`. */
  mono: '"Roboto Mono", ui-monospace, monospace',
} as const

/** Data/numeric readout — pair with `applyFont.mono` everywhere a figure is shown. */
export const tabularNums = { fontVariantNumeric: 'tabular-nums' } as const

export const applyMotion = {
  /** Entrances/exits — strong ease-out. Built-in CSS easings are too weak. */
  easeOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
  /** On-screen movement / morphing (progress fill, sliding indicators). */
  easeInOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
  pressMs: 140,
  stepMs: 220,
  revealMs: 300,
} as const

export const applyRadius = {
  /** Flow card. Tight — precise instrument, not a soft pill. */
  card: '10px',
  control: '8px',
  chip: '4px',
  full: '999px',
} as const

/**
 * Signature motif: the flow card is cut at the top-right like a clipped travel document
 * corner, instead of a uniform border-radius on all four corners.
 */
export function getClippedCardClipPath(notchPx = 18) {
  return `polygon(0 0, calc(100% - ${notchPx}px) 0, 100% ${notchPx}px, 100% 100%, 0 100%)`
}

/** Press feedback for any clickable surface. Subtle — 0.97 or higher. */
export function getPressSx(scale = 0.97, extraTransition?: string) {
  const pressTransition = `transform ${applyMotion.pressMs}ms ${applyMotion.easeOut}`
  return {
    transition: extraTransition ? `${extraTransition}, ${pressTransition}` : pressTransition,
    '&:active': { transform: `scale(${scale})` },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  } as const
}

/** Keyboard focus ring. Gold, and always paired with a visible border-color change. */
export const focusRingSx = {
  '&:focus-visible': {
    outline: 'none',
    borderColor: applyFlow.accent,
    boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
  },
} as const

/** Apply-flow button padding — horizontal = 2 × vertical (MUI spacing units). */
export const applyFlowButtonPadding = {
  sm: { px: 1.5, py: 0.75 },
  md: { px: 2, py: 1 },
  lg: { px: 4, py: 2 },
  xl: { px: 5, py: 2.5 },
} as const

/** Primary CTA — gold fill, ink label. The single loudest element on any step. */
export function getAccentButtonSx() {
  return {
    ...applyFlowButtonPadding.md,
    backgroundColor: applyFlow.accent,
    color: applyFlow.onAccent,
    fontFamily: applyFont.body,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    textTransform: 'none' as const,
    borderRadius: applyRadius.control,
    boxShadow: 'none',
    transition: `background-color 150ms ${applyMotion.easeOut}, transform ${applyMotion.pressMs}ms ${applyMotion.easeOut}`,
    '&:hover': { backgroundColor: applyFlow.accentStrong, boxShadow: 'none' },
    '&:active': { transform: 'scale(0.97)' },
    '&.Mui-disabled': {
      backgroundColor: 'rgba(15, 23, 42, 0.07)',
      color: applyFlow.inkDisabled,
    },
    ...focusRingSx,
    '@media (prefers-reduced-motion: reduce)': { transition: 'background-color 150ms linear' },
  }
}

/** Secondary / Back — quiet, hairline, no fill competing with the gold CTA. */
export function getQuietButtonSx() {
  return {
    ...applyFlowButtonPadding.md,
    color: applyFlow.inkMuted,
    fontFamily: applyFont.body,
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none' as const,
    borderRadius: applyRadius.control,
    border: `1px solid ${applyFlow.hairline}`,
    backgroundColor: 'transparent',
    transition: `border-color 150ms ${applyMotion.easeOut}, color 150ms ${applyMotion.easeOut}, transform ${applyMotion.pressMs}ms ${applyMotion.easeOut}`,
    '&:hover': {
      backgroundColor: 'transparent',
      borderColor: applyFlow.hairlineStrong,
      color: applyFlow.ink,
    },
    '&:active': { transform: 'scale(0.97)' },
    ...focusRingSx,
  }
}

/**
 * Selectable surface (option rows, method cards, traveller tabs).
 * Selected = gold hairline + soft gold wash + a gold spine on the leading edge.
 * The spine is what makes selection readable without a heavy filled background.
 */
export function getSelectableSx(selected: boolean) {
  return {
    position: 'relative' as const,
    borderRadius: applyRadius.control,
    border: `1px solid ${selected ? applyFlow.accentBorder : applyFlow.hairline}`,
    backgroundColor: selected ? applyFlow.accentSoft : applyFlow.surface,
    cursor: 'pointer',
    transition: `border-color 160ms ${applyMotion.easeOut}, background-color 160ms ${applyMotion.easeOut}, transform ${applyMotion.pressMs}ms ${applyMotion.easeOut}`,
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '2px',
      borderRadius: `${applyRadius.control} 0 0 ${applyRadius.control}`,
      backgroundColor: applyFlow.accent,
      transform: selected ? 'scaleY(1)' : 'scaleY(0)',
      transformOrigin: 'center',
      transition: `transform 200ms ${applyMotion.easeOut}`,
    },
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover': { borderColor: selected ? applyFlow.accentBorder : applyFlow.hairlineStrong },
    },
    '&:active': { transform: 'scale(0.985)' },
    ...focusRingSx,
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'border-color 160ms linear, background-color 160ms linear',
      '&::before': { transition: 'none' },
    },
  }
}

/** Eyebrow / section label — mono, tracked out, quiet. Structure without a box. */
export const eyebrowSx = {
  fontFamily: applyFont.mono,
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: applyFlow.inkFaint,
  ...tabularNums,
} as const

/**
 * Canvas behind the flow card: a fine technical grid that fades out toward the bottom,
 * plus one restrained gold bloom top-right. No full-bleed gradient wash.
 */
export const applyCanvasSx = {
  backgroundColor: applyFlow.canvas,
  backgroundImage: [
    `radial-gradient(ellipse 70% 50% at 88% 0%, rgba(${accentGoldRgb}, 0.10), transparent 60%)`,
    `linear-gradient(rgba(15, 23, 42, 0.045) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(15, 23, 42, 0.045) 1px, transparent 1px)`,
  ].join(', '),
  backgroundSize: 'auto, 44px 44px, 44px 44px',
  backgroundPosition: 'center, top left, top left',
  backgroundRepeat: 'no-repeat, repeat, repeat',
} as const
