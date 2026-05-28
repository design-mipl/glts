import { useLocation } from 'react-router-dom'
import { BUSINESS_WORKSPACE_ID, loadSession, type PortalUserRole } from '@/shared/auth/session'

export function useCustomerPortalBase() {
  const isBusiness = useLocation().pathname.startsWith('/business')
  const base = isBusiness ? '/business/app' : '/retail'
  const session = loadSession()
  const isAdmin = session?.userRole === 'corporate_admin'
  const contactName = session?.contactName ?? 'User'
  const companyName =
    session?.companyName ?? (isBusiness ? BUSINESS_WORKSPACE_ID : 'Your company')

  return { isBusiness, base, session, isAdmin, contactName, companyName }
}

export function canManageBookers(role?: PortalUserRole): boolean {
  return role === 'corporate_admin'
}
