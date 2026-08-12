import { Box, Button, Tooltip, Typography } from '@mui/material'
import { MapPin, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PublicContainer } from '../../../components/PublicContainer'
import footerWorldMapSrc from '../../../assets/footerWorldMap.svg'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import {
  publicFonts,
  publicShadows,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'

type CountryPin = {
  /** Country id in visaService */
  id: string
  label: string
  /** Approximate % position on the Natural Earth map artboard */
  left: string
  top: string
}

const COUNTRY_PINS: CountryPin[] = [
  { id: '23', label: 'Canada', left: '20%', top: '28%' },
  { id: '5', label: 'United States of America', left: '18%', top: '38%' },
  { id: '26', label: 'Brazil', left: '28%', top: '68%' },
  { id: '22', label: 'Morocco', left: '46%', top: '42%' },
  { id: '4', label: 'United Kingdom', left: '47%', top: '27%' },
  { id: '18', label: 'Netherlands', left: '50%', top: '29%' },
  { id: '17', label: 'Belgium', left: '49%', top: '31%' },
  { id: '14', label: 'France', left: '48%', top: '33%' },
  { id: '10', label: 'Kenya', left: '56%', top: '58%' },
  { id: '25', label: 'India', left: '68%', top: '46%' },
  { id: '13', label: 'China', left: '74%', top: '38%' },
  { id: '21', label: 'South Korea', left: '81%', top: '37%' },
  { id: '2', label: 'Japan', left: '84%', top: '36%' },
  { id: '16', label: 'Taiwan', left: '80%', top: '44%' },
  { id: '20', label: 'Philippines', left: '80%', top: '52%' },
  { id: '6', label: 'Singapore', left: '76%', top: '56%' },
  { id: '15', label: 'Australia', left: '84%', top: '72%' },
]

export function DestinationsMapSection() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()

  return (
    <Box
      component="section"
      aria-labelledby="destinations-map-heading"
      sx={{
        py: landingSectionPy,
        bgcolor: colors.white,
        overflow: 'hidden',
      }}
    >
      <PublicContainer>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 640,
            mx: 'auto',
            mb: landingSectionHeaderMb,
          }}
        >
          <Typography
            id="destinations-map-heading"
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontWeight: 800,
              fontSize: { xs: '28px', md: '36px', lg: '40px' },
              lineHeight: 1.15,
              color: colors.navy,
              letterSpacing: '-0.02em',
              mb: 1.25,
            }}
          >
            Visa destinations worldwide
          </Typography>
          <Typography
            sx={{
              fontFamily: publicFonts.body,
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.6,
            }}
          >
            Explore popular destinations — hover or tap a marker for details.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 1100,
            mx: 'auto',
            aspectRatio: { xs: '1.6 / 1', md: '2.15 / 1' },
            minHeight: { xs: 280, sm: 340, md: 400 },
            userSelect: 'none',
          }}
        >
          <Box
            component="img"
            src={footerWorldMapSrc}
            alt=""
            aria-hidden
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '96%',
              height: '92%',
              objectFit: 'contain',
              objectPosition: 'center',
              opacity: 0.28,
              filter: 'grayscale(1) contrast(0.9) brightness(1.05)',
              pointerEvents: 'none',
            }}
          />

          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, transparent 1.35px, ${colors.white} 1.45px)`,
              backgroundSize: '9px 9px',
              backgroundPosition: 'center',
              pointerEvents: 'none',
            }}
          />

          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at center, rgba(${brandPrimaryGreenRgb}, 0.07) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {COUNTRY_PINS.map(pin => (
            <Tooltip
              key={pin.id}
              title={pin.label}
              arrow
              placement="top"
              enterTouchDelay={0}
              slotProps={{
                tooltip: {
                  sx: {
                    fontFamily: publicFonts.body,
                    fontWeight: 600,
                    fontSize: '12px',
                    bgcolor: colors.navy,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: '8px',
                  },
                },
                arrow: {
                  sx: { color: colors.navy },
                },
              }}
            >
              <Box
                component="button"
                type="button"
                aria-label={pin.label}
                onClick={() => navigate(`/v2/countries/${pin.id}`)}
                sx={{
                  position: 'absolute',
                  left: pin.left,
                  top: pin.top,
                  transform: 'translate(-50%, -100%)',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  p: 0,
                  m: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover, &:focus-visible': {
                    transform: 'translate(-50%, -100%) scale(1.08)',
                    outline: 'none',
                    zIndex: 3,
                    '& .map-pin-mark': {
                      bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.28)`,
                      boxShadow: `0 0 0 6px rgba(${brandPrimaryGreenRgb}, 0.14)`,
                    },
                    '& .map-pin-label': {
                      bgcolor: colors.navy,
                      borderColor: colors.navy,
                    },
                    '& .map-pin-label .MuiTypography-root': {
                      color: colors.white,
                    },
                  },
                }}
              >
                <Box
                  className="map-pin-label"
                  sx={{
                    px: 0.85,
                    py: 0.35,
                    borderRadius: '8px',
                    bgcolor: colors.white,
                    border: `1px solid ${colors.borderSoft}`,
                    boxShadow: publicShadows.float,
                    maxWidth: 120,
                    transition: 'background-color 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: publicFonts.body,
                      fontWeight: 700,
                      fontSize: { xs: '10px', md: '11px' },
                      lineHeight: 1.2,
                      color: colors.navy,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {pin.label === 'United States of America' ? 'USA' : pin.label}
                  </Typography>
                </Box>

                <Box
                  className="map-pin-mark"
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.18)`,
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: `0 0 0 4px rgba(${brandPrimaryGreenRgb}, 0.08)`,
                    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <MapPin
                    size={14}
                    color={colors.greenBright}
                    fill={colors.greenBright}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Box>
              </Box>
            </Tooltip>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 3 } }}>
          <Button
            onClick={() => navigate('/v2/countries')}
            endIcon={<ArrowRight size={16} />}
            sx={{
              textTransform: 'none',
              fontFamily: publicFonts.body,
              fontWeight: 700,
              fontSize: '14px',
              color: colors.navy,
              px: 2,
              py: 1,
              borderRadius: '10px',
              '&:hover': {
                bgcolor: colors.greenMuted,
              },
            }}
          >
            Browse all destinations
          </Button>
        </Box>
      </PublicContainer>
    </Box>
  )
}
