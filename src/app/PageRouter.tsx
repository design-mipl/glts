import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicWebsiteApp } from '@/pages/website/App'
import { RetailPortalApp } from '@/pages/customer/RetailApp'
import { B2BCustomerApp } from '@/pages/customer/BusinessApp'
import { AdminPortalApp } from '@/pages/admin/App'
import { AuthApp } from '@/pages/auth/AuthApp'

export function PageRouter() {
  return (
    <Routes>
      {/* Sign-in flow — /sign-in/* */}
      <Route path="/sign-in/*" element={<AuthApp />} />

      {/* Legacy operations entry now belongs inside the admin portal. */}
      <Route path="/operations/*" element={<Navigate to="/admin/operations" replace />} />

      {/* Retail Portal — /retail/* (nested splat for React Router 7 path resolution) */}
      <Route path="/retail">
        <Route path="*" element={<RetailPortalApp />} />
      </Route>

      {/* B2B Portal — /business/* */}
      <Route path="/business/*" element={<B2BCustomerApp />} />

      {/* Admin Portal — /admin/* */}
      <Route path="/admin">
        <Route path="*" element={<AdminPortalApp />} />
      </Route>

      {/* Public Website — everything else */}
      <Route path="/*" element={<PublicWebsiteApp />} />
    </Routes>
  )
}
