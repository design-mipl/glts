import type { AdminUserPermissions } from '@/shared/types/adminPermission'
import {
  applyModulePresetToPermissions,
  createEmptyPermissions,
} from '@/shared/utils/adminPermissionEngine'

export interface AdminRoleTemplate {
  id: string
  label: string
  description: string
}

export const ADMIN_ROLE_TEMPLATES: AdminRoleTemplate[] = [
  {
    id: 'operations_admin',
    label: 'Operations Admin',
    description: 'Full access to application and ground operations modules.',
  },
  {
    id: 'finance_viewer',
    label: 'Finance Viewer',
    description: 'View-only access to finance and billing modules.',
  },
  {
    id: 'master_data_manager',
    label: 'Master Data Manager',
    description: 'Full access to masters configuration.',
  },
  {
    id: 'customer_accounts_admin',
    label: 'Customer Accounts Admin',
    description: 'Full access to customer and account workflows.',
  },
]

export function getRoleTemplatePermissions(templateId: string): AdminUserPermissions {
  const base = createEmptyPermissions()

  switch (templateId) {
    case 'operations_admin':
      return applyModulePresetToPermissions(base, 'application_management', 'all')
    case 'finance_viewer':
      return applyModulePresetToPermissions(base, 'finance', 'view_only')
    case 'master_data_manager':
      return applyModulePresetToPermissions(base, 'masters', 'all')
    case 'customer_accounts_admin':
      return applyModulePresetToPermissions(base, 'customer_accounts', 'all')
    default:
      return base
  }
}
