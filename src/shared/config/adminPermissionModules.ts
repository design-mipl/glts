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
      { id: 'b2b_agents_applications', label: 'B2B agents applications' },
    ],
  },
  {
    id: 'assignment_priority',
    label: 'Assignment & Priority Management',
    submodules: [
      { id: 'marine_assignment_queue', label: 'Marine assignment queue' },
      { id: 'b2b_assignment_queue', label: 'B2B assignment queue' },
      { id: 'corporate_assignment_queue', label: 'Corporate assignment queue' },
      { id: 'retail_assignment_queue', label: 'Retail assignment queue' },
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
      { id: 'jurisdiction', label: 'Jurisdiction Master' },
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
