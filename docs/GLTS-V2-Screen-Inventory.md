# GLTS Website V2 — Screen Inventory & Design Direction

## Brand Foundations

**Two logo variants provided, sharing one mark (sunburst + "G" + flight path) but with different sub-brand accent colors:**

| Token | Hex | Usage |
|---|---|---|
| Brand Green (core, both variants) | `#73C265` | Primary brand color across all surfaces — the one constant |
| Visa Solutions Gold | `#FEC107` | Secondary accent for **"Greenlight Visa Solutions"** wordmark |
| Travel Solutions Teal | `#0C6C79` | Secondary accent for **"Greenlight Travel Solutions"** wordmark |

**These aren't interchangeable color options — they're two different sub-brands.** V1's own footer states: *"GreenLight Visa Solutions is a brand of GreenLight Travel Solutions Pvt. Ltd."* — meaning **Travel Solutions is the parent/corporate entity, Visa Solutions is the consumer-facing retail product.**

Since V2 is specifically the retail/customer-facing redesign, **the working assumption is: use the Visa Solutions gold (`#FEC107`) as the secondary/accent color throughout the retail application flow**, with green (`#73C265`) as primary. Teal should be reserved for contexts where the parent corporate entity is the subject — About Us, legal/T&C pages, footer entity disclosures — not the application flow itself. **Flag if this reading is wrong** before it gets baked into the component library, since it affects every colored state (buttons, selected pills, progress bars, badges) across all 21 screens.

Exact values above are sampled directly from the provided logo files (not estimated) — safe to use as final tokens, though worth cross-checking against any existing brand guideline doc if one exists, in case the source-of-truth hex differs slightly from the rendered PNGs.

## Visual Language Rules — Locked

Settled decisions for the live-status / upload surface family. **Not open questions** — check here before styling any new component in this family.

- **LiveStatusPanel:** No color-blob ambient glow. Technical grid via SVG-native `<mask>` (not CSS `mask-image`), fading top-right → bottom-left. Small **green** live dot top-right (not gold). Gold is reserved for the single headline number/date only. Readiness ring + “% ready” use **green** (progress), not gold.
- **StatusStepper:** Dark-filled circles + custom check path (completed); **muted amber tint** bg + dark amber clock (current — not solid gold fill); dashed outline only (pending). Solid dark connectors through completed steps. Status pills = light tint bg + dark same-family text. Timestamps use `tabular-nums`.
- **TravellerUploadStatusRow:** Real SVG confidence ring (`stroke-dasharray`), percentage centered with flexbox. Avatar colors from semantic state only (green / amber / red / gray) — never random. Needs-attention row = **3px solid left border only**, white/default background — never a red fill tint.
- **ChecklistStep:** Full-width header + passenger tabs (dark filled rounded rectangle + avatar + Build-profile line when selected; light grey when not). Body is flex ~65/35 (not CSS Grid): left = category-grouped `DocumentChecklistRow` list; right = `BulkUploadDropzone` (scoped to active traveller) + `LiveStatusPanel` readiness variant (left-aligned; live completion % ring + minutes left). White container background. No Overview strip.
- **Gold vs green:** ~~Gold appears **once per card** — the headline number/date only (e.g. “94%”, “Aug 29”). Green owns progress, confidence, live pulse, and completed trust signals.~~ **Superseded for the retail apply flow** — see "Apply flow accent — Locked" below. Still applies to the live-status / upload surface family when used *outside* the apply flow.
- **No rainbow icon chips:** Icon badges/containers (document-type icons, requirement-type icons, etc.) use a single consistent neutral treatment (`colors.surfaceAlt` bg + `colors.border` outline + `colors.navy` icon) across every type in a set. Differentiate by icon *shape*, never by assigning each type its own pastel background/color — that per-type rainbow-pastel pattern is a flagged "AI-generated SaaS" tell and is not to be reintroduced anywhere in V2.

### Apply flow accent — Locked

Resolved by explicit product decision (supersedes the "gold once per card" rule above **for the retail apply flow only**). This answers the long-standing open question below on the Visa-vs-Travel brand reading for Steps 1–19.

