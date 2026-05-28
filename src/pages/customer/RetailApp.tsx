import { Routes, Route, Navigate } from 'react-router-dom'
import { CustomerPortalApp } from './App'

export function RetailPortalApp() {
  return (
    <Routes>
      <Route path="/*" element={<CustomerPortalApp />} />
      <Route path="*" element={<Navigate to="/retail/dashboard" replace />} />
    </Routes>
  )
}
