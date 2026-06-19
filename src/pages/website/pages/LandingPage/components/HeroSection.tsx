import { Box, Typography, Button, Stack, Grid, FormControl, Select, MenuItem } from '@mui/material'
import { useState } from 'react'
import { Plane, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/design-system/UIComponents'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingPageHeroMinHeight, landingPageHeroPy } from '../landingPageSpacing'
import {
  publicFonts,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
} from '@/shared/theme/publicBrand'
import { HeroWorldMapBackground } from '../../../components/HeroWorldMapBackground'

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
      pl: 0,
      pr: '24px !important',
      fontSize: '13px',
      color: colors.textSecondary,
      minHeight: 'auto',
      textAlign: 'left',
    },
    '& .MuiSelect-icon': { right: 0, color: colors.textMuted },
  } as const

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'flex-start',
        gap: { xs: 2, sm: 2, md: 3 },
        borderRadius: '12px',
        bgcolor: colors.white,
        border: `1px solid ${colors.borderSoft}`,
        boxShadow: '0 10px 36px rgba(15, 23, 42, 0.1)',
        px: { xs: 2, sm: 2.5, md: 3 },
        py: { xs: 2, sm: 1.5, md: 1.75 },
        width: '100%',
        maxWidth: 640,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          justifyContent: 'flex-start',
          gap: { xs: 1.5, sm: 2, md: 4 },
          minWidth: 0,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, py: { xs: 0.75, sm: 1 }, textAlign: 'left' }}>
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

        <Box sx={{ flex: 1, minWidth: 0, py: { xs: 0.75, sm: 1 }, textAlign: 'left' }}>
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
          ml: { sm: 'auto' },
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        Search
      </Button>
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
        py: landingPageHeroPy,
        minHeight: landingPageHeroMinHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <HeroWorldMapBackground />

      <PublicContainer
        variant="hero"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, md: 10, lg: 8 }}>
            <Stack spacing={{ xs: 2, md: 2.5 }} alignItems="center" sx={{ textAlign: 'center' }}>
              <Badge
                label="Your Visa Journey"
                variant="soft"
                color="primary"
                size="lg"
                icon={<Plane size={14} strokeWidth={2.25} />}
                sx={{ fontWeight: 700 }}
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
                  maxWidth: 720,
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
                  maxWidth: 620,
                }}
              >
                Expert-reviewed visa assistance with real-time tracking — so every application is
                accurate, compliant, and embassy-ready.
              </Typography>

              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <HeroSearchBar />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