- **Gold (`#FEC107`) is the primary interactive accent** in the retail apply flow — primary CTAs, active/selected states, focus rings, progress fills, phase/navigation states, and micro-interactions. The apply flow is the "Greenlight Visa Solutions" sub-brand, so it carries that sub-brand's accent.
- **Green demotes to semantic-only** here: verified, complete, passed. Green is never a CTA and never a selection state inside the apply flow.
- **Contrast discipline (non-negotiable):** `#FEC107` is ~1.6:1 on white and is **never** used as text or as a thin icon stroke on a light surface. Gold is a *fill* with ink `#12151A` on it (~11:1). When gold must read as text/stroke on light, use `accentInk` `#8A6500` (~5.6:1). On dark navy, `#FEC107` may be used as text directly.
- **Implementation:** all of the above lives in `src/pages/website/theme/applyFlowTheme.ts`. `@/shared/theme/publicBrand` is **not** modified — it is shared with admin, customer, and auth, and must stay green-primary.
- **Type pairing applied:** Roboto Slab (display) / Roboto (body) / Roboto Mono (data, `tabular-nums`). The former `Inter` + `JetBrains Mono` tokens in `retailFlowTokens.ts` were never loaded in `index.html` and had been silently falling back to system fonts.
- **Signature motifs:** clipped top-right card corner (travel-document corner cut) instead of uniform radius; a checkpoint spine for phase navigation; a mono `STEP nn / nn` counter paired with a gold hairline progress meter.
- Teal is **not** used in the apply flow — it remains scoped to the discovery pages below.

### Discovery pages (Country Listing / Country Detail) — Locked

Resolved via the redesign pass on `CountryListingPage` and `CountryDetailPage`. Settled, not open:

- **Accent color:** ~~Teal (`#0C6C79` / `colors.teal`, `tealDark`, `tealMuted`) is the interactive/selection accent for these two pages specifically.~~ **Superseded** — discovery pages now use the same **gold** (`#FEC107`) accent as the retail apply flow, for one consistent brand read across the whole retail journey (browse → detail → apply). Gold is the interactive/selection accent here too — hover states, selected chips/toggles, focus rings, tab indicator, calendar selection, data-value highlights (mono figures in stat strips). Follow the same contrast discipline as the apply flow (see "Apply flow accent — Locked" above): raw gold is a fill/dark-bg-text only, `accentInk` (`#8A6500`) is used when gold must render as text or a thin stroke on a light surface. This does **not** override green as the sitewide default for "positive/required/trust" semantics (`Required` chips, completion checks, count badges stay green) — gold is scoped to discovery-page interaction/selection, green stays the constant trust signal everywhere. Teal is retired from these two pages; `colors.teal`/`tealDark`/`tealMuted` in `publicBrand.ts` remain defined (still available for any other surface) but are no longer referenced here.
- **Typography system:** `publicFonts.display` (Roboto Slab) for hero/section display headings and country names; `publicFonts.body` (Roboto) for body copy, unchanged; `publicFonts.mono` (Roboto Mono) + `fontVariantNumeric: 'tabular-nums'` for all data/numeric readouts — stat strips, processing-time/price figures, eyebrow labels, checklist/category labels. This resolves the earlier open question on a display face to pair with Roboto — Roboto Slab is now the paired display face for V2, not a second sans.
- **Signature motif:** Boarding-pass / ticket-stub construction for the country card (`WebsiteListingCountryCard`) — dashed perforation seam with punch-hole notches between an "upper stub" (photo, flag, destination name) and "lower stub" (mono data row: processing time / from-price).

---

**Purpose:** This is the working spec that translates the Application Creation Flow (19-step engine) into concrete screens and components. Each entry defines what the screen must do, what precedent we have for it, where GLTS V1 currently falls short, and the proposed V2 direction. This document is what a design system and — later — Claude Code would build against.

**Legend for Reference column:**
- **GLTS** = current V1 already has this, needs restyling/refinement
- **Atlys** = seen on Atlys, no GLTS equivalent, needs adaptation
- **Both** = both platforms have a version, synthesize the best of each
- **Net-new** = neither reference covers this, original design work required

---

## PART A — Pre-Application (Marketing/Discovery)

