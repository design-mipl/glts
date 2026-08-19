import { Outlet } from 'react-router-dom'
import { PermissionGuard } from '@/pages/admin/components/PermissionGuard'

/** Layout for nested `/admin/finance/vendor-billing/*` routes. */
export function VendorBillingRoutes() {
  return (
    <PermissionGuard>
      <Outlet />
    </PermissionGuard>
  )
}
