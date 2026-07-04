export type AdminDashboardId = 'admin' | 'operations' | 'documentation' | 'accounts'

export interface AdminDashboardDefinition {
  id: AdminDashboardId
  label: string
  href: string
  title: string
  description: string
  status: 'live' | 'coming-soon'
}

export const ADMIN_DASHBOARDS: AdminDashboardDefinition[] = [
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    title: 'Admin dashboard',
    description: 'Executive command center for management visibility.',
    status: 'live',
  },
  {
    id: 'operations',
    label: 'Operations',
    href: '/admin/dashboard/operations',
    title: 'Operations dashboard',
    description: 'Work management dashboard for operations consultants.',
    status: 'live',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    href: '/admin/dashboard/documentation',
    title: 'Documentation dashboard',
    description: 'Document processing and quality control workspace.',
    status: 'live',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    href: '/admin/dashboard/accounts',
    title: 'Accounts dashboard',
    description: 'Financial operations workspace for invoicing, collections, and reporting.',
    status: 'live',
  },
]
