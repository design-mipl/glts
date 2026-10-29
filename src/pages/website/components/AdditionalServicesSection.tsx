import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
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
import { SiteSection, SiteSectionHeading } from './SiteSection'
import { useSiteTone } from './siteTone'
import { siteFont, siteMotion, siteRadius, clippedCorner } from '@/pages/website/theme/siteTheme'
import { additionalServicesSlider } from '../assets/landingPageImages'

const GAP_PX = 18
/** Row height for featured + collapsed cards. */
const SQUARE_H = { xs: 210, sm: 230, md: 260 }
/** Collapsed card width — slightly narrower so the featured card can breathe. */
const SQUARE_W = { xs: 196, sm: 214, md: 236 }
/**
 * Was 360ms `ease-in-out`. The featured card is re-keyed on every arrow press, so this is
 * an entrance that a visitor can fire repeatedly — it belongs under the 300ms ceiling, on
 * the strong ease-out, so a fast second press doesn't visibly restart a slow curve.
 */
const SWAP_MS = '220ms'

/** Icons shown on collapsed cards before a service opens as the featured panel. */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  'travel-insurance': ShieldCheck,
  'travel-insurance-support': ShieldCheck,
  attestation: FileCheck2,
  notary: FileText,
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

/**
 * Rendered through `createElement` rather than as `<Icon />` off a local variable: the
 * component is chosen by a lookup at render time, and assigning that to a capitalised
 * binding reads to the linter as a component defined during render.
 */
