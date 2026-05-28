import type { ReactNode } from 'react'
import { AppShell } from '@/design-system/UIComponents'
import { GreenlightLogoCollapsed, GreenlightLogoExpanded } from '@/components/brand/GreenlightLogo'
import { adminNav } from '../config/adminNav'
import { useAdminSession } from '../hooks/useAdminSession'

export interface AdminShellProps {
  children: ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const { user, signOut, goToProfile } = useAdminSession()

  return (
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
    >
      {children}
    </AppShell>
  )
}
