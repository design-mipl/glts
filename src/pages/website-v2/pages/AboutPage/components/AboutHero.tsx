import { Box, Typography, Stack, Chip, Button, keyframes } from '@mui/material'
import { ArrowRight, Building2 } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
} from '../../../theme/publicSiteTokens'
import { useHeroScrollParallax } from '../../../hooks/useHeroScrollParallax'
import { aboutHeroContent } from '../aboutPageData'
import { AboutHeroBackgroundImage } from './AboutHeroBackgroundImage'

const aboutHeroMinHeight = {
  xs: 520,
  md: 580,
  lg: 640,
} as const

const aboutHeroSpacing = {
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

export function AboutHero() {
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
        minHeight: aboutHeroMinHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: aboutHeroSpacing.topPadding,
        pb: aboutHeroSpacing.bottomPadding,
      }}
    >
      <AboutHeroBackgroundImage parallaxOffsetY={offsetY} />

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
            icon={<Building2 size={14} />}
            label={aboutHeroContent.label}
            sx={{
              height: 28,
              mb: aboutHeroSpacing.badgeToHeading,
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
              fontFamily: publicFonts.display,
              fontSize: { xs: '34px', sm: '40px', md: '46px' },
              fontWeight: 700,
              color: colors.white,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              mb: aboutHeroSpacing.headingToDescription,
              maxWidth: 640,
            }}
          >
            {aboutHeroContent.heading}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '16px', md: '17px' },
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.7,
              mb: aboutHeroSpacing.descriptionToCta,
              maxWidth: 540,
            }}
          >
            {aboutHeroContent.description}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              href={aboutHeroContent.primaryCta.href}
              endIcon={<ArrowRight size={18} />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                px: 4,
                minHeight: 48,
                height: 48,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              {aboutHeroContent.primaryCta.label}
            </Button>
          </Stack>
        </Box>
      </PublicContainer>
    </Box>
  )
}
