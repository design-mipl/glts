import { Box, Typography } from '@mui/material'
import { ArrowRight, BedDouble, FileSignature, PlaneTakeoff, ShieldCheck, Stamp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PaperSection } from '../../../components/PaperSection'
import { Button } from '../../../components/ui'
import { accent, ink, paper, paperFont, paperRadius, paperType } from '../../../theme/sitePaper'

const EXTRAS = [
  { label: 'Travel insurance', icon: ShieldCheck },
  { label: 'Attestation', icon: Stamp },
  { label: 'Notary', icon: FileSignature },
  { label: 'Flight reservation', icon: PlaneTakeoff },
  { label: 'Hotel booking', icon: BedDouble },
] as const

/**
 * Extra services — a mention, not a section.
 *
 * The homepage previously mounted the full 634-line `AdditionalServicesSection` shared
 * component here: five large cards with descriptions and their own CTAs, roughly a screen
 * of page given to insurance, attestation and hotel bookings. That is a lot of attention
 * for the things a visitor is least likely to have come for, and it arrived immediately
 * after three other "here is what we offer" sections.
 *
 * These now have a page of their own (`/extra-services`), so the homepage's job is only to
 * say the service exists and point at it. The shared component is untouched and still
 * serves that page.
 */
export function AdditionalServicesSection() {
  return (
    <PaperSection id="extra-services" ground="canvas">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'minmax(0, 0.85fr) minmax(0, 1.15fr)' },
          gap: { xs: 3.5, xl: 6 },
          alignItems: 'center',
          p: { xs: 3, xl: 4 },
          backgroundColor: paper.white,
          border: `1px solid ${paper.hairline}`,
          borderRadius: paperRadius.panel,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography component="p" sx={{ ...paperType.eyebrow, m: 0, mb: 1.25 }}>
            Extra services
          </Typography>

          <Typography
            component="h2"
            sx={{
              m: 0,
              fontFamily: paperFont.display,
              fontSize: { xs: 21, xl: 25 },
              fontWeight: 700,
              letterSpacing: '-0.022em',
              lineHeight: 1.2,
              color: ink.strong,
            }}
          >
            The paperwork around the paperwork.
          </Typography>

          <Typography
            sx={{ mt: 1.5, fontFamily: paperFont.body, fontSize: 14.5, lineHeight: 1.6, color: ink.muted }}
          >
            Documents and bookings embassies often ask for alongside the application. Add
            them to a file you already have with us.
          </Typography>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              m: 0,
              p: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {EXTRAS.map((extra) => {
              const Icon = extra.icon

              return (
                <Box
                  component="li"
                  key={extra.label}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    height: 36,
                    px: 1.75,
                    borderRadius: paperRadius.pill,
                    border: `1px solid ${paper.hairline}`,
                    backgroundColor: paper.base,
                    fontFamily: paperFont.body,
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: ink.strong,
                  }}
                >
                  <Icon size={15} strokeWidth={1.9} color={accent.ink} aria-hidden />
                  {extra.label}
                </Box>
              )
            })}
          </Box>

          <Button asChild variant="secondary" className="gl-extras-cta" sx={{ mt: 2.5 }}>
            <Link to="/extra-services">
              See extra services
              <Box
                component="span"
                aria-hidden
                sx={{
                  display: 'inline-flex',
                  transition: 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1)',
                  '.gl-extras-cta:hover &': { transform: 'translateX(3px)' },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              >
                <ArrowRight size={16} />
              </Box>
            </Link>
          </Button>
        </Box>
      </Box>
    </PaperSection>
  )
}
