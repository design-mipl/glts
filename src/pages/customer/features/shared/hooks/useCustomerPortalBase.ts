import { useLocation } from 'react-router-dom'
import {
  BUSINESS_WORKSPACE_ID,
  loadSession,
  type CustomerPortalRole,
  type CustomerType,
} from '@/shared/auth/session'
import {
  businessAppBase,
  parseBusinessSegmentFromPath,
} from '@/shared/auth/customerSegment'
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
  const pathname = useLocation().pathname
  const isBusiness = pathname.startsWith('/business')
  const session = loadSession()
  const pathSegment = parseBusinessSegmentFromPath(pathname)
  const customerType: CustomerType | undefined = pathSegment ?? session?.customerType
  const base = isBusiness
    ? customerType
      ? businessAppBase(customerType)
      : '/business/app'
    : '/retail'
  const userRole = session?.userRole
  const contactName = session?.contactName ?? 'User'
  const companyName =
    session?.companyName ?? (isBusiness ? BUSINESS_WORKSPACE_ID : 'Your company')

  return {
    isBusiness,
    base,
    session,
    customerType,
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
