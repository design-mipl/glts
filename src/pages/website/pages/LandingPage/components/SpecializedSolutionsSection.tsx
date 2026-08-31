import { Box, Typography } from '@mui/material'
import { Anchor, Building2, Handshake, User, ArrowRight, type LucideIcon } from 'lucide-react'
import { SiteSection, SiteSectionHeading } from '../../../components/SiteSection'
import {
  site,
  siteFont,
  siteMotion,
  siteRadius,
  mrzSx,
  clippedCorner,
} from '@/pages/website/theme/siteTheme'

const SOLUTIONS: {
  id: string
  icon: LucideIcon
  title: string
  summary: string
  description: string
  ctaLabel: string
  href: string
}[] = [
  {
    id: 'retail',
    icon: User,
    title: 'Retail',
    summary: 'Individuals and families',
    description:
      'Tourist, business, visit and student applications with expert review and live tracking.',
    ctaLabel: 'Explore retail',
    href: '/countries',
  },
  {
    id: 'marine',
    icon: Anchor,
    title: 'Marine',
    summary: 'Seafarers and crew',
    description:
      'Crew-change visas, joining letters and port-specific requirements for shipping operators.',
    ctaLabel: 'Explore marine',
    href: '/marine-crew',
  },
  {
    id: 'corporate',
    icon: Building2,
    title: 'Corporate',
    summary: 'Businesses and teams',
    description:
      'Centralised employee visa management across destinations, with one point of accountability.',
    ctaLabel: 'Explore corporate',
    href: '/corporate',
  },
  {
    id: 'travel-partners',
    icon: Handshake,
    title: 'Travel partners',
    summary: 'Agents and DMCs',
    description:
      'White-label visa processing for travel agents, DMCs and tour operators at volume.',
    ctaLabel: 'Partner with us',
    href: '/#final-cta',
  },
]

/**
 * Business lines.
 *
 * Four cards, each cut with the travel-document corner so the section reads as a set of
 * passes. The previous version stacked a photograph, a shadow, a 6px hover lift and a
 * staggered scroll reveal on each — four separate attention devices for content whose job
 * is simply to route four audiences to the right page.
 */
export function SpecializedSolutionsSection() {
  return (
    <SiteSection id="specialized-solutions">
      <SiteSectionHeading
        eyebrow="Who we serve"
        title="Four lines. One process."
        lead="The same clearance engine behind every one — configured for who is travelling and why."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        {SOLUTIONS.map((solution, index) => {
          const Icon = solution.icon
          return (
            <Box
              key={solution.id}
              component="a"
              href={solution.href}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 3.5, md: 4 },
                textDecoration: 'none',
                border: `1px solid ${site.hairline}`,
                borderRadius: siteRadius.card,
                clipPath: clippedCorner(16),
                backgroundColor: site.surface,
                transition: `border-color 200ms ${siteMotion.easeOut}, background-color 200ms ${siteMotion.easeOut}`,
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': { borderColor: site.accentBorder, backgroundColor: site.accentSoft },
                  '&:hover .solArrow': { transform: 'translateX(3px)' },
                },
                '&:focus-visible': {
                  outline: 'none',
                  borderColor: site.accent,
                  boxShadow: `0 0 0 3px ${site.accentRing}`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 32,
                    height: 32,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: siteRadius.chip,
                    border: `1px solid ${site.hairline}`,
                    backgroundColor: site.canvas,
                    color: site.inkMuted,
                  }}
                >
                  <Icon size={15} strokeWidth={1.9} />
                </Box>
                <Typography sx={{ ...mrzSx, fontSize: 9.5 }}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: siteFont.display,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: site.ink,
                  lineHeight: 1.2,
                }}
              >
                {solution.title}
              </Typography>
              <Typography sx={{ ...mrzSx, fontSize: 9.5, mt: 1.25 }}>{solution.summary}</Typography>

              <Typography
                sx={{
                  fontFamily: siteFont.body,
                  fontSize: 13,
                  color: site.inkMuted,
                  lineHeight: 1.55,
                  mt: 2.5,
                  mb: 3,
                }}
              >
                {solution.description}
              </Typography>

              <Box
                sx={{
                  mt: 'auto',
                  pt: 2.5,
                  borderTop: `1px solid ${site.hairlineSoft}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: site.ink,
                  fontFamily: siteFont.body,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {solution.ctaLabel}
                <Box
                  component="span"
                  className="solArrow"
                  sx={{
                    display: 'inline-flex',
                    transition: `transform 180ms ${siteMotion.easeOut}`,
                  }}
                >
                  <ArrowRight size={14} />
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
    </SiteSection>
  )
}
