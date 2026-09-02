import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import type { Country } from '@/shared/types/visa'
import { getCountryHeroImageUrl } from '@/shared/services/visaService'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import {
  figureSx,
  accent,
  ink,
  paper,
  paperFont,
  paperMotion,
  paperRadius,
  paperShadow,
  type PaperGround,
} from '../theme/sitePaper'

/**
 * Destination card — boarding pass, with the numbers actually showing.
 *
 * Two things changed from `DestinationImageCard`, which this replaces on the homepage.
 *
 * FIRST, THE DATA IS ALWAYS VISIBLE. The old card was a 380px photograph under a dark
 * navy scrim that showed only the country name; processing time, visa category and price
 * appeared on hover. That is a defect twice over. On touch there is no hover, so on every
 * phone the figures were simply unreachable — and the section's own lead promises "real
 * fees and real processing times per destination", which the card then hid. On a page
 * whose job is to earn trust, concealing the price is precisely the wrong instinct: it is
 * what the sites this company competes against do.
 *
 * SECOND, IT FOLLOWS THE LOCKED MOTIF. The V2 spec fixes a boarding-pass construction for
 * the country card — an upper stub (photo, flag, destination), a die-cut perforation seam,
 * and a lower stub carrying a mono data readout. The listing page already builds that;
 * the homepage was using a different card entirely, so the same destination looked like
 * two different products one click apart. This is the same motif on the Paper surface.
 *
 * The photograph is a place, not a person. Stock imagery of people the company has never
 * met reads as fraudulent on a visa site; a photograph of the destination is simply what
 * the destination looks like.
 */
export function PaperDestinationCard({
  country,
  /** Ground the card sits on — the perforation notches are punched in this colour. */
  ground = 'base',
}: {
  country: Country
  ground?: PaperGround
}) {
  const imageUrl = getCountryHeroImageUrl(country, 480)
  const [imageFailed, setImageFailed] = useState(!imageUrl)
  const showFallback = imageFailed || !imageUrl

  const visaLabel = country.portalProcessingLabel ?? country.visaCategory
  const groundColor = paper[ground]

  return (
    <Box
      component={Link}
      to={`/countries/${country.id}`}
      className="gl-destination-card"
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
        backgroundColor: paper.white,
        border: `1px solid ${paper.hairline}`,
        borderRadius: paperRadius.card,
        transition: [
          `border-color ${paperMotion.hoverMs}ms ease`,
          `box-shadow ${paperMotion.hoverMs}ms ease`,
          `transform ${paperMotion.hoverMs}ms ${paperMotion.easeOut}`,
        ].join(', '),

        '&:focus-visible': { outline: `2px solid ${ink.strong}`, outlineOffset: 2 },

        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            transform: 'translateY(-3px)',
            borderColor: accent.border,
            boxShadow: paperShadow.lift,
          },
          '&:hover .gl-destination-photo': { transform: 'scale(1.04)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: `border-color ${paperMotion.hoverMs}ms linear`,
          '&:hover': { transform: 'none' },
          '&:hover .gl-destination-photo': { transform: 'none' },
        },
      }}
    >
      {/* Upper stub */}
      <Box sx={{ p: 1.5, pb: 0 }}>
        <Box
          sx={{
            position: 'relative',
            height: { xs: 108, lg: 124 },
            borderRadius: paperRadius.control,
            overflow: 'hidden',
            backgroundColor: paper.canvas,
          }}
        >
          {showFallback ? (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: paper.deep,
              }}
            >
              <CountryFlagVisual flag={country.flags} countryCode={country.code} size={44} />
            </Box>
          ) : (
            <Box
              component="img"
              className="gl-destination-photo"
              src={imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              sx={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: `transform 380ms ${paperMotion.easeOut}`,
              }}
            />
          )}
        </Box>
      </Box>

      <Box sx={{ px: 2, pt: 1.75, pb: 2, flex: 1, display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
        <Box
          aria-hidden
          sx={{
            flex: '0 0 auto',
            width: 26,
            height: 26,
            mt: '1px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `1px solid ${paper.hairline}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CountryFlagVisual flag={country.flags} countryCode={country.code} size={26} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h3"
            sx={{
              m: 0,
              fontFamily: paperFont.display,
              fontSize: { xs: 16, lg: 17.5 },
              fontWeight: 700,
              letterSpacing: '-0.015em',
              lineHeight: 1.2,
              color: ink.strong,
            }}
          >
            {country.name}
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontFamily: paperFont.body,
              fontSize: 12.5,
              lineHeight: 1.3,
              color: ink.faint,
            }}
          >
            {visaLabel}
          </Typography>
        </Box>
      </Box>

      {/* Perforation seam. The notches are filled with the section ground rather than
          white, so the card genuinely reads as die-cut instead of as a card with two
          dots on it — which means the card has to be told what it is sitting on. */}
      <Box aria-hidden sx={{ position: 'relative', height: 0, borderTop: `2px dashed ${paper.hairline}` }}>
        {(['left', 'right'] as const).map((side) => (
          <Box
            key={side}
            sx={{
              position: 'absolute',
              top: 0,
              [side]: 0,
              width: 13,
              height: 13,
              transform: `translate(${side === 'left' ? '-50%' : '50%'}, -50%)`,
              borderRadius: '50%',
              backgroundColor: groundColor,
            }}
          />
        ))}
      </Box>

      {/* Lower stub — the readout. Mono and tabular so the figures line up down a column. */}
      <Box sx={{ px: 2, py: 1.75, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <StubLabel>Processing</StubLabel>
          <Typography sx={{ ...figureSx, fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
            {country.processingTime}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'right', minWidth: 0 }}>
          <StubLabel>From</StubLabel>
          <Typography
            sx={{ ...figureSx, fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: accent.ink }}
          >
            &#8377;{country.price.toLocaleString('en-IN')}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

function StubLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="span"
      sx={{
        display: 'block',
        mb: 0.375,
        fontFamily: paperFont.body,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1,
        color: ink.faint,
      }}
    >
      {children}
    </Typography>
  )
}
