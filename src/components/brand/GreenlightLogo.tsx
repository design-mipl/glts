import { Box } from '@mui/material'

const LOGO_FULL = '/greenlight_logo.jpg'
const LOGO_ICON = '/sm_logo.jpg'

export function GreenlightLogoExpanded() {
  return (
    <Box
      component="img"
      src={LOGO_FULL}
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
      src={LOGO_ICON}
      alt="Greenlight Travel"
      sx={{
        height: 28,
        width: 28,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
      }}
    />
  )
}
