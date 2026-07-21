import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminModulePlaceholder } from '../components/AdminModulePlaceholder'
import { PermissionGuard } from '../components/PermissionGuard'
import {
  CreateEnquiryPage,
  EditEnquiryPage,
  EnquiryDetailPage,
  EnquiryListingPage,
} from '../customer-accounts/enquiries'
import {
  AgreementDetailPage,
  AgreementListingPage,
  CreateAgreementPage,
  EditAgreementPage,
} from '../customer-accounts/agreements'
import {
  CorporateAccountDetailPage,
  CorporateAccountListingPage,
  CreateCorporateAccountPage,
  EditCorporateAccountPage,
} from '../customer-accounts/corporate-accounts'
import {
  CreateQuotationPage,
  EditQuotationPage,
  QuotationDetailPage,
  QuotationListingPage,
  QuotationPdfPreviewPage,
} from '../customer-accounts/quotations'
import {
  CountryConfigWorkspacePage,
  CountryListingPage,
  EditCountryConfigWorkspacePage,
} from '../masters/country'
import {
  DocumentDetailPage,
  DocumentListingPage,
} from '../masters/documents'
import { CardMasterListingPage } from '../masters/card-master'
import { CountryGroupListingPage } from '../masters/country-groups'
import { JurisdictionListingPage } from '../masters/jurisdiction'
import { SacCodeListingPage } from '../masters/sac-codes'
import { ServiceListingPage } from '../masters/services'
import { TaxConfigurationPage } from '../masters/tax'
import { WorkflowListingPage } from '../masters/workflows'
import { OperationsDashboardPage } from '../operations/dashboard/pages/OperationsDashboardPage'
import {
  AccountsDashboardPage,
  DocumentationDashboardPage,
  OperationsConsultantDashboardPage,
} from '../dashboard'
import {
  AdminDashboardPage as AdminDashboardNextPage,
  AccountsDashboardNextPage,
  GroundOperationsDashboardNextPage,
  OperationsDashboardNextPage,
  SuperAdminDashboardNextPage,
} from '../dashboard-next'
import { AdminProfilePage } from '../profile/AdminProfilePage'
import {
  MarineApplicationListingPage,
  MarineCreateApplicationPage,
  MarineVerifyDocumentsPage,
  MarineViewFormPage,
} from '../application-management/marine'
import { InvoiceFinanceRoutes } from '../finance/invoices/InvoiceFinanceRoutes'
import {
  BillingReportsPage,
  CreditNoteCompositionPage,
  GenerateInvoiceCompositionPage,
  GenerateInvoiceStepperPage,
  GenerateInvoiceWorkspacePage,
  InvoiceDetailPage,
  InvoiceListingPage,
} from '../finance/invoices'
import { ExpenseFinanceRoutes } from '../finance/expenses/ExpenseFinanceRoutes'
import {
  ApplicationExpenseDetailPage,
  ExpenseListingPage,
} from '../finance/expenses'
import { VendorBillingRoutes } from '../finance/vendor-billing/VendorBillingRoutes'
import {
  VendorBillingDetailPage,
  VendorBillingListingPage,
} from '../finance/vendor-billing'
import { FundAllocationListingPage } from '../finance/fund-allocation'
import { TeamDetailPage, TeamListingPage } from '../access/teams'
import {
  CreateUserPage,
  EditUserPage,
  UserDetailPage,
  UserListingPage,
  UserPermissionConfigurationPage,
} from '../access/users'
import ComponentLibrary from '../_tools/ComponentLibrary'
import TemplateShowcaseRoutes from '../_tools/TemplateShowcase'
import { OperationalCaseHandlingPage } from '../ground-operations/case-handling'
import { FundUtilizationListingPage } from '../ground-operations/fund-utilization'
import { LogisticsListingPage } from '../ground-operations/logistics'
import {
  CreateVendorPage,
  EditVendorPage,
  VendorDetailPage,
  VendorListingPage,
} from '../vendor-management/vendors'
import {
  SupportTicketDetailPage,
  SupportTicketListingPage,
} from '../support/tickets'
import {
  B2bAssignmentQueuePage,
  CorporateAssignmentQueuePage,
  MarineAssignmentQueuePage,
  RetailAssignmentQueuePage,
} from '../assignment-priority'
import { ADMIN_ALL_DASHBOARDS, ADMIN_DASHBOARDS } from './adminDashboards'

type AdminRouteKind = 'coming-soon' | 'dashboard' | 'operations' | 'profile' | 'tools'

interface AdminRouteDefinition {
  path?: string
  index?: boolean
  title: string
  description: string
  eyebrow: string
  kind: AdminRouteKind
}

