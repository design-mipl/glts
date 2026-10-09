import { useEffect, useRef, useState } from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { motion } from 'framer-motion'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'
import { howItWorksSteps } from '../landingWorkflowContent'
import { landingSectionPy } from '../landingPageSpacing'

const STEP_COUNT = howItWorksSteps.length
const LAST_STEP = STEP_COUNT - 1
const STEP_INTERVAL_MS = 300
const START_DELAY_MS = 150

export function HowItWorks() {
  const colors = usePublicBrandColors()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const sectionRef = useRef<HTMLElement | null>(null)
  const timelineRef = useRef<HTMLDivElement | null>(null)
  const hasStartedRef = useRef(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [mobileFractions, setMobileFractions] = useState(() =>
    Array.from({ length: STEP_COUNT }, (_, index) => index / LAST_STEP),
  )
  const visibleStep = reducedMotion ? LAST_STEP : activeStep
  const nextProgressStep = visibleStep < 0 ? -1 : Math.min(visibleStep + 1, LAST_STEP)
  const desktopProgress = nextProgressStep < 0 ? 0 : nextProgressStep / LAST_STEP
  const mobileProgress = nextProgressStep < 0 ? 0 : mobileFractions[nextProgressStep]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const timers: number[] = []
    let observer: IntersectionObserver | undefined

    if (reducedMotion) {
      hasStartedRef.current = true
      timers.push(window.setTimeout(() => setActiveStep(LAST_STEP), 0))
    } else if (!hasStartedRef.current) {
      const startSequence = () => {
        if (hasStartedRef.current) return
        hasStartedRef.current = true
        observer?.disconnect()
        for (let index = 0; index < STEP_COUNT; index += 1) {
          timers.push(window.setTimeout(() => setActiveStep(index), START_DELAY_MS + index * STEP_INTERVAL_MS))
        }
      }

      if (typeof IntersectionObserver === 'undefined') {
        startSequence()
      } else {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) startSequence()
          },
          { threshold: 0.3 },
        )
        observer.observe(section)
      }
    }

    return () => {
      observer?.disconnect()
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [reducedMotion])

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return

    const alignMobileLine = () => {
      const timelineBottom = timeline.getBoundingClientRect().bottom
      const centers = Array.from(timeline.querySelectorAll<HTMLElement>('.journey-icon')).map((icon) => {
        const rect = icon.getBoundingClientRect()
        return rect.top + rect.height / 2
      })
      if (centers.length !== STEP_COUNT) return
      const distance = centers[LAST_STEP] - centers[0]
      if (distance <= 0) return
      const fractions = centers.map((center) => (center - centers[0]) / distance)
      setMobileFractions((previous) =>
        previous.every((fraction, index) => Math.abs(fraction - fractions[index]) < 0.001)
          ? previous
          : fractions,
      )
      const bottom = Math.max(0, timelineBottom - centers[LAST_STEP])
      timeline.style.setProperty('--journey-mobile-line-bottom', `${bottom}px`)
    }

    const frame = window.requestAnimationFrame(alignMobileLine)
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(alignMobileLine)
    resizeObserver?.observe(timeline)
    window.addEventListener('resize', alignMobileLine)
    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', alignMobileLine)
    }
  }, [])

  return (
    <Box
      ref={sectionRef}
      component="section"
      id="how-it-works"
      sx={{ bgcolor: colors.white, py: landingSectionPy }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 720, mb: { xs: 5, md: 5.5, desktop: 6 } }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.display,
              fontSize: { xs: '26px', md: '32px' },
              fontWeight: 700,
              color: colors.navy,
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
              mb: 1.25,
            }}
          >
            Your Visa Journey, Simplified
          </Typography>
          <Typography
            sx={{
              fontFamily: publicFonts.body,
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            From checking requirements to tracking your application, GreenLight combines
            technology with expert visa review at every important step.
          </Typography>
        </Box>

        <Box
          ref={timelineRef}
          sx={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', desktop: `repeat(${STEP_COUNT}, minmax(0, 1fr))` },
            gap: { xs: 4, desktop: 3 },
            '&::before': {
              content: '""',
              position: 'absolute',
              zIndex: 0,
              borderRadius: 99,
              bgcolor: colors.border,
              left: { xs: 25, desktop: '10%' },
              top: { xs: 26, desktop: 30 },
              bottom: { xs: 'var(--journey-mobile-line-bottom, 26px)', desktop: 'auto' },
              width: { xs: 3, desktop: '80%' },
              height: { xs: 'auto', desktop: 3 },
            },
          }}
        >
          <Box
            component={motion.div}
            className="journey-progress-mobile"
            aria-hidden="true"
            initial={false}
            animate={{ scaleY: mobileProgress }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              display: { xs: 'block', desktop: 'none' },
              position: 'absolute',
              zIndex: 0,
              left: 25,
              top: 26,
              bottom: 'var(--journey-mobile-line-bottom, 26px)',
              width: 3,
              borderRadius: 99,
              bgcolor: colors.greenBright,
              transformOrigin: 'top',
            }}
          />
          <Box
            component={motion.div}
            className="journey-progress-desktop"
            aria-hidden="true"
            initial={false}
            animate={{ scaleX: desktopProgress }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              display: { xs: 'none', desktop: 'block' },
              position: 'absolute',
              zIndex: 0,
              left: '10%',
              top: 30,
              width: '80%',
              height: 3,
              borderRadius: 99,
              bgcolor: colors.greenBright,
              transformOrigin: 'left',
            }}
          />
          {howItWorksSteps.map((step, index) => {
            const isCompleted = index <= visibleStep
            const Icon = step.icon

            return (
              <Box
                key={step.id}
                component="article"
                className="journey-step"
                data-completed={isCompleted}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  minWidth: 0,
                  display: 'grid',
                  gridTemplateColumns: { xs: '52px minmax(0, 1fr)', desktop: '1fr' },
                  alignItems: 'start',
                  columnGap: { xs: 2.75, desktop: 0 },
                  rowGap: { xs: 0, desktop: 3 },
                  textAlign: { xs: 'left', desktop: 'center' },
                  animation: isCompleted && !reducedMotion ? 'journeyStepEnter 350ms ease-out both' : 'none',
                  '@keyframes journeyStepEnter': {
                    from: { opacity: 0, transform: 'translateY(8px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                  '@media (hover: hover)': {
                    '&:hover .journey-icon': {
                      transform: 'translateY(-3px) scale(1.05)',
                      borderColor: colors.greenBright,
                      boxShadow: `0 8px 22px rgba(${brandPrimaryGreenRgb}, 0.2)`,
                    },
                    '&:hover .journey-title': { color: colors.greenBright },
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                  },
                }}
              >
                <Box
                  className="journey-icon"
                  sx={{
                    width: { xs: 52, desktop: 60 },
                    height: { xs: 52, desktop: 60 },
                    borderRadius: '50%',
                    justifySelf: { xs: 'start', desktop: 'center' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${isCompleted ? colors.greenBright : colors.border}`,
                    bgcolor: isCompleted ? colors.greenBright : colors.white,
                    color: isCompleted ? colors.onBrandFilled : colors.navy,
                    boxShadow: isCompleted ? `0 8px 22px rgba(${brandPrimaryGreenRgb}, 0.24)` : 'none',
                    transform: isCompleted ? 'scale(1)' : 'scale(0.92)',
                    transition: 'transform 350ms ease-out, border-color 250ms ease-out, background-color 250ms ease-out, color 250ms ease-out, box-shadow 250ms ease-out',
                    '@media (prefers-reduced-motion: reduce)': {
                      transform: 'none',
                      transition: 'none',
                    },
                  }}
                >
                  <Icon size={26} strokeWidth={2.1} aria-hidden="true" />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: publicFonts.body,
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: isCompleted ? colors.greenDark : colors.textSecondary,
                      transition: 'color 250ms ease-out',
                      mb: 0.75,
                    }}
                  >
                    {step.number}
                  </Typography>
                  <Typography
                    component="h3"
                    className="journey-title"
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontSize: { xs: '18px', xl: '19px', desktop: '21px' },
                      fontWeight: 700,
                      color: isCompleted ? colors.greenDark : colors.navy,
                      lineHeight: 1.3,
                      mb: 1,
                      transition: 'color 250ms ease-out',
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: publicFonts.body,
                      fontSize: { xs: '15px', desktop: '16px' },
                      color: colors.text,
                      lineHeight: 1.5,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </PublicContainer>
    </Box>
  )
}
