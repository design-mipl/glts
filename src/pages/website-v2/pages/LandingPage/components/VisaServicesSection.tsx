import { useEffect, useRef, useState } from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { visaServiceShowcaseImages } from '../../../assets/landingPageImages'

const CARD_RADIUS = '16px'
const IMAGE_RADIUS = '14px'
const TRANSITION = '300ms cubic-bezier(0.22, 1, 0.36, 1)'

const visaServices = [
  {
    id: 'tourist',
    title: 'Tourist Visa',
    description: 'For holidays, leisure and short-term travel',
    image: visaServiceShowcaseImages.tourist,
    href: '/countries',
    objectPosition: 'center center',
  },
  {
    id: 'business',
    title: 'Business Visa',
    description: 'For meetings, conferences and business visits',
    image: visaServiceShowcaseImages.business,
    href: '/countries',
    objectPosition: 'center 35%',
  },
  {
    id: 'student',
    title: 'Student Visa',
    description: 'For overseas study and academic travel',
    image: visaServiceShowcaseImages.student,
    href: '/countries',
    objectPosition: 'center 32%',
  },
  {
    id: 'transit',
    title: 'Transit Visa',
    description: 'For layovers and onward travel through another country',
    image: visaServiceShowcaseImages.transit,
    href: '/countries',
    objectPosition: 'center 40%',
  },
  {
    id: 'family',
    title: 'Visit & Family',
    description: 'For visiting friends, relatives and family members',
    image: visaServiceShowcaseImages.family,
    href: '/countries',
    objectPosition: 'center center',
  },
  {
    id: 'other',
    title: 'Other Visa Types',
    description: 'For special cases that need country-specific guidance',
    image: visaServiceShowcaseImages.other,
    href: '/countries',
    objectPosition: 'center 35%',
  },
] as const

function useRowReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const playedRef = useRef(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || playedRef.current) return
        playedRef.current = true
        setActive(true)
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, active }
}

function VisaServiceCard({
  title,
  description,
  image,
  href,
  objectPosition,
  index,
  active,
  reducedMotion,
}: (typeof visaServices)[number] & {
  index: number
  active: boolean
  reducedMotion: boolean
}) {
  const colors = usePublicBrandColors()
  const [imageSrc, setImageSrc] = useState<string>(image.src)
  const delayMs = reducedMotion ? 0 : index * 70

  return (
    <Box
      component="a"
      href={href}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
        width: {
          xs: 'min(220px, 72vw)',
          sm: 200,
          md: 210,
          lg: '100%',
        },
        minWidth: 0,
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: CARD_RADIUS,
        bgcolor: colors.white,
        opacity: active ? 1 : 0,
        transform: active ? 'translate3d(0, 0, 0)' : 'translate3d(0, 16px, 0)',
        transition: reducedMotion
          ? 'none'
          : `opacity 0.5s ${TRANSITION} ${delayMs}ms, transform 0.5s ${TRANSITION} ${delayMs}ms`,
        willChange: 'opacity, transform',
        '@media (hover: hover)': {
          '&:hover': {
            transform: active ? 'translate3d(0, -4px, 0)' : undefined,
          },
          '&:hover .visa-card-image': {
            transform: 'scale(1.04)',
          },
          '&:hover .visa-card-cta': {
            color: colors.greenDark,
          },
          '&:hover .visa-card-arrow': {
            transform: 'translateX(4px)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 5',
          borderRadius: IMAGE_RADIUS,
          overflow: 'hidden',
          mb: 1.75,
          bgcolor: colors.surfaceAlt,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
        }}
      >
        <Box
          component="img"
          className="visa-card-image"
          src={imageSrc}
          alt={image.alt}
          loading="lazy"
          onError={() => setImageSrc(image.fallback)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
            display: 'block',
            transform: 'scale(1)',
            transition: reducedMotion ? 'none' : `transform 0.5s ${TRANSITION}`,
            willChange: 'transform',
          }}
        />
      </Box>

      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontSize: { xs: '15px', md: '16px' },
          fontWeight: 800,
          color: colors.navy,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          mb: 0.6,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: '12.5px', md: '13px' },
          color: colors.textSecondary,
          lineHeight: 1.4,
          mb: 1.25,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.8em',
        }}
      >
        {description}
      </Typography>

      <Box
        className="visa-card-cta"
        sx={{
          mt: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          color: colors.greenBright,
          fontSize: '13.5px',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          transition: reducedMotion ? 'none' : `color ${TRANSITION}`,
        }}
      >
        Apply Now
        <Box
          component="span"
          className="visa-card-arrow"
          sx={{
            display: 'inline-flex',
            transition: reducedMotion ? 'none' : `transform ${TRANSITION}`,
          }}
        >
          <ArrowRight size={15} strokeWidth={2.25} />
        </Box>
      </Box>
    </Box>
  )
}

export function VisaServicesSection() {
  const colors = usePublicBrandColors()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { ref, active } = useRowReveal()

  return (
    <Box
      component="section"
      id="visa-services"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
        scrollMarginTop: 88,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 640, mb: landingSectionHeaderMb }}>
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
            Visa Services
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
            Every visa category, expertly managed.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            From tourist trips to work permits — each service includes pre-submission review and
            live application tracking.
          </Typography>
        </Box>

        <Box
          ref={ref}
          sx={{
            display: { xs: 'flex', lg: 'grid' },
            gridTemplateColumns: {
              lg: 'repeat(6, minmax(0, 1fr))',
            },
            gap: { xs: 2.5, sm: 2.75, md: 3 },
            overflowX: { xs: 'auto', lg: 'visible' },
            pb: { xs: 1, lg: 0 },
            mx: { xs: -3, sm: -4, md: -5, lg: 0 },
            px: { xs: 3, sm: 4, md: 5, lg: 0 },
            scrollSnapType: { xs: 'x mandatory', lg: 'none' },
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            '& > *': {
              scrollSnapAlign: { xs: 'start', lg: 'unset' },
            },
          }}
        >
          {visaServices.map((service, index) => (
            <VisaServiceCard
              key={service.id}
              {...service}
              index={index}
              active={active}
              reducedMotion={reducedMotion}
            />
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
