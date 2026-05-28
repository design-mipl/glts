import { Routes, Route, Navigate } from 'react-router-dom'
import { CustomerShell } from './features/shared/layout/CustomerShell'
import { DashboardPage } from './features/dashboard/pages/DashboardPage'
import { ProfileDetailsPage } from './features/profile/pages/ProfileDetailsPage'
import { ApplicationsListPage } from './features/applications/pages/ApplicationsListPage'
import { ApplicationDetailPage } from './features/applications/pages/ApplicationDetailPage'
import { CreateApplicationFlowPage } from './features/applications/pages/create/CreateApplicationFlowPage'
import { BookersPage } from './features/bookers/pages/BookersPage'
import { BookerDetailPage } from './features/bookers/pages/BookerDetailPage'
import { TrackingPage } from './features/tracking/pages/TrackingPage'
import { PlaceholderPage } from './features/shared/pages/PlaceholderPage'
import { CrewUploadPage } from './features/marine/pages/CrewUploadPage'

export function CustomerPortalApp() {
  return (
    <Routes>
      <Route element={<CustomerShell />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfileDetailsPage />} />
        <Route path="applications" element={<ApplicationsListPage />} />
        <Route path="applications/new" element={<CreateApplicationFlowPage />} />
        <Route path="applications/:applicationId" element={<ApplicationDetailPage />} />
        <Route path="applications/new/single" element={<Navigate to="../new" replace />} />
        <Route path="applications/new/bulk" element={<Navigate to="../new" replace />} />
        <Route path="documents" element={<PlaceholderPage title="Documents vault" />} />
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="bookers" element={<BookersPage />} />
        <Route path="bookers/:bookerId" element={<BookerDetailPage />} />
        <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
        <Route path="support" element={<PlaceholderPage title="Support" />} />
        <Route path="settings" element={<Navigate to="../profile" replace />} />
        <Route path="marine/crew" element={<CrewUploadPage />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="applications/new/travelers" element={<Navigate to="../new" replace />} />
      <Route path="applications/new/docs" element={<Navigate to="../new" replace />} />
      <Route path="applications/new/essentials" element={<Navigate to="../new" replace />} />
      <Route path="applications/new/checkout" element={<Navigate to="../new" replace />} />

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}
