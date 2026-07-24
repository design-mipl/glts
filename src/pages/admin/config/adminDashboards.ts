export type LegacyDashboardId =
  | 'admin'
  | 'operations'
  | 'documentation'
  | 'accounts'

export type DashboardNextId =
  | 'admin'
  | 'operations'
  | 'accounts'
  | 'super-admin'
  | 'ground-operations'
  | 'documentation'

export interface AdminDashboardDefinition {
  id: string
  label: string
  href: string
  title: string
  description: string
  status: 'live' | 'coming-soon'
}

export interface LegacyDashboardDefinition extends AdminDashboardDefinition {
  id: LegacyDashboardId
}

export interface DashboardNextDefinition extends AdminDashboardDefinition {
  id: DashboardNextId
}

/** Legacy Dashboard module submodules. */
export const ADMIN_DASHBOARDS: LegacyDashboardDefinition[] = [
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

/** Dashboard Next module submodules. */
export const ADMIN_DASHBOARD_NEXT: DashboardNextDefinition[] = [
  {
    id: 'super-admin',
    label: 'Super Admin',
    href: '/admin/dashboard-next/super-admin',
    title: 'Super Admin dashboard (next)',
    description: 'Next-generation platform administration workspace.',
    status: 'live',
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin/dashboard-next',
    title: 'Admin dashboard (next)',
    description: 'Next-generation executive command center.',
    status: 'live',
  },
  {
    id: 'operations',
    label: 'Operations',
    href: '/admin/dashboard-next/operations',
    title: 'Operations dashboard (next)',
    description: 'Next-generation operations workspace.',
    status: 'live',
  },
  {
    id: 'accounts',
    label: 'Accounts',
    href: '/admin/dashboard-next/accounts',
    title: 'Accounts dashboard (next)',
    description: 'Next-generation financial operations workspace.',
    status: 'live',
  },
  {
    id: 'ground-operations',
    label: 'Ground Ops',
    href: '/admin/dashboard-next/ground-operations',
    title: 'Ground Operations dashboard (next)',
    description: 'Next-generation ground operations workspace.',
    status: 'live',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    href: '/admin/dashboard-next/documentation',
    title: 'Documentation dashboard (next)',
    description: 'Next-generation document processing and QC workspace.',
    status: 'live',
  },
]

/** Combined list for route placeholders and cross-module lookups by href. */
export const ADMIN_ALL_DASHBOARDS: AdminDashboardDefinition[] = [
  ...ADMIN_DASHBOARDS,
  ...ADMIN_DASHBOARD_NEXT,
]
