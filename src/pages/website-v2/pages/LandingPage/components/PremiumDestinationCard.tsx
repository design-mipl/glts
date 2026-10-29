import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { ArrowRight, Clock3, FileCheck2 } from 'lucide-react'
import type { Country } from '@/shared/types/visa'
import { getCountryHeroImageUrl } from '@/shared/services/visaService'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'

interface PremiumDestinationCardProps {
  country: Country
}

export function PremiumDestinationCard({ country }: PremiumDestinationCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = getCountryHeroImageUrl(country, 1000)
  const visaCategory = country.portalProcessingLabel ?? country.visaCategory

  return (
    <Box
      component="a"
      href={`/countries/${country.id}`}
      aria-label={`View visa requirements for ${country.name}`}
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: { xs: 380, sm: 400, lg: 360, xl: 380 },
        overflow: 'hidden',
        borderRadius: `${ds.radius.large}px`,
        bgcolor: ds.color.navy,
        color: ds.color.white,
        textDecoration: 'none',
        boxShadow: '0 14px 32px rgba(8, 24, 42, 0.16)',
        isolation: 'isolate',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
        '&:hover, &:focus-within': {
          transform: 'translateY(-5px)',
          boxShadow: '0 22px 48px rgba(8, 24, 42, 0.23)',
          '& .premium-destination-photo': { transform: 'scale(1.04)' },
          '& .premium-destination-reveal': { gridTemplateRows: '1fr' },
          '& .premium-destination-glass': { height: '72%' },
          '& .premium-destination-cta': {
            boxShadow: `0 0 20px ${ds.color.brand}B3, 0 8px 22px ${ds.color.brand}73`,
          },
        },
        '&:focus-visible': {
          outline: `3px solid ${ds.color.focus}`,
          outlineOffset: 4,
        },
        '@media (hover: none), (pointer: coarse), (max-width: 599.95px)': {
          '& .premium-destination-reveal': { gridTemplateRows: '1fr' },
          '& .premium-destination-glass': { height: '72%' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '& .premium-destination-photo, & .premium-destination-reveal, & .premium-destination-glass, & .premium-destination-cta': { transition: 'none' },
          '&:hover, &:focus-within': {
            transform: 'none',
            '& .premium-destination-photo': { transform: 'none' },
          },
        },
      }}
    >
      {imageUrl && !imageFailed ? (
        <Box
          component="img"
          className="premium-destination-photo"
          src={imageUrl}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      ) : (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(145deg, ${ds.color.teal}, ${ds.color.navy})`,
          }}
        />
      )}

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(3, 13, 27, 0.02) 28%, rgba(3, 13, 27, 0.12) 52%, rgba(3, 13, 27, 0.46) 100%)',
          pointerEvents: 'none',
        }}
      />

      <Box
        aria-hidden="true"
        className="premium-destination-glass"
        sx={{
          position: 'absolute',
          zIndex: 1,
          left: 0,
          right: 0,
          bottom: 0,
          height: '42%',
          bgcolor: 'rgba(3, 19, 39, 0.58)',
          backdropFilter: 'blur(10px) brightness(0.6)',
          WebkitBackdropFilter: 'blur(10px) brightness(0.6)',
          maskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent 100%)',
          transition: 'height 400ms ease',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          zIndex: 2,
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '100%',
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1.25, sm: 1.5 }, minWidth: 0, mb: { xs: 1.75, sm: 2.75 } }}>
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              flex: '0 0 auto',
              width: { xs: 34, sm: 38, lg: 36 },
              height: { xs: 34, sm: 38, lg: 36 },
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 3px 12px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
          >
            <CountryFlagVisual flag={country.flags} countryCode={country.code} size={32} />
          </Box>
          <Typography
            component="h3"
            title={country.name}
            sx={{
              minWidth: 0,
              color: ds.color.white,
              fontFamily: ds.font,
              fontSize: { xs: 'clamp(11px, 3vw, 18px)', sm: 20, lg: 18 },
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.75)',
            }}
          >
            {country.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, rowGap: { xs: 1.25, sm: 1.5 }, columnGap: { xs: 0.75, sm: 1, lg: 0.75 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, lg: 0.5 }, minWidth: 0 }}>
            <Clock3 size={16} color="rgba(255, 255, 255, 0.86)" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
            <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.35 }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.76)', fontSize: 12, lineHeight: 1.3 }}>
                Processing time
              </Typography>
              <Typography sx={{ color: ds.color.white, fontSize: { xs: 12, sm: 14, lg: 13 }, fontWeight: 700, lineHeight: 1.35 }}>
                {country.processingTime}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, lg: 0.5 }, minWidth: 0, justifySelf: { xs: 'start', sm: 'end' } }}>
            <FileCheck2 size={16} color="rgba(255, 255, 255, 0.86)" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
            <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.35 }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.76)', fontSize: 12, lineHeight: 1.3 }}>
                Visa category
              </Typography>
              <Typography sx={{ color: ds.color.white, fontSize: { xs: 12, sm: 14, lg: 13 }, fontWeight: 700, lineHeight: 1.35 }}>
                {visaCategory}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          className="premium-destination-reveal"
          sx={{
            display: 'grid',
            gridTemplateRows: '0fr',
            transition: 'grid-template-rows 400ms ease',
          }}
        >
          <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 1,
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                mt: 1.5,
                pt: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.78)', fontSize: { xs: 10, xl: 11 }, lineHeight: 1.3 }}>
                  Visa price
                </Typography>
                <Typography sx={{ color: ds.color.white, fontSize: 14, fontWeight: 700, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
                  From ₹{country.price.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box
                component="span"
                className="premium-destination-cta"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  width: '100%',
                  minHeight: 44,
                  px: 1,
                  boxSizing: 'border-box',
                  borderRadius: `${ds.radius.medium}px`,
                  bgcolor: ds.color.brand,
                  color: ds.color.navy,
                  fontSize: { xs: 11, sm: 13 },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  textAlign: 'center',
                  boxShadow: `0 4px 14px ${ds.color.brand}70`,
                  transition: 'box-shadow 200ms ease',
                }}
              >
                View Visa Requirements <ArrowRight size={12} aria-hidden="true" style={{ flexShrink: 0 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
