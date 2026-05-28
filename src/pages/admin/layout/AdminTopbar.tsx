import { Topbar } from '@/design-system/UIComponents'
import type { TopbarProps } from '@/design-system/UIComponents'
import { useAdminSession } from '../hooks/useAdminSession'

export interface AdminTopbarProps extends Omit<TopbarProps, 'user'> {}

export function AdminTopbar(props: AdminTopbarProps) {
  const { user, signOut, goToProfile } = useAdminSession()

  return (
    <Topbar
      {...props}
      user={user}
      onSignOut={signOut}
      onProfileClick={goToProfile}
    />
  )
}
