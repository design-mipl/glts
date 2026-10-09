import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography, Avatar, Stack, useMediaQuery } from '@mui/material'
import { MapPin, Cloud, Icon, Ship, Plane, type IconNode } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '../theme/publicSiteTokens'
import { landingSectionHeaderMb, landingSectionPy } from '../pages/LandingPage/landingPageSpacing'
import { useVisibleTestimonialCount } from '../hooks/useTestimonialScrollProgress'

const CARD_GAP = 24
const CARD_HEIGHT = 240
const WAYPOINT_COUNT = 5
const MAX_CARD_WIDTH = 380
const FALLBACK_CARD_WIDTH = 320
/** Seconds to scroll one full set of testimonials (and one flight cycle). */
const LOOP_DURATION_SEC = 42
/** How many times to repeat the card set so the viewport never shows a gap. */
const TRACK_COPIES = 3
const CROSSFADE_EDGE = 0.06

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

function JourneyMarker({
  markerIcon,
  markerRef,
}: {
  markerIcon: 'profile' | 'ship' | 'plane'
  markerRef: React.RefObject<HTMLDivElement | null>
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      ref={markerRef}
      aria-hidden
      sx={{
        position: 'absolute',
        top: 0,
        left: '0%',
        transform: 'translateX(-50%)',
        opacity: 0,
        pointerEvents: 'none',
        willChange: 'left, opacity',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
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
  )
}

/**
 * Dual-marker flight path: when one journey ends at DESTINATION, the next
 * marker is already fading in at START so the loop never snaps visibly.
 * Positions are driven from the parent rAF loop via refs (no React re-render).
 */
function FlightPathProgress({
  markerIcon,
  primaryRef,
  bridgeRef,
  pathRootRef,
}: {
  markerIcon: 'profile' | 'ship' | 'plane'
  primaryRef: React.RefObject<HTMLDivElement | null>
  bridgeRef: React.RefObject<HTMLDivElement | null>
  pathRootRef: React.RefObject<HTMLDivElement | null>
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      ref={pathRootRef}
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
            <stop data-flight-progress-a offset="0%" stopColor={colors.greenBright} stopOpacity={0.85} />
            <stop data-flight-progress-b offset="0%" stopColor={colors.border} stopOpacity={0.6} />
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
          return (
            <g key={i} data-waypoint-t={String(t)}>
              <circle
                cx={x}
                cy={y}
                r={4}
                fill={colors.white}
                stroke={colors.border}
                strokeWidth={2}
                data-waypoint-dot
              />
              <circle
                cx={x}
                cy={y}
                r={10}
                fill={`rgba(${brandPrimaryGreenRgb}, 0.12)`}
                opacity={0}
                data-waypoint-glow
              />
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
        <JourneyMarker markerIcon={markerIcon} markerRef={primaryRef} />
        <JourneyMarker markerIcon={markerIcon} markerRef={bridgeRef} />
      </Box>
    </Box>
  )
}

function TestimonialCard({
  quote,
  name,
  service,
  initials,
  avatarBg,
  avatarSrc,
  cardWidth,
}: TestimonialItem & { cardWidth: number }) {
  const colors = usePublicBrandColors()

  return (
    <Box
      data-testimonial-card="true"
      sx={{
        flex: `0 0 ${cardWidth}px`,
        width: cardWidth,
        height: CARD_HEIGHT,
        p: { xs: 3, md: 3.5 },
        borderRadius: '20px',
        bgcolor: colors.white,
        boxShadow: '0 8px 28px rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        '&:hover': {
          boxShadow: '0 14px 36px rgba(15, 23, 42, 0.12)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.75} sx={{ mb: 2.5 }}>
        <Avatar
          src={avatarSrc}
          alt={name}
          sx={{
            width: 52,
            height: 52,
            fontWeight: 700,
            fontSize: '15px',
            background: avatarBg,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontWeight: 700,
              fontSize: '16px',
              color: colors.navy,
              lineHeight: 1.3,
            }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              mt: 0.35,
              fontSize: '13px',
              fontWeight: 500,
              color: colors.textSecondary,
              lineHeight: 1.35,
            }}
          >
            {service}
          </Typography>
        </Box>
      </Stack>

      <Typography
        sx={{
          fontSize: '15px',
          color: colors.text,
          lineHeight: 1.65,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          flex: 1,
        }}
      >
        &ldquo;{quote}&rdquo;
      </Typography>
    </Box>
  )
}

/**
 * Dual-plane crossfade + trail/waypoints driven from the carousel's modulo progress.
 * Near 0/1 the outgoing marker finishes at DESTINATION while the incoming one
 * appears at START — so the path never snaps when the track wraps.
 */
function applyFlightVisuals(
  progress: number,
  primary: HTMLDivElement | null,
  bridge: HTMLDivElement | null,
  pathRoot: HTMLDivElement | null,
  colors: { greenBright: string; border: string },
) {
  const edge = CROSSFADE_EDGE
  let primaryLeft = progress
  let primaryOpacity = 1
  let bridgeLeft = 0
  let bridgeOpacity = 0

  if (progress > 1 - edge) {
    const t = (progress - (1 - edge)) / edge
    primaryOpacity = 1 - t
    primaryLeft = progress
    bridgeOpacity = t
    bridgeLeft = 0
  } else if (progress < edge) {
    const t = progress / edge
    primaryOpacity = t
    primaryLeft = progress
    bridgeOpacity = 1 - t
    bridgeLeft = 1
  }

  if (primary) {
    primary.style.left = `${primaryLeft * 100}%`
    primary.style.opacity = String(primaryOpacity)
  }
  if (bridge) {
    bridge.style.left = `${bridgeLeft * 100}%`
    bridge.style.opacity = String(bridgeOpacity)
  }

  if (!pathRoot) return

  const stopA = pathRoot.querySelector<SVGStopElement>('[data-flight-progress-a]')
  const stopB = pathRoot.querySelector<SVGStopElement>('[data-flight-progress-b]')
  const pct = `${(progress * 100).toFixed(2)}%`
  if (stopA) stopA.setAttribute('offset', pct)
  if (stopB) stopB.setAttribute('offset', pct)

  pathRoot.querySelectorAll<SVGGElement>('[data-waypoint-t]').forEach((g) => {
    const t = Number(g.dataset.waypointT ?? 0)
    const active = progress >= t
    const dot = g.querySelector<SVGCircleElement>('[data-waypoint-dot]')
    const glow = g.querySelector<SVGCircleElement>('[data-waypoint-glow]')
    if (dot) {
      dot.setAttribute('stroke', active ? colors.greenBright : colors.border)
      dot.setAttribute('fill', active ? colors.greenBright : '#ffffff')
    }
    if (glow) {
      glow.setAttribute('opacity', active ? '1' : '0')
    }
  })
}

export function TestimonialSection({
  testimonials,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  markerIcon = 'profile',
}: TestimonialSectionProps) {
  const colors = usePublicBrandColors()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const visibleCount = useVisibleTestimonialCount()

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const pathRootRef = useRef<HTMLDivElement>(null)
  const primaryMarkerRef = useRef<HTMLDivElement>(null)
  const bridgeMarkerRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const segmentWidthRef = useRef(0)
  const rafRef = useRef(0)
  const lastTimeRef = useRef(0)
  const pausedRef = useRef(false)

  const [viewportWidth, setViewportWidth] = useState(0)

  const canLoop = testimonials.length > visibleCount && !prefersReducedMotion

  const cardWidth = useMemo(() => {
    if (viewportWidth <= 0) return FALLBACK_CARD_WIDTH
    const filled = Math.floor((viewportWidth - (visibleCount - 1) * CARD_GAP) / visibleCount)
    return Math.min(filled, MAX_CARD_WIDTH)
  }, [viewportWidth, visibleCount])

  const loopItems = useMemo(() => {
    if (testimonials.length === 0) return []
    if (!canLoop) return testimonials
    return Array.from({ length: TRACK_COPIES }, () => testimonials).flat()
  }, [testimonials, canLoop])

  const syncLayout = useCallback(() => {
    const track = trackRef.current
    if (!track || testimonials.length === 0) return

    const cards = track.querySelectorAll<HTMLElement>('[data-testimonial-card="true"]')
    cards.forEach((card) => {
      card.style.width = `${cardWidth}px`
      card.style.minWidth = `${cardWidth}px`
      card.style.maxWidth = `${cardWidth}px`
      card.style.flex = `0 0 ${cardWidth}px`
    })

    if (canLoop && track.children.length > testimonials.length) {
      const firstOfSecond = track.children[testimonials.length] as HTMLElement
      segmentWidthRef.current = firstOfSecond.offsetLeft
    } else {
      segmentWidthRef.current = 0
    }
  }, [canLoop, cardWidth, testimonials.length])

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
    syncLayout()
  }, [syncLayout, loopItems.length])

  useEffect(() => {
    const flightColors = { greenBright: colors.greenBright, border: colors.border }

    if (!canLoop) {
      offsetRef.current = 0
      if (trackRef.current) {
        trackRef.current.style.transform = 'translate3d(0, 0, 0)'
      }
      applyFlightVisuals(0, primaryMarkerRef.current, bridgeMarkerRef.current, pathRootRef.current, flightColors)
      if (primaryMarkerRef.current) primaryMarkerRef.current.style.opacity = '1'
      return
    }

    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.064)
      lastTimeRef.current = time

      const segment = segmentWidthRef.current
      if (segment > 0 && !pausedRef.current) {
        offsetRef.current -= (segment / LOOP_DURATION_SEC) * dt
        // Seamless wrap: add segment until offset is in (-segment, 0]
        while (offsetRef.current <= -segment) {
          offsetRef.current += segment
        }

        const track = trackRef.current
        if (track) {
          track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
        }

        const progress = ((-offsetRef.current % segment) + segment) % segment / segment
        applyFlightVisuals(
          progress,
          primaryMarkerRef.current,
          bridgeMarkerRef.current,
          pathRootRef.current,
          flightColors,
        )
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = 0
    }
  }, [canLoop, colors.border, colors.greenBright])

  return (
    <Box
      component="section"
      aria-label="Customer testimonials"
      sx={{
        position: 'relative',
        bgcolor: colors.white,
        py: landingSectionPy,
        overflow: 'hidden',
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
              fontFamily: publicFonts.display,
              fontSize: { xs: '30px', md: '40px', lg: '44px' },
              fontWeight: 700,
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

        <FlightPathProgress
          markerIcon={markerIcon}
          primaryRef={primaryMarkerRef}
          bridgeRef={bridgeMarkerRef}
          pathRootRef={pathRootRef}
        />

        <Box
          ref={viewportRef}
          onMouseEnter={() => {
            pausedRef.current = true
          }}
          onMouseLeave={() => {
            pausedRef.current = false
          }}
          onFocusCapture={() => {
            pausedRef.current = true
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              pausedRef.current = false
            }
          }}
          sx={{
            width: '100%',
            overflow: 'hidden',
            maskImage: {
              xs: 'none',
              md: 'linear-gradient(90deg, transparent, #000 2%, #000 98%, transparent)',
            },
            WebkitMaskImage: {
              xs: 'none',
              md: 'linear-gradient(90deg, transparent, #000 2%, #000 98%, transparent)',
            },
          }}
        >
          <Box
            ref={trackRef}
            sx={{
              display: 'flex',
              gap: `${CARD_GAP}px`,
              width: 'max-content',
              py: 0.5,
              willChange: canLoop ? 'transform' : 'auto',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {loopItems.map((item, index) => (
              <TestimonialCard
                key={`${item.name}-${index}`}
                {...item}
                cardWidth={cardWidth}
              />
            ))}
          </Box>
        </Box>

        {canLoop && (
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
            A continuous journey through traveler stories
          </Typography>
        )}
      </PublicContainer>
    </Box>
  )
}