### A1. Homepage
- **Purpose:** Entry point; destination search, trust signals, service overview
- **Reference:** GLTS (has hero, search bar, trust stats, destination grid)
- **Current gap:** Generic SaaS visual language — rounded cards, stock photography, no distinct typographic identity, static world map with dots instead of anything interactive
- **V2 direction:** Establish the typography pairing here first (display face + Roboto body) since it sets the tone for everything downstream. Consider Atlys's split-panel pattern (photography + floating info card) as a hero alternative. Real interactive destination exploration instead of a decorative map.

### A2. Destinations / Country Listing
- **Purpose:** Browse all countries, filter by trip context
- **Reference:** GLTS (already strong — nationality-aware sorting, trip-timing filters, first-time/refused/minor/self-employed qualifiers)
- **Current gap:** Visual execution only — card styling, spacing, missing imagery on some cards (Japan/Singapore/Norway/Brazil showed as blank grey blocks in the current build)
- **V2 direction:** Keep the filter logic as-is; this is genuinely good UX. Restyle cards, fix missing imagery pipeline, add subtle hover/motion.

### A3. Country/Visa Detail Page
- **Purpose:** Country-specific visa info — requirements, timeline, pricing, FAQs, entry to application
- **Reference:** GLTS (visa category tabs, fee estimate card, tabbed content)
- **Current gap:** Flat visual hierarchy, no destination-specific product framing
- **V2 direction:** Borrow Atlys's landing-page structure loosely (hero stat card, time-to-complete strip) without copying the marketing-heavy add-on cross-sell section — that's out of scope for retail core flow. Keep this page focused on getting the user into "Start Application" fast.

---

## PART B — Application Flow (Steps 1–19)

### B1. Step 1 — Country (within application context)
- **Purpose:** Confirm/lock destination for this application instance
- **Reference:** Both (carried over from country detail page selection)
- **V2 direction:** No new screen — this is state carried from A3, shown as a persistent header chip throughout the flow (country flag + name), not a separate step screen.

### B2. Step 2 — Visa Type / Purpose
- **Purpose:** Select visa category (Tourist, Business, Student, Transit, etc.)
- **Reference:** GLTS (card-based selection, e.g. Tourist Visa vs Tourist e-Visa)
- **Current gap:** Plain card styling, no differentiation cues beyond text
- **V2 direction:** Icon + short descriptor + processing-time badge per card. Selected state should feel deliberate (not just a border color change) — consider a subtle scale/elevation shift.

### B3. Step 3.1 — Jurisdiction *(conditional)*
- **Purpose:** Resolve application centre based on applicant residence
- **Reference:** Net-new
- **V2 direction:** Simple resolved-value display ("Your application centre: Mumbai") rather than an interactive step where possible — this should feel like the system did the work, not another form field. Only show a picker if multiple jurisdictions are genuinely valid.

### B4. Step 3.2 — Travel Dates
- **Purpose:** Collect travel date(s), application-level
- **Reference:** Both — GLTS has a risk-colored single calendar (Safe/Timeline Tight/High Risk); Atlys has Fixed/Flexible toggle + dual-month calendar with a reassurance microcopy line
- **Current gap:** GLTS's risk-coding is smarter than Atlys's but visually under-designed; no "flexible date" option
- **V2 direction:** **Synthesize both** — keep GLTS's risk-based date coloring (this is a genuine differentiator, ties directly to your processing-time data) but adopt Atlys's Fixed/Flexible toggle and the reassurance microcopy ("Tentative dates work — you can change these later"). Dual-month view if space allows.

### B5. Step 4 — Travellers (add multiple)
- **Purpose:** Identify all travellers on this one application
- **Reference:** GLTS (traveller card + "Add travelers")
- **Current gap:** Minimal visual treatment; unclear how group/family context is communicated
- **V2 direction:** Traveller roster as a horizontal set of avatar cards (not a vertical list) so the "one application, multiple people" mental model is visually obvious from the start. Clear "+ Add traveller" affordance throughout the flow, not just here.

