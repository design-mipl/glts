import { useCallback, useMemo, useState } from 'react'
import { loadSession } from '@/shared/auth/session'
import { useAdminSession } from '@/pages/admin/hooks/useAdminSession'
import type { AdminProfileWorkspace, AdminSessionInfo } from '../types/adminProfileWorkspace'

function buildInitialSessions(): AdminSessionInfo[] {
  return [
    {
      id: 'current-session',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      lastActive: 'Just now',
      isCurrent: true,
    },
    {
      id: 'laptop-session',
      device: 'Edge on Windows',
      location: 'Pune, India',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
  ]
}

export function useAdminProfileWorkspace() {
  const { user } = useAdminSession()
  const session = loadSession()

  const initialWorkspace = useMemo<AdminProfileWorkspace>(
    () => ({
      account: {
        displayName: user.name,
        email: user.email,
        role: user.role ?? 'System administrator',
        portal: session?.portal ? session.portal : 'operations',
        team: 'Operations control',
      },
      security: {
        twoFactorEnabled: false,
        passwordLastUpdated: '14 days ago',
        recoveryEmail: user.email,
      },
      sessions: buildInitialSessions(),
    }),
    [session?.portal, user.email, user.name, user.role],
  )

  const [workspace, setWorkspace] = useState<AdminProfileWorkspace>(initialWorkspace)

  const updateAccount = useCallback((patch: Partial<AdminProfileWorkspace['account']>) => {
    setWorkspace(prev => ({ ...prev, account: { ...prev.account, ...patch } }))
  }, [])

  const setSessions = useCallback((sessions: AdminSessionInfo[]) => {
    setWorkspace(prev => ({ ...prev, sessions }))
  }, [])

  return { workspace, updateAccount, setSessions }
}
