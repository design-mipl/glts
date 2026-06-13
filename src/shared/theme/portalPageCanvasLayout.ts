import { alpha, type Theme } from '@mui/material/styles'
import type { SxProps } from '@mui/material/styles'
import type { PublicBrandColors } from '@/shared/theme/publicBrand'

/** Soft accent hues for portal page canvas (not global brand tokens). */
const PORTAL_PAGE_CANVAS_PURPLE_LIGHT = '#6366F1'
const PORTAL_PAGE_CANVAS_PURPLE_DARK = '#A78BFA'
const PORTAL_PAGE_CANVAS_YELLOW_LIGHT = '#FBBF24'
const PORTAL_PAGE_CANVAS_YELLOW_DARK = '#FCD34D'

function getPortalPageCanvasPurple(theme: Theme): string {
  return theme.palette.mode === 'light'
    ? PORTAL_PAGE_CANVAS_PURPLE_LIGHT
    : PORTAL_PAGE_CANVAS_PURPLE_DARK
}

function getPortalPageCanvasYellow(theme: Theme): string {
  return theme.palette.mode === 'light'
    ? PORTAL_PAGE_CANVAS_YELLOW_LIGHT
    : PORTAL_PAGE_CANVAS_YELLOW_DARK
}

function getPortalPageCanvasFlowOpacities(theme: Theme) {
  const isLight = theme.palette.mode === 'light'
  return {
    peak: isLight ? 0.038 : 0.06,
    mid: isLight ? 0.026 : 0.042,
    soft: isLight ? 0.015 : 0.026,
    panelPeak: isLight ? 0.032 : 0.05,
    panelMid: isLight ? 0.021 : 0.034,
    panelSoft: isLight ? 0.014 : 0.022,
  }
}

/** Overlapping radial blooms — yellow left, colors bleed into each other. */
function buildPortalPageCanvasFlowBackground(
  theme: Theme,
  colors: PublicBrandColors,
  scale: 'page' | 'panel',
): string {
  const purple = getPortalPageCanvasPurple(theme)
  const yellow = getPortalPageCanvasYellow(theme)
  const navy = theme.palette.primary.main
  const green = colors.green
  const o = getPortalPageCanvasFlowOpacities(theme)
  const peak = scale === 'page' ? o.peak : o.panelPeak
  const mid = scale === 'page' ? o.mid : o.panelMid
  const soft = scale === 'page' ? o.soft : o.panelSoft

  const yellowPeak = alpha(yellow, peak)
  const yellowMid = alpha(yellow, mid)
  const yellowSoft = alpha(yellow, soft)
  const greenPeak = alpha(green, peak)
  const greenMid = alpha(green, mid)
  const greenSoft = alpha(green, soft)
  const navyMid = alpha(navy, mid)
  const navySoft = alpha(navy, soft)
  const purplePeak = alpha(purple, peak)
  const purpleMid = alpha(purple, mid)
  const purpleSoft = alpha(purple, soft)

  if (scale === 'panel') {
    return [
      `radial-gradient(ellipse 95% 80% at -12% 42%, ${yellowPeak} 0%, ${yellowMid} 28%, ${yellowSoft} 48%, transparent 72%)`,
      `radial-gradient(ellipse 88% 72% at 22% 68%, ${greenMid} 0%, ${greenSoft} 40%, transparent 70%)`,
      `radial-gradient(ellipse 80% 68% at 55% 30%, ${navyMid} 0%, ${navySoft} 42%, transparent 68%)`,
      `radial-gradient(ellipse 78% 64% at 108% 22%, ${purplePeak} 0%, ${purpleSoft} 38%, transparent 72%)`,
      `linear-gradient(118deg, ${yellowSoft} 0%, ${alpha(green, soft)} 38%, ${alpha(navy, soft)} 58%, ${alpha(purple, soft)} 88%)`,
    ].join(', ')
  }

  return [
    `radial-gradient(ellipse 100% 85% at -10% 38%, ${yellowPeak} 0%, ${yellowMid} 26%, ${yellowSoft} 46%, transparent 74%)`,
    `radial-gradient(ellipse 92% 78% at 24% 66%, ${greenPeak} 0%, ${greenMid} 34%, ${greenSoft} 52%, transparent 76%)`,
    `radial-gradient(ellipse 88% 72% at 56% 34%, ${navyMid} 0%, ${navySoft} 44%, transparent 70%)`,
    `radial-gradient(ellipse 82% 68% at 104% 16%, ${purplePeak} 0%, ${purpleMid} 30%, ${purpleSoft} 50%, transparent 74%)`,
    `linear-gradient(120deg, ${yellowSoft} 0%, ${alpha(green, mid)} 32%, ${alpha(navy, soft)} 54%, ${alpha(purple, mid)} 78%, ${alpha(purple, soft)} 100%)`,
  ].join(', ')
}

/** Bleed into AppShell `<main>` padding (admin). */
export const ADMIN_PORTAL_PAGE_CANVAS_BLEED_SX = {
  mx: { xs: -4, lg: -3.5, desktop: -3 },
  mt: { xs: -4, lg: -3.5, desktop: -3 },
  mb: { xs: -4, lg: -3.5, desktop: -3 },
  px: { xs: 4, lg: 3.5, desktop: 3 },
  py: { xs: 4, lg: 3.5, desktop: 3 },
  minHeight: '100%',
  boxSizing: 'border-box',
} as const

/** Bleed into CustomerShell `<main>` padding — matches admin bleed (shared main padding). */
export const CUSTOMER_PORTAL_PAGE_CANVAS_BLEED_SX = {
  mx: { xs: -4, lg: -3.5, desktop: -3 },
  mt: { xs: -4, lg: -3.5, desktop: -3 },
  mb: { xs: -4, lg: -3.5, desktop: -3 },
  px: { xs: 4, lg: 3.5, desktop: 3 },
  py: { xs: 4, lg: 3.5, desktop: 3 },
  minHeight: '100%',
  boxSizing: 'border-box',
} as const

export function getPortalPageCanvasBackground(theme: Theme, colors: PublicBrandColors): string {
  return buildPortalPageCanvasFlowBackground(theme, colors, 'page')
}

export function getPortalPageCanvasShellSx(
  theme: Theme,
  colors: PublicBrandColors,
  bleedSx: typeof ADMIN_PORTAL_PAGE_CANVAS_BLEED_SX | typeof CUSTOMER_PORTAL_PAGE_CANVAS_BLEED_SX,
  surfaceColor: string,
): SxProps<Theme> {
  return {
    ...bleedSx,
    bgcolor: surfaceColor,
    backgroundImage: getPortalPageCanvasBackground(theme, colors),
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'scroll',
  }
}

/** Flowing navy + green + purple + yellow tint for grouped panels. */
export function getPortalPageCanvasPanelBackgroundSx(
  theme: Theme,
  colors: PublicBrandColors,
): SxProps<Theme> {
  const isLight = theme.palette.mode === 'light'
  return {
    bgcolor: alpha(theme.palette.primary.main, isLight ? 0.011 : 0.021),
    backgroundImage: buildPortalPageCanvasFlowBackground(theme, colors, 'panel'),
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}
