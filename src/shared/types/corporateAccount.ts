export type CorporatePortalStatus = 'draft' | 'active' | 'inactive'

export type CorporateAdminRole = 'super_admin' | 'admin'

export interface CorporateAccountActivity {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface CorporateAdminUser {
  id: string
  fullName: string
  phoneNumber: string
  emailAddress: string
  role: CorporateAdminRole
  temporaryPassword?: string
  credentialsSentAt?: string
  lastLoginAt?: string
}

export interface CorporateWorkflowConfig {
  marineWorkflowEnabled: boolean
  bulkUploadEnabled: boolean
  retailWorkflowEnabled: boolean
  corporateWorkflowEnabled: boolean
}

export interface CorporatePortalActivation {
  portalStatus: CorporatePortalStatus
  loginAccess: boolean
  applicationCreationAccess: boolean
  bulkUploadAccess: boolean
  invoiceVisibility: boolean
  trackingVisibility: boolean
}

export interface CorporateAccount {
  id: string
  companyId: string
  companyName: string
  agreementId: string
  workflowType: string
  accountType: string
  branch: string
  portalStatus: CorporatePortalStatus
  workflowConfig: CorporateWorkflowConfig
  superAdmin?: CorporateAdminUser
  admins: CorporateAdminUser[]
  assignedTeamId?: string
  assignedUserIds?: string[]
  entityIds: string[]
  vesselIds: string[]
  portalActivation: CorporatePortalActivation
  createdAt: string
  updatedAt: string
  activatedAt?: string
  activities: CorporateAccountActivity[]
}

export interface CorporateAccountFormData {
  agreementId: string
  companyId: string
  companyName: string
  workflowType: string
  accountType: string
  branch: string
  workflowConfig: CorporateWorkflowConfig
  superAdmin: Omit<CorporateAdminUser, 'id' | 'credentialsSentAt' | 'lastLoginAt'>
  admins: Omit<CorporateAdminUser, 'id' | 'credentialsSentAt' | 'lastLoginAt'>[]
  assignedTeamId: string
  assignedUserIds: string[]
  entityIds: string[]
  vesselIds: string[]
  portalActivation: CorporatePortalActivation
}

export interface CorporateAccountListFilters {
  status?: CorporatePortalStatus | 'all'
  workflowType?: string
  accountType?: string
  branch?: string
  query?: string
}
