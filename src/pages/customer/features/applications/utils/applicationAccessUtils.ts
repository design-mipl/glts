import type { CustomerPortalRole } from '@/shared/auth/session'
import type { AuthSession } from '@/shared/auth/session'
import { adminManagementService } from '@/shared/services/adminManagementService'
import { bookerManagementService } from '@/shared/services/bookerManagementService'

export interface ApplicationAccessMeta {
  createdByEmail: string
  createdByRole: CustomerPortalRole
}

export function canViewApplication(
  app: ApplicationAccessMeta,
  session: AuthSession | null,
): boolean {
  if (!session?.email) return false
  const role = session.userRole ?? 'booker'
  const email = session.email.toLowerCase()

  if (role === 'super_admin') return true

  if (role === 'booker') {
    return app.createdByEmail.toLowerCase() === email
  }

  if (role === 'admin') {
    if (app.createdByEmail.toLowerCase() === email) return true
    const admin = adminManagementService.getByEmail(email)
    if (!admin) return false
    const assignedBookerEmails = bookerManagementService
      .list({ scopedToAdminId: admin.id })
      .map(b => b.email.toLowerCase())
    return assignedBookerEmails.includes(app.createdByEmail.toLowerCase())
  }

  return false
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
