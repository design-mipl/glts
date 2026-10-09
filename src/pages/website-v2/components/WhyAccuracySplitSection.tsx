import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../theme/publicSiteTokens'
import { featureSectionPy } from '../pages/LandingPage/landingPageSpacing'

interface CollageImage {
  src: string
  fallback: string
  alt: string
}

interface ImpactPoint {
  title: string
  description: string
  icon: LucideIcon
}

interface WhyAccuracySplitSectionProps {
  id: string
  title: string
  description: string
  badgeLabel?: string
  images: {
    primary: CollageImage
    secondaryTop: CollageImage
    secondaryBottom: CollageImage
  }
  impacts: readonly ImpactPoint[]
}

function CollageImageTile({
  image,
  className,
  minHeight,
}: {
  image: CollageImage
  className?: string
  minHeight: { xs: number; md: number }
}) {
  const [imgSrc, setImgSrc] = useState(image.src)

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden',
        minHeight,
        transition: 'transform 320ms ease, box-shadow 320ms ease',
        boxShadow: '0 8px 28px rgba(15, 23, 42, 0.12)',
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 14px 34px rgba(15, 23, 42, 0.18)',
          },
          '&:hover .accuracy-collage-image': {
            transform: 'scale(1.06)',
          },
        },
      }}
    >
      <Box
        component="img"
        className="accuracy-collage-image"
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
          transition: 'transform 420ms ease',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0, 20, 40, 0.08) 0%, rgba(0, 20, 40, 0.28) 55%, rgba(0, 20, 40, 0.46) 100%)',
        }}
      />
    </Box>
  )
}

export function WhyAccuracySplitSection({
  id,
  title,
  description,
  badgeLabel,
  images,
  impacts,
}: WhyAccuracySplitSectionProps) {
  const colors = usePublicBrandColors()

  return (
    <Box component="section" id={id} sx={{ py: featureSectionPy }}>
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
            gap: { xs: 3, md: 5 },
            alignItems: { xs: 'start', md: 'center' },
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                display: 'grid',
                gap: { xs: 2, md: 2.25 },
                gridTemplateColumns: { xs: '1fr', sm: '1.25fr 1fr' },
                gridTemplateRows: { xs: 'repeat(3, auto)', sm: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <Box sx={{ gridRow: { sm: '1 / span 2' } }}>
                <CollageImageTile image={images.primary} minHeight={{ xs: 220, md: 500 }} />
              </Box>
              <CollageImageTile image={images.secondaryTop} minHeight={{ xs: 170, md: 238 }} />
              <CollageImageTile image={images.secondaryBottom} minHeight={{ xs: 170, md: 238 }} />
            </Box>

            {badgeLabel ? (
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: 12, md: 18 },
                  bottom: { xs: 12, md: 18 },
                  borderRadius: '999px',
                  px: 1.5,
                  py: 0.8,
                  bgcolor: 'rgba(255, 255, 255, 0.94)',
                  border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.32)`,
                  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: colors.greenDark,
                  }}
                >
                  {badgeLabel}
                </Typography>
              </Box>
            ) : null}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: publicFonts.display,
                fontSize: { xs: '26px', md: '32px' },
                fontWeight: 700,
                color: colors.navy,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                mb: 1.5,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: '15px',
                color: colors.textSecondary,
                lineHeight: 1.7,
                mb: { xs: 2.5, md: 3.25 },
              }}
            >
              {description}
            </Typography>

            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {impacts.map((item) => {
                const Icon = item.icon
                return (
                  <Box
                    key={item.title}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr',
                      gap: 1.5,
                      alignItems: 'start',
                      p: { xs: 1.75, md: 2 },
                      borderRadius: '16px',
                      bgcolor: colors.white,
                      border: `1px solid ${colors.border}`,
                      boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)',
                      transition:
                        'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                      '@media (hover: hover)': {
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          borderColor: `rgba(${brandPrimaryGreenRgb}, 0.4)`,
                          boxShadow: `0 12px 28px rgba(${brandPrimaryGreenRgb}, 0.12)`,
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.12)`,
                        border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.22)`,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={colors.greenBright} strokeWidth={2.1} />
                    </Box>
                    <Box sx={{ minWidth: 0, pt: 0.15 }}>
                      <Typography
                        sx={{ fontSize: '15px', fontWeight: 700, color: colors.navy, mb: 0.4 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.55 }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
