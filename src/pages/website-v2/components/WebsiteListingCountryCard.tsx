import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { BaseCard } from '@/design-system/UIComponents'
import type { Country } from '@/shared/types/visa'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import { getCountryHeroImageUrl } from '@/shared/services/visaService'
import { formatEtaShort } from '@/shared/utils/countryDisplay'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

interface WebsiteListingCountryCardProps {
  country: Country
  href?: string
}

/** Card horizontal padding — also used to bleed the perforation seam edge-to-edge. */
const CARD_PADDING_X = { xs: 1.75, md: 2 }
const NOTCH_SIZE = 18

/**
 * Boarding-pass / ticket-stub card: photo + destination "stub" on top, a die-cut
 * perforation seam, then a mono data readout "stub" below — evokes a travel
 * document without leaning on generic SaaS card chrome.
 */
export function WebsiteListingCountryCard({ country, href }: WebsiteListingCountryCardProps) {
  const colors = usePublicBrandColors()
  const imageUrl = getCountryHeroImageUrl(country)
  const [imgError, setImgError] = useState(!imageUrl)
  const link = href ?? `/countries/${country.id}`
  const processingTime = formatEtaShort(country.processingTime)
  const visaLabel = country.portalProcessingLabel ?? country.visaCategory
  const showFallback = imgError || !imageUrl

  return (
    <Box
      component={RouterLink}
      to={link}
      sx={{
        display: 'block',
        height: '100%',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: '18px',
        '&:focus-visible': {
          outline: `2px solid ${colors.teal}`,
          outlineOffset: '3px',
        },
      }}
    >
      <BaseCard
        hoverable
        sx={{
          p: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '18px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          bgcolor: colors.white,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            borderColor: colors.teal,
            boxShadow: `0 10px 28px rgba(12, 108, 121, 0.14)`,
            transform: 'translateY(-3px)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'none' },
          },
          '@media (prefers-reduced-motion: no-preference)': {
            '&:hover .country-card-image': { transform: 'scale(1.045)' },
          },
        }}
      >
        {/* Accent bar — reveals on hover, teal ownership for discovery surfaces */}
        <Box
          aria-hidden
          sx={{
            height: '3px',
            bgcolor: colors.teal,
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
            transition: 'transform 0.25s ease',
            '.MuiCard-root:hover &': { transform: 'scaleX(1)' },
          }}
        />

        {/* Upper stub — photo + destination */}
        <Box sx={{ px: CARD_PADDING_X, pt: CARD_PADDING_X, pb: 1.5 }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              sx={{
                height: { xs: 124, md: 128 },
                borderRadius: '12px',
                overflow: 'hidden',
                bgcolor: colors.surfaceAlt,
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
                    background: `linear-gradient(145deg, ${colors.navyLight} 0%, ${colors.navy} 100%)`,
                  }}
                >
                  <CountryFlagVisual flag={country.flags} countryCode={country.code} size={48} />
                </Box>
              ) : (
                <Box
                  component="img"
                  className="country-card-image"
                  src={imageUrl}
                  alt={country.name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.35s ease',
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: -18,
                right: 14,
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: colors.white,
                border: `2px solid ${colors.white}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.14)',
                zIndex: 1,
                overflow: 'hidden',
              }}
            >
              <CountryFlagVisual flag={country.flags} countryCode={country.code} size={32} />
            </Box>
          </Box>

          <Box sx={{ px: 0.5 }}>
            <Typography
              sx={{
                fontFamily: publicFonts.mono,
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: colors.textMuted,
                mb: 0.5,
              }}
            >
              DESTINATION
            </Typography>
            <Typography
              sx={{
                fontFamily: publicFonts.display,
                fontSize: { xs: '19px', md: '20px' },
                fontWeight: 800,
                color: colors.navy,
                lineHeight: 1.2,
              }}
            >
              {country.name}
            </Typography>
          </Box>
        </Box>

        {/* Perforation seam — die-cut illusion, bleeds to the card's true edge */}
        <Box
          aria-hidden
          sx={{
            position: 'relative',
            mx: { xs: -CARD_PADDING_X.xs, md: -CARD_PADDING_X.md },
            height: 0,
            borderTop: `2px dashed ${colors.border}`,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -NOTCH_SIZE / 2,
              left: -NOTCH_SIZE / 2,
              width: NOTCH_SIZE,
              height: NOTCH_SIZE,
              borderRadius: '50%',
              bgcolor: colors.surfaceAlt,
              border: `1px solid ${colors.border}`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: -NOTCH_SIZE / 2,
              right: -NOTCH_SIZE / 2,
              width: NOTCH_SIZE,
              height: NOTCH_SIZE,
              borderRadius: '50%',
              bgcolor: colors.surfaceAlt,
              border: `1px solid ${colors.border}`,
            }}
          />
        </Box>

        {/* Lower stub — mono data readout */}
        <Box sx={{ px: CARD_PADDING_X, pt: 2, pb: CARD_PADDING_X, flex: 1 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.25,
              px: 0.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: colors.textMuted,
                  letterSpacing: '0.08em',
                  mb: 0.375,
                }}
              >
                PROCESSING TIME
              </Typography>
              <Typography
                sx={{
                  fontFamily: publicFonts.mono,
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: colors.navy,
                }}
              >
                {processingTime}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: colors.textMuted,
                  letterSpacing: '0.08em',
                  mb: 0.375,
                }}
              >
                FROM
              </Typography>
              <Typography
                sx={{
                  fontFamily: publicFonts.mono,
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: colors.navy,
                }}
              >
                ₹{country.price.toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: '11px',
              color: colors.textMuted,
              mt: 1.5,
              px: 0.5,
              lineHeight: 1.4,
            }}
          >
            Visa category: {visaLabel}
          </Typography>
        </Box>
      </BaseCard>
    </Box>
  )
}
