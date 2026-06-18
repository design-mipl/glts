import { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { Anchor, Building2, User, ArrowRight, type LucideIcon } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../../../theme/publicSiteTokens'
import {
  travelSolutionImages,
  SOLUTION_CARD_IMAGE_HEIGHT,
} from '../../../assets/landingPageImages'

const solutions = [
  {
    id: 'marine',
    icon: Anchor,
    title: 'Marine Crew Travel',
    description: 'Crew visa handling for vessels, offshore teams, and port-of-call deployments.',
    href: '/marine-crew',
    image: travelSolutionImages.marine,
  },
  {
    id: 'corporate',
    icon: Building2,
    title: 'Corporate Travel Management',
    description: 'Business visa ops with compliance dashboards, bulk filing, and account support.',
    href: '/corporate',
    image: travelSolutionImages.corporate,
  },
  {
    id: 'retail',
    icon: User,
    title: 'B2B Travelers',
    description: 'Individual visa assistance for tourists, students, families, and professionals.',
    href: '/countries',
    image: travelSolutionImages.retail,
  },
] as const

const CARD_RADIUS = '20px'
const TRANSITION_MS = '300ms'
const TRANSITION_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

function SolutionCard({
  icon: _icon,
  title,
  description,
  href,
  image,
}: {
  icon: LucideIcon
  title: string
  description: string
  href: string
  image: { src: string; fallback: string; alt: string }
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
        borderRadius: CARD_RADIUS,
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
          height: SOLUTION_CARD_IMAGE_HEIGHT,
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
            objectPosition: 'center',
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
          p: { xs: 2.25, md: 2.5 },
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: '18px',
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
            fontSize: '14px',
            color: colors.textSecondary,
            lineHeight: 1.65,
            mb: 2,
            flex: 1,
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.greenBright }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Learn More</Typography>
          <ArrowRight size={15} strokeWidth={2.5} />
        </Stack>
      </Box>
    </Box>
  )
}

export function SpecializedSolutionsSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
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
            Specialized Solutions
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
            Travel Solutions
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            Purpose-built workflows for marine crews, corporate teams, and retail travelers — each
            linking to a dedicated experience.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { xs: 2, md: 2.5 },
            alignItems: 'stretch',
          }}
        >
          {solutions.map((solution) => (
            <SolutionCard key={solution.id} {...solution} />
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
