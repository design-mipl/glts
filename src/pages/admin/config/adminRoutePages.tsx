import { lazyDefault, lazyNamed } from '@/shared/routing/lazyRoute'

export const CreateEnquiryPage = lazyNamed(
  () => import('../customer-accounts/enquiries'),
  'CreateEnquiryPage',
)
export const EditEnquiryPage = lazyNamed(
  () => import('../customer-accounts/enquiries'),
  'EditEnquiryPage',
)
export const EnquiryDetailPage = lazyNamed(
  () => import('../customer-accounts/enquiries'),
  'EnquiryDetailPage',
)
export const EnquiryListingPage = lazyNamed(
  () => import('../customer-accounts/enquiries'),
  'EnquiryListingPage',
)

export const OrderListingPage = lazyNamed(() => import('../order-management/orders'), 'OrderListingPage')
export const CreateOrderPage = lazyNamed(() => import('../order-management/orders'), 'CreateOrderPage')
export const EditOrderPage = lazyNamed(() => import('../order-management/orders'), 'EditOrderPage')
export const OrderDetailPage = lazyNamed(() => import('../order-management/orders'), 'OrderDetailPage')

export const AgreementDetailPage = lazyNamed(
  () => import('../customer-accounts/agreements'),
  'AgreementDetailPage',
)
export const AgreementListingPage = lazyNamed(
  () => import('../customer-accounts/agreements'),
  'AgreementListingPage',
)
export const CreateAgreementPage = lazyNamed(
  () => import('../customer-accounts/agreements'),
  'CreateAgreementPage',
)
export const EditAgreementPage = lazyNamed(
  () => import('../customer-accounts/agreements'),
  'EditAgreementPage',
)

export const CorporateAccountDetailPage = lazyNamed(
  () => import('../customer-accounts/corporate-accounts'),
  'CorporateAccountDetailPage',
)
export const CorporateAccountListingPage = lazyNamed(
  () => import('../customer-accounts/corporate-accounts'),
  'CorporateAccountListingPage',
)
export const CreateCorporateAccountPage = lazyNamed(
  () => import('../customer-accounts/corporate-accounts'),
  'CreateCorporateAccountPage',
)
export const EditCorporateAccountPage = lazyNamed(
  () => import('../customer-accounts/corporate-accounts'),
  'EditCorporateAccountPage',
)

export const CreateQuotationPage = lazyNamed(
  () => import('../customer-accounts/quotations'),
  'CreateQuotationPage',
)
export const EditQuotationPage = lazyNamed(
  () => import('../customer-accounts/quotations'),
  'EditQuotationPage',
)
export const QuotationDetailPage = lazyNamed(
  () => import('../customer-accounts/quotations'),
  'QuotationDetailPage',
)
export const QuotationListingPage = lazyNamed(
  () => import('../customer-accounts/quotations'),
  'QuotationListingPage',
)
export const QuotationPdfPreviewPage = lazyNamed(
  () => import('../customer-accounts/quotations'),
  'QuotationPdfPreviewPage',
)

export const CountryConfigWorkspacePage = lazyNamed(
  () => import('../masters/country'),
  'CountryConfigWorkspacePage',
)
export const CountryListingPage = lazyNamed(
  () => import('../masters/country'),
  'CountryListingPage',
)
export const EditCountryConfigWorkspacePage = lazyNamed(
  () => import('../masters/country'),
  'EditCountryConfigWorkspacePage',
)

export const DocumentDetailPage = lazyNamed(
  () => import('../masters/documents'),
  'DocumentDetailPage',
)
export const DocumentListingPage = lazyNamed(
  () => import('../masters/documents'),
  'DocumentListingPage',
)

export const BankMasterListingPage = lazyNamed(
  () => import('../masters/bank-master'),
  'BankMasterListingPage',
)
export const CardMasterListingPage = lazyNamed(
  () => import('../masters/card-master'),
  'CardMasterListingPage',
)
export const CountryGroupListingPage = lazyNamed(
  () => import('../masters/country-groups'),
  'CountryGroupListingPage',
)
export const JurisdictionListingPage = lazyNamed(
  () => import('../masters/jurisdiction'),
  'JurisdictionListingPage',
)
export const SacCodeListingPage = lazyNamed(
  () => import('../masters/sac-codes'),
  'SacCodeListingPage',
)
export const ServiceListingPage = lazyNamed(
  () => import('../masters/services'),
  'ServiceListingPage',
)
export const TaxConfigurationPage = lazyNamed(
  () => import('../masters/tax'),
  'TaxConfigurationPage',
)
export const WorkflowListingPage = lazyNamed(
  () => import('../masters/workflows'),
  'WorkflowListingPage',
)
export const SlaListingPage = lazyNamed(() => import('../masters/sla'), 'SlaListingPage')

