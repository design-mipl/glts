import { AdminRoutes } from './config/adminRoutes'
import { AdminShell } from './layout/AdminShell'

export function AdminPortalApp() {
  return (
    <AdminShell>
      <AdminRoutes />
    </AdminShell>
  )
}
