import { Navigate, Routes, Route } from 'react-router-dom'
import type { ReactNode } from 'react'
import { loadSession } from '@/shared/auth/session'
import { LazyRouteBoundary } from '@/shared/routing/lazyRoute'
import { RetailAccountShell } from './retail-account/RetailAccountShell'
import { RetailAccountPage } from './retail-account/RetailAccountPage'
import { RetailApplicationDetailPage } from './retail-account/RetailApplicationDetailPage'

function RetailSessionGate({ children }: { children: ReactNode }) {
  const session = loadSession()
  if (!session || session.portal !== 'retail') {
    return <Navigate to="/sign-in/retail" replace />
  }
  return <>{children}</>
}

/**
 * Retail B2C account — website chrome, not the enterprise customer portal shell.
 * Business portals continue to use CustomerPortalApp + CustomerShell unchanged.
 */
export function RetailPortalApp() {
  return (
    <RetailSessionGate>
      <LazyRouteBoundary label="Loading…">
        <Routes>
          <Route element={<RetailAccountShell />}>
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<RetailAccountPage section="applications" />} />
            <Route path="account/documents" element={<RetailAccountPage section="documents" />} />
            {/* Profile is not its own destination — it lives in the account rail. */}
            <Route path="account/profile" element={<Navigate to="/retail/account" replace />} />
            <Route path="profile" element={<Navigate to="/retail/account" replace />} />
            <Route path="dashboard" element={<Navigate to="/retail/account" replace />} />
            <Route path="documents" element={<Navigate to="/retail/account/documents" replace />} />
            <Route path="applications" element={<Navigate to="/retail/account" replace />} />
            <Route path="applications/:applicationId" element={<RetailApplicationDetailPage />} />
            <Route path="*" element={<Navigate to="/retail/account" replace />} />
          </Route>
        </Routes>
      </LazyRouteBoundary>
    </RetailSessionGate>
  )
}
