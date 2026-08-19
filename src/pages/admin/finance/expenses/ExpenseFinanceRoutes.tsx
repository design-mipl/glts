import { Outlet } from 'react-router-dom'
import { PermissionGuard } from '@/pages/admin/components/PermissionGuard'

/** Layout for nested `/admin/finance/expenses/*` routes. */
export function ExpenseFinanceRoutes() {
  return (
    <PermissionGuard>
      <Outlet />
    </PermissionGuard>
  )
}
