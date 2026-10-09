import { Box, Typography, Stack, Chip, Button, keyframes } from '@mui/material'
import { ArrowRight, BriefcaseBusiness, CalendarDays } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
  getOutlinedButtonSx,
} from '../../../theme/publicSiteTokens'
import { useHeroScrollParallax } from '../../../hooks/useHeroScrollParallax'
import { corporateHeroCtas, corporateHeroStats } from '../corporatePageData'
import { CorporateHeroBackgroundImage } from './CorporateHeroBackgroundImage'

/** Match Marine hero vertical rhythm. */
const corporateHeroMinHeight = {
  xs: 580,
  md: 640,
  lg: 720,
} as const

const corporateHeroSpacing = {
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

export function CorporateHero() {
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
        minHeight: corporateHeroMinHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: corporateHeroSpacing.topPadding,
        pb: corporateHeroSpacing.bottomPadding,
      }}
    >
      <CorporateHeroBackgroundImage parallaxOffsetY={offsetY} />

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
            maxWidth: 1100,
            animation: `${fadeInContent} 0.85s ease-out both`,
          }}
        >
          <Chip
            icon={<BriefcaseBusiness size={14} />}
            label="CORPORATE VISA SERVICES"
            sx={{
              height: 28,
              mb: corporateHeroSpacing.badgeToHeading,
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
              mb: corporateHeroSpacing.headingToDescription,
              maxWidth: 620,
            }}
          >
            Business Travel Visa Services
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '16px', md: '17px' },
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.7,
              mb: corporateHeroSpacing.descriptionToCta,
              maxWidth: 520,
            }}
          >
            Corporate visa handling for business travel, project assignments, and enterprise mobility
            teams — with dedicated account management and embassy-ready documentation.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: corporateHeroSpacing.ctaToStats }}
          >
            <Button
              variant="contained"
              href={corporateHeroCtas.primary.href}
              endIcon={<ArrowRight size={18} />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                px: 4,
                minHeight: 48,
                height: 48,
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              {corporateHeroCtas.primary.label}
            </Button>
            <Button
              variant="outlined"
              href={corporateHeroCtas.secondary.href}
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
              {corporateHeroCtas.secondary.label}
            </Button>
          </Stack>

          <Box
            component="ul"
            aria-label="Corporate trust metrics"
            sx={{
              listStyle: 'none',
              m: 0,
              p: { xs: 1.5, md: 0 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'stretch' },
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
            {corporateHeroStats.map(({ value, label, icon: Icon }, index) => (
              <Box
                component="li"
                key={label}
                sx={{
                  flex: { md: '1 1 0' },
                  minWidth: 0,
                  minHeight: { md: 64 },
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2.25,
                  py: { xs: 2, md: 1.25 },
                  px: { xs: 1, md: 1.75 },
                  borderBottom: {
                    xs:
                      index < corporateHeroStats.length - 1
                        ? '1px solid rgba(255,255,255,0.14)'
                        : 'none',
                    md: 'none',
                  },
                  borderRight: {
                    xs: 'none',
                    md:
                      index < corporateHeroStats.length - 1
                        ? '1px solid rgba(255,255,255,0.22)'
                        : 'none',
                  },
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  borderRadius: { xs: '10px', md: 0 },
                  '@media (hover: hover)': {
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.06)',
                      transform: 'translateY(-1px)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.14)`,
                    border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.28)`,
                  }}
                >
                  <Icon size={26} color={colors.greenBright} strokeWidth={1.85} aria-hidden />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontSize: { xs: '22px', md: '24px', lg: '26px' },
                      fontWeight: 800,
                      color: colors.greenBright,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.05,
                      mb: 0.4,
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '12px', md: '12.5px' },
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.82)',
                      lineHeight: 1.35,
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
