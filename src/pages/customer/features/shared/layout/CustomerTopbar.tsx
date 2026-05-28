import { useState } from 'react'
import { Box, Typography, IconButton, Stack, InputBase, Avatar, Menu as MuiMenu, Divider } from '@mui/material'
import { Search, Bell, Menu, Wallet, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Toggle } from '@/design-system/UIComponents'
import { useFoundationTheme } from '@/design-system/ThemeContext'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useCustomerPortalBase } from '../hooks/useCustomerPortalBase'

interface CustomerTopbarProps {
  onMenuClick?: () => void
}

export function CustomerTopbar({ onMenuClick }: CustomerTopbarProps) {
  const navigate = useNavigate()
  const { base, contactName, isBusiness } = useCustomerPortalBase()
  const { isDark, setMode } = useFoundationTheme()
  const colors = usePublicBrandColors()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const initials = contactName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Box
      sx={{
        height: 56,
        px: { xs: 2, md: 3 },
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: colors.white,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {onMenuClick && (
        <IconButton size="small" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <Menu size={20} />
        </IconButton>
      )}
      <Box
        sx={{
          flex: 1,
          maxWidth: 420,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.surface,
        }}
      >
        <Search size={16} color={colors.textMuted} />
        <InputBase
          placeholder={isBusiness ? 'Country, region or visa type' : 'Search applications, travelers…'}
          sx={{ fontSize: '13px', flex: 1, color: colors.text }}
        />
        <Typography sx={{ fontSize: '10px', color: colors.textMuted, display: { xs: 'none', sm: 'block' } }}>
          ⌘K
        </Typography>
      </Box>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ml: 'auto' }}>
        <IconButton
          size="small"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setMode(isDark ? 'light' : 'dark')}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </IconButton>
        <IconButton size="small" onClick={() => navigate(`${base}/notifications`)}>
          <Bell size={18} />
        </IconButton>
        {isBusiness && (
          <IconButton size="small" onClick={() => navigate(`${base}/profile`)}>
            <Wallet size={18} />
          </IconButton>
        )}
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
        </MuiMenu>
      </Stack>
    </Box>
  )
}
