import { Box, Typography, Stack, Chip, Button, keyframes } from '@mui/material'
import { ArrowDown, Layers } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
} from '../../../theme/publicSiteTokens'
import { useHeroScrollParallax } from '../../../hooks/useHeroScrollParallax'
import { servicesHeroContent } from '../servicesPageData'
import { ServicesHeroBackgroundImage } from './ServicesHeroBackgroundImage'

const servicesHeroMinHeight = {
  xs: 520,
  md: 580,
  lg: 640,
} as const

const servicesHeroSpacing = {
  topPadding: { xs: '92px', md: '100px', lg: '108px' },
  bottomPadding: { xs: '60px', md: '70px', lg: '80px' },
  badgeToHeading: { xs: '28px', md: '32px' },
  headingToDescription: { xs: '24px', md: '28px' },
  descriptionToCta: { xs: '36px', md: '40px' },
} as const

const fadeInContent = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

export function ServicesHero() {
  const colors = usePublicBrandColors()
  const { sectionRef, offsetY } = useHeroScrollParallax()

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: colors.navy,
        minHeight: servicesHeroMinHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: servicesHeroSpacing.topPadding,
        pb: servicesHeroSpacing.bottomPadding,
      }}
    >
      <ServicesHeroBackgroundImage parallaxOffsetY={offsetY} />

      <PublicContainer
        variant="hero"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 720,
            animation: `${fadeInContent} 0.85s ease-out both`,
          }}
        >
          <Chip
            icon={<Layers size={14} />}
            label={servicesHeroContent.label}
            sx={{
              height: 28,
              mb: servicesHeroSpacing.badgeToHeading,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.18)`,
              color: colors.greenBright,
              border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.35)`,
              '& .MuiChip-icon': { color: colors.greenBright, ml: 1 },
            }}
          />

          <Typography
            component="h1"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '34px', sm: '40px', md: '46px' },
              fontWeight: 800,
              color: colors.white,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              mb: servicesHeroSpacing.headingToDescription,
              maxWidth: 640,
            }}
          >
            {servicesHeroContent.heading}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '16px', md: '17px' },
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.7,
              mb: servicesHeroSpacing.descriptionToCta,
              maxWidth: 540,
            }}
          >
            {servicesHeroContent.description}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              href={servicesHeroContent.primaryCta.href}
              endIcon={<ArrowDown size={18} />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                px: 4,
                minHeight: 48,
                height: 48,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              {servicesHeroContent.primaryCta.label}
            </Button>
          </Stack>
        </Box>
      </PublicContainer>
    </Box>
  )
}
