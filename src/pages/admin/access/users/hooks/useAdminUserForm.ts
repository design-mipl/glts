import { useMemo, useState } from 'react'
import { createEmptyPermissions } from '@/shared/utils/adminPermissionEngine'
import type {
  AdminPortalUser,
  AdminPortalUserBasicFormData,
  AdminPortalUserFormData,
} from '@/shared/types/adminPortalUser'

export const INITIAL_ADMIN_USER_BASIC_FORM: AdminPortalUserBasicFormData = {
  fullName: '',
  email: '',
  phone: '',
  employeeId: '',
  teamId: '',
  designation: '',
  roleTemplateId: '',
  profilePhotoUrl: '',
  status: 'active',
}

export const INITIAL_ADMIN_USER_FORM: AdminPortalUserFormData = {
  ...INITIAL_ADMIN_USER_BASIC_FORM,
  passwordSetupType: 'auto_email_invite',
  manualPassword: '',
  permissions: createEmptyPermissions(),
}

export function AdminPortalUserToFormData(row: AdminPortalUser): AdminPortalUserFormData {
  return {
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    employeeId: row.employeeId,
    teamId: row.teamId,
    designation: row.designation,
    roleTemplateId: row.roleTemplateId ?? '',
    profilePhotoUrl: row.profilePhotoUrl ?? '',
    status: row.status,
    passwordSetupType: row.passwordSetupType,
    manualPassword: '',
    permissions: JSON.parse(JSON.stringify(row.permissions)),
  }
}

export function AdminPortalUserToBasicFormData(row: AdminPortalUser): AdminPortalUserBasicFormData {
  return {
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    employeeId: row.employeeId,
    teamId: row.teamId,
    designation: row.designation,
    roleTemplateId: row.roleTemplateId ?? '',
    profilePhotoUrl: row.profilePhotoUrl ?? '',
    status: row.status,
  }
}

function validateBasicFields(
  formData: AdminPortalUserBasicFormData,
  errors: Record<string, string>,
) {
  const next: Record<string, string> = { ...errors }
  if (!formData.fullName.trim()) next.fullName = 'Full name is required'
  else delete next.fullName
  if (!formData.email.trim()) next.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    next.email = 'Enter a valid email address'
  } else {
    delete next.email
  }
  if (!formData.teamId) next.teamId = 'Team is required'
  else delete next.teamId
  if (!formData.designation.trim()) next.designation = 'Designation is required'
  else delete next.designation
  return next
}

export function useAdminPortalUserForm(initialData?: AdminPortalUserFormData) {
  const [formData, setFormData] = useState<AdminPortalUserFormData>(
    initialData ?? INITIAL_ADMIN_USER_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validateBasic = () => {
    const next = validateBasicFields(formData, {})
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const validate = (mode: 'create' | 'edit' = 'create') => {
    let next = validateBasicFields(formData, {})
    if (
      mode === 'edit' &&
      formData.passwordSetupType === 'manual_password' &&
      formData.manualPassword.trim().length > 0 &&
      formData.manualPassword.trim().length < 8
    ) {
      next.manualPassword = 'Password must be at least 8 characters'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: AdminPortalUserFormData) => {
    setFormData(data ?? INITIAL_ADMIN_USER_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validateBasic, validate, reset }
}

export function useAdminPortalUserBasicForm(initialData?: AdminPortalUserBasicFormData) {
  const [formData, setFormData] = useState<AdminPortalUserBasicFormData>(
    initialData ?? INITIAL_ADMIN_USER_BASIC_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validateBasic = () => {
    const next = validateBasicFields(formData, {})
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: AdminPortalUserBasicFormData) => {
    setFormData(data ?? INITIAL_ADMIN_USER_BASIC_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validateBasic, reset }
}

export const adminUserToFormData = AdminPortalUserToFormData
export const useAdminUserForm = useAdminPortalUserForm
