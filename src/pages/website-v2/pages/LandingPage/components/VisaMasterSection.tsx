import { Fragment } from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'
import {
  UserRound,
  FileCheck2,
  Crosshair,
  Waypoints,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicFonts,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'
const VISA_MASTER_IMAGE = {
  src: '/images/visa-master/passport.png',
  fallback: '/images/visa-master/passport.png',
  alt: 'Navy passport on a desk with a city skyline at dusk',
} as const

/** Subtle film grain — SVG turbulence, ~3% opacity when applied. */
const GRAIN_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

const premiumFeatures = [
  {
    icon: UserRound,
    title: 'Dedicated Expert Assistance',
    description: 'A named specialist guides your case with concierge-level attention.',
  },
  {
    icon: FileCheck2,
    title: 'Document Review',
    description: 'Every document checked for embassy fit, accuracy, and completeness.',
  },
  {
    icon: Crosshair,
    title: 'Application Tracking',
    description: 'Real-time milestone visibility from intake through final decision.',
  },
  {
    icon: Waypoints,
    title: 'End-to-End Support',
    description: 'One premium team from eligibility checks to post-decision support.',
  },
] as const

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
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        px: { xs: 1.5, lg: 1.75 },
        py: { xs: 0.5, lg: 0 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.5,
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
          border: '1.5px solid rgba(255, 255, 255, 0.22)',
          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.1)`,
        }}
      >
        <Icon size={26} color={colors.greenBright} strokeWidth={1.85} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: { xs: '15px', md: '16px' },
            fontWeight: 700,
            color: colors.white,
            lineHeight: 1.3,
            mb: 0.65,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '13px', md: '13.5px' },
            color: 'rgba(255, 255, 255, 0.68)',
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

function PassportFocal({ navy }: { navy: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: 220, md: 250, lg: 280 },
        height: { xs: 250, md: 280, lg: 300 },
        mx: { xs: 'auto', md: 0 },
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Soft white/blue backglow — depth without a hard plate */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 200, md: 230, lg: 260 },
          height: { xs: 200, md: 230, lg: 260 },
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(180, 210, 255, 0.12) 0%, rgba(120, 170, 230, 0.07) 40%, transparent 72%)',
          filter: 'blur(170px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 150, md: 175, lg: 195 },
          height: { xs: 150, md: 175, lg: 195 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(150px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Image stack — CSS mask removes rectangular edges */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          // Combined horizontal + vertical fade (no hard frame)
          WebkitMaskImage: `
            linear-gradient(90deg, transparent 0%, #000 18%, #000 82%, transparent 100%),
            linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)
          `,
          WebkitMaskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskComposite: 'source-in',
          maskImage: `
            linear-gradient(90deg, transparent 0%, #000 18%, #000 82%, transparent 100%),
            linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)
          `,
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          maskComposite: 'intersect',
        }}
      >
        <Box
          component="img"
          src={VISA_MASTER_IMAGE.src}
          alt={VISA_MASTER_IMAGE.alt}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = VISA_MASTER_IMAGE.fallback
          }}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            // Tone toward hero navy; keep passport readable
            filter: 'brightness(0.88) contrast(1.06) saturate(0.92)',
          }}
        />

        {/* Dark navy color grade overlay */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, ${navy}cc 0%, transparent 35%, transparent 65%, ${navy}d9 100%)`,
            mixBlendMode: 'multiply',
            opacity: 0.55,
            pointerEvents: 'none',
          }}
        />

        {/* Soft navy wash for palette consistency */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: navy,
            mixBlendMode: 'color',
            opacity: 0.28,
            pointerEvents: 'none',
          }}
        />

        {/* Cinematic vignette */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 55% 60% at 50% 48%, transparent 30%, ${navy} 100%)`,
            opacity: 0.85,
            pointerEvents: 'none',
          }}
        />
      </Box>
    </Box>
  )
}

export function VisaMasterSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      id="visa-master"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 5, md: 6, lg: 7 },
        bgcolor: colors.navy,
        minHeight: { md: 300, lg: 320 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Section grain — premium depth, avoids flat navy */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: GRAIN_TEXTURE,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
          opacity: 0.035,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Soft section vignette */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 90% at 50% 50%, transparent 40%, rgba(0, 12, 28, 0.55) 100%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 0.95fr) auto minmax(0, 1.4fr)',
            },
            gap: { xs: 3.5, md: 2, lg: 2.5 },
            alignItems: 'center',
          }}
        >
          {/* Left — copy + CTA */}
          <Box sx={{ minWidth: 0, maxWidth: { md: 360 }, position: 'relative', zIndex: 2 }}>
            <Stack spacing={2.25}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 28,
                    height: 3,
                    borderRadius: 1,
                    bgcolor: colors.greenBright,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: colors.greenBright,
                    lineHeight: 1.2,
                  }}
                >
                  Premium Service
                </Typography>
              </Box>

              <Typography
                component="h2"
                sx={{
                  fontFamily: publicFonts.heading,
                  fontSize: { xs: '28px', md: '34px', lg: '38px' },
                  fontWeight: 800,
                  color: colors.white,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                Visa Master
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '14px', md: '15px' },
                  color: 'rgba(255, 255, 255, 0.82)',
                  lineHeight: 1.6,
                }}
              >
                Premium assisted visa service with expert oversight, priority handling, and full
                visibility — designed for travelers who want concierge-level support.
              </Typography>

              <Box sx={{ pt: 0.75 }}>
                <Button
                  variant="contained"
                  href="/v2/countries"
                  endIcon={<ArrowRight size={16} />}
                  sx={{ ...getMarketingPrimaryButtonSx(colors), px: 3.5 }}
                >
                  Explore Visa Master
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Center — blended passport */}
          <PassportFocal navy={colors.navy} />

          {/* Right — feature panel */}
          <Box
            sx={{
              borderRadius: '18px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              bgcolor: 'rgba(4, 22, 42, 0.45)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              px: { xs: 1.25, md: 1.5, lg: 1.75 },
              py: { xs: 1.75, md: 2.25 },
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'stretch',
                width: '100%',
              }}
            >
              {premiumFeatures.map((feature, index) => (
                <Fragment key={feature.title}>
                  <PremiumFeatureItem {...feature} />
                  {index < premiumFeatures.length - 1 && (
                    <Box
                      aria-hidden
                      sx={{
                        width: '1px',
                        alignSelf: 'stretch',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </Fragment>
              ))}
            </Box>

            <Box
              sx={{
                display: { xs: 'grid', lg: 'none' },
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2.25,
              }}
            >
              {premiumFeatures.map((feature) => (
                <PremiumFeatureItem key={feature.title} {...feature} />
              ))}
            </Box>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
