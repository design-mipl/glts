import { useState } from 'react'
import { Box, keyframes, useMediaQuery } from '@mui/material'
import { corporateHeroImage } from '../../../assets/corporateHeroImage'

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

interface CorporateHeroBackgroundImageProps {
  parallaxOffsetY?: number
}

export function CorporateHeroBackgroundImage({ parallaxOffsetY = 0 }: CorporateHeroBackgroundImageProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [imgSrc, setImgSrc] = useState<string>(corporateHeroImage.src)

  const imageTransform = prefersReducedMotion
    ? undefined
    : `translateY(${parallaxOffsetY * 0.35}px) scale(1.03)`

  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
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
          onError={() => setImgSrc(corporateHeroImage.fallback)}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            transform: imageTransform,
            transition: prefersReducedMotion ? undefined : 'transform 0.1s linear',
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            105deg,
            rgba(0, 31, 63, 0.92) 0%,
            rgba(0, 31, 63, 0.82) 38%,
            rgba(0, 31, 63, 0.48) 62%,
            rgba(0, 31, 63, 0.58) 100%
          )`,
        }}
      />
    </Box>
  )
}
