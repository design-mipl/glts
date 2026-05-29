export type ManagedUserStatus = 'active' | 'inactive'

export interface ManagedUserActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface LoginActivityEntry {
  id: string
  timestamp: string
  device: string
  location: string
  status: 'success' | 'failed'
}

export interface ApplicationActivityEntry {
  id: string
  applicationId: string
  title: string
  action: string
  timestamp: string
}

export type ManagedUserDeleteResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'in_use' }
