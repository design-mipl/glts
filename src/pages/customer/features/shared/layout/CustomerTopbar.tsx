import { useState } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Stack,
  InputBase,
  Avatar,
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Search, Bell, Menu, Moon, Sun, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Toggle } from '@/design-system/UIComponents'
import { useFoundationTheme } from '@/design-system/ThemeContext'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PORTAL_MOBILE_NAV_BREAKPOINT, PORTAL_TOPBAR_HEIGHT } from '@/shared/theme/portalChromeLayout'
import { useCustomerLogout } from '../hooks/useCustomerLogout'
import { useCustomerPortalBase } from '../hooks/useCustomerPortalBase'

interface CustomerTopbarProps {
  onMenuClick?: () => void
}

export function CustomerTopbar({ onMenuClick }: CustomerTopbarProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { base, contactName, isBusiness } = useCustomerPortalBase()
  const { isDark, setMode } = useFoundationTheme()
  const colors = usePublicBrandColors()
  const isLight = theme.palette.mode === 'light'
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const logout = useCustomerLogout()
  const initials = contactName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Box
      sx={{
        height: PORTAL_TOPBAR_HEIGHT,
        flexShrink: 0,
        px: { xs: 1.5, lg: 2 },
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${alpha(isLight ? '#000000' : '#ffffff', 0.06)}`,
      }}
    >
      {onMenuClick && (
        <IconButton
          size="small"
          onClick={onMenuClick}
          sx={{
            display: { [PORTAL_MOBILE_NAV_BREAKPOINT]: 'none' },
            color: 'text.secondary',
            width: 32,
            height: 32,
            flexShrink: 0,
          }}
        >
          <Menu size={20} />
        </IconButton>
      )}
      <Box
        sx={{
          flex: 1,
          maxWidth: theme.spacing(70),
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          height: theme.spacing(8.5),
          px: { xs: 1, sm: 1.5 },
          borderRadius: '100px',
          bgcolor: alpha(isLight ? '#000000' : '#ffffff', isLight ? 0.05 : 0.07),
          border: 'none',
        }}
      >
        <Search size={15} strokeWidth={1.75} color={theme.palette.text.disabled} />
        <InputBase
          placeholder={isBusiness ? 'Country, region or visa type' : 'Search applications, travelers…'}
          sx={{ fontSize: '13px', flex: 1, color: 'text.primary' }}
        />
        <Typography
          sx={{
            fontSize: '11px',
            color: 'text.disabled',
            display: { xs: 'none', xl: 'block' },
            bgcolor: alpha(isLight ? '#000000' : '#ffffff', 0.06),
            borderRadius: '4px',
            px: '5px',
            py: '1px',
            lineHeight: 1.6,
            flexShrink: 0,
          }}
        >
          ⌘K
        </Typography>
      </Box>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 'auto' }}>
        <IconButton
          size="small"
          onClick={() => navigate(`${base}/notifications`)}
          sx={{ color: 'text.secondary', width: 34, height: 34 }}
        >
          <Bell size={18} strokeWidth={1.75} />
        </IconButton>
        <Avatar
          component="button"
          aria-label="Open customer menu"
          onClick={event => setMenuAnchor(event.currentTarget)}
          sx={{
            width: 32,
            height: 32,
            bgcolor: colors.navy,
            color: colors.white,
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            border: 0,
            p: 0,
          }}
        >
          {initials}
        </Avatar>
        <MuiMenu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { minWidth: 220, mt: 1, borderRadius: 2 } } }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: 'text.primary' }}>{contactName}</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Customer portal</Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setMenuAnchor(null)
              navigate(`${base}/profile`)
            }}
            sx={{ py: '8px', gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 'unset' }}>
              <User size={16} strokeWidth={1.75} />
            </ListItemIcon>
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <Box sx={{ px: 2, py: 1.25 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Appearance</Typography>
              </Stack>
              <Toggle
                checked={isDark}
                onChange={checked => setMode(checked ? 'dark' : 'light')}
                size="sm"
              />
            </Stack>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setMenuAnchor(null)
              logout()
            }}
            sx={{ py: '8px', gap: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 'unset', color: 'error.main' }}>
              <LogOut size={16} strokeWidth={1.75} />
            </ListItemIcon>
            <Typography variant="body2" color="error.main">
              Log out
            </Typography>
          </MenuItem>
        </MuiMenu>
      </Stack>
    </Box>
  )
}
