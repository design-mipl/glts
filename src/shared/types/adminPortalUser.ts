import type { AdminUserPermissions } from './adminPermission'
import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

export type PasswordSetupType = 'auto_email_invite' | 'manual_password'

export type AdminPortalUserType = 'super_admin' | 'admin' | 'team_leader' | 'staff'

export const ADMIN_PORTAL_USER_TYPE_OPTIONS: { value: AdminPortalUserType; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'team_leader', label: 'Team Leader' },
  { value: 'staff', label: 'Staff' },
]

export const ADMIN_PORTAL_USER_TYPE_LABEL: Record<AdminPortalUserType, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  team_leader: 'Team Leader',
  staff: 'Staff',
}

export type AdminPortalUserActivityType =
  | 'login'
  | 'user_update'
  | 'permission_change'
  | 'status_change'
  | 'password_reset'

export interface AdminPortalUserActivityLog {
  id: string
  activity: string
  activityType: AdminPortalUserActivityType
  doneBy: string
  timestamp: string
}

export interface AdminPortalUser extends MasterAuditFields {
  id: string
  fullName: string
  email: string
  phone: string
  employeeId: string
  teamId: string
  departmentId: string
  designation: string
  userType: AdminPortalUserType
  roleTemplateId: string | null
  profilePhotoUrl: string | null
  status: MasterRecordStatus
  lastLoginAt: string | null
  isSuperAdmin: boolean
  passwordSetupType: PasswordSetupType
  permissions: AdminUserPermissions
  activityLogs: AdminPortalUserActivityLog[]
}

export interface AdminPortalUserBasicFormData {
  fullName: string
  email: string
  phone: string
  employeeId: string
  teamId: string
  departmentId: string
  designation: string
  userType: AdminPortalUserType | ''
  roleTemplateId: string
  profilePhotoUrl: string
  status: MasterRecordStatus
}

export interface AdminPortalUserFormData extends AdminPortalUserBasicFormData {
  passwordSetupType: PasswordSetupType
  manualPassword: string
  permissions: AdminUserPermissions
}

export interface AdminPortalUserListFilters {
  status?: MasterRecordStatus | 'all'
  teamId?: string | 'all'
  departmentId?: string | 'all'
  designation?: string | 'all'
}
