import { Outlet } from 'react-router-dom'
import { PermissionGuard } from '@/pages/admin/components/PermissionGuard'

/** Layout for nested `/admin/finance/invoices/*` routes. */
export function InvoiceFinanceRoutes() {
  return (
    <PermissionGuard>
      <Outlet />
    </PermissionGuard>
  )
}
