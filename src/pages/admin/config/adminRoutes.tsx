import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LazyRouteBoundary } from '@/shared/routing/lazyRoute'
import { AdminModulePlaceholder } from '../components/AdminModulePlaceholder'
import { PermissionGuard } from '../components/PermissionGuard'
import {
  AccountsDashboardNextPage,
  AdminDashboardNextPage,
  AdminProfilePage,
  AgreementDetailPage,
  AgreementListingPage,
  ApplicationExpenseDetailPage,
  B2bApplicationListingPage,
  B2bAssignmentQueuePage,
  B2bCreateApplicationPage,
  B2bVerifyDocumentsPage,
  B2bViewFormPage,
  BankMasterListingPage,
  BillingReportsPage,
  CardMasterListingPage,
  ComponentLibrary,
  CorporateAccountDetailPage,
  CorporateAccountListingPage,
  CorporateApplicationListingPage,
  CorporateAssignmentQueuePage,
  CorporateCreateApplicationPage,
  CorporateVerifyDocumentsPage,
  CorporateViewFormPage,
  RetailApplicationListingPage,
  RetailCreateApplicationPage,
  RetailVerifyDocumentsPage,
  RetailViewFormPage,
  CountryConfigWorkspacePage,
  CountryGroupListingPage,
  CountryListingPage,
  CreateAgreementPage,
  CreateCorporateAccountPage,
  CreateEnquiryPage,
  CreateQuotationPage,
  CreateUserPage,
  CreateVendorPage,
  CreditNoteCompositionPage,
  DepartmentDetailPage,
  DepartmentListingPage,
  DocumentationDashboardNextPage,
  DocumentDetailPage,
  DocumentListingPage,
  CreateRequirementPage,
  EditRequirementPage,
  RequirementListingPage,
  EditAgreementPage,
  EditCorporateAccountPage,
  EditCountryConfigWorkspacePage,
  EditEnquiryPage,
  EditQuotationPage,
  EditUserPage,
  EditVendorPage,
  EnquiryDetailPage,
  EnquiryListingPage,
  ExpenseFinanceRoutes,
  ExpenseListingPage,
  FundAllocationListingPage,
  FundUtilizationListingPage,
  GenerateInvoiceCompositionPage,
  GenerateInvoiceStepperPage,
  GroundOperationsDashboardNextPage,
  InvoiceDetailPage,
  InvoiceFinanceRoutes,
  InvoiceListingPage,
  JurisdictionListingPage,
  LogisticsListingPage,
  MarineApplicationListingPage,
  MarineAssignmentQueuePage,
  MarineCreateApplicationPage,
  MarineVerifyDocumentsPage,
  MarineViewFormPage,
  CreateOrderPage,
  CreateOrderEnquiryPage,
  EditOrderPage,
  EditOrderEnquiryPage,
  OperationalCaseHandlingPage,
  OperationsDashboardNextPage,
  OperationsDashboardPage,
  OrderDetailPage,
  OrderEnquiryDetailPage,
  OrderEnquiryListingPage,
  OrderListingPage,
  QuotationDetailPage,
  QuotationListingPage,
  QuotationPdfPreviewPage,
  ReconciliationListingPage,
  RetailAssignmentQueuePage,
  SacCodeListingPage,
  ServiceListingPage,
  SlaListingPage,
  SuperAdminDashboardNextPage,
  SupportTicketDetailPage,
  SupportTicketListingPage,
  TaxConfigurationPage,
  TeamDetailPage,
  TeamListingPage,
  TemplateShowcaseRoutes,
  UserDetailPage,
  UserListingPage,
  UserPermissionConfigurationPage,
  VendorBillingDetailPage,
  VendorBillingListingPage,
  VendorBillingRoutes,
  VendorDetailPage,
  VendorListingPage,
  WorkflowListingPage,
} from './adminRoutePages'
import { ADMIN_ALL_DASHBOARDS, ADMIN_HOME_HREF } from './adminDashboards'

