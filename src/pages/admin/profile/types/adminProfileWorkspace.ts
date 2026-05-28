export type AdminProfileTabId = 'account' | 'security' | 'sessions'

export interface AdminAccountInfo {
  displayName: string
  email: string
  role: string
  portal: string
  team: string
}

export interface AdminSecurityInfo {
  twoFactorEnabled: boolean
  passwordLastUpdated: string
  recoveryEmail: string
}

export interface AdminSessionInfo {
  id: string
  device: string
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface AdminProfileWorkspace {
  account: AdminAccountInfo
  security: AdminSecurityInfo
  sessions: AdminSessionInfo[]
}
