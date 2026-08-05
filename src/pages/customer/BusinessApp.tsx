import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/pages/website/components/PublicLayout'
import { CorporateLandingPage } from '@/pages/website/business/CorporateLandingPage'
import { businessAppBase } from '@/shared/auth/customerSegment'
import { loadSession } from '@/shared/auth/session'
import { MarinePortalApp } from './marine/App'
import { CorporatePortalApp } from './corporate/App'
import { B2bAgentPortalApp } from './b2b-agent/App'

function LegacyBusinessAppRedirect() {
  const session = loadSession()
  if (session?.portal === 'business' && session.customerType) {
    return <Navigate to={`${businessAppBase(session.customerType)}/dashboard`} replace />
  }
  return <Navigate to="/sign-in/business" replace />
}

export function B2BCustomerApp() {
  return (
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
  )
}