type AdminRouteKind = 'coming-soon' | 'dashboard' | 'operations' | 'profile' | 'tools'

interface AdminRouteDefinition {
  path: string
  title: string
  description: string
  eyebrow: string
  kind: AdminRouteKind
}

/** Remap legacy `/admin/access/*` bookmarks to `/admin/user-management/*`. */
function LegacyAccessRedirect() {
  const location = useLocation()
  const nextPath = location.pathname.replace(/^\/admin\/access/, '/admin/user-management')
  return <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />
}

/** Remap legacy `/admin/vendor-management/vendors/*` to `/admin/masters/vendors/*`. */
function LegacyVendorRedirect() {
  const location = useLocation()
  const nextPath = location.pathname.replace(
    /^\/admin\/vendor-management\/vendors/,
    '/admin/masters/vendors',
  )
  return <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />
}

const adminDashboardRoutes: AdminRouteDefinition[] = ADMIN_ALL_DASHBOARDS.filter(
  (dashboard) => dashboard.status === 'coming-soon',
).map((dashboard) => ({
  path: dashboard.href.replace('/admin/', ''),
  title: dashboard.title,
  description: dashboard.description,
  eyebrow: 'Dashboard',
  kind: 'coming-soon' as const,
}))

const adminRoutes: AdminRouteDefinition[] = [
  ...adminDashboardRoutes,
  {
    path: 'customer-accounts/corporate-admins',
    title: 'Corporate admins',
    description: 'This module is under development.',
    eyebrow: 'Customer & accounts',
    kind: 'coming-soon',
  },

  {
    path: 'operations/*',
    title: 'Operations visibility',
    description: 'Admin module for processing queues, document verification, team assignments, and SLA visibility.',
    eyebrow: 'Operations',
    kind: 'operations',
  },
  {
    path: 'tools/component-library',
    title: 'Component library',
    description: 'Design system showcase and internal UI tooling.',
    eyebrow: 'Tools',
    kind: 'tools',
  },
  {
    path: 'profile',
    title: 'Your profile',
    description: 'Internal account details and session controls for operations users.',
    eyebrow: 'Account',
    kind: 'profile',
  },
]

function AdminFoundationPage({ route }: { route: AdminRouteDefinition }) {
  if (route.kind === 'profile') {
    return (
      <PermissionGuard>
        <AdminProfilePage />
      </PermissionGuard>
    )
  }

  if (route.kind === 'dashboard' || route.kind === 'operations') {
    return (
      <PermissionGuard>
        <OperationsDashboardPage />
      </PermissionGuard>
    )
  }

  if (route.kind === 'tools') {
    return (
      <PermissionGuard>
        <ComponentLibrary />
      </PermissionGuard>
    )
  }

  return (
    <PermissionGuard>
      <AdminModulePlaceholder
        eyebrow={route.eyebrow}
        title={route.title}
        description={route.description}
        returnHref={ADMIN_HOME_HREF}
        returnLabel="Back to Super Admin dashboard"
      />
    </PermissionGuard>
  )
}

