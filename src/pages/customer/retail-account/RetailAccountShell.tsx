import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { publicFonts } from '@/pages/website/theme/publicSiteTokens'
import { applyFlow } from '@/pages/website/theme/applyFlowTheme'
import { RetailAccountHeader } from './RetailAccountHeader'

/** Signed-in retail account — logo + sign out only; no marketing nav or footer. */
export function RetailAccountShell() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        fontFamily: publicFonts.body,
        color: applyFlow.ink,
        bgcolor: applyFlow.canvas,
      }}
    >
      <RetailAccountHeader />
      <Box component="main" sx={{ flex: 1, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
