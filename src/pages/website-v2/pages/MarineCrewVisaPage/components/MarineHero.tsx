import { Box, Typography, Stack, Chip, Button, keyframes } from '@mui/material'
import {
  Anchor,
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Globe2,
  Ship,
  type LucideIcon,
} from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
  getOutlinedButtonSx,
} from '../../../theme/publicSiteTokens'
import { marineHeroCtas } from '../marinePageData'
import { MarineHeroBackgroundVideo } from './MarineHeroBackgroundVideo'

/** Taller immersive banner for the marine crew solution page. */
const marineHeroMinHeight = {
  xs: 580,
  md: 640,
  lg: 720,
} as const

/** Vertical rhythm aligned to the reference hero. */
const marineHeroSpacing = {
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

const marineHeroStats: {
  value: string
  label: string
  icon: LucideIcon
}[] = [
  { value: '50K+', label: 'Seafarers Served', icon: ClipboardCheck },
  { value: '120+', label: 'Countries Covered', icon: Globe2 },
  { value: '300+', label: 'Global Partners', icon: Anchor },
  { value: '98%', label: 'On-Time Delivery', icon: Ship },
]

export function MarineHero() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: colors.navy,
        minHeight: marineHeroMinHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: marineHeroSpacing.topPadding,
        pb: marineHeroSpacing.bottomPadding,
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
        <Box
          sx={{
            width: { xs: '100%', lg: '72%', xl: '68%' },
            maxWidth: 860,
            animation: `${fadeInContent} 0.85s ease-out both`,
          }}
        >
          <Chip
            icon={<Anchor size={14} />}
            label="MARINE CREW VISA SERVICES"
            sx={{
              height: 28,
              mb: marineHeroSpacing.badgeToHeading,
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
              fontSize: { xs: '40px', sm: '48px', md: '56px', lg: '64px' },
              fontWeight: 800,
              color: colors.white,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              mb: marineHeroSpacing.headingToDescription,
              maxWidth: 620,
            }}
          >
            Marine Crew Visa Services
          </Typography>

          <Typography
            sx={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.7,
              mb: marineHeroSpacing.descriptionToCta,
              maxWidth: 610,
            }}
          >
            Visa handling built for seafarers, offshore crew, superintendents, and marine operations
            teams — with accuracy, speed, and regulatory compliance at every stage.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: marineHeroSpacing.ctaToStats }}
          >
            <Button
              variant="contained"
              href={marineHeroCtas.primary.href}
              endIcon={<ArrowRight size={18} />}
              sx={{
                ...getMarketingPrimaryButtonSx(colors),
                px: 4,
                minHeight: 48,
                height: 48,
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
                minHeight: 48,
                height: 48,
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

          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              m: 0,
              p: 0,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 0,
              width: '100%',
              maxWidth: 900,
            }}
          >
            {marineHeroStats.map(({ value, label, icon: Icon }, index) => (
              <Box
                component="li"
                key={label}
                sx={{
                  flex: { sm: '1 1 0' },
                  minWidth: { sm: 200 },
                  minHeight: { sm: 64 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2.25,
                  py: { xs: 2, sm: 1.25 },
                  pr: { sm: index < marineHeroStats.length - 1 ? 3 : 0 },
                  pl: { sm: index > 0 ? 3 : 0 },
                  borderBottom: {
                    xs:
                      index < marineHeroStats.length - 1
                        ? '1px solid rgba(255,255,255,0.2)'
                        : 'none',
                    sm: 'none',
                  },
                  borderRight: {
                    xs: 'none',
                    sm:
                      index < marineHeroStats.length - 1
                        ? '1px solid rgba(255,255,255,0.28)'
                        : 'none',
                  },
                }}
              >
                <Icon
                  size={32}
                  color={colors.white}
                  strokeWidth={1.55}
                  aria-hidden
                  style={{ flexShrink: 0 }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontSize: { xs: '24px', md: '28px' },
                      fontWeight: 800,
                      color: colors.white,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.05,
                      mb: 0.4,
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '13.5px', md: '15px' },
                      fontWeight: 500,
                      color: colors.white,
                      lineHeight: 1.25,
                      whiteSpace: 'nowrap',
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
