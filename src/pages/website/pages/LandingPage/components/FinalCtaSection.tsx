import { Box, Typography, Stack } from '@mui/material'
import { ArrowRight, Radar } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  site,
  siteFont,
  siteMotion,
  siteRadius,
  mrzSx,
  clippedCorner,
} from '@/pages/website/theme/siteTheme'
import { accentGoldRgb } from '@/pages/website/theme/applyFlowTheme'

/**
 * Closing CTA.
 *
 * The dark ground is the apply flow's navigation rail navy, carrying the same fine
 * technical grid — so the last thing on the marketing page is visibly the surface the
 * application itself runs on. It replaces a stock photograph under a navy scrim, which
 * was costing a full-size image download to produce a colour we already had a token for.
 *
 * Two actions, ranked: gold fill for the one we want, hairline for the other. Never two
 * filled buttons side by side.
 */
export function FinalCtaSection() {
  return (
    <Box
      component="section"
      id="final-cta"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 10, md: 14 },
        backgroundColor: site.railBg,
        backgroundImage: [
          `radial-gradient(ellipse 55% 60% at 88% 10%, rgba(${accentGoldRgb}, 0.16), transparent 62%)`,
          `linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px)`,
          `linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px)`,
        ].join(', '),
        backgroundSize: 'auto, 48px 48px, 48px 48px',
        backgroundRepeat: 'no-repeat, repeat, repeat',
      }}
    >
      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Box sx={{ maxWidth: 720 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3.5 }}>
            <Box
              aria-hidden
              sx={{ width: 22, height: '1px', backgroundColor: site.accent, flex: '0 0 auto' }}
            />
            <Typography sx={{ ...mrzSx, color: site.railTextFaint }}>Start an application</Typography>
          </Stack>

          <Typography
            component="h2"
            sx={{
              fontFamily: siteFont.display,
              fontSize: { xs: 28, sm: 34, md: 42 },
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: site.railText,
            }}
          >
            Know it is right
            <Box component="span" sx={{ color: site.accent }}> before you submit.</Box>
          </Typography>

          <Typography
            sx={{
              fontFamily: siteFont.body,
              fontSize: { xs: 15, md: 16.5 },
              lineHeight: 1.6,
              color: site.railTextMuted,
              mt: 3,
              maxWidth: 560,
            }}
          >
            Requirements resolved for your exact destination and residence, documents checked by
            an expert before filing, and a live status you can read at any hour.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 5 }}>
            <Box
              component="a"
              href="/countries"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                px: 4.5,
                minHeight: 48,
                borderRadius: siteRadius.control,
                clipPath: clippedCorner(12),
                backgroundColor: site.accent,
                color: site.onAccent,
                textDecoration: 'none',
                fontFamily: siteFont.body,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                transition: `background-color 150ms ${siteMotion.easeOut}, transform ${siteMotion.pressMs}ms ${siteMotion.easeOut}`,
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': { backgroundColor: site.accentStrong },
                  '&:hover .ctaArrow': { transform: 'translateX(3px)' },
                },
                '&:active': { transform: 'scale(0.97)' },
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: `0 0 0 3px ${site.accentRing}`,
                },
              }}
            >
              Check visa requirements
              <Box
                component="span"
                className="ctaArrow"
                sx={{ display: 'inline-flex', transition: `transform 180ms ${siteMotion.easeOut}` }}
              >
                <ArrowRight size={16} />
              </Box>
            </Box>

            <Box
              component="a"
              href="/track"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                px: 4,
                minHeight: 48,
                borderRadius: siteRadius.control,
                border: `1px solid ${site.railLineStrong}`,
                color: site.railText,
                textDecoration: 'none',
                fontFamily: siteFont.body,
                fontSize: 14,
                fontWeight: 600,
                transition: `border-color 150ms ${siteMotion.easeOut}, background-color 150ms ${siteMotion.easeOut}`,
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': {
                    borderColor: site.accent,
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  },
                },
                '&:active': { transform: 'scale(0.98)' },
                '&:focus-visible': {
                  outline: 'none',
                  borderColor: site.accent,
                  boxShadow: `0 0 0 3px ${site.accentRing}`,
                },
              }}
            >
              <Radar size={15} strokeWidth={1.9} />
              Track an application
            </Box>
          </Stack>
        </Box>
      </PublicContainer>
    </Box>
  )
}
