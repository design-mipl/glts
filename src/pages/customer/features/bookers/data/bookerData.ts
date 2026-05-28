import { GLTS_BOOKER_IDS } from '../../../data/portalIds'

export interface BookerRecord {
  id: string
  name: string
  email: string
  mobile: string
  designation: string
  role: string
  apps: number
  lastActive: string
  status: 'Active' | 'Disabled'
  permissions: BookerPermissionKey[]
  lastLogin?: string
}

export type BookerPermissionKey =
  | 'dashboard'
  | 'fullApplications'
  | 'assignedOnly'
  | 'bulkUpload'
  | 'documentUpload'
  | 'tracking'
  | 'invoices'
  | 'support'

export const BOOKER_PERMISSION_LABELS: Record<BookerPermissionKey, string> = {
  dashboard: 'Dashboard access',
  fullApplications: 'Full application access',
  assignedOnly: 'Assigned applications only',
  bulkUpload: 'Bulk upload access',
  documentUpload: 'Document upload access',
  tracking: 'Tracking access',
  invoices: 'Invoice visibility',
  support: 'Support access',
}

export const mockBookers: BookerRecord[] = [
  {
    id: GLTS_BOOKER_IDS.priya,
    name: 'Priya Sharma',
    email: 'priya@glts.com',
    mobile: '+91 98xxx xxxx',
    designation: 'Travel Manager',
    role: 'Booker',
    apps: 4,
    lastActive: 'Today',
    lastLogin: 'Today, 9:12 IST',
    status: 'Active',
    permissions: ['dashboard', 'assignedOnly', 'documentUpload', 'tracking', 'support'],
  },
  {
    id: GLTS_BOOKER_IDS.james,
    name: 'James Chen',
    email: 'james@glts.com',
    mobile: '+91 97xxx xxxx',
    designation: 'Operations Lead',
    role: 'Booker',
    apps: 12,
    lastActive: 'Yesterday',
    lastLogin: 'Yesterday, 16:40 IST',
    status: 'Active',
    permissions: ['dashboard', 'fullApplications', 'bulkUpload', 'documentUpload', 'tracking', 'invoices', 'support'],
  },
]