const adminDashboardRoutes: AdminRouteDefinition[] = ADMIN_ALL_DASHBOARDS.filter(
  (dashboard) =>
    dashboard.status === 'coming-soon' && !dashboard.href.startsWith('/admin/dashboard-next'),
).map((dashboard) => ({
  path: dashboard.href.replace('/admin/', ''),
  title: dashboard.title,
  description: dashboard.description,
  eyebrow: dashboard.href.startsWith('/admin/dashboard-next') ? 'Dashboard Next' : 'Dashboard',
  kind: 'coming-soon' as const,
}))

const adminRoutes: AdminRouteDefinition[] = [
  {
    index: true,
    title: ADMIN_DASHBOARDS[0].title,
    description: ADMIN_DASHBOARDS[0].description,
    eyebrow: 'Dashboard',
    kind: 'dashboard',
  },
  ...adminDashboardRoutes,
  {
    path: 'customer-accounts/corporate-admins',
    title: 'Corporate admins',
    description: 'This module is under development.',
    eyebrow: 'Customer & accounts',
    kind: 'coming-soon',
  },

  {
    path: 'application-management/retail',
    title: 'Retail application management',
    description: 'This module is under development.',
    eyebrow: 'Application management',
    kind: 'coming-soon',
  },
  {
    path: 'application-management/corporate',
    title: 'Corporate application management',
    description: 'This module is under development.',
    eyebrow: 'Application management',
    kind: 'coming-soon',
  },
  {
    path: 'application-management/b2b-agents',
    title: 'B2B agents application management',
    description: 'This module is under development.',
    eyebrow: 'Application management',
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
        returnHref="/admin"
        returnLabel="Back to Admin dashboard"
      />
    </PermissionGuard>
  )
}

export function AdminRoutes() {
  return (
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
        path="vendor-management/vendors"
        element={
          <PermissionGuard>
            <VendorListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="vendor-management/vendors/new"
        element={
          <PermissionGuard>
            <CreateVendorPage />
          </PermissionGuard>
        }
      />
      <Route
        path="vendor-management/vendors/:vendorId/edit"
        element={
          <PermissionGuard>
            <EditVendorPage />
          </PermissionGuard>
        }
      />
      <Route
        path="vendor-management/vendors/:vendorId"
        element={
          <PermissionGuard>
            <VendorDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="assignment-priority/marine"
        element={
          <PermissionGuard>
            <MarineAssignmentQueuePage />
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
        path="access/teams"
        element={
          <PermissionGuard>
            <TeamListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="access/teams/:teamId"
        element={
          <PermissionGuard>
            <TeamDetailPage />
          </PermissionGuard>
        }
      />
      <Route
        path="access/users"
        element={
          <PermissionGuard>
            <UserListingPage />
          </PermissionGuard>
        }
      />
      <Route
        path="access/users/new"
        element={
          <PermissionGuard>
            <CreateUserPage />
          </PermissionGuard>
        }
      />
      <Route
        path="access/users/:userId/edit"
        element={
          <PermissionGuard>
            <EditUserPage />
          </PermissionGuard>
        }
      />
      <Route
        path="access/users/:userId/permissions"
        element={
          <PermissionGuard>
            <UserPermissionConfigurationPage />
          </PermissionGuard>
        }
      />
      <Route
        path="access/users/:userId"
        element={
          <PermissionGuard>
            <UserDetailPage />
          </PermissionGuard>
        }
      />
      <Route path="access/roles" element={<Navigate to="/admin/access/users" replace />} />
      <Route
        path="tools/templates/*"
        element={
          <PermissionGuard>
            <TemplateShowcaseRoutes />
          </PermissionGuard>
        }
      />
      <Route
        path="dashboard/operations"
        element={
          <PermissionGuard>
            <OperationsConsultantDashboardPage />
          </PermissionGuard>
        }
      />
      <Route
        path="dashboard/documentation"
        element={
          <PermissionGuard>
            <DocumentationDashboardPage />
          </PermissionGuard>
        }
      />
      <Route
        path="dashboard/accounts"
        element={
          <PermissionGuard>
            <AccountsDashboardPage />
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
        path="dashboard-next/accounts"
        element={
          <PermissionGuard>
            <AccountsDashboardNextPage />
          </PermissionGuard>
        }
      />
      <Route
        path="dashboard-next/super-admin"
        element={
          <PermissionGuard>
            <SuperAdminDashboardNextPage />
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
      {adminRoutes.map((route) =>
        route.index ? (
          <Route key="index" index element={<AdminFoundationPage route={route} />} />
        ) : (
          <Route
            key={route.path}
            path={route.path}
            element={<AdminFoundationPage route={route} />}
          />
        ),
      )}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
