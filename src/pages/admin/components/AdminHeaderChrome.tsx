import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Search } from 'lucide-react'
import { IconButton, UserMenu, useAppShellChrome } from '@/design-system/UIComponents'
import { useAdminSession } from '../hooks/useAdminSession'

/**
 * Desktop page-header chrome: command-palette search + profile menu.
 * Returns sibling nodes (no wrapper Stack) so parent spacing stays even with page actions.
 * Hidden below the desktop breakpoint — AppShell renders MobileNavStrip there instead.
 */
export function AdminHeaderChrome() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('desktop'))
  const { openCommandPalette } = useAppShellChrome()
  const { user, signOut, goToProfile } = useAdminSession()

  if (!isDesktop) return null

  return (
    <>
      <IconButton
        icon={<Search size={16} strokeWidth={1.75} />}
        tooltip="Search"
        variant="soft"
        color="primary"
        size="sm"
        onClick={openCommandPalette}
      />
      <UserMenu
        user={user}
        onSignOut={signOut}
        onProfileClick={goToProfile}
        showDetails={false}
      />
    </>
  )
}
