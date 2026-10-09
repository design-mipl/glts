import { Box, Typography, Stack, Button, keyframes } from '@mui/material'
import { ArrowRight, MessageCircle, Check } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
} from '../../../theme/publicSiteTokens'
import { websiteSecondaryButtonSx } from '../../../theme/websiteComponentStyles'
import { useHeroScrollParallax } from '../../../hooks/useHeroScrollParallax'
import { retailHeroCtas, retailHeroTrustPoints } from '../retailPageData'
import { RetailHeroBackgroundImage } from './RetailHeroBackgroundImage'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'

/** Match Marine / Corporate hero vertical rhythm. */
const retailHeroMinHeight = {
  xs: 620,
  md: 520,
  desktop: 540,
} as const

const retailHeroSpacing = {
  topPadding: { xs: '56px', desktop: '54px' },
  bottomPadding: { xs: '50px', desktop: '50px' },
  badgeToHeading: { xs: '14px', desktop: '16px' },
  headingToDescription: { xs: '18px', desktop: '20px' },
  descriptionToCta: { xs: '25px', desktop: '28px' },
  ctaToStats: { xs: '28px', desktop: '34px' },
} as const

const fadeInContent = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

export function RetailHero() {
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
        minHeight: retailHeroMinHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: retailHeroSpacing.topPadding,
        pb: retailHeroSpacing.bottomPadding,
      }}
    >
      <RetailHeroBackgroundImage parallaxOffsetY={offsetY} />

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
            width: { xs: '100%', md: '57%' },
            maxWidth: 620,
            animation: `${fadeInContent} 0.85s ease-out both`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: retailHeroSpacing.badgeToHeading, fontSize: 12, fontWeight: 800, letterSpacing: '.1em', color: colors.greenBright }}>
            <Box component="span" sx={{ width: 27, height: 3, bgcolor: colors.greenBright, borderRadius: 1 }} /> VISA SERVICES
          </Typography>

          <Typography
            component="h1"
            sx={{
              ...websiteHeadingSx.display,
              color: colors.white,
              mb: retailHeroSpacing.headingToDescription,
              maxWidth: 570,
            }}
          >
            Visa Services, Guided by Experts.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '16px', md: '17px' },
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.6,
              mb: retailHeroSpacing.descriptionToCta,
              maxWidth: 520,
              whiteSpace: 'pre-line',
            }}
          >
            From tourist and family visits to business, study, and transit travel, get clear
            requirements, expert document review, and a transparent path to submission.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: retailHeroSpacing.ctaToStats }}
          >
            <Button
              variant="contained"
              href={retailHeroCtas.primary.href}
              endIcon={<ArrowRight size={18} />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                px: 4,
                minHeight: 48,
                height: 48,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              {retailHeroCtas.primary.label}
            </Button>
            <Button
              variant="outlined"
              href={retailHeroCtas.secondary.href}
              endIcon={<MessageCircle size={16} />}
              sx={{
                ...websiteSecondaryButtonSx,
                borderColor: 'rgba(255, 255, 255, 0.45)',
                color: colors.white,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                px: 3.5,
                minHeight: 48,
                height: 48,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
                '&:hover': {
                  borderColor: colors.greenBright,
                  bgcolor: 'rgba(255, 255, 255, 0.18)',
                },
              }}
            >
              {retailHeroCtas.secondary.label}
            </Button>
          </Stack>

          <Box
            component="ul"
            aria-label="Visa service trust indicators"
            sx={{
              listStyle: 'none',
              m: 0,
              p: { xs: 1.5, md: 0 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 0,
              width: '100%',
              borderRadius: { xs: '16px', md: 0 },
              bgcolor: 'transparent',
              border: 'none',
            }}
          >
            {retailHeroTrustPoints.map(({ label }, index) => (
              <Box
                component="li"
                key={label}
                sx={{
                  flex: { md: '1 1 0' },
                  minWidth: 0,
                  minHeight: { sm: 46 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.1,
                  py: { xs: 1, sm: .75 },
                  px: { xs: 0, sm: 1.5 },
                  borderBottom: {
                    xs:
                      index < retailHeroTrustPoints.length - 1
                        ? '1px solid rgba(255,255,255,0.14)'
                        : 'none',
                    sm: 'none',
                  },
                  borderRight: {
                    xs: 'none',
                    sm:
                      index < retailHeroTrustPoints.length - 1
                        ? '1px solid rgba(255,255,255,0.22)'
                        : 'none',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 27,
                    height: 27,
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.16)`,
                    border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.65)`,
                  }}
                >
                  <Check size={16} color={colors.greenBright} strokeWidth={2.5} aria-hidden />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '13.5px', md: '13.5px' },
                    fontWeight: 600,
                    color: colors.white,
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
