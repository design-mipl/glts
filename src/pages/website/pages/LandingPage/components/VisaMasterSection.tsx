import { Fragment } from 'react'
import { Box, Typography, Grid, Stack, Button } from '@mui/material'
import {
  UserCheck,
  FileSearch,
  Radar,
  Route,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionPy } from '../landingPageSpacing'
import {
  publicFonts,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'

const premiumFeatures = [
  {
    icon: UserCheck,
    title: 'Dedicated Expert Assistance',
    description: 'A named specialist guides your case with concierge-level attention.',
  },
  {
    icon: FileSearch,
    title: 'Document Review',
    description: 'Every document checked for embassy fit, accuracy, and completeness.',
  },
  {
    icon: Radar,
    title: 'Application Tracking',
    description: 'Real-time milestone visibility from intake through final decision.',
  },
  {
    icon: Route,
    title: 'End-to-End Support',
    description: 'One premium team from eligibility checks to post-decision support.',
  },
] as const

function FeatureDivider() {
  const colors = usePublicBrandColors()

  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: 'none', lg: 'block' },
        width: '1px',
        alignSelf: 'stretch',
        minHeight: 120,
        bgcolor: colors.borderSoft,
        mx: 0.5,
      }}
    />
  )
}

function PremiumFeatureItem({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  const colors = usePublicBrandColors()

  return (
    <Stack
      spacing={1.75}
      alignItems="center"
      sx={{
        textAlign: 'center',
        flex: 1,
        minWidth: 0,
        px: { xs: 0.5, md: 1 },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.greenMuted,
          border: `2px solid rgba(${brandPrimaryGreenRgb}, 0.28)`,
          boxShadow: `0 8px 22px rgba(${brandPrimaryGreenRgb}, 0.14)`,
        }}
      >
        <Icon size={24} color={colors.greenBright} strokeWidth={2.15} />
      </Box>

      <Box>
        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: { xs: '15px', md: '16px' },
            fontWeight: 800,
            color: colors.navy,
            lineHeight: 1.3,
            mb: 0.6,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '13px', md: '13.5px' },
            color: colors.textSecondary,
            lineHeight: 1.55,
            maxWidth: 220,
            mx: 'auto',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  )
}

function PremiumFeaturesRow() {
  const colors = usePublicBrandColors()

  return (
    <>
      <Stack
        direction="row"
        alignItems="stretch"
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: '100%',
        }}
      >
        {premiumFeatures.map((feature, index) => (
          <Fragment key={feature.title}>
            <PremiumFeatureItem {...feature} />
            {index < premiumFeatures.length - 1 && <FeatureDivider />}
          </Fragment>
        ))}
      </Stack>

      <Grid container spacing={2} sx={{ display: { xs: 'flex', lg: 'none' } }}>
        {premiumFeatures.map(feature => (
          <Grid key={feature.title} size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                height: '100%',
                p: 2.25,
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.white,
                boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
              }}
            >
              <PremiumFeatureItem {...feature} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export function VisaMasterSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.surface,
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer variant="hero">
        <Grid container spacing={{ xs: 4, md: 5 }} alignItems="center">
          <Grid size={{ xs: 12, md: 4.5 }}>
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
              Premium Service
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: { xs: '26px', md: '34px' },
                fontWeight: 800,
                color: colors.navy,
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
                mb: 1.5,
              }}
            >
              Visa Master
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '15px', md: '16px' },
                color: colors.textSecondary,
                lineHeight: 1.65,
                mb: 3,
              }}
            >
              Premium assisted visa service with expert oversight, priority handling, and full
              visibility — designed for travelers who want concierge-level support.
            </Typography>

            <Button
              variant="contained"
              href="/countries"
              endIcon={<ArrowRight size={16} />}
              sx={{ ...getMarketingPrimaryButtonSx(colors), px: 3.5 }}
            >
              Explore Visa Master
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 7.5 }}>
            <Box
              sx={{
                borderRadius: '20px',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.white,
                boxShadow: '0 12px 36px rgba(15, 23, 42, 0.07)',
                p: { xs: 2.5, md: 3.5, lg: 4 },
              }}
            >
              <PremiumFeaturesRow />
            </Box>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
