import { Box, Typography } from '@mui/material'
import { getLocalCountryFlagImageUrl } from '@/shared/assets/countryFlagImages'
import { isImageSource } from '@/shared/utils/imageSource'

interface CountryFlagVisualProps {
  flag: string
  countryCode?: string
  size?: number
  fallback?: string
}

/** Renders a local flag asset, emoji/text flag, or an uploaded/URL image. */
export function CountryFlagVisual({
  flag,
  countryCode,
  size = 22,
  fallback = '🏳️',
}: CountryFlagVisualProps) {
  const localFlag = countryCode ? getLocalCountryFlagImageUrl(countryCode) : undefined

  if (localFlag) {
    return (
      <Box
        component="img"
        src={localFlag}
        alt=""
        sx={{
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: '50%',
          display: 'block',
        }}
      />
    )
  }

  const value = flag || fallback

  if (isImageSource(value)) {
    return (
      <Box
        component="img"
        src={value}
        alt=""
        sx={{
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: '4px',
          display: 'block',
        }}
      />
    )
  }

  return (
    <Typography component="span" sx={{ fontSize: size, lineHeight: 1 }} aria-hidden>
      {value}
    </Typography>
  )
}