function renderServiceIcon(serviceId: string) {
  return createElement(SERVICE_ICONS[serviceId] ?? FileText, { size: 22, strokeWidth: 1.85 })
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
  const t = useSiteTone()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        position: 'relative',
        flex: '1 1 auto',
        minWidth: 0,
        height: squareSize,
        borderRadius: siteRadius.card,
        clipPath: clippedCorner(20),
        overflow: 'hidden',
        backgroundColor: t.surface,
        border: `1px solid ${t.hairline}`,
        display: 'flex',
      }}
    >
      <Box
        sx={{
          flex: '0 0 38%',
          maxWidth: 280,
          p: { xs: 2.5, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          backgroundColor: t.surface,
        }}
      >
        <Typography
          sx={{
            fontFamily: siteFont.display,
            fontSize: { xs: 16, md: 18 },
            fontWeight: 700,
            color: t.text,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            mb: 1.25,
          }}
        >
          {service.title}
        </Typography>

        <Typography
          sx={{
            fontFamily: siteFont.body,
            fontSize: { xs: 12.5, md: 13 },
            color: t.textMuted,
            lineHeight: 1.5,
            mb: 2.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {service.description}
        </Typography>

        <Box
          component="button"
          type="button"
          onClick={() => navigate(service.href)}
          sx={{
            appearance: 'none',
            border: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.25,
            px: 2.25,
            minHeight: 36,
            '@media (pointer: coarse)': { minHeight: 44 },
            borderRadius: siteRadius.control,
            backgroundColor: t.accent,
            color: '#12151A',
            fontFamily: siteFont.body,
            fontSize: 12.5,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            transition: `background-color 150ms ${siteMotion.easeOut}, transform ${siteMotion.pressMs}ms ${siteMotion.easeOut}`,
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': { backgroundColor: t.accentStrong },
              '&:hover .svcCtaArrow': { transform: 'translateX(3px)' },
            },
            '&:active': { transform: 'scale(0.97)' },
            '&:focus-visible': {
              outline: 'none',
              boxShadow: `0 0 0 3px ${t.accentSoft}`,
            },
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'background-color 150ms linear',
            },
          }}
        >
          {service.ctaLabel}
          <Box
            component="span"
            className="svcCtaArrow"
            sx={{
              display: 'inline-flex',
              transition: `transform 180ms ${siteMotion.easeOut}`,
            }}
          >
            <ArrowRight size={14} strokeWidth={2.25} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, position: 'relative', minWidth: 0, overflow: 'hidden' }}>
        <Box
          key={service.id}
          sx={{
            position: 'absolute',
            inset: 0,
            animation: reducedMotion
              ? 'none'
              : `featuredImageIn ${SWAP_MS} ${siteMotion.easeOut}`,
            '@keyframes featuredImageIn': {
              from: { opacity: 0, transform: 'scale(1.04)' },
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
        {/* Feathers the photograph into the copy panel so the card reads as one surface. */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, ${t.surface} 0%, transparent 18%)`,
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
  const t = useSiteTone()

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
        border: `1px solid ${t.hairline}`,
        borderRadius: siteRadius.card,
        backgroundColor: t.surface,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        textAlign: 'center',
        /**
         * No `translateY` lift and no coloured glow — the shadow-lift hover belonged to the
         * retired visual language. Selection here is a hairline going darker plus the
         * press scale, which is the same feedback every other control on the site gives.
         */
        transition: reducedMotion
          ? 'none'
          : `border-color 160ms ${siteMotion.easeOut}, background-color 160ms ${siteMotion.easeOut}, transform ${siteMotion.pressMs}ms ${siteMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            borderColor: t.hairlineStrong,
            backgroundColor: t.surfaceRaised,
          },
          '&:hover .square-icon': { backgroundColor: t.brandSoft, borderColor: t.brand },
        },
        '&:active': { transform: 'scale(0.97)' },
        '&:focus-visible': {
          outline: 'none',
          borderColor: t.accent,
          boxShadow: `0 0 0 3px ${t.accentSoft}`,
        },
      }}
    >
      {/*
       * One neutral icon treatment for every service type. Per-type coloured chips are
       * the flagged "AI-generated SaaS" tell in the V2 spec — types are told apart by the
       * icon's shape, never by giving each one its own tint.
       */}
      <Box
        className="square-icon"
        aria-hidden
        sx={{
          width: { xs: 48, md: 54 },
          height: { xs: 48, md: 54 },
          borderRadius: siteRadius.control,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.brandSoft,
          border: `1px solid ${t.brandBorder}`,
          color: t.brandText,
          transition: reducedMotion
            ? 'none'
            : `border-color 160ms ${siteMotion.easeOut}, color 160ms ${siteMotion.easeOut}`,
        }}
      >
        {renderServiceIcon(service.id)}
      </Box>

      <Typography
        sx={{
          fontFamily: siteFont.display,
          fontSize: { xs: 12.5, md: 13.5 },
          fontWeight: 700,
          color: t.text,
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
          fontFamily: siteFont.body,
          fontSize: { xs: 11.5, md: 12 },
          fontWeight: 400,
          color: t.textMuted,
          textAlign: 'center',
          lineHeight: 1.45,
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
  const t = useSiteTone()
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight

  return (
    <Box
      component="button"
      type="button"
      aria-label={label}
      onClick={onClick}
      sx={{
        appearance: 'none',
        cursor: 'pointer',
        width: 40,
        height: 40,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        borderRadius: '50%',
        border: `1px solid ${t.hairline}`,
        backgroundColor: 'transparent',
        color: t.textMuted,
        transition: `border-color 150ms ${siteMotion.easeOut}, color 150ms ${siteMotion.easeOut}, transform ${siteMotion.pressMs}ms ${siteMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': { borderColor: t.hairlineStrong, color: t.text },
        },
        '&:active': { transform: 'scale(0.95)' },
        '&:focus-visible': {
          outline: 'none',
          borderColor: t.accent,
          boxShadow: `0 0 0 3px ${t.accentSoft}`,
        },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <Icon size={17} strokeWidth={2.25} />
    </Box>
  )
}

/**
 * Additional services — featured panel plus collapsed icon cards.
 *
 * Moved off the retired `publicFonts` / `publicColors` language onto the site tokens: 10px
 * radius instead of 16px, hairline construction instead of green-tinted drop shadows, the
 * neutral icon treatment the V2 spec locks in, and the gold CTA every other section uses.
 * Colours now come from `useSiteTone`, so the section inherits whichever band it sits in
 * rather than forcing its own white ground.
 *
 * The slider interaction is unchanged — it was never the problem, and it is deliberately a
 * different shape from the service bento that precedes it on the homepage.
 *
 * Mounted on the homepage and, via `OurRetailServicesSection`, on the Retail page.
 */
export function AdditionalServicesSection({
  id = 'additional-services',
  sectionLabel = 'Additional Services',
  heading = 'A Few More Things We Can Help With',
  description = 'Optional travel assistance for the documents and bookings commonly needed with visa applications.',
  services = additionalServicesSlider,
}: AdditionalServicesSectionProps) {
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
    <SiteSection id={id}>
      <SiteSectionHeading eyebrow={sectionLabel} title={heading} lead={description} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, md: 2 } }}>
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
              animation: reducedMotion ? 'none' : `slideFade ${SWAP_MS} ${siteMotion.easeOut}`,
              '@keyframes slideFade': {
                from: { opacity: 0.55, transform: 'translateX(10px)' },
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
    </SiteSection>
  )
}
