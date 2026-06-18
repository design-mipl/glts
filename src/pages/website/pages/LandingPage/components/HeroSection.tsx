import { useState, type ReactNode } from 'react'
import { Box, Typography, Button, Stack, Grid, FormControl, Select, MenuItem } from '@mui/material'
import { Plane, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/design-system/UIComponents'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicHeroPaddingBottom,
  publicHeroPaddingTop,
  publicHeroSectionMinHeight,
  publicHeroVisualMinHeight,
} from '../landingPageSpacing'
import {
  publicFonts,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'
import { heroCollageImages } from '../../../assets/landingPageImages'

const COLLAGE_RADIUS = '22px'

function CollageImageFrame({
  children,
  sx,
}: {
  children: ReactNode
  sx?: object
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        borderRadius: COLLAGE_RADIUS,
        overflow: 'hidden',
        border: `1px solid ${colors.borderSoft}`,
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)',
        bgcolor: colors.surface,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

function HeroCollageImage({
  src,
  fallback,
  alt,
  sx,
}: {
  src: string
  fallback: string
  alt: string
  sx?: object
}) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => setImgSrc(fallback)}
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...sx,
      }}
    />
  )
}

const destinationOptions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Japan',
] as const

const visaTypeOptions = [
  'Tourist Visa',
  'Business Visa',
  'Student Visa',
  'Work Visa',
  'Family Visit Visa',
] as const

