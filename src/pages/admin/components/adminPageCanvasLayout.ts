import type { Theme } from '@mui/material/styles'
import type { SxProps } from '@mui/material/styles'
import type { PublicBrandColors } from '@/shared/theme/publicBrand'
import {
  ADMIN_PORTAL_PAGE_CANVAS_BLEED_SX,
  getPortalPageCanvasBackground,
  getPortalPageCanvasPanelBackgroundSx,
  getPortalPageCanvasShellSx,
} from '@/shared/theme/portalPageCanvasLayout'

/** @deprecated Use shared portal canvas tokens — kept for admin import stability. */
export const ADMIN_PAGE_CANVAS_MAIN_BLEED_SX = ADMIN_PORTAL_PAGE_CANVAS_BLEED_SX

export function getAdminPageCanvasBackground(theme: Theme, colors: PublicBrandColors): string {
  return getPortalPageCanvasBackground(theme, colors)
}

export function getAdminPageCanvasShellSx(
  theme: Theme,
  colors: PublicBrandColors,
): SxProps<Theme> {
  return getPortalPageCanvasShellSx(
    theme,
    colors,
    ADMIN_PORTAL_PAGE_CANVAS_BLEED_SX,
    theme.palette.background.default,
  )
}

export function getAdminPageCanvasPanelBackgroundSx(
  theme: Theme,
  colors: PublicBrandColors,
): SxProps<Theme> {
  return getPortalPageCanvasPanelBackgroundSx(theme, colors)
}
