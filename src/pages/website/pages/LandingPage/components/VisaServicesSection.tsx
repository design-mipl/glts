import { Box, Typography } from '@mui/material'
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Palmtree,
  PlaneTakeoff,
  Users,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PaperSection, PaperSectionHeading } from '../../../components/PaperSection'
import { accent, ink, paper, paperFont, paperMotion, paperRadius, paperShadow } from '../../../theme/sitePaper'

const VISA_SERVICES: {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href: string
}[] = [
  {
    id: 'tourist',
    title: 'Tourist',
    description: 'Holidays, leisure and short-term travel.',
    icon: Palmtree,
    href: '/countries?visaType=tourist',
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Meetings, conferences and client visits.',
    icon: Briefcase,
    href: '/countries?visaType=business',
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Overseas study and academic travel.',
    icon: GraduationCap,
    href: '/countries?visaType=student',
  },
  {
    id: 'transit',
    title: 'Transit',
    description: 'Layovers and onward travel through a third country.',
    icon: PlaneTakeoff,
    href: '/countries?visaType=transit',
  },
  {
    id: 'family',
    title: 'Visit & family',
    description: 'Visiting relatives, partners and friends.',
    icon: Users,
    href: '/countries?visaType=family',
  },
  {
    id: 'other',
    title: 'Everything else',
    description: 'Country-specific categories and unusual cases.',
    icon: Sparkles,
    href: '/countries',
  },
]

/**
 * Visa categories.
 *
 * Each cell carries its own filter link, so the section is a way into the product rather
 * than six routes to the same unfiltered list.
 *
 * This was the page's second dark band. The bands are gone: the site is one light surface
 * now, and separation comes from a one-step change of paper plus a hairline. Inverting to
 * near-black was the loudest device on the page and it was being spent on a list of six
 * categories — the least emotive content here.
 *
 * A second section, `RetailServicesBento`, listed these same six categories again ("Tourist
 * & Family", "Business", "Student", "Transit", "Refusal Cases") two scrolls later. It has
 * been removed rather than restyled.
 */
export function VisaServicesSection() {
  return (
    <PaperSection id="visa-services" ground="canvas">
      <PaperSectionHeading
        eyebrow="Visa categories"
        title="Every visa category, expertly managed."
        lead="Each one includes a pre-submission review by a specialist and a live application status you can check at any time."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          },
          gap: { xs: 2, xl: 2.5 },
        }}
      >
        {VISA_SERVICES.map((service) => {
          const Icon = service.icon

          return (
            <Box
              key={service.id}
              component={Link}
              to={service.href}
              className="gl-category-card"
              sx={{
                display: 'flex',
                gap: 2,
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
                  '&:hover .gl-category-arrow': { transform: 'translateX(3px)' },
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: `border-color ${paperMotion.hoverMs}ms linear`,
                  '&:hover': { transform: 'none' },
                  '&:hover .gl-category-arrow': { transform: 'none' },
                },
              }}
            >
              {/* One neutral icon treatment for every category — differentiate by glyph,
                  never by giving each type its own tinted background. */}
              <Box
                aria-hidden
                sx={{
                  flex: '0 0 auto',
                  width: 38,
                  height: 38,
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

              <Box sx={{ minWidth: 0, flex: 1 }}>
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
                  {service.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.75,
                    fontFamily: paperFont.body,
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: ink.muted,
                  }}
                >
                  {service.description}
                </Typography>

                <Box
                  sx={{
                    mt: 1.75,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    fontFamily: paperFont.body,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: accent.ink,
                  }}
                >
                  See destinations
                  <Box
                    component="span"
                    aria-hidden
                    className="gl-category-arrow"
                    sx={{
                      display: 'inline-flex',
                      transition: `transform 180ms ${paperMotion.easeOut}`,
                    }}
                  >
                    <ArrowRight size={15} />
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
    </PaperSection>
  )
}
