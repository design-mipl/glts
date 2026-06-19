import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getAdminPageCanvasShellSx } from './adminPageCanvasLayout'

export interface AdminPageCanvasShellProps {
  children: ReactNode
}

/** Full-bleed subtle brand gradient behind all admin portal pages. */
export function AdminPageCanvasShell({ children }: AdminPageCanvasShellProps) {
  const theme = useTheme()
  const colors = usePublicBrandColors()

  return <Box sx={getAdminPageCanvasShellSx(theme, colors)}>{children}</Box>
}
