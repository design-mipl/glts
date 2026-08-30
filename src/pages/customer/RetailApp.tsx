import { Navigate, Routes, Route } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { loadSession } from '@/shared/auth/session'
import { LazyRouteBoundary } from '@/shared/routing/lazyRoute'
import { RetailAccountShell } from './retail-account/RetailAccountShell'
import { RetailAccountPage } from './retail-account/RetailAccountPage'
import { ApplicationDetailPage } from './shared/customerRoutePages'
import { PublicContainer } from '@/pages/website/components/PublicContainer'
import { applyCanvasSx } from '@/pages/website/theme/applyFlowTheme'

function RetailSessionGate({ children }: { children: ReactNode }) {
  const session = loadSession()
  if (!session || session.portal !== 'retail') {
    return <Navigate to="/sign-in/retail" replace />
  }
  return <>{children}</>
}

function RetailApplicationDetailPage() {
  return (
    <Box sx={{ ...applyCanvasSx, py: { xs: 3, md: 4 } }}>
      <PublicContainer>
        <ApplicationDetailPage />
      </PublicContainer>
    </Box>
  )
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
            <Route path="account" element={<RetailAccountPage />} />
            <Route path="profile" element={<Navigate to="/retail/account" replace />} />
            <Route path="dashboard" element={<Navigate to="/retail/account" replace />} />
            <Route path="documents" element={<Navigate to="/retail/account" replace />} />
            <Route path="applications" element={<Navigate to="/retail/account" replace />} />
            <Route path="applications/:applicationId" element={<RetailApplicationDetailPage />} />
            <Route path="*" element={<Navigate to="/retail/account" replace />} />
          </Route>
        </Routes>
      </LazyRouteBoundary>
    </RetailSessionGate>
  )
}
