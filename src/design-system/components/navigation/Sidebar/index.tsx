import { Box, Drawer, IconButton, Tooltip } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'
import NavItem from './NavItem'
import NavGroup from './NavGroup'
import UserProfile from './UserProfile'

export interface NavConfig {
  type: 'item' | 'group' | 'divider'
  label?: string
  icon?: ReactNode
  href?: string
  badge?: number | string
  children?: NavConfig[]
  roles?: string[]
}

export interface UserInfo {
  name: string
  email: string
  avatarSrc?: string
  role?: string
}

export interface SidebarProps {
  navConfig: NavConfig[]
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
  user: UserInfo
  logo?: ReactNode
  logoCollapsed?: ReactNode
  currentPath?: string
  onSignOut?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const SIDEBAR_EXPANDED = 240
const SIDEBAR_COLLAPSED = 64
const TOPBAR_HEIGHT = 64

function renderNavConfig(
  items: NavConfig[],
  collapsed: boolean,
  currentPath: string,
): ReactNode {
  return items.map((item, i) => {
    if (item.type === 'divider') {
      return (
        <Box
          key={i}
          sx={{
            height: '1px',
            mx: 2,
            my: 1,
            backgroundColor: (t) =>
              alpha(t.palette.mode === 'light' ? '#000000' : '#ffffff', 0.05),
          }}
        />
      )
    }

    if (item.type === 'group') {
      if (item.icon) {
        // Collapsible group with icon
        return (
          <NavGroup
            key={i}
            label={item.label ?? ''}
            icon={item.icon}
            collapsed={collapsed}
            badge={typeof item.badge === 'number' ? item.badge : undefined}
          >
            {item.children?.map((child, j) => {
              if (child.type === 'item') {
                return (
                  <NavItem
                    key={j}
                    label={child.label ?? ''}
                    icon={child.icon ?? <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />}
                    href={child.href}
                    active={!!child.href && currentPath === child.href}
                    badge={child.badge}
                    depth={collapsed ? 0 : 1}
                    collapsed={collapsed}
                  />
                )
              }
              return null
            })}
          </NavGroup>
        )
      }
      // Section label group
      return (
          <NavGroup
            key={i}
            label={item.label ?? ''}
            collapsed={collapsed}
          >
          {item.children?.map((child) => renderNavConfig([child], collapsed, currentPath))}
        </NavGroup>
      )
    }

    if (item.type === 'item') {
      return (
        <NavItem
          key={i}
          label={item.label ?? ''}
          icon={item.icon ?? <Box />}
          href={item.href}
          active={!!item.href && currentPath === item.href}
          badge={item.badge}
          collapsed={collapsed}
        />
      )
    }

    return null
  })
}

function SidebarContent({
  navConfig,
  collapsed,
  onCollapse,
  user,
  logo,
  logoCollapsed,
  currentPath = '',
  onSignOut,
  onProfileClick,
  onSettingsClick,
}: Omit<SidebarProps, 'mobileOpen' | 'onMobileClose'>) {
  const theme = useTheme()
  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

  return (
    <Box
      sx={{
        width,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: `1px solid ${alpha(theme.palette.mode === 'light' ? '#000000' : '#ffffff', 0.06)}`,
        boxShadow: 'none',
        overflow: 'hidden',
        transition: `width ${tokens.transition.normal}`,
      }}
    >
      {/* Logo area */}
      <Box
        sx={{
          height: TOPBAR_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 0 : 2,
          flexShrink: 0,
          borderBottom: `1px solid ${alpha(theme.palette.mode === 'light' ? '#000000' : '#ffffff', 0.06)}`,
          overflow: 'hidden',
        }}
      >
        {!collapsed && (
          <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            {logo}
          </Box>
        )}
        {collapsed && logoCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {logoCollapsed}
          </Box>
        )}
        <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
          <IconButton
            size="small"
            onClick={() => onCollapse(!collapsed)}
            sx={{
              flexShrink: 0,
              color: 'text.secondary',
              width: 28,
              height: 28,
              '&:hover': { color: 'text.primary' },
            }}
          >
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Nav scroll area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'transparent',
            borderRadius: '2px',
            transition: 'background-color 200ms',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.15)'
              : 'rgba(0,0,0,0.15)',
          },
        }}
      >
        {renderNavConfig(navConfig, collapsed, currentPath)}
      </Box>

      {/* Bottom section */}
      <Box sx={{ flexShrink: 0 }}>
        <Box
          sx={{
            height: '1px',
            backgroundColor: alpha(theme.palette.mode === 'light' ? '#000000' : '#ffffff', 0.06),
          }}
        />
        <UserProfile
          name={user.name}
          email={user.email}
          avatarSrc={user.avatarSrc}
          role={user.role}
          collapsed={collapsed}
          onSignOut={onSignOut}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
        />
      </Box>
    </Box>
  )
}

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
  ...props
}: SidebarProps) {
  return (
    <>
      {/* Desktop permanent sidebar */}
      <Box
        component="nav"
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          top: TOPBAR_HEIGHT,
          left: 0,
          bottom: 0,
          zIndex: 1000,
          width: props.collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
          transition: `width ${tokens.transition.normal}`,
        }}
      >
        <SidebarContent {...props} />
      </Box>

      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_EXPANDED,
            top: 0,
            height: '100%',
            border: 'none',
            boxSizing: 'border-box',
          },
        }}
      >
        <SidebarContent {...props} collapsed={false} />
      </Drawer>
    </>
  )
}