export function AdminRoutes() {
  return (
    <LazyRouteBoundary label="Loading module…">
    <Routes>
      <Route
        path="customer-accounts/enquiries"
        element={
          <PermissionGuard>
            <EnquiryListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/enquiries/new"
        element={
          <PermissionGuard>
            <CreateEnquiryPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/enquiries/:enquiryId/edit"
        element={
          <PermissionGuard>
            <EditEnquiryPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/enquiries/:enquiryId"
        element={
          <PermissionGuard>
            <EnquiryDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="order-management/order-enquiries"
        element={
          <PermissionGuard>
            <OrderEnquiryListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="order-management/order-enquiries/new"
        element={
          <PermissionGuard>
            <CreateOrderEnquiryPage />
          </PermissionGuard>
        }
      />
      <Route
        path="order-management/order-enquiries/:enquiryId/edit"
        element={
          <PermissionGuard>
            <EditOrderEnquiryPage />
          </PermissionGuard>
        }
      />
      <Route
        path="order-management/order-enquiries/:enquiryId"
        element={
          <PermissionGuard>
            <OrderEnquiryDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="order-management/orders"
        element={
          <PermissionGuard>
            <OrderListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="order-management/orders/new"
        element={
          <PermissionGuard>
            <CreateOrderPage />
          </PermissionGuard>
        }
      />
      <Route
        path="order-management/orders/:orderId/edit"
        element={
          <PermissionGuard>
            <EditOrderPage />
          </PermissionGuard>
        }
      />
      <Route
        path="order-management/orders/:orderId"
        element={
          <PermissionGuard>
            <OrderDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/agreements"
        element={
          <PermissionGuard>
            <AgreementListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/agreements/new"
        element={
          <PermissionGuard>
            <CreateAgreementPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/agreements/:agreementId/edit"
        element={
          <PermissionGuard>
            <EditAgreementPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/agreements/:agreementId"
        element={
          <PermissionGuard>
            <AgreementDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/quotations"
        element={
          <PermissionGuard>
            <QuotationListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/quotations/new"
        element={
          <PermissionGuard>
            <CreateQuotationPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/quotations/:quotationId/edit"
        element={
          <PermissionGuard>
            <EditQuotationPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/quotations/:quotationId/pdf"
        element={
          <PermissionGuard>
            <QuotationPdfPreviewPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/quotations/:quotationId"
        element={
          <PermissionGuard>
            <QuotationDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/corporate-accounts"
        element={
          <PermissionGuard>
            <CorporateAccountListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/corporate-accounts/new"
        element={
          <PermissionGuard>
            <CreateCorporateAccountPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/corporate-accounts/:accountId/edit"
        element={
          <PermissionGuard>
            <EditCorporateAccountPage />
          </PermissionGuard>
        }
      />
      <Route
        path="customer-accounts/corporate-accounts/:accountId"
        element={
          <PermissionGuard>
            <CorporateAccountDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/country"
        element={
          <PermissionGuard>
            <CountryListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/country/new"
        element={<Navigate to="/admin/masters/country" replace />}
      />
      <Route
        path="masters/country/:countryId/edit"
        element={
          <PermissionGuard>
            <EditCountryConfigWorkspacePage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/country/:countryId"
        element={
          <PermissionGuard>
            <CountryConfigWorkspacePage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/documents"
        element={
          <PermissionGuard>
            <DocumentListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/documents/new"
        element={<Navigate to="/admin/masters/documents" replace />}
      />
      <Route
        path="masters/documents/:documentId/edit"
        element={<Navigate to="../?edit=1" replace />}
      />
      <Route
        path="masters/documents/:documentId"
        element={
          <PermissionGuard>
            <DocumentDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/requirements"
        element={
          <PermissionGuard>
            <RequirementListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/requirements/new"
        element={
          <PermissionGuard>
            <CreateRequirementPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/requirements/:requirementId/edit"
        element={
          <PermissionGuard>
            <EditRequirementPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/tax"
        element={
          <PermissionGuard>
            <TaxConfigurationPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/country-groups"
        element={
          <PermissionGuard>
            <CountryGroupListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/jurisdiction"
        element={
          <PermissionGuard>
            <JurisdictionListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/card-master"
        element={
          <PermissionGuard>
            <CardMasterListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/bank-master"
        element={
          <PermissionGuard>
            <BankMasterListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/sac-codes"
        element={
          <PermissionGuard>
            <SacCodeListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/services"
        element={
          <PermissionGuard>
            <ServiceListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/workflows"
        element={
          <PermissionGuard>
            <WorkflowListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/sla"
        element={
          <PermissionGuard>
            <SlaListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/marine"
        element={
          <PermissionGuard>
            <MarineApplicationListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/marine/new"
        element={
          <PermissionGuard>
            <MarineCreateApplicationPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/marine/:applicationId/view-form"
        element={
          <PermissionGuard>
            <MarineViewFormPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/marine/:applicationId"
        element={
          <PermissionGuard>
            <MarineVerifyDocumentsPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/corporate"
        element={
          <PermissionGuard>
            <CorporateApplicationListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/corporate/new"
        element={
          <PermissionGuard>
            <CorporateCreateApplicationPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/corporate/:applicationId/view-form"
        element={
          <PermissionGuard>
            <CorporateViewFormPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/corporate/:applicationId"
        element={
          <PermissionGuard>
            <CorporateVerifyDocumentsPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/retail"
        element={
          <PermissionGuard>
            <RetailApplicationListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/retail/new"
        element={
          <PermissionGuard>
            <RetailCreateApplicationPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/retail/:applicationId/view-form"
        element={
          <PermissionGuard>
            <RetailViewFormPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/retail/:applicationId"
        element={
          <PermissionGuard>
            <RetailVerifyDocumentsPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/b2b-agents"
        element={
          <PermissionGuard>
            <B2bApplicationListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/b2b-agents/new"
        element={
          <PermissionGuard>
            <B2bCreateApplicationPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/b2b-agents/:applicationId/view-form"
        element={
          <PermissionGuard>
            <B2bViewFormPage />
          </PermissionGuard>
        }
      />
      <Route
        path="application-management/b2b-agents/:applicationId"
        element={
          <PermissionGuard>
            <B2bVerifyDocumentsPage />
          </PermissionGuard>
        }
      />
      <Route
        path="ground-operations/case-handling"
        element={
          <PermissionGuard>
            <OperationalCaseHandlingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="ground-operations/logistics"
        element={
          <PermissionGuard>
            <LogisticsListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="ground-operations/funds"
        element={
          <PermissionGuard>
            <FundUtilizationListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="support/tickets"
        element={
          <PermissionGuard>
            <SupportTicketListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="support/tickets/:ticketId"
        element={
          <PermissionGuard>
            <SupportTicketDetailPage />
          </PermissionGuard>
        }
      />
      <Route path="support/communications" element={<Navigate to="/admin/support/tickets" replace />} />
      <Route
        path="masters/vendors"
        element={
          <PermissionGuard>
            <VendorListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/vendors/new"
        element={
          <PermissionGuard>
            <CreateVendorPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/vendors/:vendorId/edit"
        element={
          <PermissionGuard>
            <EditVendorPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/vendors/:vendorId"
        element={
          <PermissionGuard>
            <VendorDetailPage />
          </PermissionGuard>
        }
      />
      <Route path="vendor-management/vendors/*" element={<LegacyVendorRedirect />} />
      <Route path="vendor-management/vendors" element={<LegacyVendorRedirect />} />
      <Route
        path="assignment-priority/marine"
        element={
          <PermissionGuard>
            <MarineAssignmentQueuePage />
          </PermissionGuard>
        }
      />
      <Route
        path="assignment-priority/corporate"
        element={
          <PermissionGuard>
            <CorporateAssignmentQueuePage />
          </PermissionGuard>
        }
      />
      <Route
        path="assignment-priority/retail"
        element={
          <PermissionGuard>
            <RetailAssignmentQueuePage />
          </PermissionGuard>
        }
      />
      <Route
        path="assignment-priority/b2b"
        element={
          <PermissionGuard>
            <B2bAssignmentQueuePage />
          </PermissionGuard>
        }
      />
      <Route path="finance/invoices" element={<InvoiceFinanceRoutes />}>
        <Route index element={<InvoiceListingPage />} />
        <Route path="reports" element={<BillingReportsPage />} />
        <Route path="generate" element={<GenerateInvoiceStepperPage />} />
        <Route path="generate/composition" element={<GenerateInvoiceCompositionPage />} />
        <Route
          path=":invoiceId/credit-note"
          element={<CreditNoteCompositionPage />}
        />
        <Route path=":invoiceId" element={<InvoiceDetailPage />} />
      </Route>
      <Route path="finance/expenses" element={<ExpenseFinanceRoutes />}>
        <Route index element={<ExpenseListingPage />} />
        <Route path=":applicationId" element={<ApplicationExpenseDetailPage />} />
      </Route>
      <Route path="finance/vendor-billing" element={<VendorBillingRoutes />}>
        <Route index element={<VendorBillingListingPage />} />
        <Route path=":vendorId" element={<VendorBillingDetailPage />} />
      </Route>
      <Route
        path="finance/fund-allocation"
        element={
          <PermissionGuard>
            <FundAllocationListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="finance/reconciliation"
        element={
          <PermissionGuard>
            <ReconciliationListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="user-management/departments"
        element={
          <PermissionGuard>
            <DepartmentListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="user-management/departments/:departmentId"
        element={
          <PermissionGuard>
            <DepartmentDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="user-management/teams"
        element={
          <PermissionGuard>
            <TeamListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="user-management/teams/:teamId"
        element={
          <PermissionGuard>
            <TeamDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="user-management/users"
        element={
          <PermissionGuard>
            <UserListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="user-management/users/new"
        element={
          <PermissionGuard>
            <CreateUserPage />
          </PermissionGuard>
        }
      />
      <Route
        path="user-management/users/:userId/edit"
        element={
          <PermissionGuard>
            <EditUserPage />
          </PermissionGuard>
        }
      />
      <Route
        path="user-management/users/:userId/permissions"
        element={
          <PermissionGuard>
            <UserPermissionConfigurationPage />
          </PermissionGuard>
        }
      />
      <Route
        path="user-management/users/:userId"
        element={
          <PermissionGuard>
            <UserDetailPage />
          </PermissionGuard>
        }
      />
      <Route path="user-management/roles" element={<Navigate to="/admin/user-management/users" replace />} />
      <Route path="access/*" element={<LegacyAccessRedirect />} />
      <Route
        path="tools/templates/*"
        element={
          <PermissionGuard>
            <TemplateShowcaseRoutes />
          </PermissionGuard>
        }
      />
      {/* Legacy dashboard URLs → Dashboard Next */}
      <Route path="dashboard/operations" element={<Navigate to="/admin/dashboard-next/operations" replace />} />
      <Route
        path="dashboard/documentation"
        element={<Navigate to="/admin/dashboard-next/documentation" replace />}
      />
      <Route path="dashboard/accounts" element={<Navigate to="/admin/dashboard-next/accounts" replace />} />
      <Route
        path="dashboard-next/super-admin"
        element={
          <PermissionGuard>
            <SuperAdminDashboardNextPage />
          </PermissionGuard>
        }
      />
      <Route
        path="dashboard-next"
        element={
          <PermissionGuard>
            <AdminDashboardNextPage />
          </PermissionGuard>
        }
      />
      <Route
        path="dashboard-next/operations"
        element={
          <PermissionGuard>
            <OperationsDashboardNextPage />
          </PermissionGuard>
        }
      />
      <Route
        path="dashboard-next/documentation"
        element={
          <PermissionGuard>
            <DocumentationDashboardNextPage />
          </PermissionGuard>
        }
      />
      <Route
        path="dashboard-next/accounts"
        element={
          <PermissionGuard>
            <AccountsDashboardNextPage />
          </PermissionGuard>
        }
      />
      <Route
        path="dashboard-next/ground-operations"
        element={
          <PermissionGuard>
            <GroundOperationsDashboardNextPage />
          </PermissionGuard>
        }
      />
      <Route index element={<Navigate to={ADMIN_HOME_HREF} replace />} />
      {adminRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<AdminFoundationPage route={route} />}
        />
      ))}
      <Route path="*" element={<Navigate to={ADMIN_HOME_HREF} replace />} />
    </Routes>
    </LazyRouteBoundary>
  )
}
