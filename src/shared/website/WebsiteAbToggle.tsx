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
}

/** Compact A / B switch for the public-site header. */
export function WebsiteAbToggle({ fullWidth = false, onNavigate }: WebsiteAbToggleProps) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const location = useLocation()
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
    color: active ? colors.navy : colors.textMuted,
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
