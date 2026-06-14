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
  CountryConfigWorkspacePage,
  CountryListingPage,
  EditCountryConfigWorkspacePage,
} from '../masters/country'
import {
  DocumentDetailPage,
  DocumentListingPage,
} from '../masters/documents'
import { JurisdictionListingPage } from '../masters/jurisdiction'
import { SacCodeListingPage } from '../masters/sac-codes'
import { ServiceListingPage } from '../masters/services'
import { TaxConfigurationPage } from '../masters/tax'
import { OperationsDashboardPage } from '../operations/dashboard/pages/OperationsDashboardPage'
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
  GenerateInvoiceCompositionPage,
  GenerateInvoiceStepperPage,
  GenerateInvoiceWorkspacePage,
  InvoiceDetailPage,
  InvoiceListingPage,
} from '../finance/invoices'
import { ExpenseFinanceRoutes } from '../finance/expenses/ExpenseFinanceRoutes'
import {
  ApplicationExpenseDetailPage,
  ExpenseApprovalQueuePage,
  ExpenseListingPage,
} from '../finance/expenses'
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
import {
  CreateVendorPage,
  EditVendorPage,
  VendorDetailPage,
  VendorListingPage,
} from '../vendor-management/vendors'
import {
  B2bAssignmentQueuePage,
  CorporateAssignmentQueuePage,
  MarineAssignmentQueuePage,
  RetailAssignmentQueuePage,
} from '../assignment-priority'

type AdminRouteKind = 'coming-soon' | 'dashboard' | 'operations' | 'profile' | 'tools'

interface AdminRouteDefinition {
  path?: string
  index?: boolean
  title: string
  description: string
  eyebrow: string
  kind: AdminRouteKind
}

const adminRoutes: AdminRouteDefinition[] = [
  {
    index: true,
    title: 'Dashboard',
    description: 'Real-time overview of applications, operations, and finance.',
    eyebrow: 'Admin',
    kind: 'dashboard',
  },
  {
    path: 'customer-accounts/quotations',
    title: 'Quotation management',
    description: 'This module is under development.',
    eyebrow: 'Customer & accounts',
    kind: 'coming-soon',
  },
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
    path: 'ground-operations/logistics',
    title: 'Physical tracking & logistics',
    description: 'This module is under development.',
    eyebrow: 'Ground operations',
    kind: 'coming-soon',
  },
  {
    path: 'ground-operations/funds',
    title: 'Ground expense & fund management',
    description: 'This module is under development.',
    eyebrow: 'Ground operations',
    kind: 'coming-soon',
  },

  {
    path: 'finance/payments',
    title: 'Payment & collections',
    description: 'This module is under development.',
    eyebrow: 'Finance, billing & collections',
    kind: 'coming-soon',
  },
  {
    path: 'finance/reconciliation',
    title: 'Reconciliation & financial tracking',
    description: 'This module is under development.',
    eyebrow: 'Finance, billing & collections',
    kind: 'coming-soon',
  },

  {
    path: 'support/tickets',
    title: 'Ticket management',
    description: 'This module is under development.',
    eyebrow: 'Support ticket management',
    kind: 'coming-soon',
  },
  {
    path: 'support/communications',
    title: 'Communication & resolution tracking',
    description: 'This module is under development.',
    eyebrow: 'Support ticket management',
    kind: 'coming-soon',
  },

  {
    path: 'masters/rates',
    title: 'Rate master',
    description: 'This module is under development.',
    eyebrow: 'Masters',
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
        path="masters/jurisdiction"
        element={
          <PermissionGuard>
            <JurisdictionListingPage />
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
          element={<GenerateInvoiceWorkspacePage creditNoteMode />}
        />
        <Route path=":invoiceId" element={<InvoiceDetailPage />} />
      </Route>
      <Route path="finance/expenses" element={<ExpenseFinanceRoutes />}>
        <Route index element={<ExpenseListingPage />} />
        <Route path="approval-queue" element={<ExpenseApprovalQueuePage />} />
        <Route path=":applicationId" element={<ApplicationExpenseDetailPage />} />
      </Route>
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
