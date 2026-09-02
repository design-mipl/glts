import { Box, Typography } from '@mui/material'
import { ArrowRight, Crosshair, FileCheck2, UserRound, Waypoints, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PaperSection } from '../../../components/PaperSection'
import { Button } from '../../../components/ui'
import { accent, ink, paper, paperFont, paperRadius, paperType } from '../../../theme/sitePaper'

const PREMIUM_FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'A named specialist',
    description: 'One person owns your case end to end, and you have their name.',
    icon: UserRound,
  },
  {
    title: 'Document review',
    description: 'Every file checked for embassy fit, accuracy and completeness before filing.',
    icon: FileCheck2,
  },
  {
    title: 'Priority handling',
    description: 'Your application moves to the front of the queue at each internal stage.',
    icon: Crosshair,
  },
  {
    title: 'Support after the decision',
    description: 'Appeals, re-applications and travel changes stay with the same team.',
    icon: Waypoints,
  },
]

/**
 * Visa Master — the premium tier.
 *
 * This is the one section on the page allowed to sit apart, so it takes `paper.deep`, the
 * bottom step of the ladder. That step exists for exactly this: a single deliberate
 * emphasis band, reached without inverting to near-black.
 *
 * The previous version painted the apply flow's deep navy rail across the full bleed, with
 * a gold CTA. On a page that is now one continuous light surface, a near-black band here
 * would be the loudest thing on the homepage — spent not on the hero or the close, but on
 * an upsell. Emphasis by one step of paper and a green rule is proportionate to what this
 * section is actually asking for.
 *
 * NOTE: also mounted on `ServicesPage`. The change of ground applies there too, which is
 * intended — the whole site is moving to the light surface.
 */
export function VisaMasterSection() {
  return (
    <PaperSection id="visa-master" ground="deep" divided>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'minmax(0, 0.9fr) minmax(0, 1.1fr)' },
          gap: { xs: 5, xl: 7 },
          alignItems: 'start',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2 }}>
            <Box
              aria-hidden
              sx={{ width: 22, height: '2px', backgroundColor: accent.ink, flex: '0 0 auto' }}
            />
            <Typography component="p" sx={{ ...paperType.eyebrow, m: 0 }}>
              Premium tier
            </Typography>
          </Box>

          <Typography component="h2" sx={paperType.section}>
            Visa Master
          </Typography>

          <Typography sx={{ ...paperType.lead, mt: 2, maxWidth: 460 }}>
            Assisted end to end, with a named specialist, priority handling and full
            visibility. For travel where a refusal is not an acceptable outcome.
          </Typography>

          <Box sx={{ mt: 3.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2.5 }}>
            <Button asChild size="lg" className="gl-visamaster-cta">
              <Link to="/countries">
                Explore Visa Master
                <Box
                  component="span"
                  aria-hidden
                  sx={{
                    display: 'inline-flex',
                    transition: 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1)',
                    '.gl-visamaster-cta:hover &': { transform: 'translateX(3px)' },
                    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                  }}
                >
                  <ArrowRight size={17} />
                </Box>
              </Link>
            </Button>

            <Typography
              sx={{ fontFamily: paperFont.body, fontSize: 13.5, lineHeight: 1.4, color: ink.faint }}
            >
              Available on any destination
            </Typography>
          </Box>
        </Box>

        {/* The four promises. A white panel on the deep ground, divided by hairlines
            rather than split into four separate cards — one object, four claims. */}
        <Box
          sx={{
            minWidth: 0,
            backgroundColor: paper.white,
            border: `1px solid ${paper.hairline}`,
            borderRadius: paperRadius.panel,
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          {PREMIUM_FEATURES.map((feature, index) => {
            const Icon = feature.icon

            return (
              <Box
                key={feature.title}
                sx={{
                  p: { xs: 2.5, xl: 3 },
                  minWidth: 0,
                  // Hairlines between cells only — never on the panel's outer edge.
                  borderTop: index > 0 ? `1px solid ${paper.hairlineSoft}` : 'none',
                  borderLeft: 'none',
                  '@media (min-width: 600px)': {
                    borderTop: index > 1 ? `1px solid ${paper.hairlineSoft}` : 'none',
                    borderLeft: index % 2 === 1 ? `1px solid ${paper.hairlineSoft}` : 'none',
                  },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 34,
                    height: 34,
                    mb: 1.75,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: paperRadius.control,
                    border: `1px solid ${accent.border}`,
                    backgroundColor: accent.softer,
                    color: accent.ink,
                  }}
                >
                  <Icon size={17} strokeWidth={1.9} />
                </Box>

                <Typography
                  component="h3"
                  sx={{
                    m: 0,
                    mb: 0.75,
                    fontFamily: paperFont.body,
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3,
                    color: ink.strong,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  sx={{ fontFamily: paperFont.body, fontSize: 14, lineHeight: 1.6, color: ink.muted }}
                >
                  {feature.description}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>
    </PaperSection>
  )
}
