import { contactNameFromEmail, type CustomerPortalRole } from '@/shared/auth/session'
import { adminManagementService } from '@/shared/services/adminManagementService'
import { bookerManagementService } from '@/shared/services/bookerManagementService'

const SUPER_ADMIN_EMAIL = 'admin@glts.com'
const SUPER_ADMIN_NAME = 'Rajan Mehta'

export function resolveApplicationCreatorLabel(email: string): string {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return '--'
  if (normalized === SUPER_ADMIN_EMAIL) return SUPER_ADMIN_NAME

  const admin = adminManagementService.getByEmail(normalized)
  if (admin) return admin.fullName

  const booker = bookerManagementService.list().find(row => row.email === normalized)
  if (booker) return booker.fullName

  return contactNameFromEmail(normalized)
}

export function resolveApplicationCreatorRoleLabel(role: CustomerPortalRole): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin'
    case 'admin':
      return 'Admin'
    case 'booker':
      return 'Booker'
    default:
      return 'User'
  }
}

export function getApplicationCreatorOptions(emails: string[]) {
  const unique = [...new Set(emails.map(e => e.trim().toLowerCase()).filter(Boolean))].sort()
  return unique.map(email => ({
    value: email,
    label: resolveApplicationCreatorLabel(email),
  }))
}
