import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { businessSignInPath } from '@/shared/auth/customerSegment'
import { clearSession } from '@/shared/auth/session'
import { useCustomerPortalBase } from './useCustomerPortalBase'

export function useCustomerLogout() {
  const navigate = useNavigate()
  const { isBusiness, customerType } = useCustomerPortalBase()

  return useCallback(() => {
    const signIn =
      isBusiness && customerType ? businessSignInPath(customerType) : isBusiness ? '/sign-in/business' : '/'
    clearSession()
    navigate(signIn, { replace: true })
  }, [customerType, isBusiness, navigate])
}
