import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { destinationsHeroImage } from '../../../assets/destinationsHeroImage'
import { publicFonts, publicTypography, usePublicBrandColors } from '../../../theme/publicSiteTokens'

interface DestinationsHeroSectionProps {
  destinationCount: number
}

export function DestinationsHeroSection({ destinationCount }: DestinationsHeroSectionProps) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState<string>(destinationsHeroImage.src)

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: `1px solid ${colors.border}`,
        py: { xs: 6, md: 8 },
        minHeight: { xs: 240, md: 280 },
      }}
    >
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Box
          component="img"
          src={imgSrc}
          alt=""
          loading="eager"
          fetchPriority="high"
          onError={() => setImgSrc(destinationsHeroImage.fallback)}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: { xs: 'center 30%', md: '72% center' },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(
              105deg,
              rgba(255, 255, 255, 0.97) 0%,
              rgba(255, 255, 255, 0.92) 38%,
              rgba(255, 255, 255, 0.72) 58%,
              rgba(255, 255, 255, 0.38) 100%
            )`,
          }}
        />
      </Box>

      <PublicContainer sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          component="h1"
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: publicTypography.h2,
            fontWeight: 800,
            color: colors.navy,
            mb: 2,
          }}
        >
          {destinationCount} destinations
        </Typography>
        <Typography sx={{ fontSize: publicTypography.body, color: colors.textSecondary }}>
          Sorted by your nationality · Indian passport · Travel from Mar 2026
        </Typography>
      </PublicContainer>
    </Box>
  )
}
