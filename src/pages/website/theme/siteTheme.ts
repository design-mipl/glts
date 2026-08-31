/**
 * Marketing-site design tokens — "Clearance".
 *
 * Thesis: a visa is a sequence of gates being cleared, so the site reads as a precision
 * instrument rather than a SaaS landing page. Light structural surfaces, hairline
 * construction instead of stacked cards, machine-readable mono for anything a machine
 * would read (references, counts, dates, durations), and exactly one luminous signal
 * colour that only ever means "act here".
 *
 * Scope and layering — this file deliberately does NOT define a third palette:
 *
 *   publicBrand.ts      shared brand truth (admin + customer + auth + website)
 *   applyFlowTheme.ts   the retail sub-brand: gold accent, ink ramp, hairlines, motion
 *   siteTheme.ts        ← this file: marketing-scale type, rhythm and motifs ON TOP
 *
 * Colour, ink, radius and easing are re-exported from `applyFlowTheme` unchanged. That is
 * the point: the discovery pages, the marketing pages and the apply flow have been three
 * different-looking products, and the locked V2 spec calls for one read across
 * browse → detail → apply. Anything visual added here is scale and motif only.
 */

import { applyFlow, applyFont, applyMotion, applyRadius, accentGoldRgb } from './applyFlowTheme'

export { applyFlow as site, applyFont as siteFont, applyMotion as siteMotion, applyRadius as siteRadius }

/**
 * Marketing type scale. Larger than the apply flow's — a landing page has to carry a
 * headline across a full viewport, where the flow only ever labels a step.
 *
 * Sizes are px objects for MUI breakpoints. Display is slab: it reads as an official
 * travel document rather than the geometric sans every visa startup uses.
 */
export const siteType = {
  /** Hero headline. The one place type is allowed to be loud. */
  hero: {
    fontFamily: applyFont.display,
    fontSize: { xs: 34, sm: 44, md: 54, lg: 60 },
    fontWeight: 700,
    letterSpacing: '-0.03em',
    lineHeight: 1.04,
    color: applyFlow.ink,
  },
  /** Section headline. */
  section: {
    fontFamily: applyFont.display,
    fontSize: { xs: 25, md: 33 },
    fontWeight: 700,
    letterSpacing: '-0.025em',
    lineHeight: 1.12,
    color: applyFlow.ink,
  },
  /** Card / block headline. */
  block: {
    fontFamily: applyFont.display,
    fontSize: { xs: 17, md: 19 },
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: applyFlow.ink,
  },
  /** Lead paragraph under a hero or section headline. */
  lead: {
    fontFamily: applyFont.body,
    fontSize: { xs: 15, md: 16.5 },
    fontWeight: 400,
    lineHeight: 1.55,
    color: applyFlow.inkMuted,
  },
  /** Body copy. */
  body: {
    fontFamily: applyFont.body,
    fontSize: 14,
    lineHeight: 1.6,
    color: applyFlow.inkMuted,
  },
} as const

/**
 * Machine-readable zone label — the site's structural signature.
 *
 * Tracked-out mono in the manner of a passport MRZ. Used for eyebrows, section indices,
 * data captions and counts. It is the device that makes the page read as an instrument,
 * so it appears often enough to be a system and never as decoration on its own.
 */
export const mrzSx = {
  fontFamily: applyFont.mono,
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: applyFlow.inkFaint,
  fontVariantNumeric: 'tabular-nums',
} as const

/** Numeric readout — stats, durations, prices. Always tabular so columns align. */
export const dataSx = {
  fontFamily: applyFont.mono,
  fontVariantNumeric: 'tabular-nums',
  color: applyFlow.ink,
} as const

/** Vertical rhythm for marketing sections. */
export const siteSpace = {
  sectionY: { xs: 8, md: 12 },
  blockGap: { xs: 5, md: 7 },
} as const

/**
 * Page ground: a fine technical grid that fades toward the bottom, plus one restrained
 * gold bloom. No full-bleed gradient wash and no stock photography — both were the
 * "generic SaaS" tells called out against the current homepage in the V2 spec.
 */
export const siteCanvasSx = {
  backgroundColor: applyFlow.canvas,
  backgroundImage: [
    `radial-gradient(ellipse 60% 50% at 82% 0%, rgba(${accentGoldRgb}, 0.13), transparent 62%)`,
    `linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)`,
  ].join(', '),
  backgroundSize: 'auto, 48px 48px, 48px 48px',
  backgroundPosition: 'center, top left, top left',
  backgroundRepeat: 'no-repeat, repeat, repeat',
} as const

/**
 * Signature motif: the clipped travel-document corner, at marketing scale.
 * Mirrors the apply flow's flow-card cut so the two surfaces are visibly the same family.
 */
export function clippedCorner(notchPx = 20) {
  return `polygon(0 0, calc(100% - ${notchPx}px) 0, 100% ${notchPx}px, 100% 100%, 0 100%)`
}

/**
 * Deliberately no page-load reveal helper.
 *
 * An earlier pass staggered the hero in on mount. Two things were wrong with it. First,
 * the frequency gate: the homepage is the most-seen screen on the site, and an entrance
 * animation on the primary headline is decoration — it delays the one thing the visitor
 * came for and is the kind of scattered motion that reads as machine-generated. Second,
 * any such helper has to hold elements at `opacity: 0` to stage them, which makes the
 * page's core content contingent on an animation actually running.
 *
 * Motion on this site is reserved for response to input — hover, press, the console's
 * arrow nudge — and for genuinely rare states. If a scroll-triggered reveal is ever
 * wanted, drive it from `IntersectionObserver` with the visible state as the default.
 */

