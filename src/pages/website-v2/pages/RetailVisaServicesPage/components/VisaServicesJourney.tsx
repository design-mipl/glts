import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import { ProcessTimelineCopy, ProcessTimelineMarker, ResponsiveProcessTimeline } from '../../../components/workflowTimeline/ProcessTimeline'
import { howItWorksSteps } from '../../LandingPage/landingWorkflowContent'
import { landingSectionPy } from '../../LandingPage/landingPageSpacing'
import { brandPrimaryGreenRgb } from '@/shared/theme/publicBrand'

const STEP_COUNT = howItWorksSteps.length
const LAST_STEP = STEP_COUNT - 1
const ANIMATION_MS = 5000
const HORIZONTAL_MQ = `(min-width: ${ds.breakpoint.tabletLandscape}px)`

/** Muted light-green track behind the progressive brand-green fill. */
const TRACK_COLOR = '#d5ebd8'
const ACTIVE_ICON_BG = '#e4fbe9'
const ACTIVE_ICON_BORDER = '#a7e6b0'
const IDLE_ICON_BORDER = '#dce5eb'
const IDLE_BADGE_BG = '#e5eaf0'

type LineGeometry = {
  orientation: 'horizontal' | 'vertical'
  start: number
  end: number
  cross: number
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function activeIndexFromProgress(progress: number) {
  return Math.min(LAST_STEP, Math.floor(progress * LAST_STEP + 1e-6))
}

export function VisaServicesJourney() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<Array<HTMLDivElement | null>>([])
  const fillRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const geometryRef = useRef<LineGeometry | null>(null)
  const progressRef = useRef(0)
  const hasPlayedRef = useRef(false)
  const [entered, setEntered] = useState(() => typeof IntersectionObserver === 'undefined')
  const [geometry, setGeometry] = useState<LineGeometry | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isHorizontal = useMediaQuery(HORIZONTAL_MQ)

  const applyProgress = useCallback((nextProgress: number, nextGeometry = geometryRef.current) => {
    progressRef.current = nextProgress
    if (!nextGeometry) return

    const span = nextGeometry.end - nextGeometry.start
    if (span <= 0) return

    const fillLength = Math.max(0, nextProgress * span)
    const offset = nextProgress * span
    const fill = fillRef.current
    const indicator = indicatorRef.current

    if (nextGeometry.orientation === 'horizontal') {
      if (fill) {
        fill.style.width = `${fillLength}px`
        fill.style.height = '100%'
      }
      if (indicator) indicator.style.left = `${offset}px`
    } else {
      if (fill) {
        fill.style.height = `${fillLength}px`
        fill.style.width = '100%'
      }
      if (indicator) indicator.style.top = `${offset}px`
    }

    if (indicator) indicator.style.opacity = nextProgress > 0 || hasPlayedRef.current ? '1' : '0'
    setActiveIndex((prev) => {
      const next = activeIndexFromProgress(nextProgress)
      return prev === next ? prev : next
    })
  }, [])

  const measureGeometry = useCallback(() => {
    const root = timelineRef.current
    if (!root) return
    const icons = iconRefs.current.slice(0, STEP_COUNT)
    if (icons.some((icon) => !icon)) return

    const rootRect = root.getBoundingClientRect()
    const centers = icons.map((icon) => {
      const rect = icon!.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2 - rootRect.left,
        y: rect.top + rect.height / 2 - rootRect.top,
      }
    })

    const next: LineGeometry = isHorizontal
      ? {
          orientation: 'horizontal',
          start: centers[0].x,
          end: centers[LAST_STEP].x,
          cross: centers[0].y,
        }
      : {
          orientation: 'vertical',
          start: centers[0].y,
          end: centers[LAST_STEP].y,
          cross: centers[0].x,
        }

    geometryRef.current = next
    setGeometry((prev) => {
      if (
        prev
        && prev.orientation === next.orientation
        && Math.abs(prev.start - next.start) < 0.5
        && Math.abs(prev.end - next.end) < 0.5
        && Math.abs(prev.cross - next.cross) < 0.5
      ) {
        return prev
      }
      return next
    })

    // Keep the fill/indicator aligned after resize or orientation changes.
    window.requestAnimationFrame(() => {
      applyProgress(reducedMotion ? 1 : progressRef.current, next)
    })
  }, [applyProgress, isHorizontal, reducedMotion])

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline || reducedMotion || entered || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' })
    observer.observe(timeline)
    return () => observer.disconnect()
  }, [entered, reducedMotion])

  useEffect(() => {
    measureGeometry()
    const timeline = timelineRef.current
    if (!timeline) return

    const frame = window.requestAnimationFrame(measureGeometry)
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measureGeometry)
    resizeObserver?.observe(timeline)
    window.addEventListener('resize', measureGeometry)
    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', measureGeometry)
    }
  }, [measureGeometry])

  useEffect(() => {
    if (reducedMotion) {
      hasPlayedRef.current = true
      progressRef.current = 1
      applyProgress(1)
      setActiveIndex(LAST_STEP)
      return
    }
    if (!entered || hasPlayedRef.current) return

    hasPlayedRef.current = true
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / ANIMATION_MS)
      applyProgress(easeInOutCubic(raw))
      if (raw < 1) {
        frame = window.requestAnimationFrame(tick)
        return
      }
      applyProgress(1)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [applyProgress, entered, reducedMotion])

  // When the connector remounts (horizontal ↔ vertical), re-apply current progress to new nodes.
  useEffect(() => {
    if (!geometry) return
    applyProgress(reducedMotion ? 1 : progressRef.current, geometry)
  }, [applyProgress, geometry, reducedMotion])

  const span = geometry ? geometry.end - geometry.start : 0
  const showConnector = Boolean(geometry && span > 0)
  const resolvedActiveIndex = reducedMotion ? LAST_STEP : activeIndex

  return (
    <Box
      component="section"
      id="how-it-works"
      aria-labelledby="visa-journey-heading"
      sx={{ bgcolor: '#fff', py: landingSectionPy, scrollMarginTop: 88 }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 820, mb: { xs: 4, md: 5 } }}>
          <Typography sx={{ color: ds.color.brandHover, fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', mb: 0.75 }}>
            Your journey
          </Typography>
          <Typography id="visa-journey-heading" component="h2" sx={{ ...websiteHeadingSx.h2, color: ds.color.navy, mb: 0.85 }}>
            Your Visa Journey, Simplified
          </Typography>
          <Typography sx={{ fontFamily: ds.fonts.ui, fontSize: { xs: 15, desktop: 16 }, lineHeight: 1.6, color: ds.color.textSecondary }}>
            From checking requirements to tracking your application, GreenLight combines technology with expert visa review at every important step.
          </Typography>
        </Box>

        <Box ref={timelineRef} sx={{ position: 'relative' }}>
          {showConnector && geometry?.orientation === 'horizontal' && (
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                top: geometry.cross,
                left: geometry.start,
                width: span,
                height: 2,
                bgcolor: TRACK_COLOR,
                transform: 'translateY(-50%)',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            >
              <Box
                ref={fillRef}
                sx={{
                  width: 0,
                  height: '100%',
                  bgcolor: ds.color.brand,
                  borderRadius: 99,
                }}
              />
              <Box
                ref={indicatorRef}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  bgcolor: ds.color.brand,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 0 3px rgba(${brandPrimaryGreenRgb}, 0.22), 0 0 12px rgba(${brandPrimaryGreenRgb}, 0.4)`,
                  opacity: 0,
                  zIndex: 0,
                }}
              />
            </Box>
          )}

          {showConnector && geometry?.orientation === 'vertical' && (
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                left: geometry.cross,
                top: geometry.start,
                width: 2,
                height: span,
                bgcolor: TRACK_COLOR,
                transform: 'translateX(-50%)',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            >
              <Box
                ref={fillRef}
                sx={{
                  width: '100%',
                  height: 0,
                  bgcolor: ds.color.brand,
                  borderRadius: 99,
                }}
              />
              <Box
                ref={indicatorRef}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  bgcolor: ds.color.brand,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 0 3px rgba(${brandPrimaryGreenRgb}, 0.22), 0 0 12px rgba(${brandPrimaryGreenRgb}, 0.4)`,
                  opacity: 0,
                  zIndex: 0,
                }}
              />
            </Box>
          )}

          <ResponsiveProcessTimeline
            steps={howItWorksSteps}
            ariaLabel="Your visa journey steps"
            variant="visa-journey"
            horizontalAt={ds.breakpoint.tabletLandscape}
            listSx={{ gap: { xs: 0, xl: 2.5 } }}
            getItemSx={() => ({
              minWidth: 0,
              display: 'flex',
              gap: 2,
              textAlign: { xs: 'left', md: 'center' },
              position: 'relative',
              zIndex: 1,
              [`@media (min-width: ${ds.breakpoint.tabletLandscape}px)`]: { display: 'block' },
            })}
            renderStep={(step, index) => {
              const isActive = index <= resolvedActiveIndex
              return (
                <>
                  <Box
                    sx={{
                      width: 64,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 1,
                      [`@media (min-width: ${ds.breakpoint.tabletLandscape}px)`]: { width: '100%' },
                    }}
                  >
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 25,
                        height: 25,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        color: isActive ? '#fff' : ds.color.navy,
                        bgcolor: isActive ? ds.color.brandHover : IDLE_BADGE_BG,
                        fontSize: ds.type.caption.size,
                        fontWeight: 800,
                        mb: 1.1,
                        transition: reducedMotion ? 'none' : 'background-color 320ms ease, color 320ms ease',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Box
                      ref={(node: HTMLDivElement | null) => {
                        iconRefs.current[index] = node
                      }}
                      sx={{
                        display: 'inline-flex',
                        animation: isActive && !reducedMotion ? 'visaJourneyIconPop 480ms ease-out' : 'none',
                        '@keyframes visaJourneyIconPop': {
                          '0%': { transform: 'scale(1)' },
                          '45%': { transform: 'scale(1.08)' },
                          '100%': { transform: 'scale(1)' },
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                          animation: 'none',
                        },
                      }}
                    >
                      <ProcessTimelineMarker
                        icon={step.icon}
                        iconSize={ds.icon.process}
                        containerSize={64}
                        background={isActive ? ACTIVE_ICON_BG : '#fff'}
                        borderColor={isActive ? ACTIVE_ICON_BORDER : IDLE_ICON_BORDER}
                        color={isActive ? ds.color.brandHover : ds.color.navy}
                        strokeWidth={ds.icon.strokeWidth}
                        containerSx={{
                          transition: reducedMotion
                            ? 'none'
                            : 'background-color 320ms ease, border-color 320ms ease, color 320ms ease',
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ pt: { xs: 3.75, xl: 2.25 }, pb: { xs: 3.5, xl: 0 } }}>
                    <ProcessTimelineCopy
                      title={step.title}
                      description={step.description}
                      titleSx={{
                        color: isActive ? ds.color.brandHover : ds.color.navy,
                        fontSize: { xs: 16, desktop: 17 },
                        lineHeight: 1.3,
                        mb: 0.9,
                        transition: reducedMotion ? 'none' : 'color 320ms ease',
                      }}
                      descriptionSx={{
                        fontFamily: ds.fonts.ui,
                        color: ds.color.textSecondary,
                        fontSize: { xs: 15, desktop: 16 },
                        lineHeight: 1.6,
                      }}
                    />
                  </Box>
                </>
              )
            }}
          />
        </Box>
      </PublicContainer>
    </Box>
  )
}
