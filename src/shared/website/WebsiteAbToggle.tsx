import { Stack, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toggle } from '@/design-system/UIComponents'
import {
  getAlternateWebsitePath,
  isWebsiteV2Path,
} from '@/shared/website/websiteVariantPaths'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

type WebsiteAbToggleProps = {
  fullWidth?: boolean
  onNavigate?: () => void
  /** Render for legibility on a solid dark-navy background (e.g. the website-v2 header bar). */
  onDark?: boolean
}

/** Compact A / B switch for the public-site header. */
export function WebsiteAbToggle({ fullWidth = false, onNavigate, onDark = false }: WebsiteAbToggleProps) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const location = useLocation()
  // B = main website-v2 at `/`; A = legacy site at `/v1`
  const onSiteB = isWebsiteV2Path(location.pathname)

  const handleChange = (checked: boolean) => {
    const wantSiteB = checked
    if (wantSiteB === onSiteB) return
    onNavigate?.()
    navigate(getAlternateWebsitePath(location.pathname, location.search))
  }

  const sideLabelSx = (active: boolean) => ({
    fontFamily: publicFonts.body,
    fontSize: '11px',
    fontWeight: active ? 700 : 500,
    lineHeight: 1,
    color: onDark
      ? active
        ? '#fff'
        : 'rgba(255, 255, 255, 0.5)'
      : active
        ? colors.navy
        : colors.textMuted,
    minWidth: 12,
    textAlign: 'center' as const,
    userSelect: 'none' as const,
  })

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={fullWidth ? 'space-between' : 'center'}
      spacing={0.75}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        px: fullWidth ? 1.5 : 0.75,
        py: fullWidth ? 1 : 0.25,
        borderRadius: '10px',
        border: fullWidth ? `1px solid ${colors.border}` : 'none',
        bgcolor: fullWidth ? colors.surface : 'transparent',
      }}
      aria-label="Website version"
    >
      {fullWidth ? (
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>
          Site version
        </Typography>
      ) : null}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography component="span" sx={sideLabelSx(!onSiteB)} aria-hidden>
          A
        </Typography>
        <Toggle
          size="sm"
          color="primary"
          checked={onSiteB}
          onChange={handleChange}
        />
        <Typography component="span" sx={sideLabelSx(onSiteB)} aria-hidden>
          B
        </Typography>
      </Stack>
    </Stack>
  )
}
