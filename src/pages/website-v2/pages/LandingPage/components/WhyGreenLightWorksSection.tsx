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
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import {
  publicFonts,
  publicMotion,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'
import { useScrollReveal } from '../../../hooks/useScrollReveal'

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
  index,
  active,
  reducedMotion,
}: {
  title: string
  description: string
  icon: LucideIcon
  index: number
  active: boolean
  reducedMotion: boolean
}) {
  const colors = usePublicBrandColors()
  const delayMs = reducedMotion ? 0 : index * publicMotion.staggerMs

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
        p: { xs: 2, md: 2.25 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(14px)',
        transition: reducedMotion
          ? 'border-color 0.25s ease, box-shadow 0.25s ease'
          : `opacity ${publicMotion.revealDurationMs}ms ${publicMotion.easeOut} ${delayMs}ms, transform ${publicMotion.revealDurationMs}ms ${publicMotion.easeOut} ${delayMs}ms, border-color 0.25s ease, box-shadow 0.25s ease`,
        '@media (hover: hover)': {
          '&:hover': {
            transform: active ? 'translateY(-4px)' : undefined,
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.45)`,
            boxShadow: `0 14px 32px rgba(${brandPrimaryGreenRgb}, 0.14)`,
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          mb: 0.25,
          borderBottom: `1px dashed ${colors.border}`,
        }}
      >
        <Typography
          sx={{
            fontFamily: publicFonts.mono,
            fontVariantNumeric: 'tabular-nums',
            fontSize: '20px',
            fontWeight: 700,
            color: colors.textMuted,
            letterSpacing: '-0.02em',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </Typography>
        <Icon size={18} color={colors.greenBright} strokeWidth={1.9} />
      </Box>
      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontSize: '15px',
          fontWeight: 700,
          color: colors.navy,
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: '13px',
          color: colors.textSecondary,
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>
    </Box>
  )
}

export function WhyGreenLightWorksSection() {
  const colors = usePublicBrandColors()
  const { ref: gridRef, active: gridActive, reducedMotion } = useScrollReveal<HTMLDivElement>({
    threshold: 0.15,
  })

  return (
    <Box
      component="section"
      id="why-greenlight-works"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
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
                fontFamily: publicFonts.display,
                fontSize: { xs: '28px', md: '36px', lg: '40px' },
                fontWeight: 700,
                color: colors.navy,
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
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
              ref={gridRef}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 3,
              }}
            >
              {FEATURES.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  index={index}
                  active={gridActive}
                  reducedMotion={reducedMotion}
                />
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
