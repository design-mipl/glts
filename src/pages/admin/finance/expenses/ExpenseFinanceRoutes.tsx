import { Outlet, useLocation } from 'react-router-dom'
import { PermissionGuard } from '@/pages/admin/components/PermissionGuard'

/** Layout for nested `/admin/finance/expenses/*` routes. */
export function ExpenseFinanceRoutes() {
  const location = useLocation()

  return (
    <PermissionGuard>
      <Outlet key={location.pathname} />
    </PermissionGuard>
  )
}
