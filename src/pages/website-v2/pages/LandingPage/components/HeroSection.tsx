import { useMemo, useState, type FormEvent } from 'react'
import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ArrowRight, PlaneTakeoff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Select } from '@/design-system/UIComponents'
import { PublicContainer } from '../../../components/PublicContainer'
import { PUBLIC_NAV_HEIGHT_PX } from '../landingPageSpacing'
import { getAllCountries } from '@/shared/services/visaService'
import { websiteButtonSx, websiteFieldSx, websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'

const homeHeroBackground = '/images/home-airport-background.png'
const homeHeroTravelers = '/images/home-airport-travelers-cutout.png'
const homeHeroComposite = '/images/home-airport-travelers.png'

const heroCheckerFieldSx = {
  ...websiteFieldSx,
  minWidth: 0,
  '& .MuiAutocomplete-inputRoot.MuiOutlinedInput-root, & .MuiAutocomplete-inputRoot.MuiInputBase-root': {
    height: '56px !important',
    minHeight: '56px !important',
    boxSizing: 'border-box',
    padding: '10px 42px 10px 14px !important',
    alignItems: 'center',
    borderRadius: `${ds.radius.medium}px`,
    bgcolor: ds.color.surface,
  },
  '& .MuiAutocomplete-input': {
    fontSize: 16,
    lineHeight: 1.5,
  },
  '& .MuiAutocomplete-endAdornment': {
    top: '50%',
    right: 10,
    transform: 'translateY(-50%)',
  },
  '& .MuiInputLabel-root': {
    position: 'absolute',
    width: 1,
    height: 1,
    p: 0,
    m: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
  '& .MuiOutlinedInput-notchedOutline legend': { maxWidth: '0 !important' },
}

function VisaChecker() {
  const navigate = useNavigate()
  const [nationality, setNationality] = useState<string | number>('')
  const [destination, setDestination] = useState<string | number>('')
  const [formMessage, setFormMessage] = useState('')

  const countries = useMemo(
    () => [...getAllCountries()].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )
  const nationalityOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.code,
        label: country.name,
        icon: country.flags || undefined,
      })),
    [countries],
  )
  const destinationOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.id,
        label: country.name,
        icon: country.flags || undefined,
      })),
    [countries],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!nationality || !destination) {
      setFormMessage('Please select your nationality and destination to continue.')
      return
    }

    setFormMessage('')
    // Keep the current application entry route and its supported destination preselection.
    navigate(`/apply/new?${new URLSearchParams({ country: String(destination) }).toString()}`)
  }

  return (
    <Box
      id="visa-checker"
      component="form"
      aria-label="Choose your nationality and destination"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        border: `1px solid ${alpha(ds.semanticColor.border.strong, 0.62)}`,
        borderRadius: `${ds.radius.large}px`,
        bgcolor: ds.color.surface,
        boxShadow: '0 22px 56px rgba(10, 37, 64, 0.11)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          minHeight: 56,
          px: { xs: 2.25, sm: 3 },
          borderBottom: `1px solid ${ds.color.border}`,
        }}
      >
        <PlaneTakeoff size={18} color={ds.color.teal} aria-hidden="true" />
        <Typography sx={{ color: ds.color.navy, fontSize: 14, fontWeight: 700 }}>
          Where are you headed?
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'minmax(0, 1fr) 20px minmax(0, 1fr)',
          },
          alignItems: 'end',
          columnGap: { xs: 0, sm: 1.5 },
          rowGap: { xs: 1.75, sm: 2 },
          p: { xs: 2.25, sm: 3 },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography component="span" aria-hidden="true" sx={{ display: 'block', color: ds.color.textSecondary, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', mb: 1 }}>
            NATIONALITY
          </Typography>
          <Select
            label="Nationality"
            placeholder="Select nationality"
            value={nationality}
            onChange={(value) => {
              setNationality(value)
              setFormMessage('')
            }}
            options={nationalityOptions}
            searchable
            required
            fullWidth
            size="md"
            sx={heroCheckerFieldSx}
          />
        </Box>

        <Box aria-hidden="true" sx={{ display: { xs: 'none', sm: 'flex' }, height: 56, alignItems: 'center', justifyContent: 'center', color: ds.color.textMuted }}>
          <ArrowRight size={16} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography component="span" aria-hidden="true" sx={{ display: 'block', color: ds.color.textSecondary, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', mb: 1 }}>
            DESTINATION
          </Typography>
          <Select
            label="Destination"
            placeholder="Select destination"
            value={destination}
            onChange={(value) => {
              setDestination(value)
              setFormMessage('')
            }}
            options={destinationOptions}
            searchable
            required
            fullWidth
            size="md"
            sx={heroCheckerFieldSx}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="md"
          fullWidth
          endIcon={<ArrowRight size={18} aria-hidden="true" />}
          sx={{
            ...websiteButtonSx,
            minHeight: 56,
            whiteSpace: 'nowrap',
            textTransform: 'none',
            borderRadius: `${ds.radius.medium}px`,
            fontSize: 16,
            fontWeight: 700,
            gridColumn: '1 / -1',
            '&.MuiButton-containedPrimary': {
              backgroundColor: ds.color.brand,
              color: ds.color.onBrand,
            },
            '&.MuiButton-containedPrimary:hover': {
              backgroundColor: ds.color.brandHover,
              color: ds.color.onBrand,
            },
            '&:focus-visible': {
              outline: `3px solid ${ds.color.focus}`,
              outlineOffset: 2,
            },
          }}
        >
          Get started
        </Button>
      </Box>

      {formMessage ? (
        <Typography role="alert" sx={{ px: { xs: 2.25, sm: 3 }, pb: { xs: 2.25, sm: 3 }, color: ds.color.error, fontSize: ds.type.bodySmall.size }}>
          {formMessage}
        </Typography>
      ) : null}
    </Box>
  )
}

export function HeroSection() {
  return (
    <Box
      component="section"
      aria-labelledby="home-hero-title"
      sx={{
        position: 'relative',
        mt: `-${PUBLIC_NAV_HEIGHT_PX}px`,
        pt: `${PUBLIC_NAV_HEIGHT_PX}px`,
        overflow: 'hidden',
        bgcolor: ds.color.canvas,
        color: ds.color.text,
        isolation: 'isolate',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: PUBLIC_NAV_HEIGHT_PX,
          right: 0,
          bottom: 0,
          width: { xs: 0, md: '100%' },
          display: { xs: 'none', md: 'block' },
          overflow: 'hidden',
          zIndex: 0,
          '@media (min-width: 760px) and (max-width: 899.95px)': { display: 'block' },
        }}
      >
        <Box
          component="img"
          src={homeHeroBackground}
          alt=""
          sx={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: [
              `linear-gradient(90deg, ${ds.color.canvas} 0%, ${alpha(ds.color.canvas, 0.94)} 18%, ${alpha(ds.color.canvas, 0.58)} 34%, ${alpha(ds.color.canvas, 0.16)} 44%, transparent 55%)`,
              `linear-gradient(180deg, ${ds.color.canvas} 0%, ${alpha(ds.color.canvas, 0.84)} 7%, ${alpha(ds.color.canvas, 0.24)} 19%, transparent 34%, transparent 68%, ${alpha(ds.color.canvas, 0.22)} 82%, ${alpha(ds.color.canvas, 0.82)} 96%, ${ds.color.canvas} 100%)`,
            ].join(', '),
          }}
        />
      </Box>

      <Box
        component="svg"
        aria-hidden="true"
        viewBox="0 0 1440 270"
        preserveAspectRatio="none"
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: { md: 28, lg: 36 },
          width: '100%',
          height: { md: 230, lg: 270 },
          display: { xs: 'none', md: 'block' },
          zIndex: 1,
          pointerEvents: 'none',
          '@media (min-width: 760px) and (max-width: 899.95px)': { display: 'block', height: 230, bottom: 24 },
        }}
      >
        <defs>
          <linearGradient id="home-hero-ribbon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ds.color.brand} stopOpacity="0.16" />
            <stop offset="50%" stopColor={ds.color.brand} stopOpacity="0.36" />
            <stop offset="100%" stopColor={ds.color.teal} stopOpacity="0.58" />
          </linearGradient>
        </defs>
        <path
          d="M0 28 C285 44 412 195 700 206 C965 216 1132 86 1440 105 L1440 170 C1124 158 971 270 700 267 C395 263 277 108 0 97 Z"
          fill="url(#home-hero-ribbon)"
        />
        <path
          d="M0 28 C285 44 412 195 700 206 C965 216 1132 86 1440 105"
          fill="none"
          stroke={ds.color.brand}
          strokeOpacity="0.39"
          strokeWidth="2"
        />
      </Box>

      <Box
        component="img"
        src={homeHeroTravelers}
        alt=""
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: PUBLIC_NAV_HEIGHT_PX,
          right: 0,
          bottom: 0,
          width: { xs: 0, md: '50%', lg: '56%' },
          height: `calc(100% - ${PUBLIC_NAV_HEIGHT_PX}px)`,
          display: { xs: 'none', md: 'block' },
          objectFit: 'contain',
          objectPosition: 'right bottom',
          maskImage: 'linear-gradient(180deg, #000 0%, #000 76%, rgba(0, 0, 0, 0.76) 87%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
          '@media (min-width: 760px) and (max-width: 899.95px)': { display: 'block', width: '50%' },
        }}
      />

      <PublicContainer
        variant="hero"
        sx={{
          position: 'relative',
          zIndex: 3,
          minHeight: { md: 620, lg: 660 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pt: { xs: 4, sm: 5, md: 5, lg: 6 },
          pb: { xs: 0, md: 6, lg: 7 },
          '@media (min-width: 760px) and (max-width: 899.95px)': {
            minHeight: 650,
            pb: 5,
          },
        }}
      >
        <Box sx={{
          width: { xs: '100%', md: '49%', lg: '48%' },
          maxWidth: 640,
          pb: { xs: 4, md: 0 },
          '@media (min-width: 760px) and (max-width: 899.95px)': { width: '55%', pb: 0 },
        }}>
          <Typography
            component="p"
            sx={{
              color: ds.color.brandHover,
              fontSize: ds.type.eyebrow.size,
              fontWeight: ds.type.eyebrow.weight,
              letterSpacing: ds.type.eyebrow.tracking,
              lineHeight: ds.type.eyebrow.lineHeight,
              mb: { xs: 1.75, md: 2.25 },
            }}
          >
            GREENLIGHT TRAVEL SOLUTIONS
          </Typography>
          <Typography
            id="home-hero-title"
            component="h1"
            sx={{
              ...websiteHeadingSx.display,
              color: ds.color.navy,
              mb: { xs: 2, md: 2.75 },
              textWrap: 'balance',
            }}
          >
            <Box component="span" sx={{ display: 'block' }}>Visas Done Right —</Box>
            <Box component="span" sx={{ display: 'block', color: ds.color.brandHover }}>Before They Go Wrong</Box>
          </Typography>
          <Typography
            component="p"
            sx={{
              color: ds.color.navy,
              fontSize: { xs: ds.type.bodyLarge.mobile, sm: ds.type.bodyLarge.size },
              fontWeight: 700,
              lineHeight: ds.type.bodyLarge.lineHeight,
              mb: { xs: 1.5, md: 1.75 },
            }}
          >
            Technology at Every Step. Experts Who Get it Right.
          </Typography>
          <Typography
            component="p"
            sx={{
              color: ds.color.textSecondary,
              fontSize: { xs: ds.type.body.mobile, sm: ds.type.body.size },
              lineHeight: ds.type.body.lineHeight,
              maxWidth: 540,
              mb: { xs: 3.5, md: 4.5 },
            }}
          >
            Check requirements, apply securely, upload documents and track your application — with GreenLight experts reviewing your application at every critical step.
          </Typography>
          <VisaChecker />
        </Box>
      </PublicContainer>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'relative',
          width: '100%',
          height: { xs: 210, sm: 290 },
          overflow: 'hidden',
          backgroundImage: `url('${homeHeroComposite}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          '@media (min-width: 760px) and (max-width: 899.95px)': { display: 'none' },
        }}
      >
        <Box
          component="svg"
          aria-hidden="true"
          viewBox="0 0 600 290"
          preserveAspectRatio="none"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <path
            d="M0 58 C140 72 230 210 350 214 C455 217 515 119 600 121 L600 176 C498 180 447 274 348 272 C214 270 132 126 0 112 Z"
            transform="translate(0 -14)"
            fill={alpha(ds.color.brand, 0.42)}
          />
        </Box>
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(180deg, ${ds.color.canvas} 0%, transparent 22%, transparent 74%, ${ds.color.canvas} 100%)`,
          }}
        />
      </Box>
    </Box>
  )
}
