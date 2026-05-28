import { Box, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CustomerSidebar, CUSTOMER_SIDEBAR_WIDTH } from './CustomerSidebar'
import { CustomerTopbar } from './CustomerTopbar'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

export function CustomerShell() {
  const theme = useTheme()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileNav, setMobileNav] = useState(false)
  const colors = usePublicBrandColors()

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
        bgcolor: colors.surface,
        fontFamily: publicFonts.body,
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            width: CUSTOMER_SIDEBAR_WIDTH,
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
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
