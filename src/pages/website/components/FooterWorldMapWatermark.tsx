import { Box } from '@mui/material'
import footerWorldMapSrc from '../assets/footerWorldMap.svg'

/**
 * Full-width world map silhouette watermark for the public footer.
 * Source: Natural Earth 50m land (public domain), equirectangular projection.
 */
export function FooterWorldMapWatermark() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        src={footerWorldMapSrc}
        alt=""
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          opacity: { xs: 0.2, sm: 0.24, md: 0.26 },
          filter: 'brightness(0) invert(1)',
        }}
      />
    </Box>
  )
}
