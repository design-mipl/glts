import { useMemo, type ReactNode } from 'react'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import { AppShell } from '@/design-system/UIComponents'
import { GreenlightLogoCollapsed, GreenlightLogoExpanded } from '@/components/brand/GreenlightLogo'
import { AdminPageCanvasShell } from '../components/AdminPageCanvasShell'
import { adminNav } from '../config/adminNav'
import { useAdminSession } from '../hooks/useAdminSession'
import { adminDarkNavigationSurface } from '../theme/adminNavigationSurface'

export interface AdminShellProps {
  children: ReactNode
}

function AdminShellNavTheme({ children }: { children: ReactNode }) {
  const parentTheme = useTheme()
  const theme = useMemo(
    () =>
      createTheme(parentTheme, {
        foundation: { navigation: adminDarkNavigationSurface },
      }),
    [parentTheme],
  )

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export function AdminShell({ children }: AdminShellProps) {
  const { user, signOut, goToProfile } = useAdminSession()

  return (
    <AdminShellNavTheme>
      <AppShell
        navConfig={adminNav}
        user={user}
        appName="Greenlight Travel Solutions"
        logo={<GreenlightLogoExpanded />}
        logoCollapsed={<GreenlightLogoCollapsed />}
        notificationCount={0}
        onSignOut={signOut}
        onProfileClick={goToProfile}
        hideTopbarUserDetails
        hideTopbarNotificationBell
      >
        <AdminPageCanvasShell>{children}</AdminPageCanvasShell>
      </AppShell>
    </AdminShellNavTheme>
  )
}
