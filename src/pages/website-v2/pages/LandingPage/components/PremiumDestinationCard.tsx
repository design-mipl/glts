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
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: { xs: 480, sm: 440, lg: 460 },
        overflow: 'hidden',
        borderRadius: `${ds.radius.large}px`,
        bgcolor: ds.color.navy,
        color: ds.color.white,
        textDecoration: 'none',
        boxShadow: '0 14px 32px rgba(8, 24, 42, 0.16)',
        isolation: 'isolate',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
        '&:hover, &:focus-visible': {
          transform: 'translateY(-5px)',
          boxShadow: '0 22px 48px rgba(8, 24, 42, 0.23)',
          '& .premium-destination-photo': { transform: 'scale(1.04)' },
          '& .premium-destination-reveal': { gridTemplateRows: '1fr' },
        },
        '&:focus-visible': {
          outline: `3px solid ${ds.color.focus}`,
          outlineOffset: 4,
        },
        '@media (hover: none)': {
          '& .premium-destination-reveal': { gridTemplateRows: '1fr' },
        },
        '@media (pointer: coarse)': {
          '& .premium-destination-reveal': { gridTemplateRows: '1fr' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '& .premium-destination-photo, & .premium-destination-reveal': { transition: 'none' },
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
        sx={{
          position: 'absolute',
          zIndex: 1,
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '100%',
          overflowY: 'auto',
          p: { xs: 2, lg: 1.5 },
          border: '1px solid rgba(255, 255, 255, 0.26)',
          borderRadius: `${ds.radius.medium}px ${ds.radius.medium}px ${ds.radius.large}px ${ds.radius.large}px`,
          background: 'linear-gradient(135deg, rgba(11, 25, 39, 0.82), rgba(8, 19, 31, 0.72))',
          backdropFilter: 'blur(18px) saturate(135%)',
          WebkitBackdropFilter: 'blur(18px) saturate(135%)',
          boxShadow: '0 -8px 28px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, lg: 1 }, minWidth: 0, mb: 3 }}>
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              flex: '0 0 auto',
              width: { xs: 42, sm: 38, lg: 36 },
              height: { xs: 42, sm: 38, lg: 36 },
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
            sx={{
              minWidth: 0,
              color: ds.color.white,
              fontFamily: ds.font,
              fontSize: { xs: 26, sm: 22, lg: 20 },
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.35)',
            }}
          >
            {country.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: { xs: 1, lg: 0.75 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, lg: 0.5 }, minWidth: 0 }}>
            <Clock3 size={16} color="rgba(255, 255, 255, 0.86)" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.76)', fontSize: 11, lineHeight: 1.3 }}>
                Processing time
              </Typography>
              <Typography sx={{ color: ds.color.white, fontSize: { xs: 14, lg: 13 }, fontWeight: 700, lineHeight: 1.35 }}>
                {country.processingTime}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1, lg: 0.5 }, minWidth: 0 }}>
            <FileCheck2 size={16} color="rgba(255, 255, 255, 0.86)" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.76)', fontSize: 11, lineHeight: 1.3 }}>
                Visa category
              </Typography>
              <Typography sx={{ color: ds.color.white, fontSize: { xs: 14, lg: 13 }, fontWeight: 700, lineHeight: 1.35 }}>
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
            transition: 'grid-template-rows 300ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                alignItems: 'center',
                gap: { xs: 1, lg: 0.5 },
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                mt: 2,
                pt: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.78)', fontSize: { xs: 10, xl: 11 }, lineHeight: 1.3 }}>
                  Ticket price
                </Typography>
                <Typography sx={{ color: '#F5D77B', fontSize: { xs: 14, lg: 12, xl: 14 }, fontWeight: 700, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
                  From ₹{country.price.toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 0.5, lg: 0.25 },
                  width: { xs: 128, lg: 116, xl: 148 },
                  minHeight: { xs: 42, xl: 38 },
                  px: { xs: 1, lg: 0.5, xl: 1 },
                  boxSizing: 'border-box',
                  borderRadius: `${ds.radius.medium}px`,
                  bgcolor: ds.color.brand,
                  color: ds.color.navy,
                  fontSize: { xs: 11, lg: 10.5, xl: 11 },
                  fontWeight: 700,
                  lineHeight: 1.15,
                  textAlign: 'center',
                }}
              >
                View Requirements <ArrowRight size={12} aria-hidden="true" style={{ flexShrink: 0 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
