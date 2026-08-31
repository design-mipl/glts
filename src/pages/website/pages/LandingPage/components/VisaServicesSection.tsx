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
import { SiteSection, SiteSectionHeading } from '../../../components/SiteSection'
import { site, siteFont, siteMotion, siteRadius, mrzSx } from '@/pages/website/theme/siteTheme'

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
 * Was a horizontally-scrolling rail of six 4:5 stock photographs — generic travel imagery
 * that told the reader nothing about the category and put six lazy images on the page.
 * Photography is kept where it is actually information (the destination cards, which show
 * the place you are going) and dropped where it is decoration.
 *
 * Each cell now carries the category's own filter link, so the section is a way into the
 * product rather than six routes to the same unfiltered list.
 */
export function VisaServicesSection() {
  return (
    <SiteSection id="visa-services" tone="canvas" sx={{ scrollMarginTop: 88 }}>
      <SiteSectionHeading
        eyebrow={`Categories · ${String(VISA_SERVICES.length).padStart(2, '0')}`}
        title="Every visa category, expertly managed."
        lead="Each one includes a pre-submission review by a specialist and a live application status you can check at any time."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
          gap: '1px',
          backgroundColor: site.hairline,
          border: `1px solid ${site.hairline}`,
          borderRadius: siteRadius.card,
          overflow: 'hidden',
        }}
      >
        {VISA_SERVICES.map((service) => {
          const Icon = service.icon
          return (
            <Box
              key={service.id}
              component="a"
              href={service.href}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3,
                p: { xs: 3.5, md: 4 },
                minHeight: 44,
                textDecoration: 'none',
                backgroundColor: site.surface,
                transition: `background-color 200ms ${siteMotion.easeOut}`,
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': { backgroundColor: site.canvas },
                  '&:hover .svcArrow': { transform: 'translateX(3px)', color: site.accentInk },
                },
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: `inset 0 0 0 2px ${site.accent}`,
                },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 32,
                  height: 32,
                  flex: '0 0 auto',
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

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: siteFont.display,
                    fontSize: 15.5,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: site.ink,
                    lineHeight: 1.25,
                    mb: 1,
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: siteFont.body,
                    fontSize: 13,
                    color: site.inkMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {service.description}
                </Typography>
                <Typography sx={{ ...mrzSx, fontSize: 9.5, mt: 2, color: site.inkFaint }}>
                  See destinations
                </Typography>
              </Box>

              <Box
                aria-hidden
                className="svcArrow"
                sx={{
                  flex: '0 0 auto',
                  display: 'inline-flex',
                  color: site.inkFaint,
                  mt: 0.5,
                  transition: `transform 180ms ${siteMotion.easeOut}, color 180ms ${siteMotion.easeOut}`,
                }}
              >
                <ArrowRight size={15} />
              </Box>
            </Box>
          )
        })}
      </Box>
    </SiteSection>
  )
}
