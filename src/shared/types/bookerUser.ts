import type {
  ApplicationActivityEntry,
  LoginActivityEntry,
  ManagedUserActivity,
  ManagedUserStatus,
} from '@/shared/types/managedUser'

export type BookerUserRole = 'booker'

export interface BookerUser {
  id: string
  fullName: string
  email: string
  /** Parent company this booker submits applications under */
  companyName: string
  mobile: string
  location: string
  designation: string
  department: string
  role: BookerUserRole
  status: ManagedUserStatus
  notes: string
  createdBy: string
  createdById: string
  lastLogin?: string
  applicationCount: number
  createdAt: string
  updatedAt: string
  activities: ManagedUserActivity[]
  loginActivity: LoginActivityEntry[]
  applicationActivity: ApplicationActivityEntry[]
}

export interface BookerUserFormData {
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

export interface BookerUserListFilters {
  status?: ManagedUserStatus | 'all'
  location?: string | 'all'
  createdBy?: string | 'all'
  query?: string
  /** When set, only bookers created by this admin id are returned */
  scopedToAdminId?: string
}
