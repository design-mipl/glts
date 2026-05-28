import { Routes, Route, Navigate } from 'react-router-dom'
import { PortalSelectionPage } from './pages/PortalSelectionPage'
import { BusinessLoginPage } from './pages/BusinessLoginPage'
import { OperationsLoginPage } from './pages/OperationsLoginPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'

export function AuthApp() {
  return (
    <Routes>
      <Route index element={<PortalSelectionPage />} />
      <Route path="business" element={<BusinessLoginPage />} />
      <Route path="business/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="operations" element={<OperationsLoginPage />} />
      <Route path="operations/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  )
}
