import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  CUSTOMER_PORTAL_PAGE_CANVAS_BLEED_SX,
  getPortalPageCanvasShellSx,
} from '@/shared/theme/portalPageCanvasLayout'

export interface CustomerPageCanvasShellProps {
  children: ReactNode
}

/** Full-bleed subtle brand gradient behind all customer portal pages. */
export function CustomerPageCanvasShell({ children }: CustomerPageCanvasShellProps) {
  const theme = useTheme()
  const colors = usePublicBrandColors()

  return (
    <Box sx={getPortalPageCanvasShellSx(theme, colors, CUSTOMER_PORTAL_PAGE_CANVAS_BLEED_SX, colors.surface)}>
      {children}
    </Box>
  )
}
