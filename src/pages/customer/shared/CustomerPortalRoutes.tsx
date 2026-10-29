import { Routes, Route, Navigate } from 'react-router-dom'
import { LazyRouteBoundary } from '@/shared/routing/lazyRoute'
import { CustomerShell } from '../features/shared/layout/CustomerShell'
import { UserManagementRedirect } from '../features/user-management/UserManagementRedirect'
import { LegacyBookerRedirect } from '../features/user-management/LegacyBookerRedirect'
import { PlaceholderPage } from '../features/shared/pages/PlaceholderPage'
import {
  AdminDetailPage,
  AdminListingPage,
  ApplicationDetailPage,
  ApplicationsListPage,
  BookerDetailPage,
  BookersPage,
  ContactSupportPage,
  CreateApplicationFlowPage,
  CrewUploadPage,
  DashboardPage,
  EntityDetailPage,
  EntityListingPage,
  FaqPage,
  FinanceOverviewPage,
  InvoiceDetailPage,
  InvoiceListingPage,
  OutstandingStatementsPage,
  PaymentDetailPage,
  PaymentListingPage,
  ProfileDetailsPage,
  TrackingPage,
  VesselDetailPage,
  VesselListingPage,
  StoredDocumentsPage,
} from './customerRoutePages'
import { CustomerSegmentPortalProvider } from './CustomerSegmentPortalContext'
import type { CustomerSegmentPortalConfig } from './segmentTypes'
import { ApplicationFlowPolicyProvider } from '../features/applications/context/ApplicationFlowPolicyContext'
import { mapCustomerTypeToApplicationSegment } from '@/shared/config/applicationCustomerSegmentConfig'

export function CustomerPortalRoutes({ config }: { config?: CustomerSegmentPortalConfig }) {
  const showVesselMaster = config?.showVesselMaster ?? false
  const showCrewUpload = config?.showCrewUpload ?? false
  const customerSegment = mapCustomerTypeToApplicationSegment(config?.customerType)

  const routes = (
    <LazyRouteBoundary label="Loading page…">
      <Routes>
        <Route element={<CustomerShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfileDetailsPage />} />
          <Route path="applications" element={<ApplicationsListPage />} />
          <Route path="applications/new" element={<CreateApplicationFlowPage />} />
          <Route path="applications/:applicationId" element={<ApplicationDetailPage />} />
          <Route path="finance" element={<Navigate to="finance/invoices" replace />} />
          <Route path="finance/overview" element={<FinanceOverviewPage />} />
          <Route path="finance/invoices" element={<InvoiceListingPage />} />
          <Route path="finance/invoices/:invoiceId" element={<InvoiceDetailPage />} />
          <Route path="finance/payments" element={<PaymentListingPage />} />
          <Route path="finance/payments/:paymentId" element={<PaymentDetailPage />} />
          <Route path="finance/outstanding" element={<OutstandingStatementsPage />} />
          <Route path="finance/advance-payments" element={<Navigate to="../invoices" replace />} />
          <Route path="finance/payment-history" element={<Navigate to="../payments" replace />} />
          <Route path="finance/receipts" element={<Navigate to="../payments" replace />} />
          <Route path="applications/new/single" element={<Navigate to="../new" replace />} />
          <Route path="applications/new/bulk" element={<Navigate to="../new" replace />} />
          <Route path="documents" element={<StoredDocumentsPage />} />
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
          {showVesselMaster && (
            <>
              <Route path="masters/vessels" element={<VesselListingPage />} />
              <Route path="masters/vessels/:vesselId" element={<VesselDetailPage />} />
            </>
          )}
          <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
          <Route path="support" element={<Navigate to="support/faq" replace />} />
          <Route path="support/faq" element={<FaqPage />} />
          <Route path="support/contact/*" element={<ContactSupportPage />} />
          <Route path="support/:sectionId" element={<FaqPage />} />
          <Route path="settings" element={<Navigate to="../profile" replace />} />
          {showCrewUpload && <Route path="marine/crew" element={<CrewUploadPage />} />}
          <Route path="*" element={<Navigate to="dashboard" replace relative="route" />} />
        </Route>

        <Route path="applications/new/travelers" element={<Navigate to="../new" replace />} />
        <Route path="applications/new/docs" element={<Navigate to="../new" replace />} />
        <Route path="applications/new/essentials" element={<Navigate to="../new" replace />} />
        <Route path="applications/new/checkout" element={<Navigate to="../new" replace />} />
      </Routes>
    </LazyRouteBoundary>
  )

  const scopedRoutes = (
    <ApplicationFlowPolicyProvider
      policy="customer"
      listingPath=""
      breadcrumbItems={[]}
      customerSegment={customerSegment}
    >
      {routes}
    </ApplicationFlowPolicyProvider>
  )

  if (!config) return scopedRoutes

  return <CustomerSegmentPortalProvider config={config}>{scopedRoutes}</CustomerSegmentPortalProvider>
}
