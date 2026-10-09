import { useState } from 'react'
import { Box, Typography, Stack, Button } from '@mui/material'
import { ArrowRight, Compass } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
  getOutlinedButtonSx,
} from '@/shared/theme/publicBrand'
import { aboutFinalCta } from '../aboutPageData'
import {
  finalCtaActionPt,
  finalCtaContentSpacing,
  finalCtaSectionSx,
} from '../../LandingPage/landingPageSpacing'

export function AboutFinalCtaSection() {
  const colors = usePublicBrandColors()
  const [backgroundSrc, setBackgroundSrc] = useState<string>(aboutFinalCta.image.src)

  return (
    <Box
      component="section"
      id="about-final-cta"
      sx={finalCtaSectionSx}
    >
      <Box
        component="img"
        src={backgroundSrc}
        alt=""
        aria-hidden
        loading="lazy"
        onError={() => setBackgroundSrc(aboutFinalCta.image.fallback)}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: { xs: '70% 55%', md: 'center 55%' },
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,31,63,0.64) 0%, rgba(0,31,63,0.38) 48%, rgba(0,31,63,0.18) 100%)',
        }}
      />

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Stack spacing={finalCtaContentSpacing} sx={{ maxWidth: 720 }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.display,
              fontSize: { xs: '28px', sm: '32px', md: '40px' },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.7px',
              color: colors.white,
            }}
          >
            {aboutFinalCta.heading}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '16px', md: '17px' },
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {aboutFinalCta.description}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: finalCtaActionPt }}>
            <Button
              variant="contained"
              href={aboutFinalCta.primaryButton.href}
              endIcon={<ArrowRight size={18} />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                px: 4,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              {aboutFinalCta.primaryButton.label}
            </Button>
            <Button
              variant="outlined"
              href={aboutFinalCta.secondaryButton.href}
              endIcon={<Compass size={16} />}
              sx={{
                ...getOutlinedButtonSx(),
                borderColor: 'rgba(255, 255, 255, 0.45)',
                color: colors.white,
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                px: 3.5,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
                '&:hover': {
                  borderColor: colors.greenBright,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {aboutFinalCta.secondaryButton.label}
            </Button>
          </Stack>
        </Stack>
      </PublicContainer>
    </Box>
  )
}
