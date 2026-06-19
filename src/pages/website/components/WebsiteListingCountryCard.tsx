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

export function WebsiteListingCountryCard({ country, href }: WebsiteListingCountryCardProps) {
  const colors = usePublicBrandColors()
  const [imgError, setImgError] = useState(false)
  const link = href ?? `/countries/${country.id}`
  const eta = formatEtaShort(country.processingTime)
  const visaLabel = country.portalProcessingLabel ?? country.visaCategory

  return (
    <Box
      component={RouterLink}
      to={link}
      sx={{
        display: 'block',
        height: '100%',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <BaseCard
        hoverable
        sx={{
          p: 1.5,
          height: '100%',
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          bgcolor: colors.white,
          transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
          '&:hover': {
            borderColor: colors.greenBright,
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.1)',
          },
        }}
      >
        <Box sx={{ position: 'relative', mb: 2.25 }}>
          <Box
            sx={{
              height: 112,
              borderRadius: '12px',
              overflow: 'hidden',
              bgcolor: colors.surfaceAlt,
            }}
          >
            {imgError ? (
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
                src={getCountryHeroImageUrl(country)}
                alt={country.name}
                loading="lazy"
                onError={() => setImgError(true)}
                sx={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: -16,
              right: 12,
              width: 34,
              height: 34,
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
            <CountryFlagVisual flag={country.flags} countryCode={country.code} size={30} />
          </Box>
        </Box>

        <Box sx={{ mb: 0.25, px: 0.25 }}>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: '17px',
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.2,
            }}
          >
            {country.name}
          </Typography>
          {country.cities ? (
            <Typography
              sx={{
                fontSize: '12px',
                color: colors.textSecondary,
                lineHeight: 1.35,
                mt: 0.25,
              }}
            >
              {country.cities}
            </Typography>
          ) : null}
        </Box>

        <Box
          sx={{
            mt: 1.25,
            pt: 1.25,
            borderTop: `1px dashed ${colors.border}`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            px: 0.25,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.06em',
                mb: 0.25,
              }}
            >
              ETA
            </Typography>
            <Typography sx={{ fontSize: '15px', fontWeight: 800, color: colors.navy }}>
              {eta}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.06em',
                mb: 0.25,
              }}
            >
              FROM
            </Typography>
            <Typography sx={{ fontSize: '15px', fontWeight: 800, color: colors.navy }}>
              ₹{country.price.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: '11px',
            color: colors.textMuted,
            mt: 1,
            px: 0.25,
          }}
        >
          {visaLabel} · Valid till {country.validity}
        </Typography>
      </BaseCard>
    </Box>
  )
}
