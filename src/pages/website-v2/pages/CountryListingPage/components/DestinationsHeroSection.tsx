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
        display: 'flex',
        alignItems: 'center',
        minHeight: { xs: 260, sm: 280, md: 300, lg: 320 },
        height: { xs: 260, sm: 280, md: 300, lg: 320 },
        boxSizing: 'border-box',
        py: { xs: 4, md: 5 },
      }}
    >
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {/* Taller-than-section image = zoom out so the traveler isn’t cropped mid-frame */}
        <Box
          component="img"
          src={imgSrc}
          alt=""
          loading="eager"
          fetchPriority="high"
          onError={() => setImgSrc(destinationsHeroImage.fallback)}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'block',
            width: '100%',
            height: { xs: '128%', sm: '132%', md: '138%' },
            objectFit: 'cover',
            // Bias toward the traveler on the right; keep lake + peaks in view
            objectPosition: { xs: '72% 52%', md: '70% 48%', lg: '68% 46%' },
          }}
        />

        {/* Left: solid white for copy. Center-right: pure scenery. Far right: soft white shade. */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.98) 0%,
                rgba(255, 255, 255, 0.95) 26%,
                rgba(255, 255, 255, 0.72) 42%,
                rgba(255, 255, 255, 0.22) 56%,
                rgba(255, 255, 255, 0) 66%,
                rgba(255, 255, 255, 0) 82%,
                rgba(255, 255, 255, 0.18) 94%,
                rgba(255, 255, 255, 0.32) 100%
              )
            `,
          }}
        />
      </Box>

      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Typography
          component="h1"
          sx={{
            fontFamily: publicFonts.display,
            fontSize: publicTypography.h2,
            fontWeight: 700,
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
