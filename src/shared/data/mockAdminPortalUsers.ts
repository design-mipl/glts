import { superAdminFullPermissions } from '@/shared/utils/adminPermissionEngine'
import type { AdminPortalUser } from '@/shared/types/adminPortalUser'

export const SEED_ADMIN_PORTAL_USERS: AdminPortalUser[] = [
  {
    id: 'user-super-admin',
    fullName: 'Rajan Mehta',
    email: 'rajan.mehta@glts.com',
    phone: '+91 98765 43210',
    employeeId: 'GLTS-001',
    teamId: 'team-ops',
    designation: 'Super Admin',
    roleTemplateId: null,
    profilePhotoUrl: null,
    status: 'active',
    lastLoginAt: '2026-06-01T08:15:00.000Z',
    isSuperAdmin: true,
    passwordSetupType: 'manual_password',
    permissions: superAdminFullPermissions(),
    createdBy: 'System',
    updatedBy: 'System',
    createdAt: '2025-10-01T00:00:00.000Z',
    updatedAt: '2026-06-01T08:15:00.000Z',
    activityLogs: [
      {
        id: 'log-sa-1',
        activity: 'Logged in to Admin Portal',
        activityType: 'login',
        doneBy: 'Rajan Mehta',
        timestamp: '2026-06-01T08:15:00.000Z',
      },
      {
        id: 'log-sa-2',
        activity: 'Updated user permissions for Priya Sharma',
        activityType: 'permission_change',
        doneBy: 'Rajan Mehta',
        timestamp: '2026-05-28T14:20:00.000Z',
      },
    ],
  },
  {
    id: 'user-ops-1',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@glts.com',
    phone: '+91 98123 45678',
    employeeId: 'GLTS-014',
    teamId: 'team-ops',
    designation: 'Operations Manager',
    roleTemplateId: 'operations_admin',
    profilePhotoUrl: null,
    status: 'active',
    lastLoginAt: '2026-05-30T10:45:00.000Z',
    isSuperAdmin: false,
    passwordSetupType: 'auto_email_invite',
    permissions: (() => {
      const perms = superAdminFullPermissions()
      const allowed = ['application_management', 'ground_operations']
      for (const key of Object.keys(perms)) {
        if (!allowed.includes(key)) {
          perms[key] = {
            preset: 'view_only',
            submodules: Object.fromEntries(
              Object.entries(perms[key].submodules).map(([subId]) => [
                subId,
                { create: false, view: true, update: false },
              ]),
            ),
          }
        }
      }
      return perms
    })(),
    createdBy: 'Rajan Mehta',
    updatedBy: 'Rajan Mehta',
    createdAt: '2025-11-15T09:30:00.000Z',
    updatedAt: '2026-05-28T14:20:00.000Z',
    activityLogs: [
      {
        id: 'log-ps-1',
        activity: 'Logged in to Admin Portal',
        activityType: 'login',
        doneBy: 'Priya Sharma',
        timestamp: '2026-05-30T10:45:00.000Z',
      },
      {
        id: 'log-ps-2',
        activity: 'User profile updated',
        activityType: 'user_update',
        doneBy: 'Rajan Mehta',
        timestamp: '2026-05-28T14:20:00.000Z',
      },
    ],
  },
  {
    id: 'user-fin-1',
    fullName: 'Amit Desai',
    email: 'amit.desai@glts.com',
    phone: '+91 91234 56789',
    employeeId: 'GLTS-022',
    teamId: 'team-finance',
    designation: 'Finance Analyst',
    roleTemplateId: 'finance_viewer',
    profilePhotoUrl: null,
    status: 'active',
    lastLoginAt: '2026-05-29T16:30:00.000Z',
    isSuperAdmin: false,
    passwordSetupType: 'auto_email_invite',
    permissions: (() => {
      const perms = superAdminFullPermissions()
      for (const key of Object.keys(perms)) {
        if (key === 'finance') {
          perms[key] = {
            preset: 'view_only',
            submodules: Object.fromEntries(
              Object.entries(perms[key].submodules).map(([subId]) => [
                subId,
                { create: false, view: true, update: false },
              ]),
            ),
          }
        } else {
          perms[key] = {
            preset: null,
            submodules: Object.fromEntries(
              Object.entries(perms[key].submodules).map(([subId]) => [
                subId,
                { create: false, view: false, update: false },
              ]),
            ),
          }
        }
      }
      return perms
    })(),
    createdBy: 'Rajan Mehta',
    updatedBy: 'Priya Sharma',
    createdAt: '2025-12-10T11:00:00.000Z',
    updatedAt: '2026-03-15T09:00:00.000Z',
    activityLogs: [
      {
        id: 'log-ad-1',
        activity: 'Logged in to Admin Portal',
        activityType: 'login',
        doneBy: 'Amit Desai',
        timestamp: '2026-05-29T16:30:00.000Z',
      },
    ],
  },
  {
    id: 'user-sales-1',
    fullName: 'Neha Kapoor',
    email: 'neha.kapoor@glts.com',
    phone: '+91 99887 76655',
    employeeId: 'GLTS-031',
    teamId: 'team-sales',
    designation: 'Account Manager',
    roleTemplateId: 'customer_accounts_admin',
    profilePhotoUrl: null,
    status: 'inactive',
    lastLoginAt: '2026-04-10T12:00:00.000Z',
    isSuperAdmin: false,
    passwordSetupType: 'auto_email_invite',
    permissions: (() => {
      const perms = superAdminFullPermissions()
      for (const key of Object.keys(perms)) {
        if (key === 'customer_accounts') continue
        perms[key] = {
          preset: null,
          submodules: Object.fromEntries(
            Object.entries(perms[key].submodules).map(([subId]) => [
              subId,
              { create: false, view: false, update: false },
            ]),
          ),
        }
      }
      return perms
    })(),
    createdBy: 'Priya Sharma',
    updatedBy: 'Rajan Mehta',
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-04-15T17:30:00.000Z',
    activityLogs: [
      {
        id: 'log-nk-1',
        activity: 'User deactivated',
        activityType: 'status_change',
        doneBy: 'Rajan Mehta',
        timestamp: '2026-04-15T17:30:00.000Z',
      },
      {
        id: 'log-nk-2',
        activity: 'Logged in to Admin Portal',
        activityType: 'login',
        doneBy: 'Neha Kapoor',
        timestamp: '2026-04-10T12:00:00.000Z',
      },
    ],
  },
]
