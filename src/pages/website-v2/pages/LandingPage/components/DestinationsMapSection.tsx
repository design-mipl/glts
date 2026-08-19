import { useEffect, useMemo, useRef, useState, type TransitionEvent } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { MapPin, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PublicContainer } from '../../../components/PublicContainer'
import footerWorldMapSrc from '../../../assets/footerWorldMap.svg'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'

type CityGeoCoordinate = {
  lat: number
  lon: number
}

type CityDestination = CityGeoCoordinate & {
  countryId: string
  country: string
  city: string
  description: string
}

type CityPin = {
  id: string
  countryId: string
  country: string
  city: string
  description: string
  left: string
  top: string
}

const MAP_DOT_COLOR = '#73C064'
const OCEAN_CONTOUR_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" fill="none">
  <g stroke="#8EA9B8" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" opacity="0.15">
    <path d="M24 204C47 167 100 150 145 168C183 184 194 221 168 252C136 291 66 290 31 252C8 227 9 218 24 204Z" />
    <path d="M51 211C70 189 104 181 133 192C158 201 166 225 149 244C128 268 86 269 61 246C42 229 40 223 51 211Z" />
    <path d="M77 221C91 209 111 205 128 212C143 218 147 232 136 243C123 256 99 257 84 245C71 235 69 228 77 221Z" />
    <path d="M83 392C124 357 198 354 250 388C294 416 297 463 252 492C203 524 121 510 86 465C63 435 58 414 83 392Z" />
    <path d="M125 403C154 384 201 383 235 405C263 424 265 455 236 474C204 495 151 490 128 462C111 442 107 416 125 403Z" />
    <path d="M435 163C469 136 524 133 566 160C602 183 608 223 574 250C537 280 477 278 442 245C412 217 411 183 435 163Z" />
    <path d="M471 178C494 164 529 164 555 181C578 196 581 221 559 238C534 257 496 256 474 235C453 217 453 190 471 178Z" />
    <path d="M485 417C522 389 586 389 629 420C666 447 666 489 625 513C582 539 517 529 486 494C460 465 458 438 485 417Z" />
    <path d="M523 429C550 413 589 416 613 435C634 452 631 477 607 491C580 508 538 502 520 481C503 462 503 441 523 429Z" />
    <path d="M780 405C818 374 880 371 926 398C967 423 970 466 932 493C889 523 823 517 785 478C757 450 755 425 780 405Z" />
    <path d="M819 418C846 400 886 400 914 418C938 433 940 461 916 478C889 497 846 495 822 473C803 455 801 431 819 418Z" />
    <path d="M1079 213C1114 193 1164 199 1189 232C1215 266 1193 314 1149 333C1102 353 1051 329 1045 286C1041 256 1055 227 1079 213Z" />
    <path d="M1099 235C1122 224 1154 228 1169 248C1186 271 1172 302 1144 315C1116 328 1084 312 1079 284C1075 262 1084 243 1099 235Z" />
  </g>
  <g stroke="#8EA9B8" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round" opacity="0.1">
    <path d="M28 72C70 51 123 56 165 83C197 103 229 108 259 95" />
    <path d="M410 87C454 57 523 58 567 88C597 109 633 111 666 94" />
    <path d="M1072 89C1106 73 1153 77 1184 101" />
    <path d="M27 533C83 507 154 511 207 542C249 566 302 570 350 549" />
    <path d="M456 532C511 505 584 509 637 541C680 567 733 570 779 549" />
    <path d="M879 532C931 506 1000 510 1050 540C1091 565 1145 569 1186 548" />
  </g>
</svg>
`)}")`

