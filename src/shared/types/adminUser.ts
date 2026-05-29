import type {
  ApplicationActivityEntry,
  LoginActivityEntry,
  ManagedUserActivity,
  ManagedUserStatus,
} from '@/shared/types/managedUser'

export type AdminUserRole = 'admin'

export interface AdminUser {
  id: string
  fullName: string
  email: string
  mobile: string
  location: string
  designation: string
  department: string
  role: AdminUserRole
  status: ManagedUserStatus
  notes: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
  activities: ManagedUserActivity[]
  loginActivity: LoginActivityEntry[]
  applicationActivity: ApplicationActivityEntry[]
}

export interface AdminUserFormData {
  fullName: string
  email: string
  mobile: string
  location: string
  designation: string
  department: string
  status: ManagedUserStatus
  sendInviteEmail: boolean
  notes: string
}

export interface AdminUserListFilters {
  status?: ManagedUserStatus | 'all'
  location?: string | 'all'
  query?: string
}
