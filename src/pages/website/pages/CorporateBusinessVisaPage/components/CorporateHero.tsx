import { Box, Typography, Grid, Stack, Chip, Button, keyframes } from '@mui/material'
import { ArrowRight, BriefcaseBusiness, CalendarDays } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicHeroPaddingTop,
  publicHeroSectionMinHeight,
} from '../../LandingPage/landingPageSpacing'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
  getOutlinedButtonSx,
} from '../../../theme/publicSiteTokens'
import { useHeroScrollParallax } from '../../../hooks/useHeroScrollParallax'
import { corporateHeroCtas } from '../corporatePageData'
import { CorporateHeroBackgroundImage } from './CorporateHeroBackgroundImage'

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
        minHeight: publicHeroSectionMinHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: publicHeroPaddingTop,
        pb: publicHeroPaddingTop,
        borderBottom: `1px solid ${colors.borderSoft}`,
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
        <Grid container spacing={{ xs: 4, lg: 5 }} alignItems="center" sx={{ width: '100%' }}>
          <Grid
            size={{ xs: 12, lg: 7 }}
            sx={{
              animation: `${fadeInContent} 0.85s ease-out both`,
            }}
          >
            <Chip
              icon={<BriefcaseBusiness size={14} />}
              label="CORPORATE VISA SERVICES"
              sx={{
                height: 28,
                mb: 2.5,
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
                mb: 2,
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
                mb: 3,
                maxWidth: 520,
              }}
            >
              Corporate visa handling for business travel, project assignments, and enterprise mobility
              teams — with dedicated account management and embassy-ready documentation.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="contained"
                href={corporateHeroCtas.primary.href}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  ...getMarketingPrimaryButtonSx(colors),
                  px: 4,
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
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
