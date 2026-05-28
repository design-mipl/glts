import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/pages/website/components/PublicLayout'
import { CorporateLandingPage } from '@/pages/website/business/CorporateLandingPage'
import { CustomerPortalApp } from './App'

export function B2BCustomerApp() {
  return (
    <Routes>
      <Route path="login" element={<Navigate to="/sign-in/business" replace />} />
      <Route path="forgot-password" element={<Navigate to="/sign-in/business/forgot-password" replace />} />
      <Route path="app/*" element={<CustomerPortalApp />} />
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