function HeroSearchBar() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [visaType, setVisaType] = useState('')

  const goToCountries = () => {
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (visaType) params.set('visaType', visaType)
    navigate(`/countries${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const selectBaseSx = {
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSelect-select': {
      py: 0,
      pr: '24px !important',
      fontSize: '13px',
      color: colors.textSecondary,
      minHeight: 'auto',
    },
    '& .MuiSelect-icon': { right: 0, color: colors.textMuted },
  } as const

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 2, sm: 2, md: 3 },
        borderRadius: '12px',
        bgcolor: colors.white,
        border: `1px solid ${colors.borderSoft}`,
        boxShadow: '0 10px 36px rgba(15, 23, 42, 0.1)',
        px: { xs: 2, sm: 2.5, md: 3 },
        py: { xs: 2, sm: 1.5, md: 1.75 },
        width: '100%',
        maxWidth: 640,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1.5, sm: 2, md: 4 },
          minWidth: 0,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, px: { xs: 0.5, sm: 2, md: 2.5 }, py: { xs: 0.75, sm: 1 } }}>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 700,
              color: colors.navy,
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            Destination
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={destination}
              displayEmpty
              onChange={(event) => setDestination(event.target.value)}
              sx={selectBaseSx}
            >
              <MenuItem value="">
                <Typography sx={{ fontSize: '13px', color: colors.textMuted }}>
                  Where are you going?
                </Typography>
              </MenuItem>
              {destinationOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, px: { xs: 0.5, sm: 2, md: 2.5 }, py: { xs: 0.75, sm: 1 } }}>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 700,
              color: colors.navy,
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            Visa Type
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={visaType}
              displayEmpty
              onChange={(event) => setVisaType(event.target.value)}
              sx={selectBaseSx}
            >
              <MenuItem value="">
                <Typography sx={{ fontSize: '13px', color: colors.textMuted }}>
                  Tourist, business, student...
                </Typography>
              </MenuItem>
              {visaTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Button
        variant="contained"
        onClick={goToCountries}
        startIcon={<Search size={18} strokeWidth={2.25} />}
        sx={{
          ...getMarketingPrimaryButtonSx(colors),
          borderRadius: '10px',
          px: { xs: 3, sm: 3.5, md: 4 },
          minHeight: { xs: 48, sm: 52 },
          flexShrink: 0,
          alignSelf: { xs: 'stretch', sm: 'auto' },
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        Search
      </Button>
    </Box>
  )
}

function HeroImageCollage() {
  const colors = usePublicBrandColors()
  const [topLeft, topRight, bottomLeft, bottomRight] = heroCollageImages

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: 420, sm: 440, md: 400, lg: 430 },
        mx: { xs: 'auto', md: 'auto' },
        ml: { md: 'auto' },
        minHeight: publicHeroVisualMinHeight,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: { xs: '108px 132px 108px', md: '132px 156px 120px' },
          gap: { xs: 1.1, md: 1.35 },
        }}
      >
        <CollageImageFrame
          sx={{
            gridColumn: { xs: '1 / 8', md: '1 / 7' },
            gridRow: '1 / 2',
          }}
        >
          <HeroCollageImage {...topLeft} />
        </CollageImageFrame>

        <CollageImageFrame
          sx={{
            gridColumn: { xs: '6 / 13', md: '7 / 13' },
            gridRow: { xs: '1 / 3', md: '1 / 3' },
            position: 'relative',
          }}
        >
          <HeroCollageImage {...topRight} />
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.25,
              py: 0.55,
              borderRadius: '999px',
              bgcolor: 'rgba(255, 255, 255, 0.94)',
              border: `1px solid ${colors.borderSoft}`,
              boxShadow: '0 6px 18px rgba(15, 23, 42, 0.1)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: colors.greenBright,
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: colors.navy, lineHeight: 1 }}>
              Expert Reviewed
            </Typography>
          </Box>
        </CollageImageFrame>

        <CollageImageFrame
          sx={{
            gridColumn: { xs: '1 / 9', md: '1 / 8' },
            gridRow: { xs: '2 / 4', md: '2 / 4' },
            transform: { xs: 'translateX(-6px)', md: 'translateX(-12px)' },
          }}
        >
          <HeroCollageImage {...bottomLeft} />
        </CollageImageFrame>

        <CollageImageFrame
          sx={{
            gridColumn: { xs: '9 / 13', md: '8 / 13' },
            gridRow: { xs: '3 / 4', md: '3 / 4' },
          }}
        >
          <HeroCollageImage {...bottomRight} />
        </CollageImageFrame>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 4, md: -8 },
          bottom: { xs: 16, md: 28 },
          maxWidth: 188,
          px: 1.5,
          py: 1.25,
          borderRadius: '14px',
          bgcolor: colors.white,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: '18px',
            fontWeight: 800,
            color: colors.greenBright,
            lineHeight: 1.1,
            mb: 0.25,
          }}
        >
          190+ Countries
        </Typography>
        <Typography sx={{ fontSize: '11px', color: colors.textSecondary, lineHeight: 1.4 }}>
          Trusted visa support worldwide
        </Typography>
      </Box>
    </Box>
  )
}

export function HeroSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: colors.white,
        pt: publicHeroPaddingTop,
        pb: publicHeroPaddingBottom,
        minHeight: publicHeroSectionMinHeight,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: '50%',
          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.08)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: { xs: -70, md: -110 },
          bottom: { xs: 40, md: 10 },
          width: { xs: 180, md: 260 },
          height: { xs: 180, md: 260 },
          borderRadius: '50%',
          border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.18)`,
          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.05)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: { xs: 48, md: 64 },
          right: { xs: '-6%', md: '8%' },
          width: { xs: 140, md: 200 },
          height: { xs: 90, md: 120 },
          borderRadius: '24px',
          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.06)`,
          border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.12)`,
          transform: 'rotate(8deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: { xs: 80, md: 100 },
          left: { xs: '-4%', md: '6%' },
          width: { xs: 110, md: 150 },
          height: { xs: 72, md: 96 },
          borderRadius: '20px',
          bgcolor: colors.surface,
          border: `1px solid ${colors.borderSoft}`,
          transform: 'rotate(-6deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Grid container spacing={{ xs: 4, md: 5, lg: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={{ xs: 2.5, md: 3 }}>
              <Badge
                label="Your Visa Journey"
                variant="soft"
                color="primary"
                size="lg"
                icon={<Plane size={14} strokeWidth={2.25} />}
                sx={{ fontWeight: 700, alignSelf: 'flex-start' }}
              />

              <Typography
                component="h1"
                sx={{
                  fontFamily: publicFonts.heading,
                  fontSize: { xs: '34px', sm: '42px', md: '46px', lg: '52px' },
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: '-1.2px',
                  color: colors.navy,
                  maxWidth: 560,
                }}
              >
                <Box component="span" sx={{ color: colors.greenBright }}>
                  Visas Done Right
                </Box>
                {' — Before They Go Wrong.'}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '15px', md: '16px' },
                  color: colors.textSecondary,
                  lineHeight: 1.7,
                  maxWidth: 520,
                }}
              >
                Expert-reviewed visa assistance with real-time tracking — so every application is
                accurate, compliant, and embassy-ready.
              </Typography>

              <HeroSearchBar />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}>
            <HeroImageCollage />
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
