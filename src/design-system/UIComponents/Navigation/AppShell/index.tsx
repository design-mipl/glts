import { Box, useMediaQuery, Drawer as MuiDrawer } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Topbar, { TOPBAR_HEIGHT } from '../Topbar'
import Sidebar from '../Sidebar'
import type { NavConfig } from '../Sidebar'
import type { UserMenuUser } from '../Topbar/UserMenu'
import CommandPalette from '../CommandPalette'
import type { SearchResults } from '../CommandPalette'
import { tokens } from '../../../tokens'

const STORAGE_KEY = 'foundation:sidebar-collapsed'
const SIDEBAR_EXPANDED = 240
const SIDEBAR_COLLAPSED = 64

export interface AppShellProps {
  children: ReactNode
  navConfig: NavConfig[]
  user: UserMenuUser
  logo?: ReactNode
  logoCollapsed?: ReactNode
  notificationCount?: number
  onNotificationClick?: () => void
  onSignOut?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
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
  onSettingsClick,
  onSearch = defaultSearch,
}: AppShellProps) {
  const theme = useTheme()
  const location = useLocation()
  const isDesktop = useMediaQuery(theme.breakpoints.up('desktop'))

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === 'true'
    return false
  })
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Close drawer when resizing to desktop
  useEffect(() => {
    if (isDesktop) {
      setMobileDrawerOpen(false)
    }
  }, [isDesktop])

  // Close drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false)
  }, [location.pathname])

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

  function handleDesktopCollapse(val: boolean) {
    setCollapsed(val)
    localStorage.setItem(STORAGE_KEY, String(val))
  }

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* ── DESKTOP SIDEBAR (desktop / 1024+) ── */}
      {isDesktop && (
        <Box
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            height: '100vh',
            transition: `width ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          <Sidebar
            navConfig={navConfig}
            collapsed={collapsed}
            onCollapse={handleDesktopCollapse}
            logo={logo}
            logoCollapsed={logoCollapsed}
            currentPath={location.pathname}
            mobileOpen={false}
            onMobileClose={() => {}}
            logoMark="F"
            appName="Foundation"
          />
        </Box>
      )}

      {/* ── MOBILE/TABLET DRAWER (below desktop) ── */}
      {!isDesktop && (
        <MuiDrawer
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              maxWidth: '100%',
              height: '100vh',
              border: 'none',
              boxShadow: tokens.shadow.md,
              bgcolor: theme.foundation.navigation.background,
              [theme.breakpoints.up('lg')]: {
                width: 280,
                maxWidth: 280,
              },
              [theme.breakpoints.up('desktop')]: {
                width: SIDEBAR_EXPANDED,
                maxWidth: SIDEBAR_EXPANDED,
              },
            },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0,0,0,0.3)',
            },
          }}
        >
          <Sidebar
            navConfig={navConfig}
            collapsed={false}
            onCollapse={() => setMobileDrawerOpen(false)}
            logo={logo}
            logoCollapsed={logoCollapsed}
            currentPath={location.pathname}
            mobileOpen={mobileDrawerOpen}
            onMobileClose={() => setMobileDrawerOpen(false)}
            logoMark="F"
            appName="Foundation"
          />
        </MuiDrawer>
      )}

      {/* ── CONTENT COLUMN ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Topbar */}
        <Box
          sx={{
            flexShrink: 0,
            height: `${TOPBAR_HEIGHT}px`,
            zIndex: 100,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${alpha(
              theme.palette.mode === 'light' ? '#000000' : '#ffffff',
              0.06
            )}`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Topbar
            onMenuToggle={() => setMobileDrawerOpen(true)}
            user={user}
            notificationCount={notificationCount}
            onNotificationClick={onNotificationClick}
            onSignOut={onSignOut}
            onProfileClick={onProfileClick}
            onSettingsClick={onSettingsClick}
            onSearchClick={() => setPaletteOpen(true)}
            showMenuButton={!isDesktop}
          />
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={(t) => ({
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            p: t.spacing(4),
            [t.breakpoints.up('lg')]: { p: t.spacing(3.5) },
            [t.breakpoints.up('desktop')]: { p: t.spacing(3) },
            backgroundColor: t.palette.background.default,
            boxSizing: 'border-box',
          })}
        >
          {children}
        </Box>
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
