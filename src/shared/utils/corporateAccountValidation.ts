import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { isValidEmail, isValidMobile } from '@/shared/utils/contactValidation'
import { isSelectableCorporateWorkflowType } from '@/shared/utils/corporateAccountWorkflow'

export type CorporateAccountSectionId =
  | 'agreement'
  | 'super-admin'
  | 'admins'
  | 'entities'
  | 'vessels'
  | 'activation'
  | 'review'

export function createEmptyCorporateAccountFormData(): CorporateAccountFormData {
  return {
    agreementId: '',
    companyId: '',
    companyName: '',
    workflowType: '',
    accountType: 'corporate',
    branch: '',
    workflowConfig: {
      marineWorkflowEnabled: false,
      bulkUploadEnabled: false,
      retailWorkflowEnabled: false,
      corporateWorkflowEnabled: false,
    },
    superAdmin: {
      fullName: '',
      phoneNumber: '',
      emailAddress: '',
      role: 'super_admin',
    },
    admins: [],
    assignedTeamId: '',
    assignedUserIds: [],
    teamLeaderTeamId: '',
    teamLeaderUserIds: [],
    entityIds: [],
    vesselIds: [],
    portalActivation: {
      portalStatus: 'draft',
      loginAccess: true,
      applicationCreationAccess: true,
      bulkUploadAccess: false,
      invoiceVisibility: true,
      trackingVisibility: true,
    },
  }
}

export function validateCorporateAccountStep(step: number, data: CorporateAccountFormData): string[] {
  const issues: string[] = []
  if (step === 0) {
    if (!data.agreementId) issues.push('Select an agreement ready for activation')
    if (!isSelectableCorporateWorkflowType(data.workflowType)) issues.push('Select a workflow type')
  }
  if (step === 1) {
    if (!data.superAdmin.fullName.trim()) issues.push('Super admin name is required')
    if (!data.superAdmin.emailAddress.trim()) issues.push('Super admin email is required')
    else if (!isValidEmail(data.superAdmin.emailAddress)) issues.push('Enter a valid super admin email')
    if (data.superAdmin.phoneNumber.trim() && !isValidMobile(data.superAdmin.phoneNumber)) {
      issues.push('Enter a valid super admin phone number')
    }
  }
  if (step === 2) {
    for (let i = 0; i < data.admins.length; i++) {
      const admin = data.admins[i]
      if (!admin.fullName.trim()) issues.push(`Admin ${i + 1}: name is required`)
      if (!admin.emailAddress.trim()) issues.push(`Admin ${i + 1}: email is required`)
      else if (!isValidEmail(admin.emailAddress)) issues.push(`Admin ${i + 1}: invalid email`)
    }
  }
  if (step === 5) {
    if (!data.teamLeaderTeamId) issues.push('Select a team for team leader')
    if (data.teamLeaderUserIds.length === 0) issues.push('Assign at least one team leader')
    if (!data.assignedTeamId) issues.push('Select a team')
    if (data.assignedUserIds.length === 0) issues.push('Assign at least one user')
  }
  return issues
}

export function corporateAccountSectionComplete(
  sectionId: CorporateAccountSectionId,
  data: CorporateAccountFormData,
): boolean {
  switch (sectionId) {
    case 'agreement':
      return Boolean(data.agreementId) && isSelectableCorporateWorkflowType(data.workflowType)
    case 'super-admin':
      return validateCorporateAccountStep(1, data).length === 0
    case 'admins':
      return validateCorporateAccountStep(2, data).length === 0
    case 'activation':
      return validateCorporateAccountStep(5, data).length === 0
    case 'review':
      return validateForActivation(data).ok
    default:
      return Boolean(data.agreementId)
  }
}

export function validateForActivation(data: CorporateAccountFormData): { ok: boolean; issues: string[] } {
  const issues: string[] = []
  if (!data.agreementId) issues.push('Agreement is required')
  if (!isSelectableCorporateWorkflowType(data.workflowType)) issues.push('Workflow type is required')
  if (!data.superAdmin.fullName.trim()) issues.push('Super admin is required')
  if (!data.superAdmin.emailAddress.trim()) issues.push('Super admin email is required')
  if (!data.teamLeaderTeamId) issues.push('Team leader team is required')
  if (data.teamLeaderUserIds.length === 0) issues.push('At least one team leader is required')
  if (!data.assignedTeamId) issues.push('Assigned team is required')
  if (data.assignedUserIds.length === 0) issues.push('At least one assigned user is required')
  return { ok: issues.length === 0, issues }
}

export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let pwd = ''
  for (let i = 0; i < 10; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pwd
}

export const PORTAL_LOGIN_URL = 'https://portal.glts.example/login'

export function formatCredentialEmailPayload(email: string, password: string) {
  return {
    portalUrl: PORTAL_LOGIN_URL,
    username: email,
    temporaryPassword: password,
  }
}
