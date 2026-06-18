import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import chroma from 'chroma-js'

/** Light-background wordmark (`public/green-light-logo.png`). */
export const GREENLIGHT_LOGO_SRC = '/green-light-logo.png'

/** Collapsed sidebar icon (`public/green-sm.png`). */
export const GREENLIGHT_LOGO_COLLAPSED_SRC = '/green-sm.png'

/** Dark-background wordmark (`public/green-light-logo-yellow.png`). */
export const GREENLIGHT_LOGO_DARK_SRC = '/green-light-logo-yellow.png'

export function isDarkNavigationBackground(background: string): boolean {
  try {
    return chroma(background).luminance() < 0.4
  } catch {
    return false
  }
}

export function useGreenlightLogoSrc(): string {
  const theme = useTheme()
  return isDarkNavigationBackground(theme.foundation.navigation.background)
    ? GREENLIGHT_LOGO_DARK_SRC
    : GREENLIGHT_LOGO_SRC
}

export function GreenlightLogoExpanded() {
  const src = useGreenlightLogoSrc()

  return (
    <Box
      component="img"
      src={src}
      alt="Greenlight Travel Solutions"
      sx={{
        height: 32,
        width: 'auto',
        maxWidth: 168,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
      }}
    />
  )
}

export function GreenlightLogoCollapsed() {
  return (
    <Box
      component="img"
      src={GREENLIGHT_LOGO_COLLAPSED_SRC}
      alt="Greenlight Travel"
      sx={{
        width: 28,
        height: 28,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
      }}
    />
  )
}
