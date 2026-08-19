import { useEffect, useMemo, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react'
import { Box, Typography, Button, IconButton, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  CarFront,
  ClipboardList,
  FileCheck2,
  FileText,
  FolderCheck,
  GraduationCap,
  Headphones,
  HeartHandshake,
  Palmtree,
  Plane,
  PlaneTakeoff,
  ShieldAlert,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PublicContainer } from './PublicContainer'
import {
  landingSectionHeaderMb,
  landingSectionPy,
} from '../pages/LandingPage/landingPageSpacing'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
} from '@/shared/theme/publicBrand'
import { additionalServicesSlider } from '../assets/landingPageImages'

const CARD_RADIUS = '16px'
const GAP_PX = 18
/** Row height for featured + collapsed cards. */
const SQUARE_H = { xs: 210, sm: 230, md: 260 }
/** Collapsed card width — slightly narrower so the featured card can breathe. */
const SQUARE_W = { xs: 196, sm: 214, md: 236 }
const EXPAND_MS = '360ms'
const EASE = 'ease-in-out'

/** Icons shown on collapsed cards before a service opens as the featured panel. */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  'travel-insurance': ShieldCheck,
  'travel-insurance-support': ShieldCheck,
  'ticket-for-visa': PlaneTakeoff,
  'hotel-booking-for-visa': Building2,
  'passport-assistance': FileText,
  'appointment-assistance': ClipboardList,
  'student-visa-guidance': GraduationCap,
  'senior-citizen-assistance': HeartHandshake,
  'guided-document-preparation': ClipboardList,
  'travel-documentation': FileText,
  'travel-transit-documentation': FileCheck2,
  'compliance-record-management': FolderCheck,
  hotels: Building2,
  'airport-transfers': CarFront,
  forex: Banknote,
  'forex-support': Banknote,
  holidays: Palmtree,
  'travel-assistance-24x7': Headphones,
  // Retail visa services
  'tourist-family': Plane,
  business: Briefcase,
  student: GraduationCap,
  transit: PlaneTakeoff,
  refusal: ShieldAlert,
}

function resolveServiceIcon(serviceId: string): LucideIcon {
  return SERVICE_ICONS[serviceId] ?? FileText
}

export type AdditionalServiceItem = {
  id: string
  title: string
  description: string
  ctaLabel: string
  href: string
  image: {
    src: string
    fallback: string
    alt: string
    objectPosition?: string
  }
}

export type AdditionalServicesSectionProps = {
  id?: string
  sectionLabel?: string
  heading?: string
  description?: string
  services?: readonly AdditionalServiceItem[]
}

function useCollapsedCount() {
  const theme = useTheme()
  const isLg = useMediaQuery(theme.breakpoints.up('lg'))
  const isSm = useMediaQuery(theme.breakpoints.up('sm'))
  if (isLg) return 4
  if (isSm) return 3
  return 0 // mobile: featured only
}

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total
}

function ServiceImage({
  src,
  fallback,
  alt,
  objectPosition = 'center center',
  sx,
}: {
  src: string
  fallback: string
  alt: string
  objectPosition?: string
  sx?: object
}) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback)
      }}
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition,
        ...sx,
      }}
    />
  )
}

