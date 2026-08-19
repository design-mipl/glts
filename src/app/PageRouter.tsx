import { Routes, Route, Navigate } from 'react-router-dom'
import { LazyRouteBoundary, lazyNamed } from '@/shared/routing/lazyRoute'

const AuthApp = lazyNamed(() => import('@/pages/auth/AuthApp'), 'AuthApp')
const RetailPortalApp = lazyNamed(() => import('@/pages/customer/RetailApp'), 'RetailPortalApp')
const B2BCustomerApp = lazyNamed(() => import('@/pages/customer/BusinessApp'), 'B2BCustomerApp')
const AdminPortalApp = lazyNamed(() => import('@/pages/admin/App'), 'AdminPortalApp')
const PublicWebsiteApp = lazyNamed(() => import('@/pages/website/App'), 'PublicWebsiteApp')
const PublicWebsiteV2App = lazyNamed(() => import('@/pages/website-v2/App'), 'PublicWebsiteV2App')

export function PageRouter() {
  return (
    <LazyRouteBoundary label="Loading portal…">
      <Routes>
        {/* Sign-in flow — /sign-in/* */}
        <Route path="/sign-in/*" element={<AuthApp />} />

        {/* Legacy operations entry now belongs inside the admin portal. */}
        <Route path="/operations/*" element={<Navigate to="/admin/operations" replace />} />

        {/* Retail Portal — /retail/* (index + splat for React Router 7 path resolution) */}
        <Route path="/retail">
          <Route index element={<RetailPortalApp />} />
          <Route path="*" element={<RetailPortalApp />} />
        </Route>

        {/* B2B Portal — /business/* */}
        <Route path="/business/*" element={<B2BCustomerApp />} />

        {/* Admin Portal — /admin/* (index + splat so bare /admin mounts after login) */}
        <Route path="/admin">
          <Route index element={<AdminPortalApp />} />
          <Route path="*" element={<AdminPortalApp />} />
        </Route>

        {/* Public Website v2 — alternate marketing site (full page set under /v2) */}
        <Route path="/v2">
          <Route index element={<PublicWebsiteV2App />} />
          <Route path="*" element={<PublicWebsiteV2App />} />
        </Route>

        {/* Public Website — everything else */}
        <Route path="/*" element={<PublicWebsiteApp />} />
      </Routes>
    </LazyRouteBoundary>
  )
}
