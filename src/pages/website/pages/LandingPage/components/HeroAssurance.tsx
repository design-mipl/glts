import { Box, Typography } from '@mui/material'
import { ArrowRight, ShieldCheck, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui'
import { accent, figureSx, ink, paper, paperFont, verified } from '../../../theme/sitePaper'

/**
 * TODO(content): every figure and accreditation below is inherited from the previous
 * homepage and has not been verified against a source. For a visa business these are
 * regulated-adjacent trust claims — confirm each one with the business before launch, or
 * remove it. An unverifiable "98%" costs more credibility than it buys.
 */
const TRUST_FIGURES = [
  /**
   * Only the approval rate is starred. A star beside every figure would be decoration —
   * it marks this one as the headline number of the three, which is the one a visitor
   * actually weighs. Gold as a *fill* is legal; gold as a thin stroke on paper is not,
   * so the star is solid rather than outlined.
   */
  { value: '98%', label: 'Approval rate', note: 'Last 12 months', starred: true },
  { value: '100,000+', label: 'Visas processed', note: 'Since 2016', starred: false },
  { value: '100+', label: 'Countries served', note: 'Retail and corporate', starred: false },
] as const

/** TODO(content): confirm the registered-agent listings and add licence references. */
const REGISTERED_AGENT_MARKETS = [
  { code: 'CN', name: 'China' },
  { code: 'KR', name: 'South Korea' },
  { code: 'BR', name: 'Brazil' },
] as const

/**
 * Registered-agent line.
 *
 * This was three separate bordered cards sitting under the hero — one per country — which
 * gave a single sentence the visual weight of a whole section and was a large part of why
 * the hero read as cluttered. It is one sentence, so it is one line.
 *
 * It sits directly beneath the requirement console because it qualifies the console: it
 * says who is actually filing the application the console starts. Accreditation is the
 * strongest trust signal a visa company has, because it is the one thing a fraudulent
 * operator cannot claim without being checkable.
 */
export function RegisteredAgentLine() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        mt: 2.5,
        maxWidth: 560,
      }}
    >
      {/* The shield is the only mark this line needs. An earlier pass also set the three
          country codes as tinted chips beside it — but the sentence already names the
          three countries, so the chips restated their own caption and pushed the line onto
          two rows on a phone. */}
      <Box component="span" sx={{ flex: '0 0 auto', mt: '2px', display: 'inline-flex' }}>
        <ShieldCheck size={17} color={verified.ink} strokeWidth={2} aria-hidden />
      </Box>

      <Typography
        sx={{
          minWidth: 0,
          fontFamily: paperFont.body,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.5,
          color: ink.muted,
        }}
      >
        Registered agent support for{' '}
        {REGISTERED_AGENT_MARKETS.map((market, index) => (
          <Box key={market.code} component="span" sx={{ color: ink.strong, fontWeight: 600 }}>
            {market.name}
            {index < REGISTERED_AGENT_MARKETS.length - 2 ? ', ' : ''}
            {index === REGISTERED_AGENT_MARKETS.length - 2 ? ' and ' : ''}
          </Box>
        ))}
        .
      </Typography>
    </Box>
  )
}

/**
 * Hero footer strip — the evidence, and the one path out for a hard case.
 *
 * Previously two separate objects: a decorative SVG approval ring with two figures beside
 * it, and a bordered "Visa refusal support" panel. Both are here, both are now type on a
 * hairline. The ring is gone because a donut chart of a single percentage communicates
 * nothing the number does not, and it was competing with the console for the eye.
 *
 * The refusal path deserves its place in the hero rather than further down the page: a
 * visitor arriving after a rejection is the most anxious person who will read this page,
 * and making them scroll past six marketing sections to find help is a failure of care.
 */
export function HeroFooterStrip() {
  return (
    <Box
      sx={{
        mt: { xs: 5, xl: 6 },
        pt: { xs: 3.5, xl: 4 },
        borderTop: `1px solid ${paper.hairline}`,
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'minmax(0, 1.05fr) minmax(0, 0.95fr)' },
        gap: { xs: 4, xl: 6 },
        alignItems: 'start',
      }}
    >
      {/* Figures. Mono and tabular so the three align on their own baseline grid. */}
      <Box
        component="dl"
        sx={{
          m: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: { xs: 2, lg: 3 },
        }}
      >
        {TRUST_FIGURES.map((figure) => (
          <Box key={figure.label}>
            <Box
              component="dd"
              sx={{
                ...figureSx,
                m: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                fontSize: { xs: 20, lg: 23, xl: 26 },
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              {figure.value}
              {figure.starred ? (
                <Star
                  size={17}
                  strokeWidth={0}
                  fill={accent.fill}
                  aria-hidden
                  style={{ flex: '0 0 auto' }}
                />
              ) : null}
            </Box>
            <Box
              component="dt"
              sx={{
                mt: 1,
                fontFamily: paperFont.body,
                fontSize: 13.5,
                fontWeight: 600,
                lineHeight: 1.35,
                color: ink.strong,
              }}
            >
              {figure.label}
            </Box>
            <Typography
              sx={{
                mt: 0.25,
                fontFamily: paperFont.body,
                fontSize: 12.5,
                lineHeight: 1.35,
                color: ink.faint,
              }}
            >
              {figure.note}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Refusal path. A left rule instead of a box — it belongs to the hero, it is not a
          separate card sitting on top of it. */}
      <Box
        sx={{
          pl: { xs: 2.25, xl: 3 },
          borderLeft: `2px solid ${accent.border}`,
        }}
      >
        <Typography
          component="p"
          sx={{
            m: 0,
            fontFamily: paperFont.display,
            fontSize: { xs: 17, xl: 19 },
            fontWeight: 700,
            letterSpacing: '-0.018em',
            lineHeight: 1.3,
            color: ink.strong,
          }}
        >
          Visa refusal? Don&rsquo;t reapply blindly.
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontFamily: paperFont.body,
            fontSize: 14.5,
            lineHeight: 1.6,
            color: ink.muted,
          }}
        >
          Have a complicated case or previous rejection? A specialist will read the refusal
          notice and tell you what has to change before you file again.
        </Typography>

        <Button
          asChild
          variant="link"
          className="gl-refusal-link"
          sx={{ mt: 1.75, fontSize: 14.5 }}
        >
          {/* TODO(routing): there is no refusal-support route yet — `/services` is the
              closest real destination. Point this at a dedicated page when one exists. */}
          <Link to="/services">
            Get expert support
            <Box
              component="span"
              aria-hidden
              sx={{
                display: 'inline-flex',
                ml: 0.75,
                transition: 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1)',
                '.gl-refusal-link:hover &': { transform: 'translateX(3px)' },
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            >
              <ArrowRight size={16} />
            </Box>
          </Link>
        </Button>
      </Box>
    </Box>
  )
}
