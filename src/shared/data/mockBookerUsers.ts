import { GLTS_ADMIN_IDS, GLTS_BOOKER_IDS } from '@/pages/customer/data/portalIds'
import type { BookerUser } from '@/shared/types/bookerUser'

const ts = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString()

export const SEED_BOOKER_USERS: BookerUser[] = [
  {
    id: GLTS_BOOKER_IDS.priya,
    fullName: 'Priya Sharma',
    email: 'priya@glts.com',
    mobile: '+91 98xxx xxxx',
    location: 'Mumbai',
    designation: 'Travel Manager',
    department: 'Travel Desk',
    role: 'booker',
    status: 'active',
    notes: 'Primary booker for corporate travel requests.',
    createdBy: 'Sneha Patel',
    createdById: GLTS_ADMIN_IDS.sneha,
    lastLogin: 'Today, 9:12 IST',
    applicationCount: 4,
    createdAt: ts(180),
    updatedAt: ts(1),
    activities: [
      {
        id: 'bkr-act-001',
        timestamp: ts(180),
        actor: 'Sneha Patel',
        action: 'Booker created',
        detail: 'Priya Sharma invited to the portal.',
      },
    ],
    loginActivity: [
      { id: 'bkr-login-1', timestamp: ts(0), device: 'Chrome on Windows', location: 'Mumbai, IN', status: 'success' },
    ],
    applicationActivity: [
      { id: 'bkr-app-1', applicationId: 'GLTS-APP-2026-847', title: 'Schengen Business Visa', action: 'Created application', timestamp: ts(15) },
    ],
  },
  {
    id: GLTS_BOOKER_IDS.james,
    fullName: 'James Chen',
    email: 'james@glts.com',
    mobile: '+91 97xxx xxxx',
    location: 'Singapore',
    designation: 'Operations Lead',
    department: 'Operations',
    role: 'booker',
    status: 'active',
    notes: '',
    createdBy: 'Rajan Mehta',
    createdById: 'GLTS-SUPER-001',
    lastLogin: 'Yesterday, 16:40 IST',
    applicationCount: 12,
    createdAt: ts(120),
    updatedAt: ts(2),
    activities: [
      {
        id: 'bkr-act-002',
        timestamp: ts(120),
        actor: 'Rajan Mehta',
        action: 'Booker created',
        detail: 'James Chen invited to the portal.',
      },
    ],
    loginActivity: [
      { id: 'bkr-login-2', timestamp: ts(1), device: 'Firefox on macOS', location: 'Singapore, SG', status: 'success' },
    ],
    applicationActivity: [
      { id: 'bkr-app-2', applicationId: 'GLTS-APP-2026-901', title: 'Japan Business Visa', action: 'Created application', timestamp: ts(10) },
      { id: 'bkr-app-3', applicationId: 'GLTS-APP-2026-712', title: 'UAE Visit Visa', action: 'Uploaded documents', timestamp: ts(5) },
    ],
  },
]

export const BOOKER_LOCATIONS = ['Mumbai', 'Chennai', 'Singapore', 'Dubai', 'London'] as const
