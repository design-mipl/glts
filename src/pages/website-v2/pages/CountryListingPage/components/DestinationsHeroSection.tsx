import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { destinationsHeroImage } from '../../../assets/destinationsHeroImage'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { applyFlow, accentGoldRgb } from '../../../theme/applyFlowTheme'

interface DestinationsHeroSectionProps {
  destinationCount: number
}

export function DestinationsHeroSection({ destinationCount }: DestinationsHeroSectionProps) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState<string>(destinationsHeroImage.src)
  const [displayCount, setDisplayCount] = useState(0)
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current

  useEffect(() => {
    if (prefersReducedMotion || destinationCount === 0) {
      setDisplayCount(destinationCount)
      return
    }
    let raf = 0
    const duration = 900
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplayCount(Math.round(eased * destinationCount))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [destinationCount, prefersReducedMotion])

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
          component="p"
          sx={{
            fontFamily: publicFonts.mono,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: applyFlow.accentInk,
            mb: 1,
          }}
        >
          DESTINATIONS INDEX
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: publicFonts.display,
            fontVariantNumeric: 'tabular-nums',
            fontSize: { xs: '36px', sm: '42px', md: '48px', lg: '54px' },
            fontWeight: 800,
            color: colors.navy,
            lineHeight: 1.08,
            mb: 2,
          }}
        >
          {displayCount} destinations
        </Typography>
        <Typography
          component="p"
          sx={{
            fontFamily: publicFonts.mono,
            fontSize: { xs: '11px', md: '12px' },
            fontWeight: 600,
            color: colors.textSecondary,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Box
            aria-hidden
            component="span"
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: applyFlow.accentInk,
              boxShadow: `0 0 0 2px rgba(${accentGoldRgb}, 0.24)`,
              flexShrink: 0,
              '@media (prefers-reduced-motion: no-preference)': {
                animation: 'glts-hero-pulse 2.4s ease-in-out infinite',
              },
              '@keyframes glts-hero-pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.4 },
              },
            }}
          />
          Sorted by your nationality · Indian passport · Travel from Mar 2026
        </Typography>
      </PublicContainer>
    </Box>
  )
}
