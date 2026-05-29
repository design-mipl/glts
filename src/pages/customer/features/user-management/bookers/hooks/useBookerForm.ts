import { useCallback, useState } from 'react'
import type { BookerUserFormData } from '@/shared/types/bookerUser'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import { isValidEmail, isValidMobile } from '@/shared/utils/contactValidation'

export function createEmptyBookerFormData(): BookerUserFormData {
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

export function bookerUserToFormData(record: {
  fullName: string
  email: string
  mobile: string
  location: string
  designation: string
  department: string
  status: BookerUserFormData['status']
  notes: string
}): BookerUserFormData {
  return {
    ...record,
    sendInviteEmail: false,
  }
}

export function validateBookerForm(data: BookerUserFormData, excludeId?: string): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.fullName.trim()) errors.fullName = 'Booker name is required'
  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Enter a valid email address'
  } else if (bookerManagementService.isEmailTaken(data.email, excludeId)) {
    errors.email = 'This email is already registered'
  }
  if (data.mobile.trim() && !isValidMobile(data.mobile)) {
    errors.mobile = 'Enter a valid mobile number'
  }
  if (!data.status) errors.status = 'Status is required'
  return errors
}

export function useBookerForm(excludeId?: string) {
  const [formData, setFormData] = useState<BookerUserFormData>(createEmptyBookerFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = useCallback((patch: Partial<BookerUserFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }))
    setErrors(prev => {
      const next = { ...prev }
      for (const key of Object.keys(patch)) delete next[key]
      return next
    })
  }, [])

  const reset = useCallback((data?: Partial<BookerUserFormData>) => {
    setFormData({ ...createEmptyBookerFormData(), ...data })
    setErrors({})
  }, [])

  const validate = useCallback(() => {
    const next = validateBookerForm(formData, excludeId)
    setErrors(next)
    return Object.keys(next).length === 0
  }, [formData, excludeId])

  return { formData, errors, update, reset, validate }
}
