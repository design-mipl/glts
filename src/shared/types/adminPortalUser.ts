import type { AdminUserPermissions } from './adminPermission'
import type { MasterAuditFields, MasterRecordStatus } from './masterCommon'

export type PasswordSetupType = 'auto_email_invite' | 'manual_password'

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
  designation: string
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
  designation: string
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
  designation?: string | 'all'
}
