import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserMenuUser } from '@/design-system/UIComponents'
import { clearSession, contactNameFromEmail, loadSession } from '@/shared/auth/session'

export const ADMIN_SIGN_IN_PATH = '/sign-in/operations'

const fallbackUser: UserMenuUser = {
  name: 'GLTS Admin',
  email: 'admin@glts.com',
  role: 'System administrator',
}

export function adminUserFromSession(): UserMenuUser {
  const session = loadSession()
  if (!session?.email || session.portal !== 'operations') {
    return fallbackUser
  }

  return {
    name: contactNameFromEmail(session.email),
    email: session.email,
    role: 'System administrator',
  }
}

export function useAdminSession() {
  const navigate = useNavigate()

  const user = useMemo(() => adminUserFromSession(), [])

  const signOut = useCallback(() => {
    clearSession()
    navigate(ADMIN_SIGN_IN_PATH, { replace: true })
  }, [navigate])

  const goToProfile = useCallback(() => {
    navigate('/admin/profile')
  }, [navigate])

  return { user, signOut, goToProfile }
}
