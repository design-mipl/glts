import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography, Avatar, Stack } from '@mui/material'
import { Star, MapPin, Cloud, Icon, Ship, Plane, type IconNode } from 'lucide-react'
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { PublicContainer } from './PublicContainer'
import {
  publicFonts,
  publicShadows,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '../theme/publicSiteTokens'
import { landingSectionHeaderMb, PUBLIC_NAV_HEIGHT_PX } from '../pages/LandingPage/landingPageSpacing'
import {
  useTestimonialScrollProgress,
  useVisibleTestimonialCount,
  type ScrollDirection,
} from '../hooks/useTestimonialScrollProgress'

const CARD_GAP = 24
const CARD_HEIGHT = 300
const COMMENT_HEIGHT = 132
const SCROLL_STEP_VH = 0.62
const WAYPOINT_COUNT = 5

const userTieIcon: IconNode = [
  ['circle', { cx: '12', cy: '7', r: '4', key: 'head' }],
  ['path', { d: 'M19 21v-2a7 7 0 0 0-14 0v2', key: 'body' }],
  ['path', { d: 'M12 11v6', key: 'tie-line' }],
  ['path', { d: 'm10 13 2-2 2 2', key: 'tie-knot' }],
  ['path', { d: 'M10.5 15h3', key: 'tie-cross' }],
]

export interface TestimonialItem {
  quote: string
  name: string
  service: string
  initials: string
  avatarBg: string
  avatarSrc: string
  rating?: number
}

export interface TestimonialSectionProps {
  testimonials: TestimonialItem[]
  title?: string
  subtitle?: string
  markerIcon?: 'profile' | 'ship' | 'plane'
}

const DEFAULT_TITLE = 'Trusted by Travelers Worldwide'
const DEFAULT_SUBTITLE =
  'Thousands of travelers, families, students, professionals, and marine crew members trust us for smooth visa processing and travel support.'

function FloatingCloud({
  top,
  left,
  width,
  opacity,
  delay,
}: {
  top: string
  left: string
  width: number
  opacity: number
  delay: number
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        top,
        left,
        opacity,
        pointerEvents: 'none',
        animation: 'testimonialCloudFloat 12s ease-in-out infinite',
        animationDelay: `${delay}s`,
        '@keyframes testimonialCloudFloat': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-10px) translateX(6px)' },
        },
      }}
    >
      <Cloud size={width} color={colors.greenBright} strokeWidth={1.25} style={{ opacity: 0.35 }} />
    </Box>
  )
}

