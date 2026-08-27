import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { Check } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  publicMotion,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'
import { howItWorksSteps } from '../landingWorkflowContent'
import { landingSectionPy } from '../landingPageSpacing'
import { howItWorksMapPinImage } from '../../../assets/landingPageImages'

const TRANSITION_MS = 600
const STEP_COUNT = howItWorksSteps.length
const MAP_PIN_SIZE = 22

export function HowItWorks() {
  const colors = usePublicBrandColors()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [activeIndex, setActiveIndex] = useState(0)
  const [entered, setEntered] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % STEP_COUNT) + STEP_COUNT) % STEP_COUNT)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setEntered(true)
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const activeStep = howItWorksSteps[activeIndex]
  const progressPct = STEP_COUNT <= 1 ? 100 : (activeIndex / (STEP_COUNT - 1)) * 100

  return (
    <Box
      ref={sectionRef}
      component="section"
      id="how-it-works"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
      }}
    >
      <PublicContainer variant="hero">
        <Box
          onMouseLeave={() => goTo(0)}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'minmax(0, 1.85fr) minmax(0, 1fr)',
            },
            gap: { xs: 3, lg: 4 },
            alignItems: { xs: 'start', lg: 'stretch' },
          }}
        >
          {/* Left — header + steps */}
          <Box
            sx={{
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              height: { lg: '100%' },
            }}
          >
            <Box sx={{ maxWidth: 640, mb: { xs: 3.5, md: 4, lg: 4.5 }, flexShrink: 0 }}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: publicFonts.display,
                  fontSize: { xs: '26px', md: '32px' },
                  fontWeight: 700,
                  color: colors.navy,
                  letterSpacing: '-0.3px',
                  lineHeight: 1.15,
                  mb: 1.25,
                }}
              >
                How It Works
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '15px', md: '16px' },
                  color: colors.textSecondary,
                  lineHeight: 1.65,
                }}
              >
                GreenLight guides every application through a clear, expert-led process — from
                checking requirements to secure filing and final approval — so your visa journey
                stays accurate, compliant, and on track.
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'relative',
                flex: { lg: 1 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: { lg: 'center' },
                gap: { sm: 1.5 },
              }}
            >
              {/* Progress track — map pins above the line */}
              <Box
                aria-hidden
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  position: 'relative',
                  height: MAP_PIN_SIZE + 14,
                  mx: `calc(100% / ${STEP_COUNT} / 2)`,
                  mb: 0.5,
                }}
              >
                {howItWorksSteps.map((step, index) => {
                  const isActive = index === activeIndex
                  return (
                    <Box
                      key={`pin-${step.id}`}
                      sx={{
                        position: 'absolute',
                        left: `${(index / Math.max(STEP_COUNT - 1, 1)) * 100}%`,
                        top: 0,
                        width: MAP_PIN_SIZE,
                        height: MAP_PIN_SIZE,
                        transform: 'translateX(-50%)',
                        bgcolor: isActive ? colors.greenBright : colors.navy,
                        opacity: isActive ? 1 : 0.55,
                        transition: reducedMotion
                          ? 'none'
                          : `background-color ${TRANSITION_MS}ms ${publicMotion.easeInOut}, opacity ${TRANSITION_MS}ms ${publicMotion.easeInOut}`,
                        maskImage: `url(${howItWorksMapPinImage.src})`,
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskImage: `url(${howItWorksMapPinImage.src})`,
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                      }}
                    />
                  )
                })}

                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: MAP_PIN_SIZE + 4,
                    height: 3,
                    borderRadius: 2,
                    bgcolor: colors.border,
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${progressPct}%`,
                      borderRadius: 2,
                      bgcolor: colors.greenBright,
                      transition: reducedMotion
                        ? 'none'
                        : `width ${TRANSITION_MS}ms ${publicMotion.easeInOut}`,
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: `repeat(${STEP_COUNT}, minmax(0, 1fr))`,
                  },
                  gap: { xs: 2, sm: 1.5 },
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {howItWorksSteps.map((step, index) => {
                  const isActive = index === activeIndex
                  const Icon = step.icon
                  return (
                    <Box
                      key={step.id}
                      component="button"
                      type="button"
                      onMouseEnter={() => {
                        goTo(index)
                      }}
                      onFocus={() => {
                        goTo(index)
                      }}
                      onBlur={() => goTo(0)}
                      onClick={() => goTo(index)}
                      aria-pressed={isActive}
                      aria-label={`Step ${step.number}: ${step.title}`}
                      sx={{
                        m: 0,
                        p: { xs: 2, sm: 1.5, md: 2 },
                        border: 'none',
                        bgcolor: 'transparent',
                        cursor: 'pointer',
                        textAlign: { xs: 'left', sm: 'center' },
                        display: 'flex',
                        flexDirection: { xs: 'row', sm: 'column' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1.75, sm: 1.5 },
                        fontFamily: 'inherit',
                        borderRadius: '16px',
                        transition: `background-color ${TRANSITION_MS}ms ${publicMotion.easeInOut}`,
                        '@media (hover: hover)': {
                          '&:hover': {
                            bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.06)`,
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${isActive ? colors.greenBright : colors.border}`,
                          bgcolor: isActive ? colors.greenBright : colors.white,
                          color: isActive ? colors.onBrandFilled : colors.navy,
                          boxShadow: isActive
                            ? `0 8px 22px rgba(${brandPrimaryGreenRgb}, 0.35)`
                            : 'none',
                          transition: reducedMotion
                            ? 'none'
                            : `background-color ${TRANSITION_MS}ms ${publicMotion.easeInOut}, border-color ${TRANSITION_MS}ms ${publicMotion.easeInOut}, box-shadow ${TRANSITION_MS}ms ${publicMotion.easeInOut}, color ${TRANSITION_MS}ms ${publicMotion.easeInOut}`,
                        }}
                      >
                        <Icon size={24} strokeWidth={2.1} />
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: publicFonts.mono,
                            fontVariantNumeric: 'tabular-nums',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            color: isActive ? colors.greenBright : colors.textMuted,
                            mb: 0.5,
                            transition: `color ${TRANSITION_MS}ms ${publicMotion.easeInOut}`,
                          }}
                        >
                          {step.number}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: publicFonts.heading,
                            fontSize: { xs: '15px', md: '16px' },
                            fontWeight: 700,
                            color: isActive ? colors.greenBright : colors.navy,
                            lineHeight: 1.3,
                            mb: 0.75,
                            transition: `color ${TRANSITION_MS}ms ${publicMotion.easeInOut}`,
                          }}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: colors.textSecondary,
                            lineHeight: 1.5,
                            display: { xs: 'block', sm: '-webkit-box' },
                            WebkitLineClamp: { sm: 3 },
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>

          {/* Right — dynamic image card, top-aligned with header */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              // Landscape card matches the step photos (~2:1 / 3:2) so faces aren't cropped.
              aspectRatio: { xs: '4 / 3', lg: '16 / 10' },
              minHeight: { xs: 260, md: 320, lg: 0 },
              borderRadius: '20px',
              overflow: 'hidden',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
              bgcolor: colors.surfaceAlt,
              alignSelf: 'start',
            }}
          >
            {howItWorksSteps.map((step, index) => {
              const isActive = index === activeIndex
              return (
                <Box
                  key={step.id}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? 'translateX(0)'
                      : index < activeIndex
                        ? 'translateX(-28px)'
                        : 'translateX(28px)',
                    transition: reducedMotion
                      ? 'none'
                      : `opacity ${TRANSITION_MS}ms ${publicMotion.easeInOut}, transform ${TRANSITION_MS}ms ${publicMotion.easeInOut}`,
                    pointerEvents: isActive ? 'auto' : 'none',
                    zIndex: isActive ? 1 : 0,
                  }}
                >
                  <Box
                    component="img"
                    src={step.image.src}
                    alt={step.image.alt}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: step.image.objectPosition ?? 'center',
                      display: 'block',
                    }}
                  />
                  <Box
                    aria-hidden
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, transparent 45%, rgba(0, 31, 63, 0.55) 100%)',
                    }}
                  />
                </Box>
              )
            })}

            <Box
              sx={{
                position: 'absolute',
                left: 16,
                bottom: 16,
                zIndex: 2,
                maxWidth: '78%',
                px: 1.75,
                py: 1.5,
                borderRadius: '14px',
                bgcolor: 'rgba(255, 255, 255, 0.94)',
                border: `1px solid ${colors.border}`,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                opacity: entered || reducedMotion ? 1 : 0,
                transition: reducedMotion
                  ? 'none'
                  : `opacity ${TRANSITION_MS}ms ${publicMotion.easeInOut}`,
              }}
            >
              <Box
                key={activeStep.id}
                sx={{
                  animation: reducedMotion
                    ? 'none'
                    : `overlayFade ${TRANSITION_MS}ms ${publicMotion.easeInOut}`,
                  '@keyframes overlayFade': {
                    from: { opacity: 0, transform: 'translateY(6px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                {activeStep.overlay.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 0.35,
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.14)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Check size={11} color={colors.greenBright} strokeWidth={3} />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: colors.navy,
                        lineHeight: 1.3,
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
