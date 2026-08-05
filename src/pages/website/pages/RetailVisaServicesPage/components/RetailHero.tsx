import { Box, Typography, Stack, Chip, Button, keyframes } from '@mui/material'
import { ArrowRight, CalendarDays, User } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
  getOutlinedButtonSx,
} from '../../../theme/publicSiteTokens'
import { useHeroScrollParallax } from '../../../hooks/useHeroScrollParallax'
import { retailHeroCtas, retailHeroTrustPoints } from '../retailPageData'
import { RetailHeroBackgroundImage } from './RetailHeroBackgroundImage'

/** Match Marine / Corporate hero vertical rhythm. */
const retailHeroMinHeight = {
  xs: 580,
  md: 640,
  lg: 720,
} as const

const retailHeroSpacing = {
  topPadding: { xs: '92px', md: '100px', lg: '108px' },
  bottomPadding: { xs: '60px', md: '70px', lg: '80px' },
  badgeToHeading: { xs: '28px', md: '32px' },
  headingToDescription: { xs: '24px', md: '28px' },
  descriptionToCta: { xs: '36px', md: '40px' },
  ctaToStats: { xs: '48px', md: '56px' },
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
            width: { xs: '100%', lg: '62%', xl: '56%' },
            maxWidth: 720,
            animation: `${fadeInContent} 0.85s ease-out both`,
          }}
        >
          <Chip
            icon={<User size={14} />}
            label="RETAIL VISA SERVICES"
            sx={{
              height: 28,
              mb: retailHeroSpacing.badgeToHeading,
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
              fontSize: { xs: '34px', sm: '40px', md: '46px', lg: '52px' },
              fontWeight: 800,
              color: colors.white,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              mb: retailHeroSpacing.headingToDescription,
              maxWidth: 580,
            }}
          >
            Visas Done Right, Before They Go Wrong.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '16px', md: '17px' },
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.75,
              mb: retailHeroSpacing.descriptionToCta,
              maxWidth: 460,
              whiteSpace: 'pre-line',
            }}
          >
            {[
              'Expert-led review.',
              'Clear steps.',
              'Timely submission.',
              'Visa solutions for every kind of traveler.',
            ].join('\n')}
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
              endIcon={<CalendarDays size={16} />}
              sx={{
                ...getOutlinedButtonSx(),
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
            aria-label="Retail trust indicators"
            sx={{
              listStyle: 'none',
              m: 0,
              p: { xs: 1.5, md: 0 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 0,
              width: '100%',
              borderRadius: { xs: '16px', md: 0 },
              bgcolor: {
                xs: 'rgba(255, 255, 255, 0.06)',
                md: 'transparent',
              },
              border: {
                xs: '1px solid rgba(255, 255, 255, 0.12)',
                md: 'none',
              },
              backdropFilter: { xs: 'blur(12px)', md: 'none' },
            }}
          >
            {retailHeroTrustPoints.map(({ label, icon: Icon }, index) => (
              <Box
                component="li"
                key={label}
                sx={{
                  flex: { md: '1 1 0' },
                  minWidth: 0,
                  minHeight: { md: 64 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.75,
                  py: { xs: 1.75, md: 1.25 },
                  px: { xs: 1, md: 1.5 },
                  borderBottom: {
                    xs:
                      index < retailHeroTrustPoints.length - 1
                        ? '1px solid rgba(255,255,255,0.14)'
                        : 'none',
                    md: 'none',
                  },
                  borderRight: {
                    xs: 'none',
                    md:
                      index < retailHeroTrustPoints.length - 1
                        ? '1px solid rgba(255,255,255,0.22)'
                        : 'none',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '14px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.14)`,
                    border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.28)`,
                  }}
                >
                  <Icon size={20} color={colors.greenBright} strokeWidth={1.85} aria-hidden />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '13.5px', md: '14px' },
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
