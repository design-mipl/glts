import { Box, Toolbar, IconButton } from '@mui/material'
import { Menu, Search } from 'lucide-react'
import UserMenu from './UserMenu'
import type { UserMenuUser } from './UserMenu'

/** Keep in sync with `TOPBAR_HEIGHT` in Topbar/index.tsx */
const STRIP_HEIGHT = 52

export interface MobileNavStripProps {
  onMenuToggle: () => void
  user: UserMenuUser
  onSignOut?: () => void
  onProfileClick?: () => void
  onSearchClick?: () => void
}

/** Compact shell chrome for viewports below the desktop sidebar breakpoint. */
export default function MobileNavStrip({
  onMenuToggle,
  user,
  onSignOut,
  onProfileClick,
  onSearchClick,
}: MobileNavStripProps) {
  return (
    <Toolbar
      sx={{
        height: STRIP_HEIGHT,
        minHeight: `${STRIP_HEIGHT}px !important`,
        px: { xs: 1.5, lg: 2 },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.5,
        width: '100%',
      }}
    >
      <IconButton
        onClick={onMenuToggle}
        size="small"
        aria-label="Open navigation"
        sx={{
          color: 'text.secondary',
          width: 32,
          height: 32,
          flexShrink: 0,
        }}
      >
        <Menu size={20} />
      </IconButton>

      <Box sx={{ flex: 1 }} />

      <IconButton
        size="small"
        onClick={onSearchClick}
        aria-label="Search"
        sx={{
          color: 'text.secondary',
          width: 34,
          height: 34,
          flexShrink: 0,
        }}
      >
        <Search size={18} strokeWidth={1.75} />
      </IconButton>

      <UserMenu
        user={user}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
        showDetails={false}
      />
    </Toolbar>
  )
}
