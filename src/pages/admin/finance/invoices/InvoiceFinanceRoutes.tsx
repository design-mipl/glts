import { Outlet, useLocation } from 'react-router-dom'
import { PermissionGuard } from '@/pages/admin/components/PermissionGuard'

/** Layout for nested `/admin/finance/invoices/*` routes (React Router 7). */
export function InvoiceFinanceRoutes() {
  const location = useLocation()

  return (
    <PermissionGuard>
      <Outlet key={location.pathname} />
    </PermissionGuard>
  )
}
