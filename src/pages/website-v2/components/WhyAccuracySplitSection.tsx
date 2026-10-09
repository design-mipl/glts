import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../theme/publicSiteTokens'
import { websiteHeadingSx } from '../theme/websiteComponentStyles'
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
  minHeight: { xs: number; md?: number; desktop?: number }
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
    <Box component="section" id={id} sx={{ bgcolor: '#FDFEFE', py: featureSectionPy }}>
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', desktop: 'minmax(0, 0.82fr) minmax(0, 1fr)' },
            gap: { xs: 5, desktop: '42px' },
            alignItems: { xs: 'start', desktop: 'stretch' },
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', minHeight: { desktop: 454 }, alignSelf: 'stretch' }}>
            <Box
              sx={{
                display: 'grid',
                gap: { xs: 2, desktop: 2.25 },
                gridTemplateColumns: { xs: '1fr', sm: '1.25fr 1fr' },
                gridTemplateRows: { xs: 'repeat(3, auto)', sm: 'repeat(2, minmax(0, 1fr))' },
                height: '100%',
              }}
            >
              <Box sx={{ gridRow: { sm: '1 / span 2' }, height: '100%' }}>
                <Box sx={{ height: '100%', '& > *': { height: '100%' } }}>
                  <CollageImageTile image={images.primary} minHeight={{ xs: 360, md: 454 }} />
                </Box>
              </Box>
              <CollageImageTile image={images.secondaryTop} minHeight={{ xs: 170, desktop: 216 }} />
              <CollageImageTile image={images.secondaryBottom} minHeight={{ xs: 170, desktop: 216 }} />
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

          <Box sx={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
            <Typography
              component="h2"
              sx={{
                ...websiteHeadingSx.h2,
                color: colors.navy,
                maxWidth: 560,
                mb: 1.25,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontFamily: publicFonts.body,
                fontSize: { xs: '16px', desktopLg: '18px' },
                color: colors.textSecondary,
                lineHeight: 1.5,
                maxWidth: 640,
              }}
            >
              {description}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))', desktop: '1fr', desktopMd: 'repeat(2, minmax(0, 1fr))' }, columnGap: 2.5, rowGap: { xs: 3, desktop: 5.5 }, mt: { xs: 4, desktop: 4.5 }, flexGrow: { desktop: 1 }, alignContent: { desktop: 'space-between' } }}>
              {impacts.map((item) => {
                const Icon = item.icon
                return (
                  <Box
                    key={item.title}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '80px minmax(0, 1fr)', desktopLg: '88px minmax(0, 1fr)' },
                      gap: 1.5,
                      alignItems: 'start',
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 80, desktopLg: 88 },
                        height: { xs: 80, desktopLg: 88 },
                        borderRadius: '50%',
                        bgcolor: '#EAF8EC',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Icon size={46} color={colors.greenDark} strokeWidth={1.8} aria-hidden="true" />
                    </Box>
                    <Box sx={{ minWidth: 0, pt: 0.25 }}>
                      <Typography
                        component="h3"
                        sx={{ color: colors.navy, fontFamily: publicFonts.heading, fontSize: { xs: '18px', desktopLg: '19px' }, fontWeight: 700, lineHeight: 1.35, mb: 0.75 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: '16px', desktopLg: '17px' }, lineHeight: 1.5 }}
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
