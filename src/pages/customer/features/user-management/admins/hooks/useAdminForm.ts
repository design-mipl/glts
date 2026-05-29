import { useCallback, useState } from 'react'
import type { AdminUserFormData } from '@/shared/types/adminUser'
import { adminManagementService } from '@/shared/services/adminManagementService'
import { isValidEmail, isValidMobile } from '@/shared/utils/contactValidation'

export function createEmptyAdminFormData(): AdminUserFormData {
  return {
    fullName: '',
    email: '',
    mobile: '',
    location: '',
    designation: '',
    department: '',
    status: 'active',
    sendInviteEmail: true,
    notes: '',
  }
}

export function adminUserToFormData(record: {
  fullName: string
  email: string
  mobile: string
  location: string
  designation: string
  department: string
  status: AdminUserFormData['status']
  notes: string
}): AdminUserFormData {
  return {
    ...record,
    sendInviteEmail: false,
  }
}

export function validateAdminForm(data: AdminUserFormData, excludeId?: string): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.fullName.trim()) errors.fullName = 'Admin name is required'
  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Enter a valid email address'
  } else if (adminManagementService.isEmailTaken(data.email, excludeId)) {
    errors.email = 'This email is already registered'
  }
  if (data.mobile.trim() && !isValidMobile(data.mobile)) {
    errors.mobile = 'Enter a valid mobile number'
  }
  if (!data.status) errors.status = 'Status is required'
  return errors
}

export function useAdminForm(excludeId?: string) {
  const [formData, setFormData] = useState<AdminUserFormData>(createEmptyAdminFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = useCallback((patch: Partial<AdminUserFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }))
    setErrors(prev => {
      const next = { ...prev }
      for (const key of Object.keys(patch)) delete next[key]
      return next
    })
  }, [])

  const reset = useCallback((data?: Partial<AdminUserFormData>) => {
    setFormData({ ...createEmptyAdminFormData(), ...data })
    setErrors({})
  }, [])

  const validate = useCallback(() => {
    const next = validateAdminForm(formData, excludeId)
    setErrors(next)
    return Object.keys(next).length === 0
  }, [formData, excludeId])

  return { formData, errors, update, reset, validate }
}
