import { Box } from '@mui/material'
import { ink, paper, verified } from '../../../theme/sitePaper'

/**
 * Hero illustration — a cleared document, drawn rather than photographed.
 *
 * The ticks and the stamp are GREEN, not the page's gold accent. Gold means "act here";
 * green means "this one passed". A drawing of an approved application is the second, so
 * it is the one place on this page where green is the loudest colour — and it is exactly
 * the semantic role the apply flow reserves green for.
 *
 * What this replaces: a stock composite of an airliner, a container ship and two men at a
 * desk, apparently on water. Photography of people the company has never met is the
 * fastest way to make a visa site read as fraudulent, and that image was the least
 * trustworthy element on the page.
 *
 * Why a document still life rather than an abstract shape: the subject of this business is
 * a piece of paper being approved. Drawing that literally — a form, a stamp, a check —
 * says what the product does without claiming anything that is not true. It is also the
 * one thing on this page allowed to be warm and hand-made, which is where the "human"
 * part of the brief lives while the copy stays plain.
 *
 * Everything is a single inline SVG: no network request, no layout shift, crisp at any
 * size, and it inherits the Paper palette directly rather than baking in hexes that will
 * drift from the tokens.
 *
 * Static by design. A hero illustration that animates on load delays the headline — the
 * one thing the visitor came for — and reads as decoration on the most-viewed screen of
 * the site.
 */
export function HeroDocumentStill() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: 420, xl: 560 },
        mx: 'auto',
        display: 'block',
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 560 500"
        role="img"
        aria-label="An illustrated visa application, reviewed and approved."
        sx={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        <defs>
          <filter id="gl-still-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor="#1C1A16" floodOpacity="0.13" />
          </filter>
          <filter id="gl-still-shadow-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#1C1A16" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Warm wash — gives the sheets something to sit on so they do not float on nothing. */}
        <ellipse cx="286" cy="268" rx="250" ry="228" fill={paper.canvas} />

        {/* Back sheet: the supporting documents, implied rather than detailed. */}
        <g transform="rotate(-7 280 250)" filter="url(#gl-still-shadow-soft)">
          <rect
            x="86"
            y="82"
            width="352"
            height="330"
            rx="3"
            fill={paper.white}
            stroke={paper.hairline}
            strokeWidth="1.5"
          />
          <rect x="116" y="116" width="150" height="9" rx="4.5" fill={paper.deep} />
          <rect x="116" y="142" width="96" height="9" rx="4.5" fill={paper.canvas} />
        </g>

        {/* Front sheet: the application itself. The clipped top-right corner is the site's
            existing travel-document motif, kept because it is the one shape that ties this
            page to the apply flow. */}
        <g filter="url(#gl-still-shadow)">
          <path
            d="M111 96 H442 L470 124 V429 A3 3 0 0 1 467 432 H111 A3 3 0 0 1 108 429 V99 A3 3 0 0 1 111 96 Z"
            fill={paper.white}
            stroke={paper.hairline}
            strokeWidth="1.5"
          />
          {/* The folded corner, drawn as a fold rather than a cut. */}
          <path d="M442 96 L470 124 H442 Z" fill={paper.canvas} stroke={paper.hairline} strokeWidth="1.5" />
        </g>

        {/* Photo panel — an abstract sitter, not a face. Enough to read as a passport photo,
            not enough to pretend to be a person. */}
        <g>
          <rect x="140" y="134" width="98" height="120" rx="2" fill={paper.canvas} stroke={paper.hairline} />
          <circle cx="189" cy="180" r="19" fill={ink.disabled} opacity="0.55" />
          <path
            d="M157 232 a32 30 0 0 1 64 0 Z"
            fill={ink.disabled}
            opacity="0.55"
          />
        </g>

        {/* Applicant details beside the photo. */}
        <g>
          <rect x="258" y="140" width="130" height="10" rx="5" fill={ink.strong} opacity="0.82" />
          <rect x="258" y="166" width="176" height="8" rx="4" fill={paper.deep} />
          <rect x="258" y="188" width="140" height="8" rx="4" fill={paper.deep} />
          <rect x="258" y="222" width="92" height="8" rx="4" fill={paper.canvas} />
          <rect x="258" y="242" width="118" height="8" rx="4" fill={paper.canvas} />
        </g>

        {/* Checklist — three cleared requirements. The green ticks are the only saturated
            marks besides the stamp, and they mean the same thing it does. */}
        <g transform="translate(140 286)">
          {[0, 1, 2].map((row) => (
            <g key={row} transform={`translate(0 ${row * 30})`}>
              <rect width="18" height="18" rx="2" fill={verified.soft} stroke={verified.border} />
              <path
                d="M4.6 9.2 L7.8 12.4 L13.6 5.9"
                fill="none"
                stroke={verified.ink}
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="30"
                y="5"
                width={[196, 152, 174][row]}
                height="8"
                rx="4"
                fill={paper.deep}
              />
            </g>
          ))}
        </g>

        {/* Machine-readable zone. The one place the passport-strip motif still earns its
            keep: on a drawing of an actual travel document. */}
        <g transform="translate(140 394)" opacity="0.5">
          {[0, 1].map((row) => (
            <g key={row} transform={`translate(0 ${row * 14})`}>
              {Array.from({ length: 22 }).map((_, index) => (
                <rect
                  key={index}
                  x={index * 13}
                  y="0"
                  width={index % 4 === 3 ? 5 : 8}
                  height="6"
                  rx="2"
                  fill={ink.disabled}
                />
              ))}
            </g>
          ))}
        </g>

        {/* The approval stamp. Off-axis and slightly over the sheet edge, because a stamp
            is pressed by a hand and never lands square. */}
        <g transform="rotate(-13 424 372)">
          <circle cx="424" cy="372" r="56" fill={paper.white} opacity="0.92" />
          <circle cx="424" cy="372" r="56" fill="none" stroke={verified.ink} strokeWidth="3.5" opacity="0.9" />
          <circle
            cx="424"
            cy="372"
            r="46"
            fill="none"
            stroke={verified.ink}
            strokeWidth="1.2"
            strokeDasharray="3 6"
            opacity="0.75"
          />
          <path
            d="M404 371 L418 385 L446 357"
            fill="none"
            stroke={verified.ink}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.92"
          />
          <rect x="400" y="398" width="48" height="5" rx="2.5" fill={verified.ink} opacity="0.55" />
        </g>
      </Box>
    </Box>
  )
}
