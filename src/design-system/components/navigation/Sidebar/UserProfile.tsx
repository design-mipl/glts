import {
  Box, Avatar, Typography, IconButton, Menu, MenuItem,
  ListItemIcon, Divider, Tooltip,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'

export interface UserProfileProps {
  name: string
  email: string
  avatarSrc?: string
  role?: string
  collapsed?: boolean
  onProfileClick?: () => void
  onSignOut?: () => void
  onSettingsClick?: () => void
}

export default function UserProfile({
  name,
  email,
  avatarSrc,
  role,
  collapsed = false,
  onProfileClick,
  onSignOut,
  onSettingsClick,
}: UserProfileProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  const avatar = (
    <Avatar
      src={avatarSrc}
      sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 600, flexShrink: 0 }}
    >
      {initials}
    </Avatar>
  )

  if (collapsed) {
    return (
      <Box sx={{ px: 1, py: 1.5, display: 'flex', justifyContent: 'center' }}>
        <Tooltip title={`${name}${role ? ` • ${role}` : ''}`} placement="right" arrow>
          <IconButton
            size="small"
            onClick={e => setAnchorEl(e.currentTarget)}
            sx={{ p: 0.5 }}
          >
            {avatar}
          </IconButton>
        </Tooltip>
        <UserMenu
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          onSignOut={onSignOut}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ px: 1, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
      {avatar}
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          sx={{ lineHeight: 1.3 }}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          sx={{ display: 'block', lineHeight: 1.3 }}
        >
          {role ?? email}
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={e => setAnchorEl(e.currentTarget)}
        sx={{ flexShrink: 0, p: 0.5 }}
      >
        <MoreVertIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <UserMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
        onSignOut={onSignOut}
      />
    </Box>
  )
}

function UserMenu({
  anchorEl,
  onClose,
  onProfileClick,
  onSettingsClick,
  onSignOut,
}: {
  anchorEl: HTMLElement | null
  onClose: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onSignOut?: () => void
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      slotProps={{ paper: { sx: { minWidth: 160, mb: 0.5 } } }}
    >
      <MenuItem onClick={() => { onClose(); onProfileClick?.() }} sx={{ py: 0.75 }}>
        <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
        <Typography variant="body2">View Profile</Typography>
      </MenuItem>
      <MenuItem onClick={() => { onClose(); onSettingsClick?.() }} sx={{ py: 0.75 }}>
        <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
        <Typography variant="body2">Settings</Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => { onClose(); onSignOut?.() }} sx={{ py: 0.75 }}>
        <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
        <Typography variant="body2" color="error.main">Sign Out</Typography>
      </MenuItem>
    </Menu>
  )
}
