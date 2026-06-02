import type { AdminPermissionModule } from '@/shared/types/adminPermission'

/** Static permission tree aligned with admin navigation modules. */
export const ADMIN_PERMISSION_MODULES: AdminPermissionModule[] = [
  {
    id: 'customer_accounts',
    label: 'Customer & accounts',
    submodules: [
      { id: 'enquiries', label: 'Enquiry management' },
      { id: 'quotations', label: 'Quotation management' },
      { id: 'agreements', label: 'Agreements & contracts' },
      { id: 'corporate_accounts', label: 'Corporate accounts' },
      { id: 'corporate_admins', label: 'Corporate admins' },
    ],
  },
  {
    id: 'application_management',
    label: 'Application management',
    submodules: [
      { id: 'retail_applications', label: 'Retail applications' },
      { id: 'corporate_applications', label: 'Corporate applications' },
      { id: 'marine_applications', label: 'Marine applications' },
      { id: 'assignments', label: 'Assignment management' },
    ],
  },
  {
    id: 'ground_operations',
    label: 'Ground operations',
    submodules: [
      { id: 'case_handling', label: 'Operational case handling' },
      { id: 'logistics', label: 'Tracking & logistics' },
      { id: 'funds', label: 'Expense & fund management' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance, billing & collections',
    submodules: [
      { id: 'expenses', label: 'Expense management' },
      { id: 'invoices', label: 'Billing & invoices' },
      { id: 'payments', label: 'Payments & collections' },
      { id: 'reconciliation', label: 'Reconciliation' },
    ],
  },
  {
    id: 'support',
    label: 'Support tickets',
    submodules: [
      { id: 'tickets', label: 'Ticket management' },
      { id: 'communications', label: 'Communication & resolution' },
    ],
  },
  {
    id: 'masters',
    label: 'Masters',
    submodules: [
      { id: 'country', label: 'Country' },
      { id: 'visa_type', label: 'Visa type' },
      { id: 'documents', label: 'Document master' },
      { id: 'rates', label: 'Rate master' },
      { id: 'services', label: 'Service Master' },
      { id: 'sac_codes', label: 'SAC Code Master' },
      { id: 'tax', label: 'GST & TDS Master' },
    ],
  },
  {
    id: 'user_management',
    label: 'User management',
    submodules: [
      { id: 'teams', label: 'Team' },
      { id: 'users', label: 'User & permission' },
    ],
  },
]
