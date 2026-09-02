/**
 * "Paper" — the human-trust surface system for the public website.
 *
 * Why this exists alongside `siteTheme.ts` rather than replacing it:
 *
 * `siteTheme` implements the "Clearance" thesis — the site as a precision instrument:
 * MRZ tracked-mono on every eyebrow, hairline construction, a deep ink band alternating
 * with a cool slate canvas, live counters. That thesis is well built and deliberately
 * cold, which is precisely the problem it now has to answer for. A visa company is asking
 * a stranger to hand over their passport; the feeling that has to come off the page is
 * *this is a real firm, run by real people, and my documents are safe with them* — not
 * *this is a well-engineered console*.
 *
 * So Paper keeps the structural discipline (hairlines over shadows, tabular figures,
 * generous rhythm) and changes what the surface is made of:
 *
 *   1. WARM NEUTRALS, NOT SLATE. Every ground, hairline and ink here carries a small
 *      amount of yellow-red. The old ramp was Tailwind slate (`#EDF0F4`, `#0F172A`) —
 *      a blue-grey that reads clinical no matter what sits on it. The shift is small in
 *      hex and large in feel.
 *
 *   2. THE APPLY FLOW'S ACCENT. Gold (`#FEC107`) is the interactive colour here, as it is
 *      in the retail apply flow and on the discovery pages, so the whole retail journey
 *      reads as one product. Green demotes to semantic-only — verified, complete, passed.
 *      Only the neutrals are this file's own invention.
 *
 *   3. LIGHT ONLY. No ink band. Separation between sections comes from four steps of
 *      warm paper plus a hairline, never from inverting the ground.
 *
 * Contrast is stated per token and was checked against the ground each token sits on.
 * Nothing below 4.5:1 is allowed to carry words.
 */

/* ------------------------------------------------------------------------------------ *
 * Grounds — four steps of warm paper
 *
 * The steps are close together on purpose. A section boundary should be *felt* as a
 * change of weight rather than *seen* as a stripe; the hairline does the actual dividing.
 * Consecutive sections step by one, never two, so the page reads as one sheet of paper
 * with folds rather than as a stack of separate cards.
 * ------------------------------------------------------------------------------------ */

export const paper = {
  /** Cards and raised surfaces on any ground. Pure white is the only non-warm value here — it is what makes the warm grounds read as warm. */
  white: '#FFFFFF',
  /** Default page ground. Warm enough to be non-clinical, light enough to feel clean. */
  base: '#FAF9F6',
  /** One step down. Alternating band. */
  canvas: '#F4F2ED',
  /** Two steps down. Reserved for the footer and one deliberate emphasis band. */
  deep: '#EBE7DF',

  /** Structural rule. ~1.9:1 on `base` — a boundary, not a line you read. */
  hairline: 'rgba(38, 33, 24, 0.11)',
  /** Internal divisions inside a single component. */
  hairlineSoft: 'rgba(38, 33, 24, 0.06)',
  /** Interactive component edges — 3:1 minimum as a UI boundary. */
  hairlineStrong: 'rgba(38, 33, 24, 0.22)',
} as const

/* ------------------------------------------------------------------------------------ *
 * Ink — warm, and never below the text floor
 * ------------------------------------------------------------------------------------ */

export const ink = {
  /** Headlines and primary text. ~15.6:1 on `base`. */
  strong: '#1C1A16',
  /** Body and lead copy. ~7.4:1 on `base`. */
  muted: '#57534C',
  /**
   * Quietest tone still permitted to carry words. ~4.6:1 on `base`.
   * De-emphasis below this comes from size and weight, never from a lighter grey.
   */
  faint: '#7A756C',
  /** Non-text only — disabled fills, empty track segments, decorative rules. */
  disabled: '#B8B2A8',
} as const

/* ------------------------------------------------------------------------------------ *
 * Accent — gold, matching the retail apply flow
 *
 * The homepage now carries the same interactive colour as the rest of the retail journey.
 * `applyFlowTheme.ts` owns that decision for the apply flow and the discovery pages, and
 * the V2 spec's stated goal is "one consistent brand read across browse → detail → apply";
 * an earlier pass here made the homepage green-primary, which meant a green CTA landed the
 * visitor on a gold-accented page.
 *
 * CONTRAST DISCIPLINE — this is the whole reason the token is split four ways, and it is
 * the rule most likely to be broken by hand. `#FEC107` is ~1.6:1 on white. It is legible
 * as a background and illegible as anything else:
 *
 *   `fill`     a BACKGROUND. Buttons, selected states, progress. Its label is `onFill`
 *              (near-black) at ~11:1. Never use this as a text colour or a 1px icon stroke
 *              on paper — it will look fine to you on a bright monitor and be unreadable
 *              to everyone else.
 *   `onFill`   the label that sits on `fill`.
 *   `ink`      what gold becomes when it must be TEXT or a thin stroke on paper. ~5.6:1.
 *              Every "See destinations" link, eyebrow and mono figure uses this.
 *   `soft`     a tint behind an icon or a selected row. Decorative; never load-bearing.
 * ------------------------------------------------------------------------------------ */

