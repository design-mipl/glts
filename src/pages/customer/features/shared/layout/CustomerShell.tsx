import { Box, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CustomerSidebar } from './CustomerSidebar'
import { CustomerTopbar } from './CustomerTopbar'
import { CustomerPageCanvasShell } from './CustomerPageCanvasShell'
import { publicFonts } from '@/shared/theme/publicBrand'
import {
  getPortalMainPaddingSx,
  PORTAL_MOBILE_NAV_BREAKPOINT,
  PORTAL_SIDEBAR_WIDTH,
} from '@/shared/theme/portalChromeLayout'

export function CustomerShell() {
  const theme = useTheme()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down(PORTAL_MOBILE_NAV_BREAKPOINT))
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMobileNav(false))
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname])

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
        fontFamily: publicFonts.body,
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            width: PORTAL_SIDEBAR_WIDTH,
            flexShrink: 0,
            height: '100vh',
            zIndex: 1000,
          }}
        >
          <CustomerSidebar />
        </Box>
      )}
      {isMobile && (
        <CustomerSidebar mobile open={mobileNav} onClose={() => setMobileNav(false)} />
      )}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <CustomerTopbar onMenuClick={() => setMobileNav(true)} />
        <Box
          component="main"
          sx={(theme) => ({
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            ...getPortalMainPaddingSx(theme),
          })}
        >
          <CustomerPageCanvasShell>
            <Outlet />
          </CustomerPageCanvasShell>
        </Box>
      </Box>
    </Box>
  )
}
