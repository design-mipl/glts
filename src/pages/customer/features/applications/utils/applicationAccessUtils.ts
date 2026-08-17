import type { CustomerPortalRole } from '@/shared/auth/session'
import type { AuthSession } from '@/shared/auth/session'
import { mapCustomerTypeToApplicationSegment } from '@/shared/config/applicationCustomerSegmentConfig'
import { adminManagementService } from '@/shared/services/adminManagementService'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import type { ApplicationCustomerSegment } from '../types/applicationListing.types'

export interface ApplicationAccessMeta {
  createdByEmail: string
  createdByRole: CustomerPortalRole
  customerSegment?: ApplicationCustomerSegment
}

export function canViewApplication(
  app: ApplicationAccessMeta,
  session: AuthSession | null,
): boolean {
  if (!session?.email) return false
  const role = session.userRole ?? 'booker'
  const email = session.email.toLowerCase()

  let allowed = false
  if (role === 'super_admin') {
    allowed = true
  } else if (role === 'booker') {
    allowed = app.createdByEmail.toLowerCase() === email
  } else if (role === 'admin') {
    if (app.createdByEmail.toLowerCase() === email) {
      allowed = true
    } else {
      const admin = adminManagementService.getByEmail(email)
      if (admin) {
        const assignedBookerEmails = bookerManagementService
          .list({ scopedToAdminId: admin.id })
          .map(b => b.email.toLowerCase())
        allowed = assignedBookerEmails.includes(app.createdByEmail.toLowerCase())
      }
    }
  }

  if (!allowed) return false

  if (session.portal === 'business' && session.customerType && app.customerSegment) {
    return app.customerSegment === mapCustomerTypeToApplicationSegment(session.customerType)
  }

  return true
}

export function filterApplicationsBySession<T extends ApplicationAccessMeta>(
  rows: T[],
  session: AuthSession | null,
): T[] {
  return rows.filter(row => canViewApplication(row, session))
}

export function getSessionCreatorMeta(session: AuthSession | null): ApplicationAccessMeta {
  const email = session?.email?.toLowerCase() ?? 'unknown@glts.com'
  const role = session?.userRole ?? 'booker'
  return { createdByEmail: email, createdByRole: role }
}
