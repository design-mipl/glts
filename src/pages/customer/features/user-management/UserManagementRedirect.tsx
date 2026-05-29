import { Navigate } from 'react-router-dom'
import { loadSession } from '@/shared/auth/session'
import { canAccessAdminManagement } from '@/shared/auth/customerRoleAccess'

/** Redirect /users to the appropriate submodule based on role */
export function UserManagementRedirect() {
  const session = loadSession()
  if (canAccessAdminManagement(session?.userRole)) {
    return <Navigate to="admins" replace />
  }
  return <Navigate to="bookers" replace />
}
