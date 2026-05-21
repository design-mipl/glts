import { Routes, Route } from 'react-router-dom'
import { PublicWebsiteApp } from './portals/PublicWebsite/App'
import { RetailPortalApp } from './portals/RetailCustomerPortal/App'
import { B2BCustomerApp } from './portals/B2BCustomerPortal/App'
import { AdminPortalApp } from './portals/AdminPortal/App'

export function PortalRouter() {
  return (
    <Routes>
      {/* Retail Portal — /retail/* */}
      <Route path="/retail/*" element={<RetailPortalApp />} />

      {/* B2B Portal — /business/* */}
      <Route path="/business/*" element={<B2BCustomerApp />} />

      {/* Admin Portal — /admin/* */}
      <Route path="/admin/*" element={<AdminPortalApp />} />

      {/* Public Website — everything else */}
      <Route path="/*" element={<PublicWebsiteApp />} />
    </Routes>
  )
}
