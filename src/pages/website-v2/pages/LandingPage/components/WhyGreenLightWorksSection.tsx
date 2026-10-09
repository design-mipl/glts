import { Box, Typography } from '@mui/material'
import {
  Activity,
  BadgeCheck,
  FileCheck2,
  Headphones,
  ListChecks,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { whyChooseGreenlightImage } from '../../../assets/landingPageImages'
import { featureSectionPy, landingSectionHeaderMb } from '../landingPageSpacing'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'

const FEATURES: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: 'Expert Document Review',
    description:
      'Your documents are reviewed before submission to help identify missing or inconsistent information.',
    icon: FileCheck2,
  },
  {
    title: 'Clear, Transparent Process',
    description: 'Know what documents you need, what happens next and what you are paying for.',
    icon: ListChecks,
  },
  {
    title: 'Secure Document Handling',
    description: 'Your passport and supporting documents are managed through a secure digital workflow.',
    icon: ShieldCheck,
  },
  {
    title: 'Real-Time Tracking',
    description: 'Track your application and stay informed throughout the process.',
    icon: Activity,
  },
  {
    title: 'Human Support',
    description:
      'Technology simplifies the process. Our visa specialists are available when you need personal assistance.',
    icon: Headphones,
  },
  {
    title: 'Visa Expertise',
    description:
      'Specialist knowledge across destinations, visa categories and complex application requirements.',
    icon: BadgeCheck,
  },
]

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  const colors = usePublicBrandColors()
  const cardTokens = ds.component.card.benefit

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: `${cardTokens.radius}px`,
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
        p: { xs: `${cardTokens.padding.mobile}px`, md: `${cardTokens.padding.desktop}px` },
        display: 'flex',
        flexDirection: 'column',
        gap: `${cardTokens.gap}px`,
        transition: `transform ${ds.component.card.hoverDurationMs}ms ease, box-shadow ${ds.component.card.hoverDurationMs}ms ease, border-color ${ds.component.card.hoverDurationMs}ms ease`,
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.45)`,
            boxShadow: `0 14px 32px rgba(${brandPrimaryGreenRgb}, 0.14)`,
          },
        },
      }}
    >
      <Box
        sx={{
          width: cardTokens.iconContainerSize,
          height: cardTokens.iconContainerSize,
          borderRadius: '12px',
          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.12)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={ds.icon.standard} color={colors.greenBright} strokeWidth={ds.icon.strokeWidth} aria-hidden="true" />
      </Box>
      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontSize: `${cardTokens.titleSize}px`,
          fontWeight: cardTokens.titleWeight,
          color: colors.navy,
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: `${cardTokens.bodySize + 1}px`,
          color: colors.textSecondary,
          lineHeight: cardTokens.bodyLineHeight,
        }}
      >
        {description}
      </Typography>
    </Box>
  )
}

export function WhyGreenLightWorksSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      id="why-greenlight-works"
      sx={{
        bgcolor: colors.white,
        py: featureSectionPy,
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'minmax(0, 1.1fr) minmax(0, 0.95fr)',
            },
            gap: { xs: 4, md: 5, lg: 7 },
            alignItems: 'stretch',
          }}
        >
          {/* Left — content + 3×2 feature grid */}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: colors.greenBright,
                mb: 1.5,
              }}
            >
              Why Choose GreenLight
            </Typography>

            <Typography
            component="h2"
            sx={{
                ...websiteHeadingSx.h2,
                color: colors.navy,
                mb: 1.75,
              }}
            >
              More Than Visa Processing. Expert Guidance.
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '15px', md: '16px' },
                color: colors.textSecondary,
                lineHeight: 1.7,
                maxWidth: 540,
                mb: landingSectionHeaderMb,
              }}
            >
              We combine experienced visa specialists with a secure digital process to make your
              application clearer, more accurate and easier to track.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                '@media (min-width: 600px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
                gap: 3,
              }}
            >
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </Box>
          </Box>

          {/* Right — single large travel image */}
          <Box
            sx={{
              width: '100%',
              minHeight: { xs: 320, md: 420, lg: 0 },
              alignSelf: { lg: 'stretch' },
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 18px 44px rgba(15, 23, 42, 0.14)',
              bgcolor: colors.surfaceAlt,
            }}
          >
            <Box
              component="img"
              src={whyChooseGreenlightImage.src}
              alt={whyChooseGreenlightImage.alt}
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
