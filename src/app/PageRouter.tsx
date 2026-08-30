import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LazyRouteBoundary, lazyNamed } from '@/shared/routing/lazyRoute'

const AuthApp = lazyNamed(() => import('@/pages/auth/AuthApp'), 'AuthApp')
const RetailPortalApp = lazyNamed(() => import('@/pages/customer/RetailApp'), 'RetailPortalApp')
const B2BCustomerApp = lazyNamed(() => import('@/pages/customer/BusinessApp'), 'B2BCustomerApp')
const AdminPortalApp = lazyNamed(() => import('@/pages/admin/App'), 'AdminPortalApp')
const PublicWebsiteApp = lazyNamed(() => import('@/pages/website/App'), 'PublicWebsiteApp')

/** Preserve deep links from former `/v1/*` and `/v2/*` mounts. */
function RedirectPrefixedWebsiteToMain({ prefix }: { prefix: '/v1' | '/v2' }) {
  const location = useLocation()
  const rest = location.pathname.replace(new RegExp(`^${prefix}/?`), '/') || '/'
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

        {/* Former website prefixes → main public site */}
        <Route path="/v1" element={<RedirectPrefixedWebsiteToMain prefix="/v1" />} />
        <Route path="/v1/*" element={<RedirectPrefixedWebsiteToMain prefix="/v1" />} />
        <Route path="/v2" element={<RedirectPrefixedWebsiteToMain prefix="/v2" />} />
        <Route path="/v2/*" element={<RedirectPrefixedWebsiteToMain prefix="/v2" />} />

        {/* Public Website — main marketing site */}
        <Route path="/*" element={<PublicWebsiteApp />} />
      </Routes>
    </LazyRouteBoundary>
  )
}
