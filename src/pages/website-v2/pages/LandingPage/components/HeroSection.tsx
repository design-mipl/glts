import { useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  keyframes,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  ArrowRight,
  CircleCheck,
  MapPin,
  Search,
  Stamp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  PUBLIC_NAV_HEIGHT_PX,
  landingPageHeroContentPt,
  landingPageHeroMinHeight,
} from '../landingPageSpacing'
import {
  publicFonts,
  publicMotion,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
  brandPrimaryGreenRgb,
  brandGoldRgb,
} from '@/shared/theme/publicBrand'
import { retailHeroImage } from '../../../assets/retailHeroImage'
import { getAllCountries } from '@/shared/services/visaService'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const pulseDot = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(115, 192, 100, 0.45); }
  50% { box-shadow: 0 0 0 5px rgba(115, 192, 100, 0); }
`

const trustMetrics: {
  value: string
  label: string
}[] = [
  { value: '98%*', label: 'Approval Rate' },
  { value: '100,000+', label: 'Visas Processed' },
  { value: '100+', label: 'Countries' },
]

const VISA_TYPES = [
  { value: 'tourist', label: 'Tourist Visa' },
  { value: 'business', label: 'Business Visa' },
  { value: 'student', label: 'Student Visa' },
  { value: 'transit', label: 'Transit Visa' },
  { value: 'family', label: 'Family Applications' },
  { value: 'group', label: 'Group Applications' },
  { value: 'other', label: 'Other Visas' },
] as const

const POPULAR_DESTINATION_CODES = ['AE', 'US', 'GB', 'SG', 'CA', 'AU', 'DE', 'FR', 'JP', 'TH'] as const

const HERO_BORDER = '#E5E7EB'
const HERO_TEXT = '#111827'
const HERO_TEXT_SECONDARY = '#6B7280'

function HeroSearchBar() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [visaType, setVisaType] = useState('')

  const destinations = useMemo(() => {
    const all = getAllCountries()
    const popular = POPULAR_DESTINATION_CODES.map((code) =>
      all.find((country) => country.code === code),
    ).filter(Boolean) as ReturnType<typeof getAllCountries>
    return popular.length > 0 ? popular : all.slice(0, 10)
  }, [])

  const fieldSx = {
    height: 48,
    fontSize: '14px',
    color: HERO_TEXT,
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSelect-select': {
      py: 0,
      display: 'flex',
      alignItems: 'center',
      minHeight: '48px !important',
    },
  } as const

  const handleSearch = () => {
    if (destination) {
      const params = new URLSearchParams()
      if (visaType) params.set('visaType', visaType)
      const query = params.toString()
      navigate(`/countries/${destination}${query ? `?${query}` : ''}`)
      return
    }
    navigate(visaType ? `/countries?visaType=${encodeURIComponent(visaType)}` : '/countries')
  }

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault()
        handleSearch()
      }}
      sx={{
        width: { xs: '100%', md: 'min(100vw - 48px, 760px)' },
        maxWidth: 760,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'stretch',
        gap: { xs: 1.25, sm: 0 },
        bgcolor: alpha(colors.white, 0.94),
        border: `1px solid ${HERO_BORDER}`,
        borderRadius: '14px',
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.1)',
        p: { xs: 1.25, sm: 1 },
        pl: { sm: 1.5 },
        minHeight: { sm: 68 },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.15,
          px: { xs: 0.5, sm: 1 },
          minWidth: 0,
        }}
      >
        <MapPin size={18} color={colors.greenBright} strokeWidth={2.1} />
        <FormControl fullWidth size="small" variant="outlined">
          <Select
            displayEmpty
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            sx={fieldSx}
            renderValue={(selected) => {
              if (!selected) {
                return <Box sx={{ color: HERO_TEXT_SECONDARY }}>Destination</Box>
              }
              const match = destinations.find((country) => country.id === selected)
              return match?.name ?? selected
            }}
          >
            <MenuItem value="">
              <em>All destinations</em>
            </MenuItem>
            {destinations.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        aria-hidden
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: '1px',
          alignSelf: 'stretch',
          my: 1.25,
          bgcolor: HERO_BORDER,
          flexShrink: 0,
        }}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.15,
          px: { xs: 0.5, sm: 1 },
          minWidth: 0,
        }}
      >
        <Stamp size={18} color={colors.greenBright} strokeWidth={2.1} />
        <FormControl fullWidth size="small" variant="outlined">
          <Select
            displayEmpty
            value={visaType}
            onChange={(event) => setVisaType(event.target.value)}
            sx={fieldSx}
            renderValue={(selected) => {
              if (!selected) {
                return <Box sx={{ color: HERO_TEXT_SECONDARY }}>Visa type</Box>
              }
              return VISA_TYPES.find((type) => type.value === selected)?.label ?? selected
            }}
          >
            <MenuItem value="">
              <em>All visa types</em>
            </MenuItem>
            {VISA_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        type="submit"
        variant="contained"
        startIcon={<Search size={17} strokeWidth={2.25} />}
        sx={{
          ...getMarketingPrimaryButtonSx(colors),
          borderRadius: '10px',
          minHeight: 48,
          height: 48,
          px: 2.75,
          mx: { sm: 0.25 },
          alignSelf: { xs: 'stretch', sm: 'center' },
          whiteSpace: 'nowrap',
          boxShadow: `0 4px 14px rgba(${brandPrimaryGreenRgb}, 0.28)`,
          transition: `transform ${publicMotion.pressDurationMs}ms ${publicMotion.easeOut}`,
          '&:active': { transform: 'scale(0.97)' },
        }}
      >
        Search
      </Button>
    </Box>
  )
}

export function HeroSection() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        mt: `-${PUBLIC_NAV_HEIGHT_PX}px`,
        pt: `${PUBLIC_NAV_HEIGHT_PX}px`,
        overflow: 'hidden',
        bgcolor: colors.white,
        minHeight: landingPageHeroMinHeight,
        pb: { xs: 7, md: 8, lg: 9 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          animation: `${fadeIn} 1.1s ${publicMotion.easeOut} both`,
          bgcolor: colors.white,
        }}
      >
        <Box
          component="img"
          src={retailHeroImage.src}
          alt=""
          sx={{
            position: 'absolute',
            top: { xs: 64, md: 88 },
            right: 0,
            bottom: 0,
            left: 'auto',
            width: { xs: '100%', md: '72%' },
            height: { xs: 'calc(100% - 64px)', md: 'calc(100% - 88px)' },
            transform: 'scale(1.05)',
            transformOrigin: 'right center',
            objectFit: 'cover',
            objectPosition: 'right center',
            display: 'block',
            animation: `${fadeIn} 2.2s ${publicMotion.easeOut} both`,
            maskImage: `
              linear-gradient(90deg, transparent 0%, black 20%, black 100%),
              linear-gradient(180deg, transparent 0%, black 14%, black 100%)
            `,
            WebkitMaskImage: `
              linear-gradient(90deg, transparent 0%, black 20%, black 100%),
              linear-gradient(180deg, transparent 0%, black 14%, black 100%)
            `,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: {
              xs: `
                linear-gradient(
                  180deg,
                  ${alpha(colors.white, 0.92)} 0%,
                  ${alpha(colors.white, 0.55)} 12%,
                  ${alpha(colors.white, 0.15)} 28%,
                  transparent 42%,
                  transparent 72%,
                  ${alpha(colors.white, 0.18)} 100%
                ),
                linear-gradient(
                  90deg,
                  ${alpha(colors.white, 0.94)} 0%,
                  ${alpha(colors.white, 0.72)} 38%,
                  ${alpha(colors.white, 0.22)} 66%,
                  transparent 88%
                )
              `,
              md: `
                linear-gradient(
                  180deg,
                  ${alpha(colors.white, 0.95)} 0%,
                  ${alpha(colors.white, 0.6)} 10%,
                  ${alpha(colors.white, 0.18)} 22%,
                  transparent 36%,
                  transparent 80%,
                  ${alpha(colors.white, 0.2)} 100%
                ),
                linear-gradient(
                  90deg,
                  ${alpha(colors.white, 0.97)} 0%,
                  ${alpha(colors.white, 0.88)} 22%,
                  ${alpha(colors.white, 0.4)} 44%,
                  ${alpha(colors.white, 0.1)} 58%,
                  transparent 72%
                )
              `,
            },
          }}
        />
      </Box>

      <Box
        aria-hidden
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          zIndex: 1,
          right: { md: '7%', lg: '9%' },
          bottom: { md: '9%', lg: '11%' },
          width: 236,
          borderRadius: '16px',
          border: `1px solid ${HERO_BORDER}`,
          bgcolor: alpha(colors.white, 0.88),
          backdropFilter: 'blur(14px)',
          boxShadow: '0 20px 44px rgba(15, 23, 42, 0.16)',
          p: 2,
          animation: `${fadeUp} 0.9s ${publicMotion.easeOut} 0.5s both`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.9} sx={{ mb: 1.25 }}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: colors.greenBright,
              animation: `${pulseDot} 2.2s ease-out infinite`,
            }}
          />
          <Typography
            sx={{
              fontFamily: publicFonts.mono,
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: HERO_TEXT_SECONDARY,
            }}
          >
            Live Application
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: '14px',
            fontWeight: 700,
            color: HERO_TEXT,
            mb: 0.4,
          }}
        >
          Business Visa — UAE
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mb: 1.5 }}>
          <CircleCheck size={13} color={colors.greenBright} strokeWidth={2.25} />
          <Typography sx={{ fontSize: '12px', color: HERO_TEXT_SECONDARY }}>
            Documents verified
          </Typography>
        </Stack>

        <Box sx={{ borderTop: `1px dashed ${HERO_BORDER}`, pt: 1.25 }}>
          <Typography
            sx={{
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: HERO_TEXT_SECONDARY,
              mb: 0.35,
            }}
          >
            Estimated ready
          </Typography>
          <Typography
            sx={{
              fontFamily: publicFonts.mono,
              fontVariantNumeric: 'tabular-nums',
              fontSize: '19px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: `rgb(${brandGoldRgb})`,
            }}
          >
            14 Nov
          </Typography>
        </Box>
      </Box>

      <PublicContainer
        variant="hero"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: { xs: 'center', md: 'flex-start' },
          minHeight: {
            xs: `calc(100dvh - ${PUBLIC_NAV_HEIGHT_PX}px)`,
            md: landingPageHeroMinHeight.md,
            lg: landingPageHeroMinHeight.lg,
          },
          pt: landingPageHeroContentPt,
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '52%', lg: '48%' },
            maxWidth: { md: 720, lg: 760 },
            animation: `${fadeUp} 0.8s ${publicMotion.easeOut} both`,
            my: { md: 'auto' },
          }}
        >
          <Stack spacing={{ xs: 4.5, md: 5.5, lg: 6 }} alignItems="flex-start" textAlign="left">
            <Box sx={{ maxWidth: { md: 560, lg: 600 } }}>
              <Typography
                component="h1"
                sx={{
                  fontFamily: publicFonts.display,
                  fontSize: { xs: '36px', sm: '44px', md: '50px', lg: '56px' },
                  fontWeight: 700,
                  lineHeight: 1.06,
                  letterSpacing: '-1px',
                  color: HERO_TEXT,
                  mb: { xs: 2.5, md: 3 },
                }}
              >
                Visas Done Right
                <Box component="span" sx={{ color: colors.greenBright }}>
                  {' '}
                  — Before They Go Wrong
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontFamily: publicFonts.heading,
                  fontSize: { xs: '18px', md: '20px' },
                  fontWeight: 700,
                  color: HERO_TEXT,
                  mb: 1.25,
                  lineHeight: 1.35,
                }}
              >
                Expert-verified. Tech-enabled.
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '15px', md: '16px', lg: '17px' },
                  color: HERO_TEXT_SECONDARY,
                  lineHeight: 1.7,
                  maxWidth: 460,
                }}
              >
                Check requirements, apply securely, upload documents and track your application —
                with GreenLight experts reviewing your application at every critical step.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="contained"
                endIcon={<ArrowRight size={18} strokeWidth={2.25} />}
                onClick={() => navigate('/countries')}
                sx={{
                  ...getMarketingPrimaryButtonSx(colors),
                  borderRadius: '12px',
                  px: 3,
                  minHeight: 48,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  transition: `transform ${publicMotion.pressDurationMs}ms ${publicMotion.easeOut}`,
                  '&:active': { transform: 'scale(0.97)' },
                }}
              >
                Check Visa Requirements
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/countries')}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  minHeight: 48,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: HERO_BORDER,
                  color: HERO_TEXT,
                  bgcolor: alpha(colors.white, 0.72),
                  whiteSpace: 'nowrap',
                  transition: `transform ${publicMotion.pressDurationMs}ms ${publicMotion.easeOut}, border-color 200ms ease, background-color 200ms ease`,
                  '&:hover': {
                    borderColor: colors.greenBright,
                    bgcolor: alpha(colors.white, 0.92),
                  },
                  '&:active': { transform: 'scale(0.97)' },
                }}
              >
                Explore Destinations
              </Button>
            </Stack>

            <HeroSearchBar />

            <Stack
              direction="row"
              sx={{
                width: '100%',
                maxWidth: { md: 620 },
              }}
            >
              {trustMetrics.map((metric, index) => (
                <Box
                  key={metric.label}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    pl: index === 0 ? 0 : { xs: 1.5, sm: 2.5 },
                    pr: { xs: 1, sm: 1.5 },
                    borderLeft: index === 0 ? 'none' : `1px solid ${HERO_BORDER}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: publicFonts.mono,
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: { xs: '18px', md: '21px' },
                      fontWeight: 700,
                      color: colors.greenBright,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      mb: 0.35,
                    }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      color: HERO_TEXT_SECONDARY,
                      lineHeight: 1.35,
                    }}
                  >
                    {metric.label}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: HERO_TEXT_SECONDARY,
                lineHeight: 1.45,
              }}
            >
              Registered agent support available for China, South Korea, and Brazil.
            </Typography>
          </Stack>
        </Box>
      </PublicContainer>
    </Box>
  )
}
