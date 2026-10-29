import { lazyNamed } from '@/shared/routing/lazyRoute'

export const DashboardPage = lazyNamed(
  () => import('../features/dashboard/pages/DashboardPage'),
  'DashboardPage',
)
export const ProfileDetailsPage = lazyNamed(
  () => import('../features/profile/pages/ProfileDetailsPage'),
  'ProfileDetailsPage',
)
export const ApplicationsListPage = lazyNamed(
  () => import('../features/applications/pages/ApplicationsListPage'),
  'ApplicationsListPage',
)
export const ApplicationDetailPage = lazyNamed(
  () => import('../features/applications/pages/ApplicationDetailPage'),
  'ApplicationDetailPage',
)
export const CreateApplicationFlowPage = lazyNamed(
  () => import('../features/applications/pages/create/CreateApplicationFlowPage'),
  'CreateApplicationFlowPage',
)
export const AdminListingPage = lazyNamed(
  () => import('../features/user-management/admins/pages/AdminListingPage'),
  'AdminListingPage',
)
export const AdminDetailPage = lazyNamed(
  () => import('../features/user-management/admins/pages/AdminDetailPage'),
  'AdminDetailPage',
)
export const BookersPage = lazyNamed(
  () => import('../features/user-management/bookers/pages/BookersPage'),
  'BookersPage',
)
export const BookerDetailPage = lazyNamed(
  () => import('../features/user-management/bookers/pages/BookerDetailPage'),
  'BookerDetailPage',
)
export const TrackingPage = lazyNamed(
  () => import('../features/tracking/pages/TrackingPage'),
  'TrackingPage',
)
export const CrewUploadPage = lazyNamed(
  () => import('../features/marine/pages/CrewUploadPage'),
  'CrewUploadPage',
)
export const EntityListingPage = lazyNamed(
  () => import('../features/masters/entities/pages/EntityListingPage'),
  'EntityListingPage',
)
export const EntityDetailPage = lazyNamed(
  () => import('../features/masters/entities/pages/EntityDetailPage'),
  'EntityDetailPage',
)
export const VesselListingPage = lazyNamed(
  () => import('../features/masters/vessels/pages/VesselListingPage'),
  'VesselListingPage',
)
export const VesselDetailPage = lazyNamed(
  () => import('../features/masters/vessels/pages/VesselDetailPage'),
  'VesselDetailPage',
)
export const FinanceOverviewPage = lazyNamed(
  () => import('../features/finance/pages/FinanceOverviewPage'),
  'FinanceOverviewPage',
)
export const InvoiceListingPage = lazyNamed(
  () => import('../features/finance/pages/InvoiceListingPage'),
  'InvoiceListingPage',
)
export const InvoiceDetailPage = lazyNamed(
  () => import('../features/finance/pages/InvoiceDetailPage'),
  'InvoiceDetailPage',
)
export const PaymentListingPage = lazyNamed(
  () => import('../features/finance/pages/PaymentListingPage'),
  'PaymentListingPage',
)
export const PaymentDetailPage = lazyNamed(
  () => import('../features/finance/pages/PaymentDetailPage'),
  'PaymentDetailPage',
)
export const OutstandingStatementsPage = lazyNamed(
  () => import('../features/finance/pages/OutstandingStatementsPage'),
  'OutstandingStatementsPage',
)
export const FaqPage = lazyNamed(
  () => import('../features/help-support/pages/HelpSupportHubPage'),
  'FaqPage',
)
export const ContactSupportPage = lazyNamed(
  () => import('../features/help-support/pages/ContactSupportPage'),
  'ContactSupportPage',
)
export const StoredDocumentsPage = lazyNamed(
  () => import('../features/profile/components/StoredDocumentsSection'),
  'StoredDocumentsPage',
)