export const RequirementListingPage = lazyNamed(
  () => import('../masters/requirements'),
  'RequirementListingPage',
)
export const CreateRequirementPage = lazyNamed(
  () => import('../masters/requirements'),
  'CreateRequirementPage',
)
export const EditRequirementPage = lazyNamed(
  () => import('../masters/requirements'),
  'EditRequirementPage',
)

export const OperationsDashboardPage = lazyNamed(
  () => import('../operations/dashboard/pages/OperationsDashboardPage'),
  'OperationsDashboardPage',
)

export const SuperAdminDashboardNextPage = lazyNamed(
  () => import('../dashboard-next'),
  'SuperAdminDashboardNextPage',
)
export const AdminDashboardNextPage = lazyNamed(
  () => import('../dashboard-next'),
  'AdminDashboardPage',
)
export const OperationsDashboardNextPage = lazyNamed(
  () => import('../dashboard-next'),
  'OperationsDashboardNextPage',
)
export const DocumentationDashboardNextPage = lazyNamed(
  () => import('../dashboard-next'),
  'DocumentationDashboardNextPage',
)
export const AccountsDashboardNextPage = lazyNamed(
  () => import('../dashboard-next'),
  'AccountsDashboardNextPage',
)
export const GroundOperationsDashboardNextPage = lazyNamed(
  () => import('../dashboard-next'),
  'GroundOperationsDashboardNextPage',
)

export const AdminProfilePage = lazyNamed(
  () => import('../profile/AdminProfilePage'),
  'AdminProfilePage',
)

export const MarineApplicationListingPage = lazyNamed(
  () => import('../application-management/marine'),
  'MarineApplicationListingPage',
)
export const MarineCreateApplicationPage = lazyNamed(
  () => import('../application-management/marine'),
  'MarineCreateApplicationPage',
)
export const MarineVerifyDocumentsPage = lazyNamed(
  () => import('../application-management/marine'),
  'MarineVerifyDocumentsPage',
)
export const MarineViewFormPage = lazyNamed(
  () => import('../application-management/marine'),
  'MarineViewFormPage',
)

export const CorporateApplicationListingPage = lazyNamed(
  () => import('../application-management/corporate'),
  'CorporateApplicationListingPage',
)
export const CorporateCreateApplicationPage = lazyNamed(
  () => import('../application-management/corporate'),
  'CorporateCreateApplicationPage',
)
export const CorporateVerifyDocumentsPage = lazyNamed(
  () => import('../application-management/corporate'),
  'CorporateVerifyDocumentsPage',
)
export const CorporateViewFormPage = lazyNamed(
  () => import('../application-management/corporate'),
  'CorporateViewFormPage',
)

export const RetailApplicationListingPage = lazyNamed(
  () => import('../application-management/retail'),
  'RetailApplicationListingPage',
)
export const RetailCreateApplicationPage = lazyNamed(
  () => import('../application-management/retail'),
  'RetailCreateApplicationPage',
)
export const RetailVerifyDocumentsPage = lazyNamed(
  () => import('../application-management/retail'),
  'RetailVerifyDocumentsPage',
)
export const RetailViewFormPage = lazyNamed(
  () => import('../application-management/retail'),
  'RetailViewFormPage',
)

export const B2bApplicationListingPage = lazyNamed(
  () => import('../application-management/b2b-agents'),
  'B2bApplicationListingPage',
)
export const B2bCreateApplicationPage = lazyNamed(
  () => import('../application-management/b2b-agents'),
  'B2bCreateApplicationPage',
)
export const B2bVerifyDocumentsPage = lazyNamed(
  () => import('../application-management/b2b-agents'),
  'B2bVerifyDocumentsPage',
)
export const B2bViewFormPage = lazyNamed(
  () => import('../application-management/b2b-agents'),
  'B2bViewFormPage',
)

export const InvoiceFinanceRoutes = lazyNamed(
  () => import('../finance/invoices/InvoiceFinanceRoutes'),
  'InvoiceFinanceRoutes',
)
export const BillingReportsPage = lazyNamed(
  () => import('../finance/invoices/pages/BillingReportsPage'),
  'BillingReportsPage',
)
export const CreditNoteCompositionPage = lazyNamed(
  () => import('../finance/invoices/pages/CreditNoteCompositionPage'),
  'CreditNoteCompositionPage',
)
export const GenerateInvoiceCompositionPage = lazyNamed(
  () => import('../finance/invoices/pages/GenerateInvoiceCompositionPage'),
  'GenerateInvoiceCompositionPage',
)
export const GenerateInvoiceStepperPage = lazyNamed(
  () => import('../finance/invoices/pages/GenerateInvoiceStepperPage'),
  'GenerateInvoiceStepperPage',
)
export const InvoiceDetailPage = lazyNamed(
  () => import('../finance/invoices/pages/InvoiceDetailPage'),
  'InvoiceDetailPage',
)
export const InvoiceListingPage = lazyNamed(
  () => import('../finance/invoices/pages/InvoiceListingPage'),
  'InvoiceListingPage',
)

