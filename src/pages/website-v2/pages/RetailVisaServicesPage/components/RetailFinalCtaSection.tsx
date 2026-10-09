import { useState } from 'react'
import { Box, Typography, Stack, Button } from '@mui/material'
import { ArrowRight, CalendarDays, Check } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
  getOutlinedButtonSx,
} from '@/shared/theme/publicBrand'
import { finalCtaSectionPy, finalCtaSectionSx } from '../../LandingPage/landingPageSpacing'
import { retailFinalCta } from '../retailPageData'

export function RetailFinalCtaSection() {
  const colors = usePublicBrandColors()
  const [backgroundSrc, setBackgroundSrc] = useState(retailFinalCta.image.src)

  return (
    <Box
      component="section"
      id="final-cta"
      sx={{ ...finalCtaSectionSx, minHeight: { xs: 440, sm: 350, md: 360 }, py: finalCtaSectionPy, '&:last-child': { mb: 0 } }}
    >
      <Box
        component="img"
        src={backgroundSrc}
        alt=""
        aria-hidden
        loading="lazy"
        onError={() => setBackgroundSrc(retailFinalCta.image.fallback)}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: { xs: '65% center', sm: '63% 30%', md: 'center 20%' },
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: 'linear-gradient(90deg, rgba(0,31,63,0.9) 0%, rgba(0,31,63,0.74) 58%, rgba(0,31,63,0.58) 100%)',
            md: 'linear-gradient(90deg, rgba(0,31,63,0.9) 0%, rgba(0,31,63,0.72) 36%, rgba(0,31,63,0.28) 76%, rgba(0,31,63,0.16) 100%)',
          },
        }}
      />

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.greenBright, fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            <Box component="span" sx={{ width: 26, height: 3, bgcolor: colors.greenBright, borderRadius: 1 }} /> Get started today
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.display,
              fontSize: { xs: '29px', sm: '34px', md: '39px' },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.7px',
              color: colors.white,
            }}
          >
            {retailFinalCta.heading}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '16px', md: '17px' },
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {retailFinalCta.description}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: .5 }}>
            <Button
              variant="contained"
              href={retailFinalCta.primaryButton.href}
              endIcon={<ArrowRight size={18} />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                px: 4,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              {retailFinalCta.primaryButton.label}
            </Button>
            <Button
              variant="outlined"
              href={retailFinalCta.secondaryButton.href}
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
              {retailFinalCta.secondaryButton.label}
            </Button>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 3 }}
            sx={{ pt: 1 }}
            component="ul"
            aria-label="Trust points"
          >
            {retailFinalCta.trustPoints.map((point) => (
              <Box
                component="li"
                key={point}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  listStyle: 'none',
                }}
              >
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.22)`,
                    border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.4)`,
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} color={colors.greenBright} strokeWidth={3} aria-hidden />
                </Box>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.88)',
                    lineHeight: 1.3,
                  }}
                >
                  {point}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </PublicContainer>
    </Box>
  )
}