const CITY_DESTINATIONS: CityDestination[] = [
  { countryId: '23', country: 'Canada', city: 'Toronto', lat: 43.6532, lon: -79.3832, description: 'Canada\'s largest city and a major international gateway.' },
  { countryId: '23', country: 'Canada', city: 'Vancouver', lat: 49.2827, lon: -123.1207, description: 'A leading Pacific coast destination framed by mountains.' },
  { countryId: '23', country: 'Canada', city: 'Montreal', lat: 45.5017, lon: -73.5673, description: 'A bilingual cultural hub known for arts and heritage.' },
  { countryId: '5', country: 'United States', city: 'New York', lat: 40.7128, lon: -74.006, description: 'A global centre for business, culture and tourism.' },
  { countryId: '5', country: 'United States', city: 'San Francisco', lat: 37.7749, lon: -122.4194, description: 'A major technology and tourism hub on the Pacific coast.' },
  { countryId: '26', country: 'Brazil', city: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, description: 'Brazil\'s iconic coastal city and tourism centre.' },
  { countryId: '26', country: 'Brazil', city: 'Sao Paulo', lat: -23.5505, lon: -46.6333, description: 'Brazil\'s largest city and principal business hub.' },
  { countryId: '26', country: 'Brazil', city: 'Brasilia', lat: -15.7939, lon: -47.8828, description: 'Brazil\'s modern capital and administrative centre.' },
  { countryId: '22', country: 'Morocco', city: 'Casablanca', lat: 33.5731, lon: -7.5898, description: 'Morocco\'s largest city and commercial gateway.' },
  { countryId: '22', country: 'Morocco', city: 'Marrakech', lat: 31.6295, lon: -7.9811, description: 'A historic destination known for markets and architecture.' },
  { countryId: '22', country: 'Morocco', city: 'Rabat', lat: 34.0209, lon: -6.8416, description: 'Morocco\'s capital and diplomatic centre.' },
  { countryId: '4', country: 'United Kingdom', city: 'London', lat: 51.5074, lon: -0.1278, description: 'The UK\'s capital and a global business and cultural centre.' },
  { countryId: '4', country: 'United Kingdom', city: 'Edinburgh', lat: 55.9533, lon: -3.1883, description: 'Scotland\'s historic capital and festival city.' },
  { countryId: '18', country: 'Netherlands', city: 'Amsterdam', lat: 52.3676, lon: 4.9041, description: 'The Netherlands\' cultural capital and international gateway.' },
  { countryId: '17', country: 'Belgium', city: 'Brussels', lat: 50.8503, lon: 4.3517, description: 'Belgium\'s capital and a major European institutions hub.' },
  { countryId: '14', country: 'France', city: 'Paris', lat: 48.8566, lon: 2.3522, description: 'France\'s capital and one of the world\'s leading destinations.' },
  { countryId: '14', country: 'France', city: 'Lyon', lat: 45.764, lon: 4.8357, description: 'A major French centre for business, culture and cuisine.' },
  { countryId: '10', country: 'Kenya', city: 'Nairobi', lat: -1.2921, lon: 36.8219, description: 'Kenya\'s capital and East Africa\'s principal business hub.' },
  { countryId: '10', country: 'Kenya', city: 'Mombasa', lat: -4.0435, lon: 39.6682, description: 'Kenya\'s historic Indian Ocean port city.' },
  { countryId: '25', country: 'India', city: 'Delhi', lat: 28.6139, lon: 77.209, description: 'India\'s capital and a major international arrival point.' },
  { countryId: '25', country: 'India', city: 'Mumbai', lat: 19.076, lon: 72.8777, description: 'India\'s financial capital and busiest commercial gateway.' },
  { countryId: '25', country: 'India', city: 'Bengaluru', lat: 12.9716, lon: 77.5946, description: 'India\'s leading technology and innovation centre.' },
  { countryId: '13', country: 'China', city: 'Beijing', lat: 39.9042, lon: 116.4074, description: 'China\'s capital and principal cultural and political centre.' },
  { countryId: '13', country: 'China', city: 'Shanghai', lat: 31.2304, lon: 121.4737, description: 'China\'s largest city and global financial hub.' },
  { countryId: '13', country: 'China', city: 'Guangzhou', lat: 23.1291, lon: 113.2644, description: 'A major southern Chinese trade and manufacturing centre.' },
  { countryId: '21', country: 'South Korea', city: 'Seoul', lat: 37.5665, lon: 126.978, description: 'South Korea\'s capital and largest metropolitan destination.' },
  { countryId: '21', country: 'South Korea', city: 'Busan', lat: 35.1796, lon: 129.0756, description: 'South Korea\'s leading port and coastal destination.' },
  { countryId: '2', country: 'Japan', city: 'Tokyo', lat: 35.6762, lon: 139.6503, description: 'Japan\'s capital and primary international gateway.' },
  { countryId: '2', country: 'Japan', city: 'Osaka', lat: 34.6937, lon: 135.5023, description: 'A major Japanese business, food and entertainment centre.' },
  { countryId: '16', country: 'Taiwan', city: 'Taipei', lat: 25.033, lon: 121.5654, description: 'Taiwan\'s capital and main international gateway.' },
  { countryId: '16', country: 'Taiwan', city: 'Kaohsiung', lat: 22.6273, lon: 120.3014, description: 'Taiwan\'s principal southern port city.' },
  { countryId: '20', country: 'Philippines', city: 'Manila', lat: 14.5995, lon: 120.9842, description: 'The Philippines\' capital and primary travel gateway.' },
  { countryId: '20', country: 'Philippines', city: 'Cebu', lat: 10.3157, lon: 123.8854, description: 'A central Philippine hub for beaches, business and heritage.' },
  { countryId: '6', country: 'Singapore', city: 'Singapore', lat: 1.3521, lon: 103.8198, description: 'A major Asian aviation, business and tourism hub.' },
  { countryId: '15', country: 'Australia', city: 'Sydney', lat: -33.8688, lon: 151.2093, description: 'Australia\'s best-known harbour city and travel gateway.' },
  { countryId: '15', country: 'Australia', city: 'Melbourne', lat: -37.8136, lon: 144.9631, description: 'A leading Australian centre for culture, study and business.' },
  { countryId: '15', country: 'Australia', city: 'Perth', lat: -31.9523, lon: 115.8613, description: 'Western Australia\'s capital and Indian Ocean gateway.' },
]

