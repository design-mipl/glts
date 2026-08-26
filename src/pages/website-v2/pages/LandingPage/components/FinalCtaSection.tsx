import { useState } from 'react'
import { Box, Typography, Stack, Button } from '@mui/material'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { finalCtaBackgroundImage } from '../../../assets/landingPageImages'
import {
  publicFonts,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
  getOutlinedButtonSx,
} from '@/shared/theme/publicBrand'
import { finalCtaContentSpacing, finalCtaSectionSx } from '../landingPageSpacing'

export function FinalCtaSection() {
  const colors = usePublicBrandColors()
  const [backgroundSrc, setBackgroundSrc] = useState<string>(finalCtaBackgroundImage.src)

  return (
    <Box
      component="section"
      id="final-cta"
      sx={finalCtaSectionSx}
    >
      <Box
        component="img"
        src={backgroundSrc}
        alt=""
        aria-hidden
        loading="lazy"
        onError={() => setBackgroundSrc(finalCtaBackgroundImage.fallback)}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center right',
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,31,63,0.72) 0%, rgba(0,31,63,0.45) 48%, rgba(0,31,63,0.2) 100%)',
        }}
      />

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Stack spacing={finalCtaContentSpacing} sx={{ maxWidth: 720 }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '28px', sm: '32px', md: '40px' },
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.7px',
              color: colors.white,
            }}
          >
            Ready to Submit With Confidence?
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '16px', md: '17px' },
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Get expert-reviewed visa assistance with real-time tracking, compliance checks, and
            dedicated support from start to finish.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
            <Button
              variant="contained"
              href="/v2/countries"
              endIcon={<ArrowRight size={18} />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                px: 4,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              Check Visa Requirements
            </Button>
            <Button
              variant="outlined"
              href="/v2/track"
              endIcon={<CalendarDays size={16} />}
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
              Talk to a Visa Expert
            </Button>
          </Stack>
        </Stack>
      </PublicContainer>
    </Box>
  )
}
