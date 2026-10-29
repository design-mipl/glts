import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { applyCanvasSx, applyFlow, applyFont } from '../theme/applyFlowTheme'

interface WebsiteApplicationFlowLayoutProps {
  children: ReactNode
}

/** Max width of the flow panel. Wider than a form, narrower than a dashboard. */
const PANEL_MAX_WIDTH = 1220

/**
 * Focused retail apply shell.
 *
 * Deliberately has **no site header**: the old one showed the logo plus the destination
 * flag and name, which the flow panel's own rail now carries. Duplicating it pushed the
 * panel down the page and made the screen read as "a website with a form on it" rather
 * than a single application surface. The brand mark and the exit affordance live in the
 * rail instead, so the panel owns the viewport.
 */
export function WebsiteApplicationFlowLayout({ children }: WebsiteApplicationFlowLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        minHeight: '100vh',
        width: '100%',
        fontFamily: applyFont.body,
        color: applyFlow.ink,
        boxSizing: 'border-box',
        overflow: 'hidden',
        p: { xs: 0, lg: 5, xl: 7 },
        ...applyCanvasSx,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: PANEL_MAX_WIDTH,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          // Full-bleed on phones — a floating card on a small screen wastes the viewport.
          maxHeight: { xs: '100%', lg: 860 },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
