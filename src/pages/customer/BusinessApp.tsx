import { Navigate, Route, Routes } from 'react-router-dom'
import { LazyRouteBoundary, lazyNamed } from '@/shared/routing/lazyRoute'
import { PublicLayout } from '@/pages/website/components/PublicLayout'
import { businessAppBase } from '@/shared/auth/customerSegment'
import { loadSession } from '@/shared/auth/session'

const MarinePortalApp = lazyNamed(() => import('./marine/App'), 'MarinePortalApp')
const CorporatePortalApp = lazyNamed(() => import('./corporate/App'), 'CorporatePortalApp')
const B2bAgentPortalApp = lazyNamed(() => import('./b2b-agent/App'), 'B2bAgentPortalApp')
const CorporateLandingPage = lazyNamed(
  () => import('@/pages/website/business/CorporateLandingPage'),
  'CorporateLandingPage',
)

function LegacyBusinessAppRedirect() {
  const session = loadSession()
  if (session?.portal === 'business' && session.customerType) {
    return <Navigate to={`${businessAppBase(session.customerType)}/dashboard`} replace />
  }
  return <Navigate to="/sign-in/business" replace />
}

export function B2BCustomerApp() {
  return (
    <LazyRouteBoundary label="Loading portal…">
      <Routes>
        <Route path="login" element={<Navigate to="/sign-in/business" replace />} />
        <Route path="forgot-password" element={<Navigate to="/sign-in/business/forgot-password" replace />} />
        <Route path="app/marine/*" element={<MarinePortalApp />} />
        <Route path="app/corporate/*" element={<CorporatePortalApp />} />
        <Route path="app/b2b/*" element={<B2bAgentPortalApp />} />
        <Route path="app/*" element={<LegacyBusinessAppRedirect />} />
        <Route
          index
          element={
            <PublicLayout>
              <CorporateLandingPage />
            </PublicLayout>
          }
        />
        <Route path="*" element={<Navigate to="/business" replace />} />
      </Routes>
    </LazyRouteBoundary>
  )
}
