import { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { Anchor, Building2, Handshake, User, ArrowRight, type LucideIcon } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../../../theme/publicSiteTokens'
import {
  travelSolutionImages,
  SOLUTION_CARD_IMAGE_HEIGHT,
} from '../../../assets/landingPageImages'

const solutions = [
  {
    id: 'retail',
    icon: User,
    title: 'Retail',
    summary: 'Visa services for individuals and families',
    description:
      'Apply for tourist, business, visit, student and other visa categories with expert guidance and digital tracking.',
    ctaLabel: 'Explore Retail',
    href: '/',
    image: travelSolutionImages.retail,
  },
  {
    id: 'marine',
    icon: Anchor,
    title: 'Marine',
    summary: 'Specialist visa support for seafarers and crew',
    description: 'Dedicated visa expertise for shipping companies, seafarers and marine professionals.',
    ctaLabel: 'Explore Marine',
    href: '/marine-crew',
    image: travelSolutionImages.marine,
  },
  {
    id: 'corporate',
    icon: Building2,
    title: 'Corporate',
    summary: 'Visa management for businesses',
    description:
      'Simplify employee and business visa applications across destinations with dedicated support and centralized management.',
    ctaLabel: 'Explore Corporate',
    href: '/corporate',
    image: travelSolutionImages.corporate,
  },
  {
    id: 'travel-partners',
    icon: Handshake,
    title: 'Travel Partners',
    summary: 'Your visa processing partner',
    description: 'Reliable visa processing support for travel agents, DMCs and other travel partners.',
    ctaLabel: 'Partner With GreenLight',
    href: '/travel-agents',
    image: travelSolutionImages.corporate,
  },
] as const

const visaServiceImages: Record<string, { src: string; fallback: string; alt: string; objectPosition?: string }> = {
  retail: { src: '/images/about-industries/retail-travelers.png', fallback: '/images/about-industries/retail-travelers.png', alt: 'Travelers enjoying a seaside destination', objectPosition: 'center 72%' },
  marine: { src: '/images/about-industries/marine-offshore.png', fallback: '/images/about-industries/marine-offshore.png', alt: 'Marine shipping operations at a port', objectPosition: 'center 55%' },
  corporate: { src: '/images/about-industries/corporate-businesses.png', fallback: '/images/about-industries/corporate-businesses.png', alt: 'Business travelers in an airport' },
  'travel-partners': { src: '/images/services/travel-assistance-24x7.png', fallback: '/images/services/travel-assistance-24x7.png', alt: 'Travel specialist assisting a customer' },
}

const CARD_RADIUS = '20px'
const TRANSITION_MS = '300ms'
const TRANSITION_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

function SolutionCard({
  icon: Icon,
  title,
  summary,
  description,
  ctaLabel,
  href,
  image,
  visaServices = false,
}: {
  icon: LucideIcon
  title: string
  summary: string
  description: string
  ctaLabel: string
  href: string
  image: { src: string; fallback: string; alt: string; objectPosition?: string }
  visaServices?: boolean
}) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState(image.src)

  return (
    <Box
      component="a"
      href={href}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: visaServices ? '14px' : CARD_RADIUS,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
        bgcolor: colors.white,
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        transition: `border-color ${TRANSITION_MS} ease, box-shadow ${TRANSITION_MS} ease, transform ${TRANSITION_MS} ${TRANSITION_EASE}`,
        '@media (hover: hover)': {
          '&:hover': {
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.4)`,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
            transform: 'translateY(-6px)',
            '& .solution-card-image': {
              transform: 'scale(1.06)',
            },
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: visaServices ? { xs: 205, md: 175, desktop: 155 } : SOLUTION_CARD_IMAGE_HEIGHT,
          flexShrink: 0,
          overflow: 'hidden',
          bgcolor: colors.surfaceAlt,
          borderTopLeftRadius: CARD_RADIUS,
          borderTopRightRadius: CARD_RADIUS,
        }}
      >
        <Box
          component="img"
          className="solution-card-image"
          src={imgSrc}
          alt={image.alt}
          loading="lazy"
          onError={() => setImgSrc(image.fallback)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: visaServices ? image.objectPosition ?? 'center' : 'center',
            display: 'block',
            transition: `transform ${TRANSITION_MS} ${TRANSITION_EASE}`,
            willChange: 'transform',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          p: visaServices ? { xs: 2.25, desktop: 2.25 } : { xs: 2.25, md: 2.5 },
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '10px',
              bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.12)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} color={colors.greenBright} strokeWidth={2.1} />
          </Box>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: visaServices ? '18px' : '18px',
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: visaServices ? '15px' : '16px',
            fontWeight: 800,
            color: colors.navy,
            lineHeight: 1.35,
            mb: 0.75,
          }}
        >
          {summary}
        </Typography>

        <Typography
          sx={{
            fontSize: visaServices ? '15px' : '14px',
            color: colors.textSecondary,
            lineHeight: 1.65,
            mb: 2,
            flex: 1,
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.greenBright }}>
          <Typography sx={{ fontSize: visaServices ? '15px' : '13px', fontWeight: 700 }}>{ctaLabel}</Typography>
          <ArrowRight size={15} strokeWidth={2.5} />
        </Stack>
      </Box>
    </Box>
  )
}

export function SpecializedSolutionsSection({ visaServices = false }: { visaServices?: boolean }) {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      id="specialist-visa-services"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
        scrollMarginTop: 88,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: visaServices ? 790 : 640, mb: landingSectionHeaderMb }}>
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
            Specialist Visa Services
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.display,
              fontSize: visaServices ? { xs: '30px', lg: '36px', desktop: '42px' } : { xs: '26px', md: '32px' },
              fontWeight: 700,
              color: colors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              mb: 1.25,
            }}
          >
            Visa Expertise Across Every Business Need
          </Typography>

          <Typography
            sx={{
            fontSize: visaServices ? { xs: '15px', desktop: '16px' } : { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            Whether you're travelling independently, managing employees, supporting crew or serving
            your own clients, GreenLight has a specialist visa solution.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: visaServices
              ? { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }
              : { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            gap: visaServices ? 2 : { xs: 2, md: 2.5 },
            alignItems: 'stretch',
            ...(visaServices ? { '@media (min-width: 1100px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' } } : {}),
          }}
        >
          {solutions.map((solution) => (
            <SolutionCard key={solution.id} {...solution} image={visaServices ? visaServiceImages[solution.id] : solution.image} visaServices={visaServices} />
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
