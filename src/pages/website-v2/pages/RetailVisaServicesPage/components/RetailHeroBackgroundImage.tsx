import { useState } from 'react'
import { Box, keyframes, useMediaQuery } from '@mui/material'
import { retailHeroImage } from '../../../assets/retailHeroImage'

const fadeZoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(1);
  }
  to {
    opacity: 1;
    transform: scale(1.03);
  }
`

interface RetailHeroBackgroundImageProps {
  parallaxOffsetY?: number
}

export function RetailHeroBackgroundImage({ parallaxOffsetY = 0 }: RetailHeroBackgroundImageProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [imgSrc, setImgSrc] = useState<string>(retailHeroImage.src)

  const imageTransform = prefersReducedMotion
    ? undefined
    : `translateY(${parallaxOffsetY * 0.35}px) scale(1.03)`

  return (
    <Box
      aria-hidden
      sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: '-3%',
          animation: prefersReducedMotion ? undefined : `${fadeZoomIn} 1.2s ease-out both`,
        }}
      >
        <Box
          component="img"
          src={imgSrc}
          alt=""
          loading="eager"
          fetchPriority="high"
          onError={() => setImgSrc(retailHeroImage.fallback)}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // Keep traveler on the right; bright sky on the left for copy
            objectPosition: { xs: '72% center', md: 'center center', lg: 'center 42%' },
            transform: imageTransform,
            transition: prefersReducedMotion ? undefined : 'transform 0.1s linear',
          }}
        />
      </Box>

      {/* Keep the full-width trust row legible over the bright airport image. */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: { xs: 'linear-gradient(90deg, rgba(0,31,63,.94) 0%, rgba(0,31,63,.86) 62%, rgba(0,31,63,.72) 100%)', desktop: `linear-gradient(
            105deg,
            rgba(0, 31, 63, 0.94) 0%,
            rgba(0, 31, 63, 0.82) 38%,
            rgba(0, 31, 63, 0.48) 62%,
            rgba(0, 31, 63, 0.62) 100%
          )` },
        }}
      />
    </Box>
  )
}