function projectCityToMap(coordinate: CityGeoCoordinate): Pick<CityPin, 'left' | 'top'> {
  // footerWorldMap.svg uses a 2:1 equirectangular projection.
  const latitude = Math.max(-90, Math.min(90, coordinate.lat))
  const left = ((coordinate.lon + 180) / 360) * 100
  const top = ((90 - latitude) / 180) * 100

  return {
    left: `${left.toFixed(2)}%`,
    top: `${top.toFixed(2)}%`,
  }
}

function buildCityPins(): CityPin[] {
  const countryCounts = new Map<string, number>()

  return CITY_DESTINATIONS.flatMap(destination => {
    const count = countryCounts.get(destination.countryId) ?? 0
    if (count >= 5) return []

    countryCounts.set(destination.countryId, count + 1)
    return [{
      id: `${destination.countryId}-${destination.city.toLowerCase().replace(/\s+/g, '-')}`,
      countryId: destination.countryId,
      country: destination.country,
      city: destination.city,
      description: destination.description,
      ...projectCityToMap(destination),
    }]
  })
}

export function DestinationsMapSection() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement | null>(null)
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null)
  const [zoomPinId, setZoomPinId] = useState<string | null>(null)
  const [isMapZoomed, setIsMapZoomed] = useState(false)
  const [hasMapEntered, setHasMapEntered] = useState(false)
  const cityPins = useMemo(() => buildCityPins(), [])
  const zoomPin = useMemo(
    () => cityPins.find(pin => pin.id === zoomPinId) ?? null,
    [cityPins, zoomPinId],
  )

  useEffect(() => {
    if (hasMapEntered) return undefined

    const section = sectionRef.current
    if (!section || typeof window.IntersectionObserver === 'undefined') {
      const frameId = window.requestAnimationFrame(() => setHasMapEntered(true))
      return () => window.cancelAnimationFrame(frameId)
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setHasMapEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.28 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [hasMapEntered])

  const handlePinEnter = (pin: CityPin) => {
    setHoveredPinId(pin.id)
    setZoomPinId(pin.id)
    setIsMapZoomed(true)
  }

  const handlePinLeave = () => {
    setHoveredPinId(null)
    setIsMapZoomed(false)
  }

  const handleZoomTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'transform' && !isMapZoomed) {
      setZoomPinId(null)
    }
  }

  return (
    <Box
      ref={sectionRef}
      component="section"
      aria-labelledby="destinations-map-heading"
      sx={{
        py: landingSectionPy,
        bgcolor: colors.white,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        '@keyframes mapDotRevealOnce': {
          '0%': {
            WebkitClipPath: 'polygon(0 0, 0 0, 0 0, 0 0)',
            clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)',
            opacity: 0,
          },
          '8%': {
            opacity: 1,
          },
          '78%': {
            WebkitClipPath: 'polygon(0 0, 220% 0, 0 220%, 0 0)',
            clipPath: 'polygon(0 0, 220% 0, 0 220%, 0 0)',
          },
          '100%': {
            WebkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            opacity: 1,
          },
        },
        '@keyframes mapPinAppear': {
          '0%': {
            opacity: 0,
            transform: 'translateX(-50%) scale(0.96)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(-50%) scale(1)',
          },
        },
      }}
    >
      <PublicContainer variant="hero">
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
              letterSpacing: 0,
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
            Explore popular visa destinations around the world.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 1520,
            mx: 'auto',
            aspectRatio: { xs: '1.15 / 1', sm: '1.55 / 1', md: '2.1 / 1', lg: '2.25 / 1' },
            minHeight: { xs: 390, sm: 460, md: 560, lg: 640 },
            userSelect: 'none',
            overflow: 'hidden',
            borderRadius: { xs: '18px', md: '28px' },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: { xs: '98%', sm: '98%', md: '87.6%', lg: '81.8%' },
              maxHeight: '92%',
              aspectRatio: '2 / 1',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Box
              onTransitionEnd={handleZoomTransitionEnd}
              sx={{
                position: 'absolute',
                inset: 0,
                transform: isMapZoomed && zoomPin ? 'scale(2.6)' : 'scale(1)',
                transformOrigin: zoomPin ? `${zoomPin.left} ${zoomPin.top}` : '50% 50%',
                transition: 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform',
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: 'none',
                  backgroundImage: OCEAN_CONTOUR_PATTERN,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: '100% 100%',
                  opacity: { xs: 0.34, md: 0.42 },
                }}
              />

              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  pointerEvents: 'none',
                  bgcolor: colors.white,
                  WebkitMaskImage: `url("${footerWorldMapSrc}")`,
                  maskImage: `url("${footerWorldMapSrc}")`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                }}
              />

              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  pointerEvents: 'none',
                  WebkitMaskImage: `url("${footerWorldMapSrc}")`,
                  maskImage: `url("${footerWorldMapSrc}")`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  backgroundImage:
                    'radial-gradient(circle, rgba(43, 63, 82, 0.2) 1.4px, transparent 1.75px)',
                  backgroundSize: { xs: '8px 8px', md: '9px 9px', lg: '10px 10px' },
                  backgroundPosition: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    opacity: hasMapEntered ? 1 : 0,
                    backgroundImage: `radial-gradient(circle, ${MAP_DOT_COLOR} 1.5px, transparent 1.8px)`,
                    backgroundSize: { xs: '8px 8px', md: '9px 9px', lg: '10px 10px' },
                    backgroundPosition: 'center',
                    WebkitClipPath: hasMapEntered
                      ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                      : 'polygon(0 0, 0 0, 0 0, 0 0)',
                    clipPath: hasMapEntered
                      ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                      : 'polygon(0 0, 0 0, 0 0, 0 0)',
                    animation: hasMapEntered
                      ? 'mapDotRevealOnce 1200ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both'
                      : 'none',
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    '&::before': {
                      animation: 'none',
                      opacity: hasMapEntered ? 1 : 0,
                      WebkitClipPath: 'none',
                      clipPath: 'none',
                    },
                  },
                }}
              />

              {cityPins.map((pin, index) => (
                <Box
                  key={pin.id}
                  sx={{
                    position: 'absolute',
                    left: pin.left,
                    top: pin.top,
                    width: 0,
                    height: 0,
                    zIndex: hoveredPinId === pin.id ? 4 : 2,
                  }}
                >
                  <Box
                    component="button"
                    type="button"
                    aria-label={`${pin.city}, ${pin.country}`}
                    onClick={() => navigate(`/v2/countries/${pin.countryId}`)}
                    onPointerEnter={() => handlePinEnter(pin)}
                    onPointerLeave={handlePinLeave}
                    onFocus={() => handlePinEnter(pin)}
                    onBlur={handlePinLeave}
                    sx={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      width: { xs: 28, md: 32 },
                      height: { xs: 28, md: 32 },
                      p: 0,
                      m: 0,
                      border: 'none',
                      borderRadius: '50%',
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      transform: 'translateX(-50%)',
                      '&:hover, &:focus-visible': {
                        outline: 'none',
                        '& .map-pin-visual': {
                          transform: 'translateX(-50%) scale(1.075)',
                          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.28)`,
                          boxShadow: `0 0 0 5px rgba(${brandPrimaryGreenRgb}, 0.14)`,
                        },
                      },
                      '@media (prefers-reduced-motion: reduce)': {
                        '& .map-pin-visual': {
                          animation: 'none',
                          opacity: 1,
                          transition: 'none',
                        },
                      },
                    }}
                  >
                    <Box
                      className="map-pin-visual"
                      sx={{
                        position: 'absolute',
                        left: '50%',
                        bottom: 0,
                        width: { xs: 16, sm: 19, md: 24 },
                        height: { xs: 16, sm: 19, md: 24 },
                        borderRadius: '50%',
                        bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.18)`,
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: {
                          xs: `0 0 0 3px rgba(${brandPrimaryGreenRgb}, 0.09)`,
                          md: `0 0 0 4px rgba(${brandPrimaryGreenRgb}, 0.1)`,
                        },
                        opacity: 0,
                        transform: 'translateX(-50%) scale(1)',
                        transformOrigin: '50% 100%',
                        animation: `mapPinAppear 360ms cubic-bezier(0.22, 1, 0.36, 1) ${180 + index * 105}ms both`,
                        transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), background-color 240ms ease, box-shadow 240ms ease',
                        '& svg': {
                          width: { xs: 10, sm: 11, md: 14 },
                          height: { xs: 10, sm: 11, md: 14 },
                        },
                      }}
                    >
                      <MapPin
                        size={14}
                        color={MAP_DOT_COLOR}
                        fill={MAP_DOT_COLOR}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {zoomPin && (
              <Box
                aria-hidden={hoveredPinId !== zoomPin.id}
                sx={{
                  position: 'absolute',
                  left: zoomPin.left,
                  top: zoomPin.top,
                  zIndex: 8,
                  px: 0.9,
                  py: 0.4,
                  borderRadius: '8px',
                  bgcolor: colors.white,
                  border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.22)`,
                  boxShadow: `0 8px 22px rgba(8, 32, 55, 0.16)`,
                  pointerEvents: 'none',
                  opacity: hoveredPinId === zoomPin.id ? 1 : 0,
                  transform: hoveredPinId === zoomPin.id
                    ? 'translate(-50%, calc(-100% - 16px)) scale(1)'
                    : 'translate(-50%, calc(-100% - 10px)) scale(0.94)',
                  transformOrigin: '50% 100%',
                  transition: 'opacity 150ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    bottom: -4,
                    width: 7,
                    height: 7,
                    bgcolor: colors.white,
                    borderRight: `1px solid rgba(${brandPrimaryGreenRgb}, 0.22)`,
                    borderBottom: `1px solid rgba(${brandPrimaryGreenRgb}, 0.22)`,
                    transform: 'translateX(-50%) rotate(45deg)',
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    display: 'block',
                    fontFamily: publicFonts.body,
                    fontWeight: 800,
                    fontSize: '12px',
                    lineHeight: 1.2,
                    color: colors.navy,
                    letterSpacing: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {zoomPin.city}
                </Typography>
              </Box>
            )}
          </Box>
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
