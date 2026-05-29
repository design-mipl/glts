import { Navigate, Route, Routes } from 'react-router-dom'
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'
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
  CountryDetailPage,
  CountryListingPage,
  CreateCountryPage,
  EditCountryPage,
} from '../masters/country'
import {
  DocumentDetailPage,
  DocumentListingPage,
  EditDocumentPage,
} from '../masters/documents'
import { InternalDashboard } from '../operations/pages/InternalDashboard'
import { AdminProfilePage } from '../profile/AdminProfilePage'
import { MarineApplicationListingPage, MarineVerifyDocumentsPage, MarineViewFormPage } from '../application-management/marine'
import ComponentLibrary from '../_tools/ComponentLibrary'
import TemplateShowcaseRoutes from '../_tools/TemplateShowcase'

type AdminRouteKind = 'coming-soon' | 'operations' | 'profile' | 'tools'

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
    description: 'This module is under development.',
    eyebrow: 'Admin',
    kind: 'coming-soon',
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
    path: 'application-management/assignments',
    title: 'Application assignment management',
    description: 'This module is under development.',
    eyebrow: 'Application management',
    kind: 'coming-soon',
  },

  {
    path: 'ground-operations/case-handling',
    title: 'Operational case handling',
    description: 'This module is under development.',
    eyebrow: 'Ground operations',
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
    path: 'finance/expenses',
    title: 'Expense management',
    description: 'This module is under development.',
    eyebrow: 'Finance, billing & collections',
    kind: 'coming-soon',
  },
  {
    path: 'finance/invoices',
    title: 'Billing & invoice management',
    description: 'This module is under development.',
    eyebrow: 'Finance, billing & collections',
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
    path: 'masters/visa-type',
    title: 'Visa type master',
    description: 'This module is under development.',
    eyebrow: 'Masters',
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
    path: 'masters/sac-codes',
    title: 'SAC code master',
    description: 'This module is under development.',
    eyebrow: 'Masters',
    kind: 'coming-soon',
  },
  {
    path: 'masters/tax',
    title: 'GST and TDS master',
    description: 'This module is under development.',
    eyebrow: 'Masters',
    kind: 'coming-soon',
  },
  {
    path: 'masters/services',
    title: 'Service master',
    description: 'This module is under development.',
    eyebrow: 'Masters',
    kind: 'coming-soon',
  },

  {
    path: 'access/users',
    title: 'User management',
    description: 'This module is under development.',
    eyebrow: 'User & role management',
    kind: 'coming-soon',
  },
  {
    path: 'access/roles',
    title: 'Roles and permission',
    description: 'This module is under development.',
    eyebrow: 'User & role management',
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

  if (route.kind === 'operations') {
    return (
      <PermissionGuard>
        <InternalDashboard />
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
      <ComingSoonPage
        title={route.title}
        description={route.description}
        returnLink={{ text: 'Back to Admin dashboard', href: '/admin' }}
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
        element={
          <PermissionGuard>
            <CreateCountryPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/country/:countryId/edit"
        element={
          <PermissionGuard>
            <EditCountryPage />
          </PermissionGuard>
        }
      />
      <Route
        path="masters/country/:countryId"
        element={
          <PermissionGuard>
            <CountryDetailPage />
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
        element={
          <PermissionGuard>
            <EditDocumentPage />
          </PermissionGuard>
        }
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
        path="application-management/marine"
        element={
          <PermissionGuard>
            <MarineApplicationListingPage />
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
