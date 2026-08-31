import { useMemo, useState } from 'react'
import { Box, Typography, Stack, Select, MenuItem, FormControl } from '@mui/material'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  PUBLIC_NAV_HEIGHT_PX,
  landingPageHeroContentPt,
  landingPageHeroMinHeight,
} from '../landingPageSpacing'
import {
  site,
  siteFont,
  siteMotion,
  siteRadius,
  siteType,
  siteCanvasSx,
  mrzSx,
  dataSx,
  clippedCorner,

} from '@/pages/website/theme/siteTheme'
import { getAllCountries } from '@/shared/services/visaService'

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

const TRUST_METRICS = [
  { value: '98%', suffix: '*', label: 'Approval rate' },
  { value: '100,000', suffix: '+', label: 'Visas processed' },
  { value: '100', suffix: '+', label: 'Countries' },
] as const

/**
 * Clearance console — the hero's signature element.
 *
 * The old hero put its search in a soft, drop-shadowed white pill floating over a stock
 * travel photograph, which is the exact "generic SaaS" homepage the V2 spec flags. This is
 * the opposite read: a hairline instrument panel with the travel-document corner cut, two
 * fields divided by a rule rather than boxed separately, and the only saturated element on
 * the entire screen as its action.
 */
function ClearanceConsole() {
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

  function handleSearch() {
    if (destination) {
      const params = new URLSearchParams()
      if (visaType) params.set('visaType', visaType)
      const query = params.toString()
      navigate(`/countries/${destination}${query ? `?${query}` : ''}`)
      return
    }
    navigate(visaType ? `/countries?visaType=${encodeURIComponent(visaType)}` : '/countries')
  }

  const selectSx = {
    fontFamily: siteFont.body,
    fontSize: 14.5,
    fontWeight: 500,
    color: site.ink,
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSelect-select': {
      py: 0,
      pl: 0,
      display: 'flex',
      alignItems: 'center',
      minHeight: '30px !important',
    },
    '&.Mui-focused': { outline: 'none' },
  } as const

  function Field({
    label,
    children,
  }: {
    label: string
    children: React.ReactNode
  }) {
    return (
      <Box sx={{ flex: 1, minWidth: 0, px: { xs: 3, sm: 3.5 }, py: 2.5 }}>
        <Typography sx={{ ...mrzSx, fontSize: 9.5, mb: 1 }}>{label}</Typography>
        {children}
      </Box>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault()
        handleSearch()
      }}
      sx={{
        width: '100%',
        maxWidth: 620,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'stretch',
        backgroundColor: site.surface,
        border: `1px solid ${site.hairline}`,
        borderRadius: siteRadius.card,
        clipPath: { xs: 'none', sm: clippedCorner(18) },
        boxShadow: '0 1px 2px rgba(8, 24, 43, 0.04), 0 18px 40px -24px rgba(8, 24, 43, 0.28)',
      }}
    >
      <Field label="Destination">
        <FormControl fullWidth size="small" variant="outlined">
          <Select
            displayEmpty
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            IconComponent={(props) => <ChevronDown size={15} {...props} />}
            sx={selectSx}
            renderValue={(selected) => {
              if (!selected) return <Box sx={{ color: site.inkFaint }}>Where to?</Box>
              return destinations.find((country) => country.id === selected)?.name ?? selected
            }}
          >
            <MenuItem value="">All destinations</MenuItem>
            {destinations.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Field>

      <Box
        aria-hidden
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: '1px',
          alignSelf: 'stretch',
          backgroundColor: site.hairline,
          flexShrink: 0,
        }}
      />
      <Box
        aria-hidden
        sx={{
          display: { xs: 'block', sm: 'none' },
          height: '1px',
          backgroundColor: site.hairline,
        }}
      />

      <Field label="Visa type">
        <FormControl fullWidth size="small" variant="outlined">
          <Select
            displayEmpty
            value={visaType}
            onChange={(event) => setVisaType(event.target.value)}
            IconComponent={(props) => <ChevronDown size={15} {...props} />}
            sx={selectSx}
            renderValue={(selected) => {
              if (!selected) return <Box sx={{ color: site.inkFaint }}>Any purpose</Box>
              return VISA_TYPES.find((type) => type.value === selected)?.label ?? selected
            }}
          >
            <MenuItem value="">All visa types</MenuItem>
            {VISA_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Field>

      <Box
        component="button"
        type="submit"
        sx={{
          appearance: 'none',
          border: 'none',
          cursor: 'pointer',
          flex: '0 0 auto',
          m: { xs: 2.5, sm: 1.5 },
          px: 4,
          minHeight: 48,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          borderRadius: siteRadius.control,
          backgroundColor: site.accent,
          color: site.onAccent,
          fontFamily: siteFont.body,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          transition: `background-color 150ms ${siteMotion.easeOut}, transform ${siteMotion.pressMs}ms ${siteMotion.easeOut}`,
          '@media (hover: hover) and (pointer: fine)': {
            '&:hover': { backgroundColor: site.accentStrong },
            '&:hover .heroArrow': { transform: 'translateX(3px)' },
          },
          '&:active': { transform: 'scale(0.97)' },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${site.accentRing}`,
          },
          '@media (prefers-reduced-motion: reduce)': { transition: 'background-color 150ms linear' },
        }}
      >
        Check requirements
        <Box
          component="span"
          className="heroArrow"
          sx={{
            display: 'inline-flex',
            transition: `transform 180ms ${siteMotion.easeOut}`,
          }}
        >
          <ArrowRight size={16} />
        </Box>
      </Box>
    </Box>
  )
}

/**
 * A1 Homepage hero.
 *
 * Removed deliberately: the full-bleed stock photograph with six stacked mask/scrim
 * gradients, and the floating glass "Live Application" card. Both were doing the work of
 * looking premium rather than saying anything, and the photo forced every foreground
 * element to fight a scrim for contrast. The ground is now the technical grid the rest of
 * the retail journey already sits on, so the homepage and the apply flow finally read as
 * one product.
 */
export function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        mt: `-${PUBLIC_NAV_HEIGHT_PX}px`,
        pt: `${PUBLIC_NAV_HEIGHT_PX}px`,
        overflow: 'hidden',
        minHeight: landingPageHeroMinHeight,
        pb: { xs: 7, md: 8, lg: 9 },
        ...siteCanvasSx,
      }}
    >
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
        <Box sx={{ width: '100%', maxWidth: 880, my: { md: 'auto' } }}>
          {/* Eyebrow — MRZ band. States what this is in the site's own machine voice. */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <Box
              aria-hidden
              sx={{ width: 26, height: '1px', backgroundColor: site.accent, flex: '0 0 auto' }}
            />
            <Typography sx={mrzSx}>Greenlight Travel Solutions · Visa clearance</Typography>
          </Stack>

          <Typography component="h1" sx={{ ...siteType.hero, maxWidth: 760 }}>
            Visas done right
            <Box component="span" sx={{ color: site.inkFaint }}> — before they go wrong.</Box>
          </Typography>

          <Typography
            sx={{ ...siteType.lead, maxWidth: 520, mt: { xs: 3, md: 3.5 } }}
          >
            Check what your destination actually requires, apply in one guided pass, and watch
            every document clear — with a GreenLight expert reviewing at each critical gate.
          </Typography>

          <Box sx={{ mt: { xs: 4.5, md: 5.5 } }}>
            <ClearanceConsole />
          </Box>

          {/* Proof strip — mono figures on a hairline rule, not three floating stat cards. */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              maxWidth: 620,
              mt: { xs: 5, md: 6 },
              pt: 3,
              borderTop: `1px solid ${site.hairline}`,
              
            }}
          >
            {TRUST_METRICS.map((metric, index) => (
              <Box
                key={metric.label}
                sx={{
                  flex: 1,
                  minWidth: 96,
                  pl: index === 0 ? 0 : { xs: 2.5, sm: 4 },
                  pr: { xs: 1, sm: 2 },
                  borderLeft: index === 0 ? 'none' : `1px solid ${site.hairlineSoft}`,
                }}
              >
                <Typography
                  sx={{
                    ...dataSx,
                    fontSize: { xs: 20, md: 23 },
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}
                >
                  {metric.value}
                  <Box component="span" sx={{ color: site.accentInk }}>
                    {metric.suffix}
                  </Box>
                </Typography>
                <Typography sx={{ ...mrzSx, fontSize: 9.5, mt: 1.25 }}>{metric.label}</Typography>
              </Box>
            ))}
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.75}
            sx={{ mt: 3.5 }}
          >
            <Check size={13} strokeWidth={2.6} style={{ color: site.success, flexShrink: 0 }} />
            <Typography sx={{ ...siteType.body, fontSize: 12.5 }}>
              Registered agent support for China, South Korea and Brazil.
            </Typography>
          </Stack>
        </Box>
      </PublicContainer>
    </Box>
  )
}
