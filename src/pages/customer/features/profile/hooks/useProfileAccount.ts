import { useCallback, useMemo, useState } from 'react'
import { loadSession } from '@/shared/auth/session'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import type { AccountWorkspace, PersonalAccount, UserSession } from '../types/accountWorkspace'

export function useProfileAccount() {
  const initial = useMemo(() => customerPortalService.getAccountWorkspace(), [])
  const [workspace, setWorkspace] = useState<AccountWorkspace>(initial)
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(null)

  const session = loadSession()
  const isAdmin = session?.userRole === 'corporate_admin'

  const updatePersonalAccount = useCallback((patch: Partial<PersonalAccount>) => {
    setWorkspace(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        account: { ...prev.personal.account, ...patch },
      },
    }))
  }, [])

  const setSessions = useCallback((sessions: UserSession[]) => {
    setWorkspace(prev => ({
      ...prev,
      personal: { ...prev.personal, sessions },
    }))
  }, [])

  return {
    workspace,
    isLoading,
    error,
    isAdmin,
    updatePersonalAccount,
    setSessions,
  }
}