/** RGB components for accent gold (`#FEC107`) — for `rgba(${accentGoldRgb}, α)`. */
export const accentGoldRgb = '254, 193, 7' as const

export const accent = {
  /** Interactive FILL only. Never text, never a thin stroke on paper. */
  fill: '#FEC107',
  /** Hover / pressed state of `fill`. */
  fillStrong: '#E5AC00',
  /** Label on `fill`. ~11:1. */
  onFill: '#12151A',
  /** Gold as text or a thin stroke on paper. ~5.6:1 on white. */
  ink: '#8A6500',
  /**
   * Hover state of `ink`. Text gets DARKER on hover, never brighter — reaching for
   * `fillStrong` here is the natural mistake and it lands at ~1.9:1 on paper.
   */
  inkStrong: '#6B4E00',
  soft: `rgba(${accentGoldRgb}, 0.13)`,
  softer: `rgba(${accentGoldRgb}, 0.07)`,
  border: `rgba(${accentGoldRgb}, 0.55)`,
  /** Focus ring — a 3px outer glow. */
  ring: `rgba(${accentGoldRgb}, 0.32)`,
} as const

/* ------------------------------------------------------------------------------------ *
 * Verified — green, semantic only
 *
 * Green is demoted here exactly as it is in the apply flow: it means *verified, complete,
 * passed*, and nothing else. It is never a CTA and never a selection state. That division
 * is what keeps the two colours from muddying each other — gold means "act here", green
 * means "this one is done".
 *
 * `mark` is ~3.2:1 on white, so it is a fill and an icon body, not a label; `ink` is the
 * darkened green for text and strokes on paper at ~5.0:1.
 * ------------------------------------------------------------------------------------ */

/** RGB components for brand green (`#73C064`). */
export const greenRgb = '115, 192, 100' as const

export const verified = {
  /** Semantic success as a fill or an icon body. */
  mark: '#0FA968',
  /** Success as text or a thin stroke on paper. ~5.0:1. */
  ink: '#0B7A4B',
  /** Brand green, for illustration tints and approval imagery only. */
  brand: '#73C064',
  soft: `rgba(${greenRgb}, 0.16)`,
  border: `rgba(${greenRgb}, 0.45)`,
} as const

/* ------------------------------------------------------------------------------------ *
 * Semantics — used sparingly, and never as decoration
 * ------------------------------------------------------------------------------------ */

export const semantic = {
  /** Attention / needs-fixing. ~5.1:1 on `base`. */
  warning: '#9A5B12',
  warningSoft: 'rgba(154, 91, 18, 0.09)',
  /** Refusal, expiry, blocking problems. ~6.3:1 on `base`. */
  critical: '#A8321F',
  criticalSoft: 'rgba(168, 50, 31, 0.08)',
} as const

/* ------------------------------------------------------------------------------------ *
 * Type
 *
 * The faces are unchanged — Roboto Slab / Roboto / Roboto Mono are what `index.html`
 * actually loads. What changes is where mono is *allowed*.
 *
 * Under "Clearance", tracked-out MRZ mono ran on every section eyebrow. Repeated that
 * often it stopped being a signal and became the page's temperature: the coldest device
 * on the site, applied to the most human moments. Here mono is restricted to genuine
 * machine data — fees, durations, dates, reference codes, country codes — where tabular
 * alignment is the actual reason to use it. Eyebrows revert to the body face.
 * ------------------------------------------------------------------------------------ */

export const paperFont = {
  display: '"Roboto Slab", Georgia, serif',
  body: '"Roboto", system-ui, sans-serif',
  /** Figures only. Always paired with `tabular-nums`. */
  mono: '"Roboto Mono", ui-monospace, monospace',
} as const

/**
 * BREAKPOINTS — read this before writing a responsive value on this site.
 *
 * This project remaps MUI's breakpoint scale in `src/design-system/breakpoints.ts`:
 *
 *     xs 320   sm 375   md 428   lg 600   xl 900   desktop 1024   desktopMd 1280
 *
 * `md` is 428px, not 900px. A `{ xs, md }` pair — the habitual MUI shorthand, and what
 * most of this site is written with — therefore switches to its "wide" value on a large
 * phone, which is how a two-column hero ends up rendering at 430px. The tiers below are
 * the ones actually worth designing to; prefer them over `sm`/`md` in new work.
 */
export const bp = {
  /** Phones. Base. */
  phone: 'xs',
  /** 600px — tablet portrait. First point a two-up layout is comfortable. */
  tablet: 'lg',
  /** 900px — tablet landscape / small laptop. First point a hero split works. */
  wide: 'xl',
  /** 1024px — true desktop. */
  desktop: 'desktop',
} as const

