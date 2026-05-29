import { useLocation } from 'react-router-dom'
import {
  BUSINESS_WORKSPACE_ID,
  loadSession,
  type CustomerPortalRole,
} from '@/shared/auth/session'
import {
  canAccessAdminManagement,
  canAccessBookerManagement,
  canAccessMasters,
  canAccessUserManagement,
  canCreateApplications,
  canManageAdmins,
  canManageBookers,
  isBooker,
  isPortalAdmin,
  isSuperAdmin,
} from '@/shared/auth/customerRoleAccess'

export function useCustomerPortalBase() {
  const isBusiness = useLocation().pathname.startsWith('/business')
  const base = isBusiness ? '/business/app' : '/retail'
  const session = loadSession()
  const userRole = session?.userRole
  const contactName = session?.contactName ?? 'User'
  const companyName =
    session?.companyName ?? (isBusiness ? BUSINESS_WORKSPACE_ID : 'Your company')

  return {
    isBusiness,
    base,
    session,
    userRole,
    isSuperAdmin: isSuperAdmin(userRole),
    isAdmin: isPortalAdmin(userRole),
    isBooker: isBooker(userRole),
    canAccessUserManagement: canAccessUserManagement(userRole),
    canAccessAdminManagement: canAccessAdminManagement(userRole),
    canAccessBookerManagement: canAccessBookerManagement(userRole),
    canAccessMasters: canAccessMasters(userRole),
    canCreateApplications: canCreateApplications(userRole),
    canManageAdmins: canManageAdmins(userRole),
    canManageBookers: canManageBookers(userRole),
    contactName,
    companyName,
  }
}

export { canManageBookers } from '@/shared/auth/customerRoleAccess'
export type { CustomerPortalRole }
