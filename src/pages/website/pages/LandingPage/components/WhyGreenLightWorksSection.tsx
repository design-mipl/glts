import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Box, Typography, Stack, Button } from '@mui/material'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb } from '../landingPageSpacing'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
  getMarketingPrimaryButtonSx,
} from '../../../theme/publicSiteTokens'
import { methodologyCarouselImages } from '../../../assets/landingPageImages'

const IMAGE_RADIUS = '22px'
const SLIDE_COUNT = 3
const SWIPE_THRESHOLD_PX = 48
const CAROUSEL_TRANSITION_SECONDS = 0.42

const methodologySlides = [
  {
    id: 'what-we-do',
    title: 'What We Do',
    description:
      'Our specialists handle every step between your documents and embassy submission — with precision, clarity, and zero shortcuts.',
    items: [
      'Expert Review',
      'Document Matching',
      'Application Validation',
      'Submission Preparation',
    ],
    layout: 'content-left' as const,
    image: methodologyCarouselImages.whatWeDo,
    cta: { label: 'See how it works', href: '#how-it-works' },
  },
  {
    id: 'why-greenlight',
    title: 'Why GreenLight',
    description:
      'Structured methodology meets modern tooling — so every application is reviewed by experts, tracked in real time, and submitted with confidence.',
    items: ['Zero Guesswork', 'Tech-enabled', 'Human + Expert', 'Faster Processing'],
    layout: 'content-right' as const,
    image: methodologyCarouselImages.whyGreenlight,
    cta: { label: 'Start your application', href: '/countries' },
  },
  {
    id: 'what-we-check',
    title: 'What We Check',
    description:
      'Before anything reaches an embassy, we validate against official requirements — catching gaps early and protecting your approval odds.',
    items: [
      'Embassy Requirements',
      'Document Accuracy',
      'Eligibility Criteria',
      'Application Completeness',
    ],
    layout: 'content-left' as const,
    collage: methodologyCarouselImages.checkCollage,
    cta: { label: 'Explore destinations', href: '/countries' },
  },
] as const

function EditorialImage({
  src,
  fallback,
  alt,
  sx,
}: {
  src: string
  fallback: string
  alt: string
  sx?: object
}) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      loading="lazy"
      onError={() => setImgSrc(fallback)}
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...sx,
      }}
    />
  )
}

function ImageCollage({
  images,
}: {
  images: readonly { src: string; fallback: string; alt: string }[]
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: { xs: 1.25, md: 1.75 },
        height: { xs: 340, sm: 400, md: 480, lg: 540 },
        width: '100%',
      }}
    >
      {images.map((image, index) => {
        const isTall = index === 0 || index === 3

        return (
          <Box
            key={image.alt}
            sx={{
              gridColumn: index === 0 ? 1 : index === 3 ? 3 : 2,
              gridRow: isTall ? '1 / 3' : index === 1 ? 1 : 2,
              borderRadius: IMAGE_RADIUS,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(15, 23, 42, 0.1)',
              border: `1px solid ${colors.borderSoft}`,
              minHeight: 0,
            }}
          >
            <EditorialImage {...image} />
          </Box>
        )
      })}
    </Box>
  )
}

function SlideContent({
  title,
  description,
  items,
  cta,
}: {
  title: string
  description: string
  items: readonly string[]
  cta: { label: string; href: string }
}) {
  const colors = usePublicBrandColors()

  return (
    <Stack
      spacing={{ xs: 2.5, md: 3 }}
      sx={{
        justifyContent: 'center',
        height: '100%',
        py: { xs: 1, md: 2 },
        pr: { md: 2, lg: 4 },
      }}
    >
      <Typography
        component="h3"
        sx={{
          fontFamily: publicFonts.heading,
          fontSize: { xs: '32px', sm: '36px', md: '42px', lg: '46px' },
          fontWeight: 800,
          color: colors.navy,
          lineHeight: 1.08,
          letterSpacing: '-0.8px',
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: '16px', md: '17px', lg: '18px' },
          color: colors.textSecondary,
          lineHeight: 1.7,
          maxWidth: 480,
        }}
      >
        {description}
      </Typography>

      <Stack spacing={1.75} sx={{ pt: 0.5 }}>
        {items.map(item => (
          <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                bgcolor: colors.greenMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                mt: 0.1,
              }}
            >
              <Check size={13} color={colors.greenBright} strokeWidth={2.75} />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '16px', md: '17px' },
                fontWeight: 600,
                color: colors.navy,
                lineHeight: 1.45,
              }}
            >
              {item}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Box sx={{ pt: { xs: 0.5, md: 1 } }}>
        <Button
          component="a"
          href={cta.href}
          variant="contained"
          endIcon={<ArrowRight size={18} />}
          sx={{
            ...getMarketingPrimaryButtonSx(colors),
            px: 3.5,
            alignSelf: 'flex-start',
          }}
        >
          {cta.label}
        </Button>
      </Box>
    </Stack>
  )
}