function FlightPathProgress({
  progress,
  direction,
  markerIcon,
}: {
  progress: MotionValue<number>
  direction: ScrollDirection
  markerIcon: 'profile' | 'ship' | 'plane'
}) {
  const colors = usePublicBrandColors()
  const [displayProgress, setDisplayProgress] = useState(0)

  useMotionValueEvent(progress, 'change', (v) => setDisplayProgress(v))

  const planeLeftPercent = useTransform(progress, (p) => `${p * 100}%`)

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 72,
        mb: { xs: 3, md: 4 },
        mt: { xs: 1, md: 2 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          bottom: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.25,
          transform: 'translateX(-4px)',
        }}
      >
        <MapPin size={18} color={colors.greenBright} fill={`rgba(${brandPrimaryGreenRgb}, 0.2)`} />
        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.04em' }}>
          START
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.25,
          transform: 'translateX(4px)',
        }}
      >
        <MapPin size={18} color={colors.navy} fill={`rgba(0, 31, 63, 0.12)`} />
        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.04em' }}>
          DESTINATION
        </Typography>
      </Box>

      <Box
        component="svg"
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        sx={{
          position: 'absolute',
          left: 28,
          right: 28,
          top: 18,
          width: 'calc(100% - 56px)',
          height: 48,
          overflow: 'visible',
        }}
      >
        <defs>
          <linearGradient id="testimonialFlightPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.greenBright} stopOpacity={0.5} />
            <stop offset={`${displayProgress * 100}%`} stopColor={colors.greenBright} stopOpacity={0.85} />
            <stop offset={`${displayProgress * 100}%`} stopColor={colors.border} stopOpacity={0.6} />
            <stop offset="100%" stopColor={colors.border} stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <path
          d="M 0 42 Q 250 8, 500 30 T 1000 24"
          fill="none"
          stroke="url(#testimonialFlightPathGradient)"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
        />
        {Array.from({ length: WAYPOINT_COUNT }).map((_, i) => {
          const t = (i + 1) / (WAYPOINT_COUNT + 1)
          const x = t * 1000
          const y = 42 - Math.sin(t * Math.PI) * 18
          const passed = t <= displayProgress
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={passed ? 5 : 4}
                fill={passed ? colors.greenBright : colors.white}
                stroke={passed ? colors.greenBright : colors.border}
                strokeWidth={2}
              />
              {passed && (
                <circle cx={x} cy={y} r={10} fill={`rgba(${brandPrimaryGreenRgb}, 0.12)`} />
              )}
            </g>
          )
        })}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 28,
          right: 28,
          top: 0,
          height: 36,
        }}
      >
        <Box
          component={motion.div}
          style={{
            left: planeLeftPercent,
            x: '-50%',
          }}
          sx={{
            position: 'absolute',
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component={motion.div}
            animate={{ scaleX: direction === 'backward' ? -1 : 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: colors.white,
              border: `2px solid ${colors.greenBright}`,
              boxShadow: `0 4px 16px rgba(${brandPrimaryGreenRgb}, 0.28)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {markerIcon === 'ship' ? (
              <Ship
                size={16}
                color={colors.greenBright}
                fill={`rgba(${brandPrimaryGreenRgb}, 0.15)`}
                strokeWidth={2.25}
              />
            ) : markerIcon === 'plane' ? (
              <Plane
                size={16}
                color={colors.greenBright}
                fill={`rgba(${brandPrimaryGreenRgb}, 0.15)`}
                strokeWidth={2.25}
              />
            ) : (
              <Icon
                iconNode={userTieIcon}
                size={16}
                color={colors.greenBright}
                fill={`rgba(${brandPrimaryGreenRgb}, 0.15)`}
                strokeWidth={2.25}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function StarRating({ rating }: { rating: number }) {
  const colors = usePublicBrandColors()

  return (
    <Stack direction="row" spacing={0.3} aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => {
        const fillAmount = Math.min(Math.max(rating - index, 0), 1)

        if (fillAmount >= 1) {
          return (
            <Star key={index} size={14} color={colors.greenBright} fill={colors.greenBright} />
          )
        }

        if (fillAmount > 0) {
          return (
            <Box key={index} sx={{ position: 'relative', width: 14, height: 14, flexShrink: 0 }}>
              <Star
                size={14}
                color={colors.greenBright}
                style={{ position: 'absolute', inset: 0, opacity: 0.28 }}
              />
              <Box sx={{ position: 'absolute', inset: 0, width: '50%', overflow: 'hidden' }}>
                <Star size={14} color={colors.greenBright} fill={colors.greenBright} />
              </Box>
            </Box>
          )
        }

        return <Star key={index} size={14} color={colors.greenBright} style={{ opacity: 0.28 }} />
      })}
    </Stack>
  )
}

function TestimonialCard({
  quote,
  name,
  service,
  initials,
  avatarBg,
  avatarSrc,
  rating = 4.5,
  cardWidth,
}: TestimonialItem & { cardWidth: number }) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        flex: `0 0 ${cardWidth}px`,
        width: cardWidth,
        height: CARD_HEIGHT,
        p: 3,
        borderRadius: '20px',
        bgcolor: colors.white,
        border: `1px solid ${colors.border}`,
        boxShadow: publicShadows.card,
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          boxShadow: publicShadows.cardHover,
          transform: 'translateY(-3px)',
          borderColor: `rgba(${brandPrimaryGreenRgb}, 0.35)`,
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 1.5 }}>
        <Avatar
          src={avatarSrc}
          alt={name}
          sx={{
            width: 44,
            height: 44,
            fontWeight: 700,
            fontSize: '14px',
            background: avatarBg,
            color: '#fff',
            border: `2px solid ${colors.white}`,
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.1)',
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ minWidth: 0, pt: 0.25 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '15px', color: colors.navy, lineHeight: 1.3 }}>
            {name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.5 }}>
            <StarRating rating={rating} />
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: colors.textMuted,
                lineHeight: 1,
              }}
            >
              ({rating.toFixed(1)})
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <Box
        sx={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          px: 1.25,
          py: 0.4,
          mb: 2,
          borderRadius: '8px',
          bgcolor: colors.greenMuted,
          border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.18)`,
        }}
      >
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: colors.greenDark, letterSpacing: '0.02em' }}>
          {service}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: '14px',
          color: colors.textSecondary,
          lineHeight: 1.65,
          height: COMMENT_HEIGHT,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 5,
          WebkitBoxOrient: 'vertical',
          flex: 1,
          mb: 2,
        }}
      >
        &ldquo;{quote}&rdquo;
      </Typography>
    </Box>
  )
}

