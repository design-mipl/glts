import { useCallback, useState } from 'react'
import type { BookerUserFormData } from '@/shared/types/bookerUser'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import { isValidEmail, isValidMobile } from '@/shared/utils/contactValidation'

export function createEmptyBookerFormData(): BookerUserFormData {
  return {
    fullName: '',
    email: '',
    additionalEmails: [],
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
  additionalEmails?: string[]
  mobile: string
  location: string
  designation: string
  department: string
  status: BookerUserFormData['status']
  notes: string
}): BookerUserFormData {
  return {
    ...record,
    additionalEmails: [...(record.additionalEmails ?? [])],
    sendInviteEmail: false,
  }
}

export function validateBookerForm(data: BookerUserFormData, excludeId?: string): Record<string, string> {
  const errors: Record<string, string> = {}
  const primaryEmail = data.email.trim().toLowerCase()

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

  const seenAdditional = new Set<string>()
  data.additionalEmails.forEach((raw, index) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    const normalized = trimmed.toLowerCase()
    const key = `additionalEmails.${index}`

    if (!isValidEmail(trimmed)) {
      errors[key] = 'Enter a valid email address'
      return
    }
    if (normalized === primaryEmail) {
      errors[key] = 'Must differ from the primary email ID'
      return
    }
    if (seenAdditional.has(normalized)) {
      errors[key] = 'Duplicate email ID'
      return
    }
    if (bookerManagementService.isEmailTaken(trimmed, excludeId)) {
      errors[key] = 'This email is already registered'
      return
    }
    seenAdditional.add(normalized)
  })

  return errors
}

export function useBookerForm(excludeId?: string) {
  const [formData, setFormData] = useState<BookerUserFormData>(createEmptyBookerFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = useCallback((patch: Partial<BookerUserFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }))
    setErrors(prev => {
      const next = { ...prev }
      for (const key of Object.keys(patch)) {
        if (key === 'additionalEmails') {
          Object.keys(next).forEach(errorKey => {
            if (errorKey.startsWith('additionalEmails.')) delete next[errorKey]
          })
        } else {
          delete next[key]
        }
      }
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
