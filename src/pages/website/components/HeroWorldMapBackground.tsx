import { Box } from '@mui/material'
import footerWorldMapSrc from '../assets/footerWorldMap.svg'
import { brandPrimaryGreenRgb } from '@/shared/theme/publicBrand'

/**
 * Centered, full-bleed world map background for the landing page hero.
 * Reuses the same Natural Earth silhouette as the public footer.
 */
export function HeroWorldMapBackground() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={footerWorldMapSrc}
        alt=""
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          opacity: { xs: 0.04, md: 0.05 },
          filter:
            'brightness(0) saturate(100%) sepia(1) hue-rotate(72deg) saturate(2.4) brightness(0.95)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            180deg,
            rgba(${brandPrimaryGreenRgb}, 0.18) 0%,
            rgba(${brandPrimaryGreenRgb}, 0.08) 28%,
            transparent 72%
          )`,
        }}
      />
    </Box>
  )
}
