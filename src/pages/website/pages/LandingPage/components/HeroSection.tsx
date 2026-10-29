import { Box, Typography } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  PUBLIC_NAV_HEIGHT_PX,
  landingPageHeroContentPt,
  landingPageHeroMinHeight,
} from '../landingPageSpacing'
import { accent, ink, paper, paperType } from '../../../theme/sitePaper'
import { RequirementConsole } from './RequirementConsole'
import { HeroDocumentStill } from './HeroDocumentStill'
import { HeroFooterStrip, RegisteredAgentLine } from './HeroAssurance'

/**
 * Homepage hero.
 *
 * The previous hero held nine competing objects in one viewport: headline, lead, console,
 * a decorative approval ring, two figures, a stock photograph of people the company has
 * never met, two floating name cards over that photograph, a live "clearance desk" stats
 * panel, and a four-card support strip beneath all of it. Every one of them was asking for
 * attention at the same volume, which is the definition of cluttered.
 *
 * This hero holds four, in the order a visitor actually needs them:
 *
 *   1. what this is           the headline and one paragraph
 *   2. the thing to do        the requirement console — the only lift and the only
 *                             saturated fill on the screen
 *   3. who is doing it        the registered-agent line, directly under the console
 *                             because it qualifies the console
 *   4. why to believe it,     the footer strip: three figures, and the way out for
 *      and the hard case      someone arriving after a refusal
 *
 * The illustration sits opposite rather than behind. Nothing reads over it, so it needs no
 * scrim, and the type keeps a clean paper ground at full contrast.
 *
 * Ground: `paper.base`, flat. The old hero painted a 32px technical grid plus a gold
 * radial bloom under everything; on a page whose job is to feel trustworthy rather than
 * instrumented, a visible machine texture behind the headline works against the brief.
 */
export function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        mt: `-${PUBLIC_NAV_HEIGHT_PX}px`,
        pt: `${PUBLIC_NAV_HEIGHT_PX}px`,
        pb: { xs: 7, xl: 9 },
        minHeight: landingPageHeroMinHeight,
        backgroundColor: paper.base,
        // A single soft warm lift behind the illustration side. Low enough that it reads
        // as light falling on paper rather than as a gradient.
        backgroundImage: `radial-gradient(ellipse 70% 60% at 78% 8%, ${accent.softer}, transparent 62%)`,
        overflow: 'hidden',
      }}
    >
      <PublicContainer
        variant="hero"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: {
            xs: `calc(100dvh - ${PUBLIC_NAV_HEIGHT_PX}px)`,
            md: landingPageHeroMinHeight.md,
            lg: landingPageHeroMinHeight.lg,
          },
          pt: landingPageHeroContentPt,
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            // `minmax(0, 1fr)` on the single-column tier too: a bare `1fr` takes its
            // automatic minimum from min-content, so one wide child (the console) blows
            // the track past the viewport and the whole page scrolls sideways.
            // The split waits for `xl` (900px) — at `md` it would fire on a 430px phone.
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'minmax(0, 1fr) minmax(0, 0.82fr)' },
            gap: { xs: 5, xl: 6, desktop: 8 },
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '100%', minWidth: 0, maxWidth: { xs: 880, xl: 620 } }}>
            {/* Eyebrow. Sentence case in the body face — the tracked-out mono that used to
                run here is now reserved for actual figures. */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: { xs: 2.5, xl: 3 } }}>
              <Box
                aria-hidden
                sx={{ width: 24, height: '2px', backgroundColor: accent.ink, flex: '0 0 auto' }}
              />
              <Typography component="p" sx={{ ...paperType.eyebrow, m: 0 }}>
                Visa applications, handled by specialists
              </Typography>
            </Box>

            <Typography component="h1" sx={{ ...paperType.hero, maxWidth: 620 }}>
              Visas done right
              <Box component="span" sx={{ color: ink.muted }}>
                {' '}
                &mdash; before they go wrong.
              </Box>
            </Typography>

            <Typography sx={{ ...paperType.lead, maxWidth: 500, mt: { xs: 2.5, xl: 3 } }}>
              Tell us where you are going and we will tell you exactly what that embassy
              needs. A specialist checks every document before it is filed, and you can see
              where your application is at any point.
            </Typography>

            <Box sx={{ mt: { xs: 4, xl: 4.5 } }}>
              <RequirementConsole />
            </Box>

            <RegisteredAgentLine />
          </Box>

          <HeroDocumentStill />
        </Box>

        <HeroFooterStrip />
      </PublicContainer>
    </Box>
  )
}
