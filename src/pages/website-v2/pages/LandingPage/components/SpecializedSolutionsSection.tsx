import { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { Anchor, Building2, Handshake, User, ArrowRight, type LucideIcon } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../../../theme/publicSiteTokens'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'
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
  const cardTokens = visaServices ? ds.component.card.category : ds.component.card.service
  const cardRadius = visaServices ? ds.component.card.category.compactRadius : cardTokens.radius

  return (
    <Box
      component="a"
      href={href}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: `${cardRadius}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
        bgcolor: colors.white,
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        transition: `border-color ${ds.component.card.hoverDurationMs}ms ease, box-shadow ${ds.component.card.hoverDurationMs}ms ease, transform ${ds.component.card.hoverDurationMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        '&:focus-visible': { outline: `${ds.component.card.focusWidth}px solid ${ds.color.focus}`, outlineOffset: 3 },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '& .solution-card-image': { transition: 'none' } },
        '@media (hover: hover)': {
          '&:hover': {
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.4)`,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
            transform: 'translateY(-6px)',
            '& .solution-card-image': {
              transform: `scale(${ds.component.card.imageZoomScale})`,
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
          borderTopLeftRadius: `${cardRadius}px`,
          borderTopRightRadius: `${cardRadius}px`,
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
            transition: `transform ${ds.component.card.hoverDurationMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            willChange: 'transform',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          p: { xs: `${cardTokens.padding.mobile}px`, md: `${cardTokens.padding.desktop}px` },
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: cardTokens.iconContainerSize,
              height: cardTokens.iconContainerSize,
              borderRadius: `${cardTokens.iconRadius}px`,
              bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.12)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={cardTokens.iconSize} color={colors.greenBright} strokeWidth={ds.icon.strokeWidth} aria-hidden="true" />
          </Box>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: `${cardTokens.titleSize}px`,
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
            fontSize: `${visaServices ? ds.component.card.category.subtitleSize : ds.component.card.service.summarySize}px`,
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
            fontSize: `${visaServices ? ds.component.card.category.bodySize : cardTokens.bodySize}px`,
            color: colors.textSecondary,
            lineHeight: cardTokens.bodyLineHeight,
            mb: 2,
            flex: 1,
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.greenBright }}>
          <Typography sx={{ fontSize: visaServices ? '15px' : '14px', fontWeight: 700 }}>{ctaLabel}</Typography>
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
              ...websiteHeadingSx.h2,
              color: colors.navy,
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