export const paperType = {
  /** Hero headline. The one place type is allowed to be loud. */
  hero: {
    fontFamily: paperFont.display,
    fontSize: { xs: 32, lg: 40, xl: 48, desktop: 56 },
    fontWeight: 700,
    letterSpacing: '-0.028em',
    lineHeight: 1.08,
    color: ink.strong,
  },
  section: {
    fontFamily: paperFont.display,
    fontSize: { xs: 25, lg: 29, xl: 34 },
    fontWeight: 700,
    letterSpacing: '-0.024em',
    lineHeight: 1.14,
    color: ink.strong,
  },
  block: {
    fontFamily: paperFont.display,
    fontSize: { xs: 17, xl: 19 },
    fontWeight: 700,
    letterSpacing: '-0.018em',
    lineHeight: 1.25,
    color: ink.strong,
  },
  /**
   * Lead paragraph. Looser line-height than the old scale (1.55 → 1.62) and a slightly
   * larger size: the single cheapest thing that makes a page read as written by a person
   * rather than generated.
   */
  lead: {
    fontFamily: paperFont.body,
    fontSize: { xs: 15.5, lg: 16.5, xl: 17.5 },
    fontWeight: 400,
    lineHeight: 1.62,
    color: ink.muted,
  },
  body: {
    fontFamily: paperFont.body,
    fontSize: 15,
    lineHeight: 1.65,
    color: ink.muted,
  },
  /**
   * Section eyebrow. Sentence case in the body face — NOT tracked-out mono.
   * This is the main visible break from "Clearance" and the main source of warmth.
   */
  eyebrow: {
    fontFamily: paperFont.body,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.005em',
    lineHeight: 1.3,
    color: accent.ink,
  },
  /** Small print, captions, disclaimers. */
  caption: {
    fontFamily: paperFont.body,
    fontSize: 13,
    lineHeight: 1.5,
    color: ink.faint,
  },
} as const

/** Numeric readout — fees, durations, counts. Tabular so columns align. */
export const figureSx = {
  fontFamily: paperFont.mono,
  fontVariantNumeric: 'tabular-nums',
  color: ink.strong,
} as const

/* ------------------------------------------------------------------------------------ *
 * Radius
 *
 * Near-square, on purpose. This started at 10 / 14 / 18 and stepped down twice; both
 * earlier passes still read as soft. The reason is that radius competes with the hairline:
 * on a surface whose entire structure is 1px rules on paper, a generous corner rounds off
 * the very edges doing the structural work, and the result looks like a card UI wearing a
 * document's clothes.
 *
 * At 2 / 3 / 4 the corner stops being a style and is only there to take the bite off a
 * hard mitre. It matches the subject: visas, forms and boarding passes are square-cornered
 * objects, and this page is made of them.
 *
 * The values sit within 2px of each other so nested shapes do not fight, and so that a
 * large container never reads rounder than the small ones inside it.
 *
 * Use the tokens. Radius literals in component `sx` are what caused the drift.
 * ------------------------------------------------------------------------------------ */

export const paperRadius = {
  /** Buttons, inputs, icon tiles, inner photo wells. */
  control: 2,
  /** Cards and any panel carrying content. */
  card: 3,
  /**
   * The largest containers — the hero console, the Visa Master panel.
   *
   * Barely larger than a card, and deliberately not scaled up with the shape. Radius reads
   * relative to the edge it sits on: the same 8px corner that looks tight on a 300px card
   * looks visibly rounded on a 600px console, which is why the hero kept reading soft after
   * the card grid had stopped.
   */
  panel: 4,
  /** Chips and pills only, where the shape *is* the affordance. */
  pill: 999,
} as const

export const paperMotion = {
  /** Entrances and exits. Built-in CSS easings are too weak to read as intentional. */
  easeOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
  /** On-screen movement and morphing. */
  easeInOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
  /** Button press feedback. */
  pressMs: 140,
  /** Hover and colour changes. */
  hoverMs: 180,
  /** Popovers, dropdowns, disclosure. */
  overlayMs: 200,
} as const

/**
 * Shadow policy: almost none.
 *
 * A trust surface built on hairlines reads as printed and precise; the same surface built
 * on soft drop shadows reads as a template. `lift` exists for the one element that must
 * genuinely float above the page (the hero's requirement console) and for hover on a
 * genuinely clickable card. Nothing else gets a shadow.
 */
export const paperShadow = {
  none: 'none',
  lift: '0 1px 2px rgba(28, 26, 22, 0.04), 0 16px 36px -22px rgba(28, 26, 22, 0.26)',
  liftHover: '0 1px 2px rgba(28, 26, 22, 0.05), 0 22px 48px -24px rgba(28, 26, 22, 0.32)',
} as const

/** Vertical rhythm for marketing sections. */
export const paperSpace = {
  sectionY: { xs: 7, lg: 9, xl: 12 },
  blockGap: { xs: 4, xl: 6 },
} as const

export type PaperGround = 'white' | 'base' | 'canvas' | 'deep'

/** Resolve the background for a named ground. Sections take a `ground` prop, never a hex. */
export function groundSx(name: PaperGround) {
  return { backgroundColor: paper[name] } as const
}
