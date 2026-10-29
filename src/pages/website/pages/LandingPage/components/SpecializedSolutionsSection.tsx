import { Box, Typography } from '@mui/material'
import { ArrowRight, Anchor, Building2, Handshake, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PaperSection, PaperSectionHeading } from '../../../components/PaperSection'
import { accent, ink, paper, paperFont, paperMotion, paperRadius, paperShadow } from '../../../theme/sitePaper'

const SOLUTIONS: {
  id: string
  title: string
  audience: string
  description: string
  ctaLabel: string
  href: string
  icon: LucideIcon
}[] = [
  {
    id: 'retail',
    title: 'Retail',
    audience: 'Individuals and families',
    description:
      'Tourist, business, visit and student applications with expert review and live tracking.',
    ctaLabel: 'Explore retail',
    href: '/countries',
    icon: Users,
  },
  {
    id: 'marine',
    title: 'Marine',
    audience: 'Seafarers and crew',
    description:
      'Crew-change visas, joining letters and port-specific requirements for shipping operators.',
    ctaLabel: 'Explore marine',
    href: '/marine-crew',
    icon: Anchor,
  },
  {
    id: 'corporate',
    title: 'Corporate',
    audience: 'Businesses and teams',
    description:
      'Centralised employee visa management across destinations, with one point of accountability.',
    ctaLabel: 'Explore corporate',
    href: '/corporate',
    icon: Building2,
  },
  {
    id: 'partners',
    title: 'Travel partners',
    audience: 'Agents and DMCs',
    description:
      'White-label visa processing for travel agents, DMCs and tour operators at volume.',
    ctaLabel: 'Partner with us',
    href: '/#final-cta',
    icon: Handshake,
  },
]

/**
 * Who we serve — the four business lines, which are also the site's top-level navigation.
 *
 * The `01 / 02 / 03 / 04` markers are gone. These four are not a sequence: nobody moves
 * from Retail to Marine to Corporate, and numbering an unordered set is decoration
 * pretending to be structure. Numbering survives in exactly one place on this page, the
 * process section, where the order genuinely is the information.
 *
 * The section lead previously described "the same clearance engine behind every one".
 * That is the machine register the rest of this rebuild is moving away from — a person
 * choosing who to trust with their passport is not reassured by being told there is an
 * engine.
 */
export function SpecializedSolutionsSection() {
  return (
    <PaperSection id="who-we-serve" ground="base" divided>
      <PaperSectionHeading
        eyebrow="Who we serve"
        title="Four lines. One process."
        lead="The same people and the same checks behind every one — set up for who is travelling, and why."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
          gap: { xs: 2, xl: 2.5 },
        }}
      >
        {SOLUTIONS.map((solution) => {
          const Icon = solution.icon

          return (
            <Box
              key={solution.id}
              component={Link}
              to={solution.href}
              className="gl-solution-card"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2.5, xl: 3 },
                minWidth: 0,
                textDecoration: 'none',
                backgroundColor: paper.white,
                border: `1px solid ${paper.hairline}`,
                borderRadius: paperRadius.card,
                transition: [
                  `border-color ${paperMotion.hoverMs}ms ease`,
                  `box-shadow ${paperMotion.hoverMs}ms ease`,
                  `transform ${paperMotion.hoverMs}ms ${paperMotion.easeOut}`,
                ].join(', '),

                '&:focus-visible': { outline: `2px solid ${ink.strong}`, outlineOffset: 2 },

                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: accent.border,
                    boxShadow: paperShadow.lift,
                  },
                  '&:hover .gl-solution-arrow': { transform: 'translateX(3px)' },
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: `border-color ${paperMotion.hoverMs}ms linear`,
                  '&:hover': { transform: 'none' },
                  '&:hover .gl-solution-arrow': { transform: 'none' },
                },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 38,
                  height: 38,
                  mb: 2,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: paperRadius.control,
                  border: `1px solid ${accent.border}`,
                  backgroundColor: accent.softer,
                  color: accent.ink,
                }}
              >
                <Icon size={18} strokeWidth={1.9} />
              </Box>

              <Typography
                component="h3"
                sx={{
                  m: 0,
                  fontFamily: paperFont.display,
                  fontSize: { xs: 17, xl: 18 },
                  fontWeight: 700,
                  letterSpacing: '-0.018em',
                  lineHeight: 1.25,
                  color: ink.strong,
                }}
              >
                {solution.title}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontFamily: paperFont.body,
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: ink.faint,
                }}
              >
                {solution.audience}
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  flex: 1,
                  fontFamily: paperFont.body,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: ink.muted,
                }}
              >
                {solution.description}
              </Typography>

              <Box
                sx={{
                  mt: 2.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  fontFamily: paperFont.body,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: accent.ink,
                }}
              >
                {solution.ctaLabel}
                <Box
                  component="span"
                  aria-hidden
                  className="gl-solution-arrow"
                  sx={{ display: 'inline-flex', transition: `transform 180ms ${paperMotion.easeOut}` }}
                >
                  <ArrowRight size={15} />
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
    </PaperSection>
  )
}