export const ExpenseFinanceRoutes = lazyNamed(
  () => import('../finance/expenses/ExpenseFinanceRoutes'),
  'ExpenseFinanceRoutes',
)
export const ApplicationExpenseDetailPage = lazyNamed(
  () => import('../finance/expenses/pages/ApplicationExpenseDetailPage'),
  'ApplicationExpenseDetailPage',
)
export const ExpenseListingPage = lazyNamed(
  () => import('../finance/expenses/pages/ExpenseListingPage'),
  'ExpenseListingPage',
)

export const VendorBillingRoutes = lazyNamed(
  () => import('../finance/vendor-billing/VendorBillingRoutes'),
  'VendorBillingRoutes',
)
export const VendorBillingDetailPage = lazyNamed(
  () => import('../finance/vendor-billing/pages/VendorBillingDetailPage'),
  'VendorBillingDetailPage',
)
export const VendorBillingListingPage = lazyNamed(
  () => import('../finance/vendor-billing/pages/VendorBillingListingPage'),
  'VendorBillingListingPage',
)

export const FundAllocationListingPage = lazyNamed(
  () => import('../finance/fund-allocation/pages/FundAllocationListingPage'),
  'FundAllocationListingPage',
)
export const ReconciliationListingPage = lazyNamed(
  () => import('../finance/reconciliation/pages/ReconciliationListingPage'),
  'ReconciliationListingPage',
)

export const TeamDetailPage = lazyNamed(() => import('../user-management/teams'), 'TeamDetailPage')
export const TeamListingPage = lazyNamed(() => import('../user-management/teams'), 'TeamListingPage')

export const DepartmentDetailPage = lazyNamed(
  () => import('../user-management/departments'),
  'DepartmentDetailPage',
)
export const DepartmentListingPage = lazyNamed(
  () => import('../user-management/departments'),
  'DepartmentListingPage',
)

export const CreateUserPage = lazyNamed(
  () => import('../user-management/users'),
  'CreateUserPage',
)
export const EditUserPage = lazyNamed(() => import('../user-management/users'), 'EditUserPage')
export const UserDetailPage = lazyNamed(
  () => import('../user-management/users'),
  'UserDetailPage',
)
export const UserListingPage = lazyNamed(
  () => import('../user-management/users'),
  'UserListingPage',
)
export const UserPermissionConfigurationPage = lazyNamed(
  () => import('../user-management/users'),
  'UserPermissionConfigurationPage',
)

export const ComponentLibrary = lazyDefault(() => import('../_tools/ComponentLibrary'))
export const TemplateShowcaseRoutes = lazyDefault(() => import('../_tools/TemplateShowcase'))

export const OperationalCaseHandlingPage = lazyNamed(
  () => import('../ground-operations/case-handling'),
  'OperationalCaseHandlingPage',
)
export const FundUtilizationListingPage = lazyNamed(
  () => import('../ground-operations/fund-utilization'),
  'FundUtilizationListingPage',
)
export const LogisticsListingPage = lazyNamed(
  () => import('../ground-operations/logistics'),
  'LogisticsListingPage',
)

export const CreateVendorPage = lazyNamed(
  () => import('../masters/vendors'),
  'CreateVendorPage',
)
export const EditVendorPage = lazyNamed(() => import('../masters/vendors'), 'EditVendorPage')
export const VendorDetailPage = lazyNamed(
  () => import('../masters/vendors'),
  'VendorDetailPage',
)
export const VendorListingPage = lazyNamed(
  () => import('../masters/vendors'),
  'VendorListingPage',
)

export const SupportTicketDetailPage = lazyNamed(
  () => import('../support/tickets'),
  'SupportTicketDetailPage',
)
export const SupportTicketListingPage = lazyNamed(
  () => import('../support/tickets'),
  'SupportTicketListingPage',
)

export const MarineAssignmentQueuePage = lazyNamed(
  () => import('../assignment-priority'),
  'MarineAssignmentQueuePage',
)
export const CorporateAssignmentQueuePage = lazyNamed(
  () => import('../assignment-priority'),
  'CorporateAssignmentQueuePage',
)
export const RetailAssignmentQueuePage = lazyNamed(
  () => import('../assignment-priority'),
  'RetailAssignmentQueuePage',
)
export const B2bAssignmentQueuePage = lazyNamed(
  () => import('../assignment-priority'),
  'B2bAssignmentQueuePage',
)
