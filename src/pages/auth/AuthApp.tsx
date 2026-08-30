import { Navigate, Route, Routes } from 'react-router-dom'
import { LazyRouteBoundary } from '@/shared/routing/lazyRoute'
import {
  B2bAgentLoginPage,
  BusinessLoginHubPage,
  CorporateLoginPage,
  ForgotPasswordPage,
  MarineLoginPage,
  OperationsLoginPage,
  PortalSelectionPage,
  RetailLoginPage,
} from './authRoutePages'

export function AuthApp() {
  return (
    <LazyRouteBoundary label="Loading…">
      <Routes>
        <Route index element={<PortalSelectionPage />} />
        <Route path="retail" element={<RetailLoginPage />} />
        <Route path="business" element={<BusinessLoginHubPage />} />
        <Route path="business/marine" element={<MarineLoginPage />} />
        <Route path="business/corporate" element={<CorporateLoginPage />} />
        <Route path="business/b2b" element={<B2bAgentLoginPage />} />
        <Route path="business/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="business/marine/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="business/corporate/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="business/b2b/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="operations" element={<OperationsLoginPage />} />
        <Route path="operations/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </LazyRouteBoundary>
  )
}
