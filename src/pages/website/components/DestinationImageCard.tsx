import { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import type { Country } from '@/shared/types/visa'
import { getCountryHeroImageUrl } from '@/shared/services/visaService'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import { publicFonts, usePublicBrandColors } from '../theme/publicSiteTokens'

/** Fixed destination card dimensions — shared across homepage and listing grids. */
export const DESTINATION_CARD_HEIGHT = 300
export const DESTINATION_CARD_BORDER_RADIUS = '16px'
export const DESTINATION_CARD_CONTENT_PADDING = 2
export const DESTINATION_FLAG_BADGE_SIZE = 36
export const DESTINATION_FLAG_BADGE_MARGIN = 12

const TRANSITION_MS = '380ms'
const TRANSITION_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

const GRADIENT_DEFAULT =
  'linear-gradient(to top, rgba(0, 20, 40, 0.9) 0%, rgba(0, 20, 40, 0.55) 42%, rgba(0, 20, 40, 0.12) 72%, transparent 100%)'
const GRADIENT_HOVER =
  'linear-gradient(to top, rgba(0, 20, 40, 0.94) 0%, rgba(0, 20, 40, 0.62) 45%, rgba(0, 20, 40, 0.16) 75%, transparent 100%)'
const GRADIENT_COMPACT =
  'linear-gradient(to top, rgba(0, 20, 40, 0.88) 0%, rgba(0, 20, 40, 0.45) 38%, transparent 72%)'

function formatEtaLabel(processingTime: string): string {
  const trimmed = processingTime.trim()
  if (!trimmed) return 'ETA: —'
  const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
  return `ETA: ${normalized}`
}

interface DestinationImageCardProps {
  country: Country
  href?: string
  imageWidth?: number
  /** Homepage: show name + cities only; reveal ETA, price, and CTA on hover. */
  revealDetailsOnHover?: boolean
}

export function DestinationImageCard({
  country,
  href,
  imageWidth = 480,
  revealDetailsOnHover = false,
}: DestinationImageCardProps) {
  const colors = usePublicBrandColors()
  const [imgError, setImgError] = useState(false)
  const link = href ?? `/countries/${country.id}`

  return (
    <Box
      component="a"
      href={link}
      className="destination-card-root"
      sx={{
        display: 'block',
        position: 'relative',
        width: '100%',
        height: DESTINATION_CARD_HEIGHT,
        borderRadius: DESTINATION_CARD_BORDER_RADIUS,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        bgcolor: colors.surfaceAlt,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.08)',
        transition: `transform ${TRANSITION_MS} ${TRANSITION_EASE}, box-shadow ${TRANSITION_MS} ease`,
        boxSizing: 'border-box',
        '@media (hover: hover)': {
          '&:hover': {
            transform: revealDetailsOnHover ? 'none' : 'translateY(-4px)',
            boxShadow: revealDetailsOnHover
              ? '0 10px 28px rgba(15, 23, 42, 0.14)'
              : '0 14px 32px rgba(15, 23, 42, 0.16)',
            zIndex: 2,
            '& .destination-card-image': {
              transform: 'scale(1.05)',
            },
            '& .destination-card-gradient': {
              background: GRADIENT_HOVER,
            },
            ...(revealDetailsOnHover && {
              '& .destination-card-details-panel': {
                gridTemplateRows: '1fr',
              },
            }),
          },
        },
      }}
    >
      {imgError ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(145deg, ${colors.navyLight} 0%, ${colors.navy} 100%)`,
          }}
        />
      ) : (
        <Box
          component="img"
          className="destination-card-image"
          src={getCountryHeroImageUrl(country, imageWidth)}
          alt={country.name}
          loading="lazy"
          onError={() => setImgError(true)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: `transform ${TRANSITION_MS} ${TRANSITION_EASE}`,
            willChange: 'transform',
          }}
        />
      )}

      <Box
        className="destination-card-gradient"
        sx={{
          position: 'absolute',
          inset: 0,
          background: revealDetailsOnHover ? GRADIENT_COMPACT : GRADIENT_DEFAULT,
          transition: `background ${TRANSITION_MS} ease`,
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: DESTINATION_FLAG_BADGE_MARGIN,
          right: DESTINATION_FLAG_BADGE_MARGIN,
          width: DESTINATION_FLAG_BADGE_SIZE,
          height: DESTINATION_FLAG_BADGE_SIZE,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 2,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35))',
        }}
      >
        <CountryFlagVisual
          flag={country.flags}
          countryCode={country.code}
          size={DESTINATION_FLAG_BADGE_SIZE}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          p: DESTINATION_CARD_CONTENT_PADDING,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: '18px',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
            lineHeight: 1.2,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {country.name}
        </Typography>

        {country.cities ? (
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.72)',
              textShadow: '0 1px 6px rgba(0, 0, 0, 0.45)',
              lineHeight: 1.35,
              mb: revealDetailsOnHover ? 0 : 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: revealDetailsOnHover ? undefined : '2.7em',
            }}
          >
            {country.cities}
          </Typography>
        ) : (
          !revealDetailsOnHover && <Box sx={{ minHeight: '2.7em', mb: 1.25 }} />
        )}

        <Box
          className="destination-card-details-panel"
          sx={{
            display: 'grid',
            gridTemplateRows: revealDetailsOnHover ? '0fr' : '1fr',
            transition: `grid-template-rows ${TRANSITION_MS} ${TRANSITION_EASE}`,
          }}
        >
          <Box sx={{ overflow: 'hidden' }}>
            <Stack spacing={0.25} sx={{ pt: 1.25, mb: 1 }}>
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.82)',
                  textShadow: '0 1px 6px rgba(0, 0, 0, 0.45)',
                  lineHeight: 1.3,
                }}
              >
                {formatEtaLabel(country.processingTime)}
              </Typography>
              <Typography
                sx={{
                  fontFamily: publicFonts.heading,
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#fff',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
                  lineHeight: 1.25,
                }}
              >
                From: ₹{country.price.toLocaleString('en-IN')}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.35}
              sx={{ color: '#fff', textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)' }}
            >
              <Typography sx={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.2 }}>
                View Requirements
              </Typography>
              <ArrowRight size={14} strokeWidth={2.5} />
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
