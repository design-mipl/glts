import { Box, Toolbar, IconButton, Badge, Divider } from '@mui/material'
import { Menu, Bell, Search } from 'lucide-react'
import { alpha, useTheme } from '@mui/material/styles'
import UserMenu from './UserMenu'
import type { UserMenuUser } from './UserMenu'

export const TOPBAR_HEIGHT = 52

export interface TopbarProps {
  onMenuToggle: () => void
  user: UserMenuUser
  notificationCount?: number
  onNotificationClick?: () => void
  onSignOut?: () => void
  onProfileClick?: () => void
  onSearchClick?: () => void
  showMenuButton?: boolean
  showUserDetails?: boolean
}

export default function Topbar({
  onMenuToggle,
  user,
  notificationCount,
  onNotificationClick,
  onSignOut,
  onProfileClick,
  onSearchClick,
  showMenuButton = false,
  showUserDetails = true,
}: TopbarProps) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  return (
    <Toolbar
      sx={{
        height: TOPBAR_HEIGHT,
        minHeight: `${TOPBAR_HEIGHT}px !important`,
        px: { xs: 1.5, lg: 2 },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
        width: '100%',
      }}
    >
      {/* LEFT — hamburger (shown conditionally) */}
      {showMenuButton && (
        <IconButton
          onClick={onMenuToggle}
          size="small"
          sx={{
            color: 'text.secondary',
            width: 32,
            height: 32,
            flexShrink: 0,
          }}
        >
          <Menu size={20} />
        </IconButton>
      )}

      {/* SEARCH — always left-aligned, right after hamburger */}
      <Box
        onClick={onSearchClick}
        sx={(t) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          height: t.spacing(8.5),
          px: { xs: 1, sm: 1.5, md: 1.5 },
          borderRadius: '100px',
          cursor: 'pointer',
          color: 'text.disabled',
          bgcolor: alpha(isLight ? '#000000' : '#ffffff', isLight ? 0.05 : 0.07),
          border: 'none',
          width: t.spacing(8.5),
          [t.breakpoints.up('sm')]: { width: t.spacing(50) },
          [t.breakpoints.up('md')]: { width: t.spacing(60) },
          [t.breakpoints.up('lg')]: { width: t.spacing(70) },
          flexShrink: 0,
          transition: 'background-color 150ms ease',
          '&:hover': {
            bgcolor: alpha(isLight ? '#000000' : '#ffffff', isLight ? 0.08 : 0.1),
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Search size={15} strokeWidth={1.75} />
        </Box>

        {/* Hide text on xs, show on sm+ */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'block' },
            fontSize: '13px',
            color: 'text.disabled',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          Search...
        </Box>

        {/* Hide ⌘K on xs/sm, show on md+ */}
        <Box
          sx={{
            display: { xs: 'none', xl: 'flex' },
            marginLeft: 'auto',
            alignItems: 'center',
            fontSize: '11px',
            color: 'text.disabled',
            bgcolor: alpha(isLight ? '#000000' : '#ffffff', 0.06),
            borderRadius: '4px',
            px: '5px',
            py: '1px',
            lineHeight: 1.6,
            flexShrink: 0,
          }}
        >
          ⌘K
        </Box>
      </Box>

      {/* SPACER — pushes right section to end */}
      <Box sx={{ flex: 1 }} />

      {/* RIGHT — bell + avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {/* Notification bell */}
        <IconButton
          size="small"
          onClick={onNotificationClick}
          sx={{
            color: 'text.secondary',
            width: 34,
            height: 34,
            flexShrink: 0,
          }}
        >
          <Badge
            badgeContent={notificationCount}
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                height: 14,
                minWidth: 14,
                fontSize: '9px',
              },
            }}
          >
            <Bell size={18} strokeWidth={1.75} />
          </Badge>
        </IconButton>

        {/* Vertical divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ height: 18, alignSelf: 'center', mx: '4px', opacity: 0.25 }}
        />

        {/* Avatar + dropdown */}
        <UserMenu
          user={user}
          onSignOut={onSignOut}
          onProfileClick={onProfileClick}
          showDetails={showUserDetails}
        />
      </Box>
    </Toolbar>
  )
}