function FeaturedCard({
  service,
  reducedMotion,
  squareSize,
}: {
  service: AdditionalServiceItem
  reducedMotion: boolean
  squareSize: number
}) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        position: 'relative',
        flex: '1 1 auto',
        minWidth: 0,
        height: squareSize,
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        bgcolor: colors.white,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 12px 28px rgba(${brandPrimaryGreenRgb}, 0.12)`,
        display: 'flex',
      }}
    >
      <Box
        sx={{
          flex: '0 0 38%',
          maxWidth: 280,
          p: { xs: 2, md: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          bgcolor: colors.white,
        }}
      >
        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: { xs: '17px', md: '19px' },
            fontWeight: 800,
            color: colors.greenBright,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            mb: 0.85,
          }}
        >
          {service.title}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '12.5px', md: '13px' },
            color: colors.textSecondary,
            lineHeight: 1.45,
            mb: 1.75,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {service.description}
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowRight size={14} strokeWidth={2.25} />}
          onClick={() => navigate(service.href)}
          sx={{
            ...getMarketingPrimaryButtonSx(colors),
            alignSelf: 'flex-start',
            borderRadius: '10px',
            minHeight: 34,
            px: 1.75,
            fontSize: '12.5px',
            fontWeight: 700,
          }}
        >
          {service.ctaLabel}
        </Button>
      </Box>

      <Box sx={{ flex: 1, position: 'relative', minWidth: 0, overflow: 'hidden' }}>
        <Box
          key={service.id}
          sx={{
            position: 'absolute',
            inset: 0,
            animation: reducedMotion ? 'none' : `featuredImageIn ${EXPAND_MS} ${EASE}`,
            '@keyframes featuredImageIn': {
              from: { opacity: 0, transform: 'scale(1.05)' },
              to: { opacity: 1, transform: 'scale(1)' },
            },
          }}
        >
          <ServiceImage
            src={service.image.src}
            fallback={service.image.fallback}
            alt={service.image.alt}
            objectPosition={service.image.objectPosition ?? 'center center'}
          />
        </Box>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, ${colors.white} 0%, transparent 18%)`,
            pointerEvents: 'none',
          }}
        />
      </Box>
    </Box>
  )
}

