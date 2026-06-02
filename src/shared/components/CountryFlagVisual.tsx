import { Box, Typography } from '@mui/material'
import { isImageSource } from '@/shared/utils/imageSource'

interface CountryFlagVisualProps {
  flag: string
  size?: number
  fallback?: string
}

/** Renders emoji/text flag or an uploaded/URL image. */
export function CountryFlagVisual({ flag, size = 22, fallback = '🏳️' }: CountryFlagVisualProps) {
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
