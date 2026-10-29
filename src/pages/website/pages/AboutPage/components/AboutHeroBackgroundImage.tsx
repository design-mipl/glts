import { useState } from 'react'
import { Box, keyframes, useMediaQuery } from '@mui/material'
import { aboutHeroContent } from '../aboutPageData'

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

interface AboutHeroBackgroundImageProps {
  parallaxOffsetY?: number
}

export function AboutHeroBackgroundImage({ parallaxOffsetY = 0 }: AboutHeroBackgroundImageProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [imgSrc, setImgSrc] = useState<string>(aboutHeroContent.image.src)

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
          onError={() => setImgSrc(aboutHeroContent.image.fallback)}
          sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center right',
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
            rgba(0, 31, 63, 0.72) 0%,
            rgba(0, 31, 63, 0.42) 28%,
            rgba(0, 31, 63, 0.12) 48%,
            rgba(0, 31, 63, 0.08) 100%
          )`,
        }}
      />
    </Box>
  )
}
