import { Box, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Topbar from '../Topbar'
import Sidebar from '../Sidebar'
import type { NavConfig, UserInfo } from '../Sidebar'
import CommandPalette from '../CommandPalette'
import type { SearchResults } from '../CommandPalette'

const STORAGE_KEY = 'foundation:sidebar-collapsed'
const TOPBAR_HEIGHT = 64
const SIDEBAR_EXPANDED = 240
const SIDEBAR_COLLAPSED = 64

export interface AppShellProps {
  children: ReactNode
  navConfig: NavConfig[]
  user: UserInfo
  logo?: ReactNode
  logoCollapsed?: ReactNode
  notificationCount?: number
  onNotificationClick?: () => void
  onSignOut?: () => void
  onProfileClick?: () => void
  onSearch?: (query: string) => Promise<SearchResults>
}

function defaultSearch(): Promise<SearchResults> {
  return Promise.resolve({ pages: [], records: [], users: [] })
}

export default function AppShell({
  children,
  navConfig,
  user,
  logo,
  logoCollapsed,
  notificationCount,
  onNotificationClick,
  onSignOut,
  onProfileClick,
  onSearch = defaultSearch,
}: AppShellProps) {
  const theme = useTheme()
  const location = useLocation()
  const isLg = useMediaQuery(theme.breakpoints.up('lg'))

  // Initialize collapsed state from localStorage, with breakpoint default
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === 'true'
    // md starts collapsed, lg starts expanded
    return false // will be corrected after first render
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Set initial collapse based on breakpoint only if no localStorage value
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === null) {
      setCollapsed(!isLg)
    }
  }, [isLg])

  function handleCollapse(val: boolean) {
    setCollapsed(val)
    localStorage.setItem(STORAGE_KEY, String(val))
  }

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(p => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Topbar */}
      <Topbar
        onMenuToggle={() => setMobileOpen(o => !o)}
        sidebarCollapsed={collapsed}
        user={user}
        notificationCount={notificationCount}
        onNotificationClick={onNotificationClick}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
        onSearchClick={() => setPaletteOpen(true)}
      />

      {/* Sidebar */}
      <Sidebar
        navConfig={navConfig}
        collapsed={collapsed}
        onCollapse={handleCollapse}
        user={user}
        logo={logo}
        logoCollapsed={logoCollapsed}
        currentPath={location.pathname}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          marginTop: `${TOPBAR_HEIGHT}px`,
          marginLeft: {
            xs: 0,
            md: collapsed ? `${SIDEBAR_COLLAPSED}px` : `${SIDEBAR_EXPANDED}px`,
          },
          transition: `margin-left ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          bgcolor: 'background.default',
          p: { xs: 2, md: 3 },
          boxSizing: 'border-box',
          width: {
            xs: '100%',
            md: collapsed
              ? `calc(100% - ${SIDEBAR_COLLAPSED}px)`
              : `calc(100% - ${SIDEBAR_EXPANDED}px)`,
          },
        }}
      >
        {children}
      </Box>

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSearch={onSearch}
      />
    </Box>
  )
}
