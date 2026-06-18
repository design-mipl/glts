import { Box, Typography, Grid, Stack, Chip, Button, keyframes } from '@mui/material'
import { Anchor, ArrowRight, CalendarDays } from 'lucide-react'
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
import { marineHeroCtas } from '../marinePageData'
import { MarineHeroBackgroundVideo } from './MarineHeroBackgroundVideo'

const fadeInContent = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

export function MarineHero() {
  const colors = usePublicBrandColors()

  return (
    <Box
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
      <MarineHeroBackgroundVideo />

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
              icon={<Anchor size={14} />}
              label="MARINE CREW VISA SERVICES"
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
              }}
            >
              Marine Crew Visa Services
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
              Visa handling built for seafarers, offshore crew, superintendents, and marine operations
              teams — with accuracy, speed, and regulatory compliance at every stage.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="contained"
                href={marineHeroCtas.primary.href}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  ...getMarketingPrimaryButtonSx(colors),
                  px: 4,
                  alignSelf: { xs: 'stretch', sm: 'flex-start' },
                }}
              >
                {marineHeroCtas.primary.label}
              </Button>
              <Button
                variant="outlined"
                href={marineHeroCtas.secondary.href}
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
                {marineHeroCtas.secondary.label}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
