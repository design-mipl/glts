export type DashboardNextRoleId =
  | 'super-admin'
  | 'admin'
  | 'operations'
  | 'accounts'
  | 'ground-operations'
  | 'documentation'

export interface DashboardNextRoleConfig {
  id: DashboardNextRoleId
  label: string
  title: string
  description: string
  href: string
  status: 'live' | 'coming-soon'
}

export const DASHBOARD_NEXT_ROLES: DashboardNextRoleConfig[] = [
  {
    id: 'super-admin',
    label: 'Super Admin',
    title: 'Super Admin dashboard (next)',
    description: 'Next-generation platform administration workspace.',
    href: '/admin/dashboard-next/super-admin',
    status: 'live',
  },
  {
    id: 'admin',
    label: 'Admin',
    title: 'Admin dashboard (next)',
    description: 'Next-generation executive command center.',
    href: '/admin/dashboard-next',
    status: 'live',
  },
  {
    id: 'operations',
    label: 'Operations',
    title: 'Operations dashboard (next)',
    description: 'Next-generation operations workspace.',
    href: '/admin/dashboard-next/operations',
    status: 'live',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    title: 'Accounts dashboard (next)',
    description: 'Next-generation financial operations workspace.',
    href: '/admin/dashboard-next/accounts',
    status: 'live',
  },
  {
    id: 'ground-operations',
    label: 'Ground Ops',
    title: 'Ground Operations dashboard (next)',
    description: 'Next-generation ground operations workspace.',
    href: '/admin/dashboard-next/ground-operations',
    status: 'live',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    title: 'Documentation dashboard (next)',
    description: 'Next-generation document processing and QC workspace.',
    href: '/admin/dashboard-next/documentation',
    status: 'live',
  },
]