export function TestimonialSection({
  testimonials,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  markerIcon = 'profile',
}: TestimonialSectionProps) {
  const colors = usePublicBrandColors()
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const visibleCount = useVisibleTestimonialCount()

  const [viewportWidth, setViewportWidth] = useState(0)
  const [scrollSpanPx, setScrollSpanPx] = useState(0)

  const scrollSteps = Math.max(0, testimonials.length - visibleCount)
  const scrollEnabled = scrollSteps > 0

  const cardWidth = useMemo(() => {
    if (viewportWidth <= 0) return 320
    return Math.floor((viewportWidth - (visibleCount - 1) * CARD_GAP) / visibleCount)
  }, [viewportWidth, visibleCount])

  const maxTranslate = scrollSteps * (cardWidth + CARD_GAP)

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const stepPx = window.innerHeight * SCROLL_STEP_VH
    setScrollSpanPx(scrollSteps * stepPx)
  }, [scrollSteps])

  const { smoothProgress, direction } = useTestimonialScrollProgress({
    sectionRef,
    enabled: scrollEnabled,
  })

  const trackX = useTransform(smoothProgress, (p) => -p * maxTranslate)

  const sectionHeight = scrollEnabled
    ? `calc(100vh + ${scrollSpanPx}px)`
    : 'auto'

  const stickyHeight = `calc(100vh - ${PUBLIC_NAV_HEIGHT_PX}px)`

  return (
    <Box
      ref={sectionRef}
      component="section"
      aria-label="Customer testimonials"
      sx={{
        position: 'relative',
        height: sectionHeight,
        bgcolor: colors.white,
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: PUBLIC_NAV_HEIGHT_PX,
          height: stickyHeight,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: '8%',
            right: '-4%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${brandPrimaryGreenRgb}, 0.07) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            bottom: '12%',
            left: '-6%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${brandPrimaryGreenRgb}, 0.05) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <FloatingCloud top="6%" left="8%" width={52} opacity={0.5} delay={0} />
        <FloatingCloud top="14%" left="78%" width={44} opacity={0.4} delay={2} />
        <FloatingCloud top="72%" left="85%" width={38} opacity={0.35} delay={4} />
        <FloatingCloud top="80%" left="12%" width={46} opacity={0.3} delay={1.5} />

        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.025,
            backgroundImage: `
              linear-gradient(${colors.greenBright} 1px, transparent 1px),
              linear-gradient(90deg, ${colors.greenBright} 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }}
        />

        <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 720, mb: landingSectionHeaderMb, mx: 'auto', textAlign: 'center' }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: { xs: '30px', md: '40px', lg: '44px' },
                fontWeight: 800,
                color: colors.navy,
                lineHeight: 1.12,
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '16px', md: '17px' },
                color: colors.textSecondary,
                lineHeight: 1.7,
                maxWidth: 640,
                mx: 'auto',
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <FlightPathProgress progress={smoothProgress} direction={direction} markerIcon={markerIcon} />

          <Box
            ref={viewportRef}
            sx={{
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Box
              component={motion.div}
              style={{ x: trackX }}
              sx={{
                display: 'flex',
                gap: `${CARD_GAP}px`,
                width: 'max-content',
                py: 0.5,
                willChange: 'transform',
              }}
            >
              {testimonials.map((item) => (
                <TestimonialCard key={item.name} {...item} cardWidth={cardWidth} />
              ))}
            </Box>
          </Box>

          {scrollEnabled && (
            <Typography
              sx={{
                mt: 2.5,
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 600,
                color: colors.textMuted,
                letterSpacing: '0.04em',
              }}
            >
              Scroll to travel through stories
            </Typography>
          )}
        </PublicContainer>
      </Box>
    </Box>
  )
}
