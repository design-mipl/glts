import type { CustomerPortalRole } from '@/shared/auth/session'

export function isSuperAdmin(role?: CustomerPortalRole): boolean {
  return role === 'super_admin'
}

export function isPortalAdmin(role?: CustomerPortalRole): boolean {
  return role === 'admin'
}

export function isBooker(role?: CustomerPortalRole): boolean {
  return role === 'booker'
}

export function canAccessUserManagement(role?: CustomerPortalRole): boolean {
  return role === 'super_admin' || role === 'admin'
}

export function canAccessAdminManagement(role?: CustomerPortalRole): boolean {
  return role === 'super_admin'
}

export function canAccessBookerManagement(role?: CustomerPortalRole): boolean {
  return role === 'super_admin' || role === 'admin'
}

export function canAccessMasters(role?: CustomerPortalRole): boolean {
  return role === 'super_admin' || role === 'admin'
}

export function canCreateApplications(role?: CustomerPortalRole): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'booker'
}

export function canManageAdmins(role?: CustomerPortalRole): boolean {
  return role === 'super_admin'
}

export function canManageBookers(role?: CustomerPortalRole): boolean {
  return role === 'super_admin' || role === 'admin'
}
