import { Routes, Route, Navigate } from 'react-router-dom'
import { PortalSelectionPage } from './pages/PortalSelectionPage'
import { BusinessLoginHubPage } from './pages/BusinessLoginHubPage'
import { MarineLoginPage } from './pages/MarineLoginPage'
import { CorporateLoginPage } from './pages/CorporateLoginPage'
import { B2bAgentLoginPage } from './pages/B2bAgentLoginPage'
import { OperationsLoginPage } from './pages/OperationsLoginPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'

export function AuthApp() {
  return (
    <Routes>
      <Route index element={<PortalSelectionPage />} />
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
  )
}
