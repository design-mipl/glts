import {
  Box, AppBar, Toolbar, IconButton, Typography, Avatar,
  Badge, Divider, Menu, MenuItem, ListItemIcon, Tooltip,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import { alpha, useTheme } from '@mui/material/styles'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

export interface TopbarUser {
  name: string
  email: string
  avatarSrc?: string
  role?: string
}

export interface TopbarProps {
  onMenuToggle: () => void
  sidebarCollapsed: boolean
  actions?: ReactNode
  user: TopbarUser
  notificationCount?: number
  onNotificationClick?: () => void
  onSignOut?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onSearchClick?: () => void
}

const TOPBAR_HEIGHT = 64

export default function Topbar({
  onMenuToggle,
  actions,
  user,
  notificationCount,
  onNotificationClick,
  onSignOut,
  onProfileClick,
  onSettingsClick,
  onSearchClick,
}: TopbarProps) {
  const theme = useTheme()
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        height: TOPBAR_HEIGHT,
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${alpha(theme.palette.mode === 'light' ? '#000000' : '#ffffff', 0.06)}`,
        boxShadow: theme.palette.mode === 'light' ? `0 1px 3px rgba(0, 0, 0, 0.04)` : 'none',
        zIndex: 1100,
        color: 'text.primary',
      }}
    >
      <Toolbar
        sx={{
          height: TOPBAR_HEIGHT,
          minHeight: `${TOPBAR_HEIGHT}px !important`,
          px: { xs: 1.5, md: 2 },
          gap: 1,
        }}
      >
        {/* Mobile hamburger */}
        <IconButton
          onClick={onMenuToggle}
          size="small"
          sx={{ display: { md: 'none' }, mr: 0.5 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Custom actions */}
        {actions}

        {/* Search button */}
        <Box
          onClick={onSearchClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            height: 36,
            px: { xs: 1, md: 1.5 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: tokens.borderRadius.md,
            cursor: 'pointer',
            color: 'text.secondary',
            bgcolor: 'action.hover',
            minWidth: { xs: 36, sm: 140, md: 220 },
            transition: `border-color ${tokens.transition.normal}, box-shadow ${tokens.transition.normal}`,
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: `0 0 0 2px rgba(99,102,241,0.15)`,
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 18, flexShrink: 0 }} />
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Search...
          </Typography>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.25,
            }}
          >
            <Box
              component="kbd"
              sx={{
                fontSize: 11,
                color: 'text.disabled',
                bgcolor: 'action.selected',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '4px',
                px: 0.5,
                py: 0.125,
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            >
              ⌘K
            </Box>
          </Box>
        </Box>

        {/* Notification bell */}
        <Tooltip title="Notifications">
          <IconButton
            size="small"
            onClick={onNotificationClick}
            sx={{ color: 'text.secondary' }}
          >
            <Badge badgeContent={notificationCount} color="error" max={99}>
              <NotificationsIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Vertical divider */}
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, alignSelf: 'center' }} />

        {/* User avatar button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            borderRadius: tokens.borderRadius.md,
            px: 0.75,
            py: 0.5,
            '&:hover': { bgcolor: 'action.hover' },
            transition: `background-color ${tokens.transition.normal}`,
          }}
          onClick={e => setUserMenuAnchor(e.currentTarget)}
        >
          <Avatar
            src={user.avatarSrc}
            sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 600 }}
          >
            {initials}
          </Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap sx={{ lineHeight: 1.2 }}>
              {user.name}
            </Typography>
            {user.role && (
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', lineHeight: 1.2 }}>
                {user.role}
              </Typography>
            )}
          </Box>
        </Box>

        {/* User dropdown */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: { minWidth: 220, mt: 0.5 },
            },
          }}
        >
          {/* User info header */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={user.avatarSrc} sx={{ width: 40, height: 40, fontSize: 15, fontWeight: 600 }}>
                {initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>{user.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => { setUserMenuAnchor(null); onProfileClick?.() }}
            sx={{ py: 1 }}
          >
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            <Typography variant="body2">My Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => { setUserMenuAnchor(null); onSettingsClick?.() }}
            sx={{ py: 1 }}
          >
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => { setUserMenuAnchor(null); onSignOut?.() }}
            sx={{ py: 1 }}
          >
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
            <Typography variant="body2" color="error.main">Sign Out</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
