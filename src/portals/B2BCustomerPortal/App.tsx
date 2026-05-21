import { Routes, Route, Navigate } from 'react-router-dom'
import { CorporateLandingPage } from './pages/CorporateLandingPage'
import { PublicLayout } from '../PublicWebsite/components/PublicLayout'

export function B2BCustomerApp() {
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<CorporateLandingPage />} />
        <Route path="*" element={<Navigate to="/business" replace />} />
      </Routes>
    </PublicLayout>
  )
}
