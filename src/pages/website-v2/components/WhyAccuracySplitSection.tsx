import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import type { LucideIcon } from 'lucide-react'
import { PublicContainer } from './PublicContainer'
import { publicFonts, usePublicBrandColors } from '../theme/publicSiteTokens'
import { websiteHeadingSx } from '../theme/websiteComponentStyles'
import { websiteDesignSystem as ds } from '../theme/websiteDesignSystem'
import { featureSectionPy } from '../pages/LandingPage/landingPageSpacing'

interface AccuracyImage {
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
  image: AccuracyImage
  impacts: readonly ImpactPoint[]
}

export function WhyAccuracySplitSection({
  id,
  title,
  description,
  image,
  impacts,
}: WhyAccuracySplitSectionProps) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState(image.src)

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
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 360, sm: 440, desktop: 'auto' },
              minHeight: { desktop: 454 },
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={imgSrc}
              alt={image.alt}
              loading="lazy"
              onError={() => { if (imgSrc !== image.fallback) setImgSrc(image.fallback) }}
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
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

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))', desktop: '1fr', desktopMd: 'repeat(2, minmax(0, 1fr))' }, gap: 2, gridAutoRows: '1fr', mt: { xs: 4, desktop: 4.5 }, flexGrow: { desktop: 1 } }}>
              {impacts.map((item) => {
                const Icon = item.icon
                return (
                  <Box
                    key={item.title}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '80px minmax(0, 1fr)', desktopLg: '88px minmax(0, 1fr)' },
                      gap: 1.5,
                      alignItems: 'center',
                      minWidth: 0,
                      p: { xs: 2, desktopMd: 2.25 },
                      bgcolor: colors.white,
                      border: `1px solid ${colors.border}`,
                      borderRadius: `${ds.component.card.benefit.radius}px`,
                      boxShadow: '0 6px 20px rgba(15, 35, 55, 0.055)',
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
                    <Box sx={{ minWidth: 0 }}>
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
