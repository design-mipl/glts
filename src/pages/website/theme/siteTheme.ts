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
 *
 * Cell size and contrast are deliberately low: 32px at ~2.6% reads as paper texture at a
 * glance and only resolves into a grid when looked for. The earlier 48px at 4% was legible
 * as a grid from across the room, which made it a pattern competing with the content
 * rather than a ground sitting behind it. Keep both canvases on the same cell size — two
 * different grid pitches on one page is visible even when neither is.
 */
export const siteCanvasSx = {
  backgroundColor: applyFlow.canvas,
  backgroundImage: [
    `radial-gradient(ellipse 60% 50% at 82% 0%, rgba(${accentGoldRgb}, 0.13), transparent 62%)`,
    `linear-gradient(rgba(15, 23, 42, 0.026) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(15, 23, 42, 0.026) 1px, transparent 1px)`,
  ].join(', '),
  backgroundSize: 'auto, 32px 32px, 32px 32px',
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


/* ------------------------------------------------------------------------------------ *
 * Ink bands
 *
 * The landing page alternates between the light "Clearance" ground above and a deep
 * inverted band. That band is NOT a new palette: it is the apply flow's navigation rail
 * (`railBg`) promoted to section scale, so the marketing page, the discovery pages and
 * the flow's rail all read as one product. It also buys back the one thing the light
 * ground cannot give: on this ground the accent gold is ~9:1 and is finally allowed to
 * be *text* rather than only a fill.
 *
 * The contrast ramp is the rail's, unchanged and deliberate — `textFaint` is the floor
 * for anything carrying words (~5.4:1). De-emphasis below that comes from weight, never
 * from dropping alpha.
 * ------------------------------------------------------------------------------------ */

export const siteInk = {
  bg: applyFlow.railBg,
  bgTop: applyFlow.railBgTop,
  /** Headlines. ~15.8:1. */
  text: applyFlow.railText,
  /** Body and lead copy. ~8:1. */
  textMuted: applyFlow.railTextMuted,
  /** Eyebrows and captions. ~5.4:1 — the floor for text on this ground. */
  textFaint: applyFlow.railTextFaint,
  hairline: applyFlow.railLine,
  /** Interactive boundaries — needs 3:1 as a UI component edge. */
  hairlineStrong: applyFlow.railLineStrong,
  /** Gold as text is legal here, and only here. */
  accent: applyFlow.accent,
  /** Raised card inside an ink band. */
  surface: 'rgba(255, 255, 255, 0.045)',
  surfaceHover: 'rgba(255, 255, 255, 0.075)',
} as const

/** Ink-band ground: the same technical grid as the light canvas, inverted, one gold bloom. */
export const siteInkCanvasSx = {
  backgroundColor: siteInk.bg,
  backgroundImage: [
    `radial-gradient(ellipse 60% 50% at 82% 0%, rgba(${accentGoldRgb}, 0.10), transparent 62%)`,
    `linear-gradient(180deg, ${siteInk.bgTop}, transparent 40%)`,
    `linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px)`,
    `linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px)`,
  ].join(', '),
  backgroundSize: 'auto, auto, 32px 32px, 32px 32px',
  backgroundPosition: 'center, top center, top left, top left',
  backgroundRepeat: 'no-repeat, no-repeat, repeat, repeat',
} as const

/** Marketing type scale recoloured for an ink band. Same sizes — colour is the only change. */
export const siteInkType = {
  hero: { ...siteType.hero, color: siteInk.text },
  section: { ...siteType.section, color: siteInk.text },
  block: { ...siteType.block, color: siteInk.text },
  lead: { ...siteType.lead, color: siteInk.textMuted },
  body: { ...siteType.body, color: siteInk.textMuted },
} as const

/** MRZ eyebrow on an ink band. */
export const mrzInkSx = { ...mrzSx, color: siteInk.textFaint } as const

/** Numeric readout on an ink band. */
export const dataInkSx = { ...dataSx, color: siteInk.text } as const

/* ------------------------------------------------------------------------------------ *
 * Brand green on the marketing surface
 *
 * The site had drifted to navy + white + grey + one small gold accent — measured at 0.31%
 * of the homepage's area carrying any saturated colour, with the brand primary appearing
 * exactly once. That is not restraint, it is absence, and it is why the page reads cool
 * and flat regardless of how much photography sits on it.
 *
 * Green returns as a real second colour here. It does NOT contradict the locked spec: the
 * "green demotes to semantic-only" rule is scoped to the retail apply flow, where gold is
 * the sub-brand accent. The marketing site was never required to be green-free.
 *
 * The division of labour is what keeps this from muddying the interface:
 *
 *   gold   = action. CTAs, the one thing to press. Unchanged, and still scarce.
 *   green  = brand and progress. Section marks, icon treatments, readiness, verification.
 *
 * Contrast, since raw `#73C064` is ~2.1:1 on white and unusable as text there:
 *   - `brand` is a FILL and an icon-on-tint colour, never a label on white.
 *   - `brandText` is the darkened green for text/strokes on light — ~6.4:1 on white.
 *   - On the ink ground `#73C064` is ~8:1 and may be used as text directly.
 * ------------------------------------------------------------------------------------ */

/** RGB components for brand green (`#73C064`) — for `rgba(${brandGreenRgb}, α)`. */
export const brandGreenRgb = '115, 192, 100' as const

export const siteBrand = {
  /** Brand green as a fill or a tint. */
  green: '#73C064',
  /** Hover / pressed state of a green fill. */
  greenStrong: '#5A9A4E',
  /** Green as TEXT or a thin stroke on a light surface. ~6.4:1 on white. */
  greenInk: '#2E6B27',
  /** Label on a green fill. */
  onGreen: '#0B2208',
  greenSoft: `rgba(${brandGreenRgb}, 0.14)`,
  greenBorder: `rgba(${brandGreenRgb}, 0.45)`,
} as const

/* ------------------------------------------------------------------------------------ *
 * Tone resolution
 *
 * The landing page groups its sections into alternating light and ink bands, and the
 * grouping is expected to change as the page's story changes. If each section hardcodes
 * `site.surface` / `siteType`, moving one section into an ink band means rewriting it —
 * which is how a page ends up with sections that can only live in one place.
 *
 * So a section asks for the tokens of whatever band it is currently in, and every
 * light/dark decision is made once, here. Note what is NOT symmetrical:
 *
 *   - `accentText` differs by ground. Gold is ~1.6:1 on light, so on a light band this
 *     resolves to `accentInk`; on ink it is the raw accent at ~9:1. This is the single
 *     rule most likely to be broken by hand, which is the main reason this exists.
 *   - `success` lightens on ink. `#0FA968` is only ~3:1 on the rail ground.
 * ------------------------------------------------------------------------------------ */

export type SiteTone = 'surface' | 'canvas' | 'ink'

export interface SiteToneTokens {
  tone: SiteTone
  isInk: boolean
  /** Type scale, already coloured for the ground. */
  type: typeof siteType
  /** MRZ eyebrow. */
  mrz: typeof mrzSx
  /** Numeric readout. */
  data: typeof dataSx
  text: string
  textMuted: string
  textFaint: string
  /** Card / raised surface sitting on this ground. */
  surface: string
  /** Hover or nested-panel step above `surface`. */
  surfaceRaised: string
  hairline: string
  hairlineSoft: string
  hairlineStrong: string
  /** Accent as a FILL. Same on both grounds. */
  accent: string
  accentStrong: string
  /** Accent as TEXT or a thin stroke — differs by ground. Never use `accent` for this. */
  accentText: string
  accentSoft: string
  accentBorder: string
  /** Semantic success, contrast-corrected for the ground. */
  success: string
  /** Brand green as a FILL / tint. Never a label on a light ground. */
  brand: string
  brandStrong: string
  /** Brand green as TEXT or a thin stroke — differs by ground, like `accentText`. */
  brandText: string
  brandSoft: string
  brandBorder: string
  /** The ground itself, for a section that paints its own. */
  ground: object
}

const LIGHT_TONE_TOKENS = {
  isInk: false,
  type: siteType,
  mrz: mrzSx,
  data: dataSx,
  text: applyFlow.ink,
  textMuted: applyFlow.inkMuted,
  textFaint: applyFlow.inkFaint,
  hairline: applyFlow.hairline,
  hairlineSoft: applyFlow.hairlineSoft,
  hairlineStrong: applyFlow.hairlineStrong,
  accent: applyFlow.accent,
  accentStrong: applyFlow.accentStrong,
  accentText: applyFlow.accentInk,
  accentSoft: applyFlow.accentSoft,
  accentBorder: applyFlow.accentBorder,
  success: applyFlow.success,
  brand: siteBrand.green,
  brandStrong: siteBrand.greenStrong,
  /** Darkened — raw green is ~2.1:1 on white. */
  brandText: siteBrand.greenInk,
  brandSoft: siteBrand.greenSoft,
  brandBorder: siteBrand.greenBorder,
} as const

const INK_TONE_TOKENS = {
  tone: 'ink',
  isInk: true,
  type: siteInkType,
  mrz: mrzInkSx,
  data: dataInkSx,
  text: siteInk.text,
  textMuted: siteInk.textMuted,
  textFaint: siteInk.textFaint,
  surface: siteInk.surface,
  surfaceRaised: siteInk.surfaceHover,
  hairline: siteInk.hairline,
  hairlineSoft: 'rgba(255, 255, 255, 0.055)',
  hairlineStrong: siteInk.hairlineStrong,
  accent: applyFlow.accent,
  accentStrong: applyFlow.accentStrong,
  /** Legible as text here — this is the payoff of the ink band. */
  accentText: applyFlow.accent,
  accentSoft: `rgba(${accentGoldRgb}, 0.14)`,
  accentBorder: `rgba(${accentGoldRgb}, 0.5)`,
  /** `#0FA968` is ~3:1 on the rail ground; this is ~7:1. */
  success: '#3FD69B',
  brand: siteBrand.green,
  brandStrong: siteBrand.greenStrong,
  /** ~8:1 on the ink ground — green gets to be text here, same as gold does. */
  brandText: siteBrand.green,
  brandSoft: `rgba(${brandGreenRgb}, 0.16)`,
  brandBorder: `rgba(${brandGreenRgb}, 0.5)`,
  ground: siteInkCanvasSx,
} as const

export function siteTokensFor(tone: SiteTone): SiteToneTokens {
  if (tone === 'ink') return INK_TONE_TOKENS as unknown as SiteToneTokens

  return {
    ...LIGHT_TONE_TOKENS,
    tone,
    /** On the grey canvas a card lifts by going white; on white it lifts by going grey. */
    surface: tone === 'canvas' ? applyFlow.surface : applyFlow.surface,
    surfaceRaised: tone === 'canvas' ? applyFlow.surface : applyFlow.canvas,
    ground: { backgroundColor: tone === 'canvas' ? applyFlow.canvas : applyFlow.surface },
  } as SiteToneTokens
}
