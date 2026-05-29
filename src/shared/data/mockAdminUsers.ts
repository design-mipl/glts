import { GLTS_ADMIN_IDS } from '@/pages/customer/data/portalIds'
import type { AdminUser } from '@/shared/types/adminUser'

const ts = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString()

export const SEED_ADMIN_USERS: AdminUser[] = [
  {
    id: GLTS_ADMIN_IDS.sneha,
    fullName: 'Sneha Patel',
    email: 'sneha.patel@glts.com',
    mobile: '+91 98765 00002',
    location: 'Mumbai',
    designation: 'Operations Manager',
    department: 'Operations',
    role: 'admin',
    status: 'active',
    notes: 'Handles day-to-day application processing and booker onboarding.',
    lastLogin: 'Today, 10:24 IST',
    createdAt: ts(200),
    updatedAt: ts(5),
    activities: [
      {
        id: 'adm-act-001',
        timestamp: ts(200),
        actor: 'Rajan Mehta',
        action: 'Admin created',
        detail: 'Sneha Patel invited to the portal.',
      },
      {
        id: 'adm-act-002',
        timestamp: ts(5),
        actor: 'Sneha Patel',
        action: 'Profile updated',
        detail: 'Designation updated to Operations Manager.',
      },
    ],
    loginActivity: [
      { id: 'adm-login-1', timestamp: ts(0), device: 'Chrome on Windows', location: 'Mumbai, IN', status: 'success' },
      { id: 'adm-login-2', timestamp: ts(3), device: 'Safari on iPhone', location: 'Mumbai, IN', status: 'success' },
    ],
    applicationActivity: [
      { id: 'adm-app-1', applicationId: 'GLTS-APP-2026-847', title: 'Schengen Business Visa', action: 'Created application', timestamp: ts(12) },
      { id: 'adm-app-2', applicationId: 'GLTS-APP-2026-901', title: 'Japan Business Visa', action: 'Reviewed documents', timestamp: ts(8) },
    ],
  },
  {
    id: GLTS_ADMIN_IDS.arun,
    fullName: 'Arun Krishnan',
    email: 'arun.krishnan@glts.com',
    mobile: '+91 98765 00003',
    location: 'Chennai',
    designation: 'Regional Admin',
    department: 'Operations',
    role: 'admin',
    status: 'active',
    notes: '',
    lastLogin: 'Yesterday, 18:05 IST',
    createdAt: ts(150),
    updatedAt: ts(10),
    activities: [
      {
        id: 'adm-act-003',
        timestamp: ts(150),
        actor: 'Rajan Mehta',
        action: 'Admin created',
        detail: 'Arun Krishnan invited to the portal.',
      },
    ],
    loginActivity: [
      { id: 'adm-login-3', timestamp: ts(1), device: 'Edge on Windows', location: 'Chennai, IN', status: 'success' },
    ],
    applicationActivity: [
      { id: 'adm-app-3', applicationId: 'GLTS-APP-2026-712', title: 'UAE Visit Visa', action: 'Created application', timestamp: ts(20) },
    ],
  },
  {
    id: GLTS_ADMIN_IDS.karan,
    fullName: 'Karan Deshmukh',
    email: 'karan.d@glts.com',
    mobile: '+91 98765 00005',
    location: 'Pune',
    designation: 'Operations Lead',
    department: 'Operations',
    role: 'admin',
    status: 'inactive',
    notes: 'Account suspended pending HR review.',
    lastLogin: '30 days ago',
    createdAt: ts(120),
    updatedAt: ts(25),
    activities: [
      {
        id: 'adm-act-004',
        timestamp: ts(25),
        actor: 'Rajan Mehta',
        action: 'Admin inactivated',
        detail: 'Status changed to inactive.',
      },
    ],
    loginActivity: [],
    applicationActivity: [],
  },
]

export const ADMIN_LOCATIONS = ['Mumbai', 'Chennai', 'Pune', 'Delhi', 'Singapore', 'Dubai'] as const
