import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LazyRouteBoundary, lazyNamed } from '@/shared/routing/lazyRoute'

const AuthApp = lazyNamed(() => import('@/pages/auth/AuthApp'), 'AuthApp')
const RetailPortalApp = lazyNamed(() => import('@/pages/customer/RetailApp'), 'RetailPortalApp')
const B2BCustomerApp = lazyNamed(() => import('@/pages/customer/BusinessApp'), 'B2BCustomerApp')
const AdminPortalApp = lazyNamed(() => import('@/pages/admin/App'), 'AdminPortalApp')
const PublicWebsiteApp = lazyNamed(() => import('@/pages/website/App'), 'PublicWebsiteApp')
const PublicWebsiteV2App = lazyNamed(() => import('@/pages/website-v2/App'), 'PublicWebsiteV2App')

/** Preserve deep links from the former `/v2/*` mount. */
function RedirectV2ToMain() {
  const location = useLocation()
  const rest = location.pathname.replace(/^\/v2\/?/, '/') || '/'
  const normalized = rest === '//' ? '/' : rest
  return <Navigate to={`${normalized}${location.search}${location.hash}`} replace />
}

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

        {/* Legacy public website — Site A under /v1 */}
        <Route path="/v1">
          <Route index element={<PublicWebsiteApp />} />
          <Route path="*" element={<PublicWebsiteApp />} />
        </Route>

        {/* Former website-v2 prefix → main site */}
        <Route path="/v2" element={<RedirectV2ToMain />} />
        <Route path="/v2/*" element={<RedirectV2ToMain />} />

        {/* Public Website (website-v2) — main marketing site */}
        <Route path="/*" element={<PublicWebsiteV2App />} />
      </Routes>
    </LazyRouteBoundary>
  )
}
