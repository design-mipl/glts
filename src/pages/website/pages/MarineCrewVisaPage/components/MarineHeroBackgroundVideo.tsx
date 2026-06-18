import { useEffect, useRef, useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { marineHeroBackgroundVideo } from '../../../assets/marineHeroVideo'

export function MarineHeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [posterSrc, setPosterSrc] = useState<string>(marineHeroBackgroundVideo.poster.src)
  const [videoReady, setVideoReady] = useState(false)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const video = videoRef.current
    if (!video || prefersReducedMotion) return

    const play = async () => {
      try {
        await video.play()
        setVideoReady(true)
      } catch {
        setVideoReady(false)
      }
    }

    void play()
  }, [prefersReducedMotion])

  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Box
        component="img"
        src={posterSrc}
        alt=""
        onError={() => setPosterSrc(marineHeroBackgroundVideo.poster.fallback)}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 42%',
          opacity: videoReady ? 0 : 1,
          transition: 'opacity 0.8s ease',
        }}
      />

      {!prefersReducedMotion && (
        <Box
          component="video"
          ref={videoRef}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 42%',
            opacity: videoReady ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          <source src={marineHeroBackgroundVideo.src} type="video/mp4" />
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            105deg,
            rgba(0, 31, 63, 0.94) 0%,
            rgba(0, 31, 63, 0.82) 36%,
            rgba(0, 31, 63, 0.45) 58%,
            rgba(0, 31, 63, 0.62) 100%
          )`,
        }}
      />
    </Box>
  )
}