function MethodologySlide({
  slide,
}: {
  slide: (typeof methodologySlides)[number]
}) {
  const colors = usePublicBrandColors()
  const isReversed = slide.layout === 'content-right'

  const visual = (
    <Box
      sx={{
        flex: { md: '0 0 60%' },
        width: { xs: '100%', md: '60%' },
        minWidth: 0,
        height: { xs: 280, sm: 360, md: 'auto' },
        minHeight: { md: 420, lg: 500 },
      }}
    >
      {'collage' in slide ? (
        <ImageCollage images={slide.collage} />
      ) : (
        <Box
          sx={{
            height: '100%',
            minHeight: { md: 420, lg: 500 },
            borderRadius: IMAGE_RADIUS,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)',
            border: `1px solid ${colors.borderSoft}`,
          }}
        >
          <EditorialImage {...slide.image} />
        </Box>
      )}
    </Box>
  )

  const content = (
    <Box
      sx={{
        flex: { md: '0 0 40%' },
        width: { xs: '100%', md: '40%' },
        minWidth: 0,
      }}
    >
      <SlideContent
        title={slide.title}
        description={slide.description}
        items={slide.items}
        cta={slide.cta}
      />
    </Box>
  )

  return (
    <Box
      role="group"
      aria-roledescription="slide"
      aria-label={`${slide.title} — slide ${methodologySlides.findIndex(s => s.id === slide.id) + 1} of ${SLIDE_COUNT}`}
      sx={{
        flex: '0 0 100%',
        minWidth: '100%',
        px: { xs: 0, md: 0.5 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: isReversed ? 'row-reverse' : 'row',
          },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: { xs: 4, md: 5, lg: 7 },
          minHeight: { md: 480, lg: 560 },
        }}
      >
        {content}
        {visual}
      </Box>
    </Box>
  )
}


export function WhyGreenLightWorksSection() {
  const colors = usePublicBrandColors()
  const prefersReducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const dragStartX = useRef<number | null>(null)
  const isDragging = useRef(false)

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(SLIDE_COUNT - 1, index)))
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex(prev => Math.min(SLIDE_COUNT - 1, prev + 1))
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex(prev => Math.max(0, prev - 1))
  }, [])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    isDragging.current = true
    dragStartX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || dragStartX.current === null) return

    const delta = event.clientX - dragStartX.current
    if (delta <= -SWIPE_THRESHOLD_PX) goNext()
    else if (delta >= SWIPE_THRESHOLD_PX) goPrev()

    isDragging.current = false
    dragStartX.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handlePointerCancel = () => {
    isDragging.current = false
    dragStartX.current = null
  }

  return (
    <Box
      component="section"
      id="why-greenlight-works"
      sx={{
        bgcolor: colors.white,
        py: { xs: 12, md: 16, lg: 20 },
        borderTop: `1px solid ${colors.borderSoft}`,
        borderBottom: `1px solid ${colors.borderSoft}`,
        overflow: 'visible',
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: landingSectionHeaderMb }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '32px', md: '44px', lg: '48px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.1,
              letterSpacing: '-0.7px',
              mb: 1.75,
            }}
          >
            Why GreenLight Works
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '16px', md: '18px' },
              color: colors.textSecondary,
              lineHeight: 1.7,
            }}
          >
            Every application goes through a structured review process before submission, ensuring
            accuracy, compliance, and confidence.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
          }}
        >
          <Box
            aria-roledescription="carousel"
            aria-label="GreenLight methodology"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              touchAction: 'pan-y',
              cursor: { md: 'grab' },
              userSelect: 'none',
              pb: { xs: 2, md: 0 },
            }}
          >
            <motion.div
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: CAROUSEL_TRANSITION_SECONDS, ease: [0.22, 1, 0.36, 1] }
              }
              style={{
                display: 'flex',
                width: '100%',
                willChange: 'transform',
              }}
            >
              {methodologySlides.map(slide => (
                <MethodologySlide key={slide.id} slide={slide} />
              ))}
            </motion.div>
          </Box>

          <Stack
            direction="row"
            spacing={1.25}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: { xs: 5, md: 6 }, pt: { xs: 2, md: 0 } }}
            role="tablist"
            aria-label="Methodology slides"
          >
            <Box
              component="button"
              type="button"
              aria-label="Previous slide"
              onClick={goPrev}
              disabled={activeIndex === 0}
              sx={{
                width: 34,
                height: 34,
                borderRadius: '999px',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.white,
                color: colors.navy,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={18} />
            </Box>
            {methodologySlides.map((slide, index) => {
              const isActive = index === activeIndex

              return (
                <Box
                  key={slide.id}
                  component="button"
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to ${slide.title}`}
                  onClick={() => goTo(index)}
                  sx={{
                    border: 'none',
                    p: 0,
                    cursor: 'pointer',
                    bgcolor: 'transparent',
                    width: isActive ? 28 : 8,
                    height: 8,
                    borderRadius: 999,
                    transition: 'width 280ms ease, background-color 280ms ease',
                    backgroundColor: isActive
                      ? colors.greenBright
                      : `rgba(${brandPrimaryGreenRgb}, 0.22)`,
                    '&:hover': {
                      backgroundColor: isActive
                        ? colors.greenDark
                        : `rgba(${brandPrimaryGreenRgb}, 0.4)`,
                    },
                  }}
                />
              )
            })}
            <Box
              component="button"
              type="button"
              aria-label="Next slide"
              onClick={goNext}
              disabled={activeIndex === SLIDE_COUNT - 1}
              sx={{
                width: 34,
                height: 34,
                borderRadius: '999px',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.white,
                color: colors.navy,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === SLIDE_COUNT - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === SLIDE_COUNT - 1 ? 0.4 : 1,
              }}
            >
              <ChevronRight size={18} />
            </Box>
          </Stack>
        </Box>
      </PublicContainer>
    </Box>
  )
}
