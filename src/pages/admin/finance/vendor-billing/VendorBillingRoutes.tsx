import { Outlet, useLocation } from 'react-router-dom'
import { PermissionGuard } from '@/pages/admin/components/PermissionGuard'

/** Layout for nested `/admin/finance/vendor-billing/*` routes. */
export function VendorBillingRoutes() {
  const location = useLocation()

  return (
    <PermissionGuard>
      <Outlet key={location.pathname} />
    </PermissionGuard>
  )
}