function SquareCard({
  service,
  onSelect,
  reducedMotion,
  squareWidth,
  squareHeight,
}: {
  service: AdditionalServiceItem
  onSelect: () => void
  reducedMotion: boolean
  squareWidth: number
  squareHeight: number
}) {
  const colors = usePublicBrandColors()
  const Icon = resolveServiceIcon(service.id)

  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      aria-label={`View ${service.title}`}
      sx={{
        flex: '0 0 auto',
        width: squareWidth,
        height: squareHeight,
        m: 0,
        p: { xs: 2, md: 2.5 },
        border: `1px solid ${colors.border}`,
        borderRadius: CARD_RADIUS,
        bgcolor: colors.white,
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.07)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.15,
        textAlign: 'center',
        transition: reducedMotion
          ? 'none'
          : `transform ${EXPAND_MS} ${EASE}, box-shadow ${EXPAND_MS} ${EASE}, border-color ${EXPAND_MS} ${EASE}`,
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-3px)',
            borderColor: colors.greenBright,
            boxShadow: `0 12px 28px rgba(${brandPrimaryGreenRgb}, 0.14)`,
          },
          '&:hover .square-icon': {
            bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.18)`,
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.4)`,
            transform: 'scale(1.06)',
          },
        },
      }}
    >
      <Box
        className="square-icon"
        sx={{
          width: { xs: 56, md: 64 },
          height: { xs: 56, md: 64 },
          borderRadius: '14px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.12)`,
          border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.22)`,
          transition: reducedMotion
            ? 'none'
            : `transform ${EXPAND_MS} ${EASE}, background-color ${EXPAND_MS} ${EASE}, border-color ${EXPAND_MS} ${EASE}`,
        }}
      >
        <Icon size={26} color={colors.greenBright} strokeWidth={1.85} aria-hidden />
      </Box>

      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontSize: { xs: '12.5px', md: '13px' },
          fontWeight: 700,
          color: colors.navy,
          textAlign: 'center',
          lineHeight: 1.3,
          letterSpacing: '-0.02em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {service.title}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: '11.5px', md: '12px' },
          fontWeight: 500,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {service.description}
      </Typography>
    </Box>
  )
}

function NavArrow({
  direction,
  onClick,
  label,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  label: string
}) {
  const colors = usePublicBrandColors()
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight

  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.white,
        color: colors.navy,
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
        flexShrink: 0,
        transition: `border-color ${EXPAND_MS} ${EASE}, color ${EXPAND_MS} ${EASE}, box-shadow ${EXPAND_MS} ${EASE}`,
        '&:hover': {
          borderColor: colors.greenBright,
          color: colors.greenBright,
          bgcolor: colors.white,
          boxShadow: `0 8px 20px rgba(${brandPrimaryGreenRgb}, 0.16)`,
        },
      }}
    >
      <Icon size={18} strokeWidth={2.25} />
    </IconButton>
  )
}

export function AdditionalServicesSection({
  id = 'additional-services',
  sectionLabel = 'Additional Services',
  heading = 'A Few More Things We Can Help With',
  description = 'Optional travel assistance for the documents and bookings commonly needed with visa applications.',
  services = additionalServicesSlider,
}: AdditionalServicesSectionProps) {
  const colors = usePublicBrandColors()
  const theme = useTheme()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isSm = useMediaQuery(theme.breakpoints.up('sm'))
  const isMd = useMediaQuery(theme.breakpoints.up('md'))
  const collapsedCount = useCollapsedCount()
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const total = services.length
  const squareHeight = isMd ? SQUARE_H.md : isSm ? SQUARE_H.sm : SQUARE_H.xs
  const squareWidth = isMd ? SQUARE_W.md : isSm ? SQUARE_W.sm : SQUARE_W.xs

  const collapsedServices = useMemo(() => {
    if (collapsedCount === 0 || total === 0) return []
    return Array.from({ length: Math.min(collapsedCount, Math.max(0, total - 1)) }, (_, i) => {
      const index = wrapIndex(activeIndex + i + 1, total)
      return services[index]
    })
  }, [activeIndex, collapsedCount, services, total])

  const activeService = services[wrapIndex(activeIndex, total)]

  const goPrev = () => setActiveIndex((i) => wrapIndex(i - 1, total))
  const goNext = () => setActiveIndex((i) => wrapIndex(i + 1, total))

  const handleTouchStart = (event: ReactTouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event: ReactTouchEvent) => {
    if (touchStartX.current == null) return
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 48) return
    if (delta < 0) goNext()
    else goPrev()
  }

  if (!activeService) return null

  return (
    <Box
      component="section"
      id={id}
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 560, mb: landingSectionHeaderMb }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.greenBright,
              mb: 1.5,
            }}
          >
            {sectionLabel}
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '26px', md: '32px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              mb: 1.25,
            }}
          >
            {heading}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.25, md: 2 },
          }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <NavArrow direction="prev" onClick={goPrev} label="Previous services" />
          </Box>

          <Box
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              alignItems: 'stretch',
              gap: `${GAP_PX}px`,
              height: squareHeight,
              overflow: 'hidden',
            }}
          >
            <Box
              key={activeService.id}
              sx={{
                flex: '1 1 auto',
                minWidth: 0,
                height: squareHeight,
                animation: reducedMotion ? 'none' : `slideFade ${EXPAND_MS} ${EASE}`,
                '@keyframes slideFade': {
                  from: { opacity: 0.55, transform: 'translateX(12px)' },
                  to: { opacity: 1, transform: 'translateX(0)' },
                },
              }}
            >
              <FeaturedCard
                service={activeService}
                reducedMotion={reducedMotion}
                squareSize={squareHeight}
              />
            </Box>

            {collapsedServices.map((service) => (
              <SquareCard
                key={`${activeIndex}-${service.id}`}
                service={service}
                squareWidth={squareWidth}
                squareHeight={squareHeight}
                reducedMotion={reducedMotion}
                onSelect={() => {
                  const next = services.findIndex((item) => item.id === service.id)
                  if (next >= 0) setActiveIndex(next)
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <NavArrow direction="next" onClick={goNext} label="Next services" />
          </Box>
        </Box>

        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            justifyContent: 'center',
            gap: 1.5,
            mt: 2.5,
          }}
        >
          <NavArrow direction="prev" onClick={goPrev} label="Previous services" />
          <NavArrow direction="next" onClick={goNext} label="Next services" />
        </Box>
      </PublicContainer>
    </Box>
  )
}
