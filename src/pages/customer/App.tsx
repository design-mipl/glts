import { Routes, Route, Navigate } from 'react-router-dom'
import { CustomerShell } from './features/shared/layout/CustomerShell'
import { DashboardPage } from './features/dashboard/pages/DashboardPage'
import { ProfileDetailsPage } from './features/profile/pages/ProfileDetailsPage'
import { ApplicationsListPage } from './features/applications/pages/ApplicationsListPage'
import { ApplicationDetailPage } from './features/applications/pages/ApplicationDetailPage'
import { CreateApplicationFlowPage } from './features/applications/pages/create/CreateApplicationFlowPage'
import { AdminListingPage } from './features/user-management/admins/pages/AdminListingPage'
import { AdminDetailPage } from './features/user-management/admins/pages/AdminDetailPage'
import { BookersPage } from './features/user-management/bookers/pages/BookersPage'
import { BookerDetailPage } from './features/user-management/bookers/pages/BookerDetailPage'
import { UserManagementRedirect } from './features/user-management/UserManagementRedirect'
import { LegacyBookerRedirect } from './features/user-management/LegacyBookerRedirect'
import { TrackingPage } from './features/tracking/pages/TrackingPage'
import { PlaceholderPage } from './features/shared/pages/PlaceholderPage'
import { CrewUploadPage } from './features/marine/pages/CrewUploadPage'
import { EntityListingPage } from './features/masters/entities/pages/EntityListingPage'
import { EntityDetailPage } from './features/masters/entities/pages/EntityDetailPage'
import { VesselListingPage } from './features/masters/vessels/pages/VesselListingPage'
import { VesselDetailPage } from './features/masters/vessels/pages/VesselDetailPage'
import { FinanceOverviewPage } from './features/finance/pages/FinanceOverviewPage'
import { InvoiceListingPage } from './features/finance/pages/InvoiceListingPage'
import { InvoiceDetailPage } from './features/finance/pages/InvoiceDetailPage'
import { PaymentListingPage } from './features/finance/pages/PaymentListingPage'
import { PaymentDetailPage } from './features/finance/pages/PaymentDetailPage'
import { OutstandingStatementsPage } from './features/finance/pages/OutstandingStatementsPage'

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
        <Route path="finance" element={<Navigate to="finance/overview" replace />} />
        <Route path="finance/overview" element={<FinanceOverviewPage />} />
        <Route path="finance/invoices" element={<InvoiceListingPage />} />
        <Route path="finance/invoices/:invoiceId" element={<InvoiceDetailPage />} />
        <Route path="finance/payments" element={<PaymentListingPage />} />
        <Route path="finance/payments/:paymentId" element={<PaymentDetailPage />} />
        <Route path="finance/outstanding" element={<OutstandingStatementsPage />} />
        <Route path="finance/advance-payments" element={<Navigate to="../overview" replace />} />
        <Route path="finance/payment-history" element={<Navigate to="../payments" replace />} />
        <Route path="finance/receipts" element={<Navigate to="../payments" replace />} />
        <Route path="applications/new/single" element={<Navigate to="../new" replace />} />
        <Route path="applications/new/bulk" element={<Navigate to="../new" replace />} />
        <Route path="documents" element={<PlaceholderPage title="Documents vault" />} />
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="users" element={<UserManagementRedirect />} />
        <Route path="users/admins" element={<AdminListingPage />} />
        <Route path="users/admins/:adminId" element={<AdminDetailPage />} />
        <Route path="users/bookers" element={<BookersPage />} />
        <Route path="users/bookers/:bookerId" element={<BookerDetailPage />} />
        <Route path="bookers" element={<Navigate to="users/bookers" replace />} />
        <Route path="bookers/:bookerId" element={<LegacyBookerRedirect />} />
        <Route path="masters/entities" element={<EntityListingPage />} />
        <Route path="masters/entities/:entityId" element={<EntityDetailPage />} />
        <Route path="masters/vessels" element={<VesselListingPage />} />
        <Route path="masters/vessels/:vesselId" element={<VesselDetailPage />} />
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
