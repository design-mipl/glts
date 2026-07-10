import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSession } from '@/shared/auth/session'
import { useCustomerPortalBase } from './useCustomerPortalBase'

export function useCustomerLogout() {
  const navigate = useNavigate()
  const { isBusiness } = useCustomerPortalBase()

  return useCallback(() => {
    clearSession()
    navigate(isBusiness ? '/sign-in/business' : '/', { replace: true })
  }, [isBusiness, navigate])
}
