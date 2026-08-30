import { Box, Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { GREENLIGHT_LOGO_SRC } from '@/components/brand/GreenlightLogo'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import { getCountryMasterById } from '@/shared/services/countryMasterService'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PublicContainer } from './PublicContainer'

const HEADER_HEIGHT = 64

/**
 * Minimal apply chrome — logo left, destination context right.
 * No marketing nav links (Destinations / Marine / etc.).
 */
export function WebsiteApplyHeader() {
  const colors = usePublicBrandColors()
  const [searchParams] = useSearchParams()
  const countryId = searchParams.get('country')?.trim() ?? ''
  const country = countryId ? getCountryMasterById(countryId) : undefined

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        height: HEADER_HEIGHT,
        borderBottom: `1px solid ${colors.border}`,
        bgcolor: colors.white,
      }}
    >
      <PublicContainer
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box
          component="a"
          href="/"
          sx={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
        >
          <Box component="img" src={GREENLIGHT_LOGO_SRC} alt="Greenlight" sx={{ height: 36 }} />
        </Box>

        {country ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: colors.surfaceAlt,
                flexShrink: 0,
              }}
            >
              <CountryFlagVisual flag={country.flag} countryCode={country.code} size={32} />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: 14, sm: 15 },
                color: colors.navy,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {country.name}
            </Typography>
          </Box>
        ) : null}
      </PublicContainer>
    </Box>
  )
}

export const WEBSITE_APPLY_HEADER_HEIGHT = HEADER_HEIGHT