### B6/B7. Steps 5–6 — Photo & Passport Capture (per traveller)
- **Purpose:** Guided capture/upload of photo and passport
- **Reference:** Both — GLTS has circular guide frame + Live/Upload toggle; Atlys adds live validation feedback ("No Face Detected"), a zoom/dial indicator, corner-bracket frame for documents (vs. circle for faces), and a labeled dummy example image for passport
- **Current gap:** GLTS has no real-time validation feedback and no reference/example imagery
- **V2 direction:** This is one of the highest-priority components. Build:
  - Distinct frame shapes per capture type (circle = face, bracket corners = document) — small but meaningful signal to the user about what's being scanned
  - Live validation state (face detected / not detected, blur/glare warnings if feasible)
  - A generic labeled example image ("Sample — not your document") shown before/beside the capture area, built as original GLTS-branded artwork
  - Security/trust microcopy at the point of upload (Atlys's "AES-256 encrypted" badge is a good pattern — GLTS should have its own equivalent trust signal here)

### B8. Step 7 — Passport Data Confirmation (OCR)
- **Purpose:** Show extracted passport fields for user confirmation/correction
- **Reference:** GLTS (already exists — editable fields pre-filled after upload)
- **Current gap:** Visual styling only; functionally solid
- **V2 direction:** Keep the structure, restyle. Add a clear visual distinction between "we read this" (OCR-filled, needs confirming) vs "you typed this" (manually entered) so trust in automation is calibrated correctly.

### B9. Step 8.1 — Employment Status *(conditional)*
- **Purpose:** Persona question feeding document requirements
- **Reference:** GLTS (modal wizard: profession list)
- **V2 direction:** Keep as a modal step; restyle the option-list cards, add icons per profession type (already present, just needs visual refinement).

### B10. Step 8.2–8.6 — Who's Paying / Sponsor Type / Sponsor Details *(conditional, per traveller)*
- **Purpose:** Determine sponsor relationship per traveller, not per application
- **Reference:** Both — GLTS currently asks this once at application level; Atlys similarly application-level but with better visual execution (highlighted pill, "SPONSOR" badge)
- **Current gap:** **Structural gap, not just visual** — your spec requires sponsor to be resolved per-traveller, which neither reference site does. This needs original flow design.
- **V2 direction:** Adapt Atlys's pill-selection visual pattern, but repeat it inside each traveller's own step sequence rather than once for the whole application. Natural-language summary card afterward ("is sponsored by [Name], their [relationship]") — Atlys's sentence-based profile summary is a good model to extend here.

### B11. Step 8.7 — Other Country/Visa Questions *(conditional)*
- **Purpose:** Render config-driven question set (prior refusal, travel history, etc.)
- **Reference:** GLTS (has this — "Have you been refused a visa?" style Yes/No cards)
- **V2 direction:** Keep the binary-choice card pattern; ensure the component is generic enough to render any yes/no or single-select question from config, not hardcoded per question.

### B12. Step 9 — Resolve Requirements
- **Purpose:** System action, no screen — but a transition moment
- **Reference:** Atlys (playful branded loading state — "Knocking on embassy doors")
- **V2 direction:** GLTS needs its own on-brand loading copy for this transition. This is cheap to design (just copy + a simple animation) and disproportionately improves perceived craft. Write 4–6 GLTS-voiced loading lines to rotate through across the flow (arrival at this pattern was one of the most "not-AI-generated-feeling" details on Atlys).

### B13. Step 10 — Document Checklist
- **Purpose:** Show personalized, categorized document requirements per traveller
- **Reference:** Both — GLTS has category grouping (Financial/Other) + info drawer; Atlys has richer categorization (Personal/Financial/Additional), per-item completion state, "Optional" labeling, and smart contextual notes ("Recommended above ₹1,00,000")
- **Current gap:** GLTS's version is good but thinner than Atlys's — fewer categories, no completion badges, no optional-vs-required distinction shown inline
- **V2 direction:** This is the most complex and most important screen in the flow — matches your Step 10 spec closely. Build:
  - Category grouping (Personal / Financial / Additional, or config-driven category names)
  - Per-item: icon, name, one-line description, info icon → drawer, completion badge, Optional tag where applicable
  - Collapsible per-traveller container when multiple travellers exist (Atlys pattern)
  - "Why we ask" drawer content template: Why they ask it / What it should look like — GLTS already has this structure, just needs to scale to every document type and get restyled

### B14. Step 11 — Document Upload
- **Purpose:** Actual upload interaction per document
- **Reference:** Both — GLTS's photo/passport capture modals + Atlys's bank-statement modal (plain drag-and-drop, explicit file-type constraints)
- **Current gap:** GLTS lacks the "why we ask" content inside the upload modal itself (currently separate from the info drawer)
- **V2 direction:** Two upload modal templates:
  1. **Capture-type** (photo/passport) — camera guide frame, live validation, example image
  2. **File-type** (bank statement, NOC, etc.) — drag-and-drop, explicit format/size constraints, no camera option
  Both should surface the "why we ask" content inline or one tap away, not just from a separate checklist screen. Also design the **bulk upload** interaction from your spec (folder/ZIP upload, OCR auto-categorization, explicitly scoped to the currently selected traveller) — this has no reference precedent from either site and needs original design.

### B15. Step 12 — Original Documents *(conditional)*
- **Purpose:** Flag which uploaded documents also require physical originals
- **Reference:** Net-new
- **V2 direction:** Likely an annotation/badge on the relevant checklist items from B13 ("Original required") rather than a fully separate screen — keeps it low-friction, avoids introducing a redundant step when only 1–2 documents need it.

### B16. Step 13 — Physical Collection *(conditional, 4 methods)*
- **Purpose:** GLTS Pickup / Drop at GLTS / Courier / Hand-carry
- **Reference:** Atlys (partial — pickup map screen only)
- **Current gap:** 3 of 4 methods have zero precedent
- **V2 direction:** Method selector as a card grid (icon + one-line description per method), config-driven visibility. For GLTS Pickup, adapt Atlys's map-pin pattern (search + current-location + address confirm). Drop-at-GLTS = simple instructions card with address/hours. Courier = address + carrier info form. Hand-carry = instructions card. Keep all four visually consistent even though only Pickup has a map.

### B17. Step 14.1–14.2 — Travel & Visa Essentials *(conditional: Insurance, Ticket)*
- **Purpose:** Upload-own / get-from-GLTS / skip, per service
- **Reference:** Atlys (toggle rows + nested detail page for insurance, e.g. "$50,000 covered," provider branding, expandable benefits list)
- **Current gap:** No GLTS equivalent exists at all
- **V2 direction:** Toggle-row pattern on the main Essentials screen (matches your 3-option spec: Upload own / Get from GLTS / Skip — note Atlys only really shows 2, so this needs a 3-way control, e.g. segmented control rather than a toggle). Tapping "Get from GLTS" opens a detail view per service, GLTS-branded equivalent of Atlys's insurance page. Apply the same pattern to Flight Ticket.

### B18. Step 15 — Review
- **Purpose:** Full application summary before payment, per-traveller completeness, edit capability
- **Reference:** Net-new (neither site showed a full pre-payment review screen distinct from the payment screen itself)
- **V2 direction:** Accordion-per-traveller (Complete/Incomplete badge), accordion-per-section (Documents, Originals, Collection, Essentials) matching Atlys's collapsible pattern from the payment screen. Critical: if an edit here changes requirements, the UI must visibly signal "requirements updated" — a toast or inline banner, not a silent recalculation.

### B19. Step 16 — Payment
- **Purpose:** Itemized pricing, per-traveller + application-level charges, payment action
- **Reference:** Atlys (strong reference — collapsible Visa Details/Cancellation Policy/Essentials, itemized Pay now vs Pay on approval, sticky CTA, trust line under button)
- **Current gap:** No GLTS payment screen observed yet in this research — likely the biggest visual gap to close
- **V2 direction:** Directly adapt Atlys's structure:
  - Confirmation-style header card (not just a form)
  - **Cancellation Policy as a colored timeline** (Full refund → Full refund → No refund, staged against your own Ground Ops milestones) — this is a strong trust pattern worth adopting wholesale
  - Itemized price breakdown per traveller + application-level fees (matches your Step 16 spec almost exactly)
  - Sticky bottom CTA with a trust microcopy line beneath it (GLTS equivalent of "100% refund on refusal" — pull from your actual refund policy)

### B20. Step 17 — Application Created (confirmation)
- **Purpose:** Success state after payment
- **Reference:** Net-new
- **V2 direction:** Simple, calm confirmation screen — application ID, what happens next (tie to B21 tracking), not over-designed. This is a relief moment, not a celebration moment; keep tone reassuring rather than exuberant.

### B21. Step 19 — Application Tracking
- **Purpose:** Post-submission status visibility, conditional status list
- **Reference:** Net-new
- **V2 direction:** Vertical status timeline (same visual language as the Cancellation Policy timeline from B19 for consistency), only rendering statuses applicable to this application (config-driven per your spec). This is a good candidate for the "technology is handling the complexity, user always knows what's next" brand line — this screen should be the clearest embodiment of that promise in the whole product.

---

## PART C — Core Component Library

Derived from the screens above. Build order suggested (highest reuse / highest complexity first):

1. **Stepper / progress indicator** — used in every screen; needs a top-level (6-stage) and possibly sub-stage variant
2. **Info drawer** ("Why we ask") — reused across every document type
3. **Capture modal** (camera guide + live validation + example image) — 2 sub-variants: face circle, document brackets
4. **File upload modal** (drag-and-drop, format constraints)
5. **Traveller card** (roster view + expanded/collapsed states)
6. **Document checklist row** (category, name, description, info icon, completion badge, optional tag)
7. **Persona/qualifying question card** (binary and multi-select variants)
8. **Risk-coded calendar**
9. **Timeline component** (shared between Cancellation Policy and Application Tracking)
10. **Price breakdown table** (per-traveller + application-level rows)
11. **Loading state / transition copy system**
12. **Method-selector card grid** (used for Physical Collection, possibly Essentials)

---

## Decisions Confirmed

**B10 — Sponsor (per traveller):** Two options only — **Individual** (self-funded) or **Someone else**. If "Someone else" is selected: collect a short set of basic sponsor questions (name, relationship, contact — per Step 8.6 of the engine spec) **and** require a bank statement upload from the sponsor. This replaces the open "Sponsor Type" multi-option list (Parent/Spouse/Family/Company/Other) from the original engine spec with a simpler binary choice — confirm this simplification is intentional before Claude Code implements Step 8.5 as binary rather than multi-select.

**B19 — Payment:** Confirmed — build directly off the Atlys mobile payment screen shared earlier (confirmation header card, collapsible Visa Details/Cancellation Policy/Essentials, itemized Pay-now vs Pay-on-approval, sticky CTA with trust line beneath). Desktop is an adapted layout of the same information hierarchy, not a separate design.

**B14 — Bulk Upload:** Confirmed as a **UI-first build** (not gated on backend OCR readiness for V2's initial design pass). Reference image provided (green dashed dropzone, "Upload passport folder or ZIP," accepts .zip/JPG/PNG/PDF, one file per traveller, "Browse passport files"). Behavior:
- One row per traveller in a list view, each row shows current upload status directly (not hidden behind a click)
- Each row surfaces a **confidence/quality indicator** for how well OCR extraction worked on that upload (not just success/fail — a graded signal)
- Rows that need attention (poor extraction, missing pages, low confidence) are visually flagged inline
- Opening a row lets the user upload remaining/individual documents for that traveller, or re-upload if extraction failed
- This becomes its own component: **Bulk Upload Dropzone** (Part C, add as #13) — green dashed border, upload icon, primary instruction line, secondary format/constraint line, secondary action button — plus a companion **Traveller Upload Status Row** component for the resulting list view

## Open Questions Before Build

- Do you have (or want us to define) the actual GLTS refund/cancellation policy stages, so B19's timeline reflects real policy rather than a placeholder?
- B10 simplification (binary Individual/Someone-else vs. the original multi-type sponsor list) — confirm this is the final intended behavior across all visa types, or only specific ones?
- ~~**Confirm the Visa Solutions (gold) vs. Travel Solutions (teal) brand reading above.**~~ **Resolved.** Discovery pages (Country Listing/Detail) keep **teal** as the interactive accent; the retail apply flow (Steps 1–19) moves to **gold as the primary interactive accent** with green demoted to semantic-only — see "Apply flow accent — Locked" above. The two-sub-brand split is intentional: browsing is Travel Solutions, applying is Visa Solutions.
- ~~Still open: a display/heading typeface to pair with Roboto.~~ **Resolved:** Roboto Slab is the paired display face (`publicFonts.display`), Roboto Mono (`publicFonts.mono`) is the data/tabular face; see "Discovery pages — Locked" above. Applied so far to the Country Listing/Detail pages — extend the same pairing when the Landing Page and Retail Apply Flow are redesigned next, rather than reverting to single-typeface Roboto.
