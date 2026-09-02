import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { siteRadius, clippedCorner } from '@/pages/website/theme/siteTheme'
import { useSiteTone } from '../../../components/siteTone'
import { landingHeroTravelImage } from '../../../assets/landingPageImages'
import { HeroClearanceCard, HeroLiveCard, HERO_CLEARANCES } from './HeroProofStack'

/**
 * Hero visual — the photograph, with the proof cards floating off its edges.
 *
 * The homepage had no imagery above the fold at all: an earlier pass removed the hero
 * photograph as a "generic SaaS" tell, and the measured result was a page carrying 0.31%
 * saturated colour across its whole area. The objection to the old hero was never the
 * photograph itself — it was a *full-bleed* image with six stacked scrim gradients that
 * every foreground element then had to fight for contrast.
 *
 * So the picture comes back contained: a bordered panel with the travel-document corner
 * cut, sitting in its own column. Nothing reads over it, so it needs no scrim, and the
 * headline and console keep a clean light ground to sit on.
 *
 * The cards overhang the panel's edges deliberately. An image with cards tucked neatly
 * inside it is one rectangle; an image the cards break out of is a composition, and the
 * overhang is what tells the eye the readouts belong to the product rather than to the
 * photograph.
 */

/** How far the cards break past the image edge. Kept small — the section clips overflow. */
const OVERHANG = 20

export function HeroVisual() {
  const t = useSiteTone()
  const [src, setSrc] = useState(landingHeroTravelImage.src)

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: { xs: 'none', md: 'block' },
        pr: `${OVERHANG}px`,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { md: 420, lg: 500 },
          height: { md: 420, lg: 500 },
          borderRadius: siteRadius.card,
          clipPath: clippedCorner(28),
          overflow: 'hidden',
          border: `1px solid ${t.hairline}`,
          backgroundColor: t.surfaceRaised,
        }}
      >
        <Box
          component="img"
          src={src}
          alt={landingHeroTravelImage.alt}
          onError={() => {
            if (src !== landingHeroTravelImage.fallback) setSrc(landingHeroTravelImage.fallback)
          }}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </Box>

      {/* Two clearance receipts, breaking out of the top-right corner. */}
      <Stack
        spacing={1.5}
        sx={{
          position: 'absolute',
          top: { md: 28, lg: 36 },
          right: 0,
          width: { md: 240, lg: 262 },
        }}
      >
        {HERO_CLEARANCES.map((item) => (
          <HeroClearanceCard key={item.name} item={item} floating />
        ))}
      </Stack>

      {/* The live desk readout, anchored to the opposite corner so the eye travels. */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { md: 24, lg: 32 },
          left: { md: -12, lg: -28 },
          width: { md: 236, lg: 258 },
        }}
      >
        <HeroLiveCard floating />
      </Box>
    </Box>
  )
}
